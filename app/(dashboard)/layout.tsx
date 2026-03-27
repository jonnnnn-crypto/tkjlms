import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { getUserProfile, getUserSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();
  const profile = await getUserProfile();

  const role = profile?.role || "student";
  const email = session?.user?.email || "";
  const name = profile?.full_name || email.split("@")[0] || "";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Topbar userEmail={email} userName={name} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
