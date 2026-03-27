export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card py-3 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground/70">TJKT LMS</span> &copy; {new Date().getFullYear()}
        </span>
        <span className="text-center">
          Development by{" "}
          <span className="font-semibold text-primary">Ghifari Azhar</span>
          {" "}&middot;{" "}
          Production by{" "}
          <span className="font-semibold text-foreground/70">LTEC SMK NEGERI 1 LIWA</span>
        </span>
      </div>
    </footer>
  );
}
