import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, PlusCircle, ScanLine, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  // If no user, just render children (Login page usually)
  if (!user) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const isStudent = user.role === "STUDENT";
  const isWarden = user.role === "WARDEN";
  const isSecurity = user.role === "SECURITY";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar / Mobile Header */}
      <aside className="bg-white border-r border-border w-full md:w-64 flex-shrink-0 flex flex-col h-auto md:min-h-screen shadow-xs z-10 sticky top-0 md:relative">
        <div className="p-6 border-b border-border flex justify-between items-center md:block">
          <div>
            <h1 className="font-display font-bold text-xl text-primary tracking-tight">CampusPass</h1>
            <p className="text-xs text-muted-foreground mt-1">Out-Pass Management</p>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={logout}>
             <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 hidden md:block">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
            
            {isStudent && (
              <>
                <NavLink href="/student/dashboard" active={location === "/student/dashboard"} icon={<LayoutDashboard size={18} />}>
                  Dashboard
                </NavLink>
                <NavLink href="/student/apply" active={location === "/student/apply"} icon={<PlusCircle size={18} />}>
                  Apply Pass
                </NavLink>
              </>
            )}

            {isWarden && (
              <NavLink href="/warden/dashboard" active={location === "/warden/dashboard"} icon={<ListChecks size={18} />}>
                Approvals
              </NavLink>
            )}

            {isSecurity && (
              <NavLink href="/security/scan" active={location === "/security/scan"} icon={<ScanLine size={18} />}>
                Scan QR
              </NavLink>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border hidden md:block">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-colors" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        {/* Mobile Navigation Bar (Bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-2 flex justify-around z-50 pb-safe">
           {isStudent && (
              <>
                <MobileNavLink href="/student/dashboard" active={location === "/student/dashboard"} icon={<LayoutDashboard size={20} />} label="Home" />
                <MobileNavLink href="/student/apply" active={location === "/student/apply"} icon={<PlusCircle size={20} />} label="Apply" />
              </>
            )}
            {isWarden && (
               <MobileNavLink href="/warden/dashboard" active={location === "/warden/dashboard"} icon={<ListChecks size={20} />} label="Requests" />
            )}
            {isSecurity && (
               <MobileNavLink href="/security/scan" active={location === "/security/scan"} icon={<ScanLine size={20} />} label="Scan" />
            )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-4rem)] md:h-screen pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, active, icon, children }: { href: string, active: boolean, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
        {icon}
        {children}
      </div>
    </Link>
  );
}

function MobileNavLink({ href, active, icon, label }: { href: string, active: boolean, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href}>
      <div className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer ${active ? 'text-primary' : 'text-muted-foreground'}`}>
        {icon}
        <span className="text-[10px] mt-1 font-medium">{label}</span>
      </div>
    </Link>
  );
}