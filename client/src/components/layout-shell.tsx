import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sprout, 
  Droplets, 
  UserCheck, 
  ClipboardList, 
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  FileText,
  ListChecks,
  PawPrint,
  ClipboardCheck,
  Library,
  ChevronDown
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(location.startsWith("/resources"));

  useEffect(() => {
    if (location.startsWith("/resources")) {
      setIsResourcesOpen(true);
    }
  }, [location]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Produce Safety Checklist', href: '/checklist', icon: ListChecks },
    { name: 'Coverage Checker', href: '/onboarding', icon: FileText },
    { name: 'Resources', href: '/resources', icon: Library },
  ];

  const resourcesNavigation = [
    { name: 'Worker Training', href: '/resources/training', icon: UserCheck },
    { name: 'Agricultural Water', href: '/resources/water', icon: Droplets },
    { name: 'Soil Amendments', href: '/resources/soil', icon: Sprout },
    { name: 'Postharvest Handling', href: '/resources/postharvest', icon: ClipboardList },
    { name: 'Wildlife & Animals', href: '/resources/wildlife', icon: PawPrint },
    { name: 'Recordkeeping', href: '/resources/recordkeeping', icon: ClipboardCheck },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a4d4f] to-[#0a4d4f] text-white">
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2 font-serif text-xl font-bold text-white">
          <div className="p-1.5 bg-amber-400 rounded-lg">
            <Sprout className="h-5 w-5 text-emerald-900" />
          </div>
          <span>Agrifood Safety</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navigation.map((item) => {
          if (item.name === "Resources") {
            const isResourcesActive = location.startsWith("/resources");
            return (
              <div key={item.name} className="space-y-1">
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isResourcesActive
                      ? "bg-white/20 text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Link href={item.href} className="flex flex-1 items-center gap-3" onClick={() => setIsMobileOpen(false)}>
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isResourcesActive ? "text-amber-400" : "text-white/60 group-hover:text-amber-400"
                      )}
                    />
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    className="p-1 text-white/70 hover:text-white"
                    onClick={() => setIsResourcesOpen((prev) => !prev)}
                    aria-label={isResourcesOpen ? "Collapse resources" : "Expand resources"}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-500 ease-in-out",
                        isResourcesOpen && "rotate-180"
                      )}
                    />
                  </button>
                </div>
                <div
                  className={cn(
                    "space-y-1 overflow-hidden transition-all duration-500 ease-in-out",
                    isResourcesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {resourcesNavigation.map((subItem) => {
                    const isActive = location === subItem.href;
                    return (
                        <Link key={subItem.name} href={subItem.href}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-8 py-2 text-xs font-medium rounded-lg transition-all duration-200 group cursor-pointer",
                          isActive
                            ? "bg-white/20 text-white shadow-md"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <subItem.icon
                              className={cn(
                                "h-4 w-4",
                                isActive ? "text-amber-400" : "text-white/60 group-hover:text-amber-400"
                              )}
                            />
                            {subItem.name}
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            );
          }

          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-amber-400" : "text-white/60 group-hover:text-amber-400"
                  )}
                />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-amber-400 text-emerald-900 flex items-center justify-center font-bold text-sm">
            {user?.firstName?.[0] || user?.email?.[0] || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate text-white">{user?.firstName || 'User'}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 fixed inset-y-0 z-50">
        <NavContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40 bg-background/80 backdrop-blur border shadow-sm">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-w-0">
        <div className="container max-w-6xl mx-auto p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
