import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/promote-students
 * Promotes all students up one grade level:
 *   - X TJKT N → XI TJKT N
 *   - XI TJKT N → XII TJKT N
 *   - XII graduates are optionally flagged as alumni
 * Also creates new classes for the new school year if needed.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { newSchoolYearName } = await request.json() as { newSchoolYearName: string };
  if (!newSchoolYearName) return NextResponse.json({ error: "newSchoolYearName required" }, { status: 400 });

  const admin = createAdminClient();

  // 1. Create new school year
  const { data: newYear, error: yearErr } = await admin
    .from("school_years")
    .insert({ name: newSchoolYearName, is_active: true })
    .select()
    .single();

  if (yearErr) return NextResponse.json({ error: yearErr.message }, { status: 400 });

  // 2. Deactivate old school years
  await admin.from("school_years").update({ is_active: false }).neq("id", newYear.id);

  // 3. Create new classes for the new year (X, XI, XII × 1/2/3)
  const newClasses: Record<string, string> = {};
  const grades = [
    { grade: 10, prefix: "X" },
    { grade: 11, prefix: "XI" },
    { grade: 12, prefix: "XII" },
  ];
  for (const { grade, prefix } of grades) {
    for (const n of [1, 2, 3]) {
      const { data: cls } = await admin
        .from("classes")
        .insert({ name: `${prefix} TJKT ${n}`, grade_level: grade, school_year_id: newYear.id })
        .select()
        .single();
      if (cls) newClasses[`${grade}-${n}`] = cls.id;
    }
  }

  // 4. Get all students with their current class
  const { data: students } = await admin
    .from("profiles")
    .select("id, class_id, classes(grade_level, name)")
    .eq("role", "student");

  let promoted = 0;
  let graduated = 0;

  for (const student of students ?? []) {
    const cls = (student as any).classes;
    if (!cls) continue;

    const currentGrade: number = cls.grade_level;
    const classNum = parseInt(cls.name.match(/\d+$/)?.[0] ?? "1");

    if (currentGrade === 12) {
      // Graduate — remove class assignment
      await admin.from("profiles").update({ class_id: null }).eq("id", student.id);
      graduated++;
    } else {
      const nextGrade = currentGrade + 1;
      const newClassId = newClasses[`${nextGrade}-${classNum}`];
      if (newClassId) {
        await admin.from("profiles").update({ class_id: newClassId }).eq("id", student.id);
        promoted++;
      }
    }
  }

  // 5. Update system setting for current school year
  await admin.from("system_settings")
    .update({ value: newSchoolYearName })
    .eq("key", "current_school_year");

  return NextResponse.json({
    success: true,
    promoted,
    graduated,
    newSchoolYear: newSchoolYearName,
  });
}
