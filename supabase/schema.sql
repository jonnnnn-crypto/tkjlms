-- ================================================================
-- NetLearnX LMS — Complete Supabase SQL Setup
-- ================================================================
-- Cara pakai:
-- 1. Buka Supabase Dashboard → SQL Editor
-- 2. Paste seluruh file ini → Run
-- 3. Cek tab Table Editor untuk verifikasi
-- ================================================================

-- ── Ekstensi ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- SECTION 1: TABLES
-- ================================================================

-- ── 1.1 PROFILES ─────────────────────────────────────────────────
-- Dibuat otomatis setelah user register via trigger
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  role        TEXT        NOT NULL DEFAULT 'student'
              CHECK (role IN ('admin', 'teacher', 'student')),
  avatar_url  TEXT,
  phone       TEXT,
  bio         TEXT,
  school      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Data profil pengguna, terhubung ke auth.users';
COMMENT ON COLUMN public.profiles.role IS 'admin | teacher | student';

-- ── 1.2 CLASSES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.classes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  teacher_id  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  class_code  TEXT        NOT NULL UNIQUE,
  subject     TEXT,       -- mis: 'Jaringan Komputer', 'Keamanan Jaringan'
  semester    TEXT,       -- mis: 'Ganjil 2025/2026'
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  cover_color TEXT        DEFAULT '#6366f1', -- warna cover kelas
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.classes IS 'Kelas yang dibuat oleh guru';

-- ── 1.3 ENROLLMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enrollments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id    UUID        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, class_id)
);

COMMENT ON TABLE public.enrollments IS 'Siswa yang terdaftar di kelas';

