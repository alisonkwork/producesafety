import { useFsmaStatus } from "@/hooks/use-fsma";
import { usePreferences } from "@/hooks/use-preferences";
import { LayoutShell } from "@/components/layout-shell";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Leaf, Droplets, Users, ClipboardList, Sparkles, Settings, SprayCan, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ALL_BOXES = [
  { id: 'training', name: 'Worker Training', description: 'Log employee food safety training sessions', icon: Users, gradient: 'bg-gradient-to-br from-purple-600 to-purple-800', href: '/records/training' },
  { id: 'cleaning', name: 'Cleaning & Sanitizing', description: 'Track equipment and surface cleaning', icon: SprayCan, gradient: 'bg-gradient-to-br from-cyan-500 to-teal-600', href: '/records/cleaning' },
  { id: 'water', name: 'Agricultural Water', description: 'Record water testing and treatment', icon: Droplets, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600', href: '/records/water' },
  { id: 'compost', name: 'Compost', description: 'Track biological soil amendments', icon: Leaf, gradient: 'bg-gradient-to-br from-amber-500 to-orange-600', href: '/records/soil' },
  { id: 'general', name: 'All Records', description: 'View and manage all compliance records', icon: ClipboardList, gradient: 'bg-gradient-to-br from-emerald-600 to-teal-700', href: '/records/general' },
];

function StatusCard({ status }: { status: any }) {
  if (!status) {
    return (
      <Card className="border-2 border-dashed border-orange-300 bg-orange-50/50 dark:bg-orange-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg font-bold text-orange-800 dark:text-orange-200">FSMA Status</CardTitle>
            <ShieldCheck className="h-6 w-6 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif font-bold mb-2 text-orange-700 dark:text-orange-300">Not Yet Determined</div>
          <p className="text-sm text-orange-600/80 dark:text-orange-400/80">
            Take our quick wizard to find out if you're exempt from the FSMA Produce Safety Rule.
          </p>
        </CardContent>
        <CardFooter className="pt-2">
          <Link href="/onboarding">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" data-testid="button-start-wizard">Start Wizard</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const getStatusStyle = () => {
    if (status.isExempt && status.exemptionType === "qualified") {
      return { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300", text: "text-amber-800 dark:text-amber-200" };
    }
    if (status.isExempt) {
      return { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-300", text: "text-emerald-800 dark:text-emerald-200" };
    }
    return { bg: "bg-sky-50 dark:bg-sky-950/30", border: "border-sky-300", text: "text-sky-800 dark:text-sky-200" };
  };

  const style = getStatusStyle();
  const statusTitle = status.isExempt 
    ? (status.exemptionType === "qualified" ? "Qualified Exempt" : "Exempt") 
    : "Covered";

  return (
    <Card className={`border-2 ${style.border} ${style.bg}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={`text-lg font-bold ${style.text}`}>FSMA Status</CardTitle>
          <ShieldCheck className={`h-6 w-6 ${style.text}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-serif font-bold mb-2 ${style.text}`}>{statusTitle}</div>
        <p className={`text-sm ${style.text} opacity-80`}>
          Based on <strong>{status.annualSales}</strong> in annual sales.
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href="/onboarding">
          <Button variant="ghost" size="sm" className={style.text} data-testid="button-update-status">Update Status</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function QuickActionCard({ 
  id,
  title, 
  description, 
  icon: Icon, 
  href, 
  gradient 
}: { 
  id: string;
  title: string; 
  description: string; 
  icon: any; 
  href: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <Card className={`${gradient} text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer h-full`} data-testid={`card-action-${id}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-white">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 text-sm">{description}</p>
        </CardContent>
        <CardFooter>
          <span className="text-white/90 text-sm font-medium flex items-center">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

function CustomizeDialog({ 
  visibleBoxes, 
  onUpdate,
  isUpdating 
}: { 
  visibleBoxes: string[];
  onUpdate: (boxes: string[]) => void;
  isUpdating: boolean;
}) {
  const [localBoxes, setLocalBoxes] = useState<string[]>(visibleBoxes);
  const [open, setOpen] = useState(false);

  const handleToggle = (boxId: string) => {
    if (localBoxes.includes(boxId)) {
      setLocalBoxes(localBoxes.filter(b => b !== boxId));
    } else {
      setLocalBoxes([...localBoxes, boxId]);
    }
  };

  const handleSave = () => {
    onUpdate(localBoxes);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" data-testid="button-customize-dashboard">
          <Settings className="h-4 w-4" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Your Dashboard</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which record types to show on your dashboard. Hide any you don't use.
        </p>
        <div className="space-y-4">
          {ALL_BOXES.map((box) => (
            <div key={box.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <box.icon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor={`toggle-${box.id}`} className="font-medium cursor-pointer">
                  {box.name}
                </Label>
              </div>
              <Switch
                id={`toggle-${box.id}`}
                checked={localBoxes.includes(box.id)}
                onCheckedChange={() => handleToggle(box.id)}
                data-testid={`switch-${box.id}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isUpdating || localBoxes.length === 0} data-testid="button-save-preferences">
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const { status, isLoading: statusLoading } = useFsmaStatus();
  const { preferences, isLoading: prefsLoading, updatePreferences, isUpdating } = usePreferences();

  const isLoading = statusLoading || prefsLoading;

  if (isLoading) {
    return (
      <LayoutShell>
        <div className="space-y-6">
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        </div>
      </LayoutShell>
    );
  }

  const visibleBoxIds = preferences?.dashboardBoxes || ['training', 'cleaning', 'water', 'compost', 'general'];
  const visibleBoxes = ALL_BOXES.filter(box => visibleBoxIds.includes(box.id));

  const handleUpdatePreferences = async (boxes: string[]) => {
    await updatePreferences({ dashboardBoxes: boxes });
  };

  return (
    <LayoutShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
            </div>
            <CustomizeDialog 
              visibleBoxes={visibleBoxIds} 
              onUpdate={handleUpdatePreferences}
              isUpdating={isUpdating}
            />
          </div>
          <p className="text-muted-foreground">Manage your farm's food safety compliance records.</p>
        </div>

        <StatusCard status={status} />

        {visibleBoxes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No record types selected. Click "Customize Dashboard" to choose which ones to show.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleBoxes.map((box) => (
              <QuickActionCard
                key={box.id}
                id={box.id}
                title={box.name}
                description={box.description}
                icon={box.icon}
                href={box.href}
                gradient={box.gradient}
              />
            ))}
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
