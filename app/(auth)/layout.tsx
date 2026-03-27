export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
      {/* Background decorations for LMS theme */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>
      
      <div className="w-full max-w-md bg-card text-card-foreground border rounded-2xl shadow-xl z-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-cyan-500" />
        <div className="p-8">
          <div className="flex flex-col items-center justify-center space-y-2 text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl mb-2 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">TJKT Learning</h1>
            <p className="text-sm text-muted-foreground">Log in to your account or register to join</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