-- ── 1.4 MATERIALS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.materials (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  content     TEXT,       -- Markdown / text / URL
  type        TEXT        NOT NULL DEFAULT 'text'
              CHECK (type IN ('text', 'video', 'pdf', 'link', 'slide')),
  order_num   INT         NOT NULL DEFAULT 0,
  is_published BOOLEAN    NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.materials IS 'Materi pembelajaran per kelas';

-- ── 1.5 QUIZZES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quizzes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  duration    INT         NOT NULL DEFAULT 30, -- menit
  pass_score  INT         NOT NULL DEFAULT 70, -- nilai minimal lulus
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  attempt_limit INT,      -- NULL = unlimited, 1 = sekali, dst
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.quizzes IS 'Quiz per kelas, dengan durasi dan nilai minimum lulus';

-- ── 1.6 QUESTIONS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.questions (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id        UUID    NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question       TEXT    NOT NULL,
  options        JSONB   NOT NULL,
  -- Format: ["A. Routing table", "B. ARP table", "C. DNS cache", "D. Switch table"]
  correct_answer TEXT    NOT NULL,
  -- Format: "A" | "B" | "C" | "D"
  explanation    TEXT,   -- penjelasan jawaban yang benar (opsional)
  points         INT     NOT NULL DEFAULT 1,
  order_num      INT     NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.questions IS 'Soal-soal dalam quiz pilihan ganda';

-- ── 1.7 SUBMISSIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.submissions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id     UUID        NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  answers     JSONB,
  -- Format: {"question_id": "A", ...}
  score       INT         NOT NULL DEFAULT 0,
  is_passed   BOOLEAN     GENERATED ALWAYS AS (score >= (
    SELECT pass_score FROM public.quizzes WHERE id = quiz_id
  )) STORED,
  time_spent  INT,        -- detik yang digunakan
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

COMMENT ON TABLE public.submissions IS 'Jawaban dan nilai siswa per quiz';

-- ── 1.8 LABS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.labs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  type        TEXT        NOT NULL DEFAULT 'network'
              CHECK (type IN ('network', 'subnetting', 'routing', 'vlan', 'security')),
  config      JSONB,
  -- Format: {"instructions": "...", "topology": "...", "devices": [...]}
  answer      JSONB,
  -- Format: {"ip": "192.168.1.10", "subnet": "255.255.255.0", "gateway": "192.168.1.1", "dns": "8.8.8.8"}
  difficulty  TEXT        DEFAULT 'medium'
              CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.labs IS 'Lab simulasi jaringan per kelas';

-- ── 1.9 LAB SUBMISSIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lab_submissions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lab_id      UUID        NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
  answers     JSONB,
  -- Format: {"ip": "...", "subnet": "...", "gateway": "...", "dns": "..."}
  is_correct  BOOLEAN     NOT NULL DEFAULT false,
  attempt     INT         NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.lab_submissions IS 'Jawaban siswa pada lab simulasi';

-- ── 1.10 ANNOUNCEMENTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID        NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  author_id   UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.announcements IS 'Pengumuman guru untuk kelas';

-- ================================================================
-- SECTION 2: INDEXES (Optimasi query)
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id
  ON public.classes(teacher_id);

CREATE INDEX IF NOT EXISTS idx_classes_class_code
  ON public.classes(class_code);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id
  ON public.enrollments(user_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_class_id
  ON public.enrollments(class_id);

CREATE INDEX IF NOT EXISTS idx_materials_class_id
  ON public.materials(class_id);

CREATE INDEX IF NOT EXISTS idx_materials_order
  ON public.materials(class_id, order_num);

CREATE INDEX IF NOT EXISTS idx_quizzes_class_id
  ON public.quizzes(class_id);

CREATE INDEX IF NOT EXISTS idx_questions_quiz_id
  ON public.questions(quiz_id);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id
  ON public.submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_submissions_quiz_id
  ON public.submissions(quiz_id);

CREATE INDEX IF NOT EXISTS idx_submissions_user_quiz
  ON public.submissions(user_id, quiz_id);

CREATE INDEX IF NOT EXISTS idx_labs_class_id
  ON public.labs(class_id);

CREATE INDEX IF NOT EXISTS idx_lab_submissions_user_id
  ON public.lab_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_lab_submissions_lab_id
  ON public.lab_submissions(lab_id);

CREATE INDEX IF NOT EXISTS idx_announcements_class_id
  ON public.announcements(class_id);

-- ================================================================
-- SECTION 3: FUNCTIONS & TRIGGERS
-- ================================================================

-- ── 3.1 Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_classes_updated_at ON public.classes;
CREATE TRIGGER trg_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_materials_updated_at ON public.materials;
CREATE TRIGGER trg_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_quizzes_updated_at ON public.quizzes;
CREATE TRIGGER trg_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── 3.2 Auto-create profile saat user register ───────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 3.3 Generate unique class code ───────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Format: 2 huruf + 4 angka, mis: JK4821
    code := upper(substring(md5(random()::text) FROM 1 FOR 2)) ||
            lpad(floor(random() * 9000 + 1000)::text, 4, '0');
    SELECT EXISTS (SELECT 1 FROM public.classes WHERE class_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ── 3.4 Helper: get user role ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── 3.5 Helper: is_admin ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── 3.6 Helper: is_teacher_of_class ─────────────────────────────
CREATE OR REPLACE FUNCTION public.is_teacher_of(class_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = class_uuid AND teacher_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── 3.7 Helper: is_enrolled_in ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_enrolled_in(class_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE class_id = class_uuid AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- == View: student dashboard stats ================================
CREATE OR REPLACE VIEW public.student_stats AS
SELECT
  e.user_id,
  COUNT(DISTINCT e.class_id)    AS class_count,
  COUNT(DISTINCT s.quiz_id)     AS quiz_done,
  COALESCE(AVG(s.score), 0)::INT AS avg_score,
  COUNT(DISTINCT ls.lab_id)     AS lab_done
FROM public.enrollments e
LEFT JOIN public.submissions s   ON s.user_id = e.user_id
LEFT JOIN public.lab_submissions ls ON ls.user_id = e.user_id
GROUP BY e.user_id;

COMMENT ON VIEW public.student_stats IS 'Statistik cepat per siswa untuk dashboard';

-- ================================================================
-- SECTION 4: ROW LEVEL SECURITY
-- ================================================================

-- Enable RLS pada semua tabel
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements   ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────
-- PROFILES
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: user selects own"    ON public.profiles;
DROP POLICY IF EXISTS "profiles: user updates own"    ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin selects all"   ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin updates all"   ON public.profiles;
DROP POLICY IF EXISTS "profiles: service insert"      ON public.profiles;

-- Admin bisa baca semua profil
CREATE POLICY "profiles: admin selects all" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- User bisa baca profil sendiri
CREATE POLICY "profiles: user selects own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- User bisa update profil sendiri
CREATE POLICY "profiles: user updates own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin bisa update semua (untuk set role)
CREATE POLICY "profiles: admin updates all" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Service role bisa insert (untuk trigger)
CREATE POLICY "profiles: service insert" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────
-- CLASSES
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "classes: teacher manages own"  ON public.classes;
DROP POLICY IF EXISTS "classes: student views enrolled" ON public.classes;
DROP POLICY IF EXISTS "classes: admin manages all"    ON public.classes;

-- Teacher bisa CRUD kelas miliknya
CREATE POLICY "classes: teacher manages own" ON public.classes
  FOR ALL USING (auth.uid() = teacher_id);

-- Siswa bisa lihat kelas yang diikuti
CREATE POLICY "classes: student views enrolled" ON public.classes
  FOR SELECT USING (public.is_enrolled_in(id));

-- Admin bisa akses semua kelas
CREATE POLICY "classes: admin manages all" ON public.classes
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- ENROLLMENTS
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "enrollments: select own"      ON public.enrollments;
DROP POLICY IF EXISTS "enrollments: insert self"     ON public.enrollments;
DROP POLICY IF EXISTS "enrollments: teacher views"   ON public.enrollments;
DROP POLICY IF EXISTS "enrollments: admin all"       ON public.enrollments;

CREATE POLICY "enrollments: select own" ON public.enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "enrollments: insert self" ON public.enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Teacher bisa lihat siswa di kelasnya
CREATE POLICY "enrollments: teacher views" ON public.enrollments
  FOR SELECT USING (public.is_teacher_of(class_id));

CREATE POLICY "enrollments: admin all" ON public.enrollments
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- MATERIALS
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "materials: student views"     ON public.materials;
DROP POLICY IF EXISTS "materials: teacher manages"   ON public.materials;
DROP POLICY IF EXISTS "materials: admin all"         ON public.materials;

CREATE POLICY "materials: student views" ON public.materials
  FOR SELECT USING (
    is_published = true AND
    public.is_enrolled_in(class_id)
  );

CREATE POLICY "materials: teacher manages" ON public.materials
  FOR ALL USING (public.is_teacher_of(class_id));

CREATE POLICY "materials: admin all" ON public.materials
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- QUIZZES
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "quizzes: student views"       ON public.quizzes;
DROP POLICY IF EXISTS "quizzes: teacher manages"     ON public.quizzes;
DROP POLICY IF EXISTS "quizzes: admin all"           ON public.quizzes;

CREATE POLICY "quizzes: student views" ON public.quizzes
  FOR SELECT USING (
    is_active = true AND
    public.is_enrolled_in(class_id)
  );

CREATE POLICY "quizzes: teacher manages" ON public.quizzes
  FOR ALL USING (public.is_teacher_of(class_id));

CREATE POLICY "quizzes: admin all" ON public.quizzes
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- QUESTIONS
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "questions: student views"     ON public.questions;
DROP POLICY IF EXISTS "questions: teacher manages"   ON public.questions;
DROP POLICY IF EXISTS "questions: admin all"         ON public.questions;

CREATE POLICY "questions: student views" ON public.questions
  FOR SELECT USING (
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      WHERE public.is_enrolled_in(q.class_id)
    )
  );

CREATE POLICY "questions: teacher manages" ON public.questions
  FOR ALL USING (
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      WHERE public.is_teacher_of(q.class_id)
    )
  );

CREATE POLICY "questions: admin all" ON public.questions
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- SUBMISSIONS
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "submissions: student own"     ON public.submissions;
DROP POLICY IF EXISTS "submissions: student insert"  ON public.submissions;
DROP POLICY IF EXISTS "submissions: teacher views"   ON public.submissions;
DROP POLICY IF EXISTS "submissions: admin all"       ON public.submissions;

CREATE POLICY "submissions: student own" ON public.submissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "submissions: student insert" ON public.submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "submissions: teacher views" ON public.submissions
  FOR SELECT USING (
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      WHERE public.is_teacher_of(q.class_id)
    )
  );

CREATE POLICY "submissions: admin all" ON public.submissions
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- LABS
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "labs: student views"          ON public.labs;
DROP POLICY IF EXISTS "labs: teacher manages"        ON public.labs;
DROP POLICY IF EXISTS "labs: admin all"              ON public.labs;

CREATE POLICY "labs: student views" ON public.labs
  FOR SELECT USING (
    is_active = true AND
    public.is_enrolled_in(class_id)
  );

CREATE POLICY "labs: teacher manages" ON public.labs
  FOR ALL USING (public.is_teacher_of(class_id));

CREATE POLICY "labs: admin all" ON public.labs
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- LAB SUBMISSIONS
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "lab_submissions: student own"    ON public.lab_submissions;
DROP POLICY IF EXISTS "lab_submissions: student insert" ON public.lab_submissions;
DROP POLICY IF EXISTS "lab_submissions: teacher views"  ON public.lab_submissions;
DROP POLICY IF EXISTS "lab_submissions: admin all"      ON public.lab_submissions;

CREATE POLICY "lab_submissions: student own" ON public.lab_submissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "lab_submissions: student insert" ON public.lab_submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "lab_submissions: teacher views" ON public.lab_submissions
  FOR SELECT USING (
    lab_id IN (
      SELECT l.id FROM public.labs l
      WHERE public.is_teacher_of(l.class_id)
    )
  );

CREATE POLICY "lab_submissions: admin all" ON public.lab_submissions
  FOR ALL USING (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- ANNOUNCEMENTS
-- ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "announcements: student views"    ON public.announcements;
DROP POLICY IF EXISTS "announcements: teacher manages"  ON public.announcements;
DROP POLICY IF EXISTS "announcements: admin all"        ON public.announcements;

CREATE POLICY "announcements: student views" ON public.announcements
  FOR SELECT USING (public.is_enrolled_in(class_id));

CREATE POLICY "announcements: teacher manages" ON public.announcements
  FOR ALL USING (public.is_teacher_of(class_id) OR auth.uid() = author_id);

CREATE POLICY "announcements: admin all" ON public.announcements
  FOR ALL USING (public.is_admin());

-- ================================================================
-- SECTION 5: SAMPLE DATA
-- ================================================================
-- Jalankan bagian ini TERPISAH setelah setup awal selesai.
-- Uncomment baris yang ingin dijalankan.
-- ================================================================

/*
-- ── 5.1 Set user sebagai ADMIN ──────────────────────────────────
-- Ganti 'user@email.com' dengan email admin kamu
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@sekolah.sch.id' LIMIT 1
);

-- ── 5.2 Set user sebagai GURU ───────────────────────────────────
UPDATE public.profiles
SET role = 'teacher'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'guru@sekolah.sch.id' LIMIT 1
);

-- ── 5.3 Sample Kelas (jalankan setelah akun guru dibuat) ────────
INSERT INTO public.classes (name, description, teacher_id, class_code, subject, semester)
VALUES
  ('Jaringan Komputer XI TKJ 1', 'Kelas jaringan komputer semester ganjil untuk kelas XI TKJ 1',
   (SELECT id FROM public.profiles WHERE role='teacher' LIMIT 1),
   'JK2026', 'Jaringan Komputer', 'Ganjil 2025/2026'),

  ('Keamanan Jaringan XII TKJ 1', 'Materi keamanan jaringan dan ethical hacking dasar',
   (SELECT id FROM public.profiles WHERE role='teacher' LIMIT 1),
   'KJ2026', 'Keamanan Jaringan', 'Ganjil 2025/2026'),

  ('Administrasi Sistem Jaringan XI TKJ 2', 'Administrasi server Linux dan Windows Server',
   (SELECT id FROM public.profiles WHERE role='teacher' LIMIT 1),
   'ASJ226', 'Administrasi Sistem', 'Ganjil 2025/2026');

-- ── 5.4 Sample Materi ───────────────────────────────────────────
INSERT INTO public.materials (class_id, title, content, type, order_num)
SELECT
  id AS class_id,
  'Pengenalan Model OSI' AS title,
  '# Model OSI

Model OSI (Open Systems Interconnection) adalah model referensi yang mendefinisikan cara sistem komunikasi jaringan berinteraksi.

## 7 Layer OSI

1. **Physical** - Bit stream melalui media fisik
2. **Data Link** - Frame dan MAC address
3. **Network** - IP routing dan addressing
4. **Transport** - TCP/UDP, end-to-end delivery
5. **Session** - Manajemen sesi koneksi
6. **Presentation** - Enkripsi, kompresi, format data
7. **Application** - HTTP, FTP, SMTP, DNS

## Cara Mengingat (Mnemonik)
**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way' AS content,
  'text' AS type,
  1 AS order_num
FROM public.classes LIMIT 1;

INSERT INTO public.materials (class_id, title, content, type, order_num)
SELECT
  id AS class_id,
  'Video: Konfigurasi MikroTik Dasar' AS title,
  'https://www.youtube.com/watch?v=example-mikrotik-config' AS content,
  'video' AS type,
  2 AS order_num
FROM public.classes LIMIT 1;

INSERT INTO public.materials (class_id, title, content, type, order_num)
SELECT
  id AS class_id,
  'Subnetting dan VLSM' AS title,
  '# Subnetting

## Apa itu Subnetting?
Subnetting adalah proses membagi jaringan besar menjadi sub-jaringan yang lebih kecil.

## Contoh Soal
Network: 192.168.1.0/24
Bagi menjadi 4 subnet sama besar:

- Subnet 1: 192.168.1.0/26 (host: .1 – .62)
- Subnet 2: 192.168.1.64/26 (host: .65 – .126)
- Subnet 3: 192.168.1.128/26 (host: .129 – .190)
- Subnet 4: 192.168.1.192/26 (host: .193 – .254)' AS content,
  'text' AS type,
  3 AS order_num
FROM public.classes LIMIT 1;

-- ── 5.5 Sample Quiz ─────────────────────────────────────────────
WITH new_quiz AS (
  INSERT INTO public.quizzes (class_id, title, description, duration, pass_score)
  SELECT
    id,
    'Quiz 1 — Model OSI & TCP/IP',
    'Ujian pemahaman model OSI 7 layer dan perbedaannya dengan TCP/IP',
    30,
    70
  FROM public.classes LIMIT 1
  RETURNING id
)
INSERT INTO public.questions (quiz_id, question, options, correct_answer, explanation, order_num)
SELECT
  new_quiz.id,
  q.question,
  q.options::jsonb,
  q.correct_answer,
  q.explanation,
  q.order_num
FROM new_quiz, (VALUES
  (1, 'Layer manakah pada model OSI yang bertugas menentukan jalur terbaik pengiriman data?',
   '["A. Data Link", "B. Transport", "C. Network", "D. Session"]',
   'C', 'Layer Network (Layer 3) bertugas routing dan addressing menggunakan IP address untuk menentukan jalur terbaik.'),

  (2, 'Protokol apa yang bekerja pada Layer 4 (Transport) model OSI dan menjamin pengiriman data?',
   '["A. IP", "B. ARP", "C. HTTP", "D. TCP"]',
   'D', 'TCP (Transmission Control Protocol) bekerja di Layer Transport dan menyediakan reliable, ordered delivery.'),

  (3, 'Berapa jumlah layer pada model TCP/IP?',
   '["A. 7", "B. 5", "C. 4", "D. 3"]',
   'C', 'Model TCP/IP memiliki 4 layer: Network Access, Internet, Transport, dan Application.'),

  (4, 'Perangkat manakah yang bekerja pada Layer 2 (Data Link) model OSI?',
   '["A. Router", "B. Hub", "C. Switch", "D. Firewall"]',
   'C', 'Switch bekerja pada Layer 2 menggunakan MAC address untuk meneruskan frame ke port yang tepat.'),

  (5, 'Apa fungsi protokol ARP dalam jaringan komputer?',
   '["A. Mengkonversi domain name ke IP address", "B. Mengkonversi IP address ke MAC address", "C. Mengenkripsi paket data", "D. Menentukan rute terbaik"]',
   'B', 'ARP (Address Resolution Protocol) berfungsi untuk memetakan IP address ke MAC address dalam jaringan lokal.')
) AS q(order_num, question, options, correct_answer, explanation);

-- ── 5.6 Sample Lab ──────────────────────────────────────────────
INSERT INTO public.labs (class_id, title, description, type, config, answer, difficulty)
SELECT
  id,
  'Lab 1 — Konfigurasi IP Static LAN',
  'Konfigurasikan IP address, subnet mask, gateway, dan DNS pada komputer yang terhubung ke jaringan LAN sekolah dengan topologi star.',
  'network',
  '{
    "instructions": "Sebuah komputer baru perlu dikonfigurasi untuk terhubung ke jaringan LAN lab komputer.\n\nInformasi jaringan:\n• Network address: 192.168.10.0/24\n• Gateway Router: 192.168.10.1\n• DNS Server Sekolah: 192.168.10.2\n• IP yang tersedia: 192.168.10.10 - 192.168.10.50\n\nTugas: Konfigurasikan komputer dengan IP static yang valid!",
    "topology": "PC → Switch → Router → Internet",
    "devices": [
      {"name": "PC Baru", "role": "client"},
      {"name": "Switch Cisco", "role": "switch"},
      {"name": "Router MikroTik", "role": "gateway", "ip": "192.168.10.1"},
      {"name": "Server DNS", "role": "dns", "ip": "192.168.10.2"}
    ]
  }'::jsonb,
  '{
    "ip": "192.168.10.20",
    "subnet": "255.255.255.0",
    "gateway": "192.168.10.1",
    "dns": "192.168.10.2"
  }'::jsonb,
  'easy'
FROM public.classes LIMIT 1;
*/

-- ================================================================
-- SECTION 6: VERIFIKASI (Jalankan setelah semua setup)
-- ================================================================

-- Cek semua tabel ada
SELECT
  schemaname,
  tablename,
  tableowner,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'classes', 'enrollments', 'materials',
    'quizzes', 'questions', 'submissions',
    'labs', 'lab_submissions', 'announcements'
  )
ORDER BY tablename;

-- Cek semua policy RLS aktif
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
