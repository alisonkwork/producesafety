import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sprout, 
  Droplets, 
  UserCheck, 
  ClipboardList, 
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  FileText
} from "lucide-react";
import { useState } from "react";
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'FSMA Wizard', href: '/onboarding', icon: FileText },
    { name: 'Worker Training', href: '/records/training', icon: UserCheck },
    { name: 'Water Records', href: '/records/water', icon: Droplets },
    { name: 'Soil Amendments', href: '/records/soil', icon: Sprout },
    { name: 'Other Records', href: '/records/general', icon: ClipboardList },
    { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
          <Sprout className="h-6 w-6" />
          <span>ProduceSafe</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/50 bg-secondary/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
            {user?.firstName?.[0] || user?.email?.[0] || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.firstName || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
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
