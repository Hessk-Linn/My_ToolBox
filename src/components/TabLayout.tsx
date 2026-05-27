import { useLocation, Link } from "wouter";
import { Sun, Fuel, Home } from "lucide-react";

const tabs = [
  { path: "/",           label: "24V",    icon: Sun },
  { path: "/fuel",       label: "Fuel",   icon: Fuel },
  { path: "/home-solar", label: "48V",    icon: Home },
];

function pageSubtitle(loc: string): string {
  if (loc === "/" || loc === "") return "24V Solar Battery Monitor";
  if (loc.startsWith("/fuel"))       return "Fuel Cost Calculator (MMK)";
  if (loc.startsWith("/home-solar")) return "48V Home Solar System";
  return "My Tools";
}

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isDark = !location.startsWith("/fuel");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl">
            <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">My Tools</h1>
            <p className="text-xs text-muted-foreground truncate">{pageSubtitle(location)}</p>
          </div>
        </div>

        <div className="flex gap-0.5 bg-muted rounded-2xl p-1 mb-4 sm:mb-5">
          {tabs.map(({ path, label, icon: Icon }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                className={[
                  "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 sm:py-2.5 rounded-xl transition-all",
                  isActive
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span style={{ fontSize: "0.58rem", lineHeight: 1.2 }} className="w-full text-center font-semibold truncate px-0.5 sm:text-xs">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={isDark ? "w-full max-w-4xl mx-auto" : "w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8"}>
        {children}
      </div>
    </div>
  );
}
