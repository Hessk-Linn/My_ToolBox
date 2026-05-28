import { useLocation, Link } from "wouter";
import { Fuel, Zap, Battery, Calculator } from "lucide-react";

const tabs = [
  { path: "/fuel",       label: "Fuel",      icon: Fuel },
  { path: "/home-solar", label: "48V Solar", icon: Zap },
  { path: "/",           label: "24V Solar", icon: Battery },
  { path: "/converter",  label: "Converter", icon: Calculator },
];

function pageSubtitle(loc: string): string {
  if (loc.startsWith("/fuel"))       return "Fuel Cost Calculator (MMK)";
  if (loc.startsWith("/home-solar")) return "48V Home Solar System";
  if (loc === "/" || loc === "")     return "24V Solar Battery Monitor";
  if (loc.startsWith("/converter"))  return "Unit & Power Converter";
  return "My ToolBox";
}

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e0e0e0' }}>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-2">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4" style={{ borderBottom: '1px solid #1a2332', paddingBottom: '12px' }}>
          <div style={{ padding: '8px 10px', background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0e1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m5.2-13.2-4.2 4.2m0 6 4.2 4.2M23 12h-6m-6 0H5m13.2 5.2-4.2-4.2m0-6 4.2-4.2"/>
              <path d="M18 3l-3 3m-6 0L6 3m0 18l3-3m6 0l3 3"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }} className="sm:text-2xl">MY TOOLBOX</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.3px' }} className="sm:text-sm">{pageSubtitle(location)}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: '#0f1419', borderRadius: '16px', padding: '6px', marginBottom: '16px', border: '1px solid #1a2332' }}>
          {tabs.map(({ path, label, icon: Icon }) => {
            const isActive = path === "/" ? location === "/" : location.startsWith(path);
            return (
              <Link
                key={path}
                href={path}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '10px 8px',
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive ? 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)' : 'transparent',
                  color: isActive ? '#0a0e1a' : '#6b7280',
                  border: isActive ? '1px solid #00ff88' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 20px rgba(0,255,136,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="hover:bg-opacity-10 hover:bg-white"
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                    animation: 'shimmer 2s infinite',
                  }} />
                )}
                <Icon style={{ width: '18px', height: '18px', strokeWidth: isActive ? 2.5 : 2 }} className="sm:w-5 sm:h-5" />
                <span style={{ fontSize: '0.7rem', lineHeight: 1.2, fontWeight: isActive ? 800 : 600, letterSpacing: '0.3px' }} className="sm:text-xs">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8">
        {children}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
