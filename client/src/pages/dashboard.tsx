import { useFsmaStatus } from "@/hooks/use-fsma";
import { useRecords } from "@/hooks/use-records";
import { useChecklistStore } from "@/hooks/use-checklist";
import { LayoutShell } from "@/components/layout-shell";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, FileText, ArrowRight, Leaf, Droplets, Users, ClipboardList, Sparkles, SprayCan, AlertTriangle, CalendarClock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";


function HeroSection({ hasStatus }: { hasStatus: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl gradient-hero text-white p-8 md:p-12 shadow-xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-yellow-300" />
          <span className="text-sm font-medium text-white/90 uppercase tracking-wide">Produce Safety Recordkeeping</span>
        </div>
        <h1 className="text-3xl md:text-4xl text-white font-serif font-bold mb-3">
          {hasStatus ? "Welcome back" : "Grow Safely, Sell Confidently"}
        </h1>
        <p className="text-lg text-white/80 max-w-2xl mb-6">
          {hasStatus 
            ? "Organize your farm's produce safety records and stay on top of FSMA Produce Safety Rule and GAPs requirements."
            : "Simplify FSMA compliance with smart record-keeping and exemption tracking designed for real farmers."}
        </p>
        {!hasStatus && (
          <Link href="/onboarding">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90 font-semibold shadow-lg">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Check Your FSMA Status
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}



function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  gradient,
  iconBg,
  isDark
}: { 
  title: string; 
  description: string; 
  icon: any; 
  href: string;
  gradient: string;
  iconBg: string;
  isDark?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className={`${gradient} ${isDark ? 'text-white' : 'text-stone-600'} border border-transparent shadow-sm hover:shadow-lg hover:border-emerald-600 transition-all hover:scale-[1.02] cursor-pointer h-full`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${iconBg} rounded-lg white`}>
              <Icon className="h-6 w-6 text-white"/>
            </div>
            <CardTitle className={`text-lg font-bold ${isDark ? 'text-white' : 'text-stone-600'}`}>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`${isDark ? 'text-white/90' : 'text-stone-400'} text-sm`}>{description}</p>
        </CardContent>
        <CardFooter>
          
        </CardFooter>
      </Card>
    </Link>
  );
}





export default function Dashboard() {
  const { status, isLoading: statusLoading } = useFsmaStatus();
  const { records, isLoading: recordsLoading } = useRecords();
  const { summary } = useChecklistStore();

  if (statusLoading || recordsLoading) {
    return (
      <LayoutShell>
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        </div>
      </LayoutShell>
    );
  }

  const quickActionCards = [
    {
      title: "Worker Training",
      description: "Log employee food safety training sessions",
      icon: Users,
      href: "/resources/training",
      gradient: "white",
      iconBg: "bg-red-200",
    },
    {
      title: "Cleaning & Sanitizing",
      description: "Track equipment and surface sanitation logs",
      icon: SprayCan,
      href: "/resources/postharvest",
      gradient: "white",
      iconBg: "bg-orange-200",
    },
    {
      title: "Agricultural Water",
      description: "Record agricultural water test results",
      icon: Droplets,
      href: "/resources/water",
      gradient: "white",
      iconBg: "bg-amber-200",
    },
    {
      title: "Compost",
      description: "Track biological soil amendments and compost",
      icon: Leaf,
      href: "/resources/soil",
      gradient: "white",
      iconBg: "bg-sky-200",
    },
    {
      title: "Recordkeeping",
      description: "Self-check that required records exist",
      icon: ClipboardList,
      href: "/resources/recordkeeping",
      gradient: "white",
      iconBg: "bg-green-200",
    },
  ];

  const visibleCards = quickActionCards;

  return (
    <LayoutShell>
      <div className="space-y-8">
        <HeroSection hasStatus={!!status} />

        

      
        <StatusCard status={status} />

        {summary && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-rose-200 bg-rose-50/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-rose-700">{summary.overdueCount}</CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  Due soon (14 days)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-amber-700">{summary.dueSoonCount}</CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed this month
                </CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-emerald-700">{summary.completedThisMonth}</CardContent>
            </Card>
          </div>
        )}

       
        

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card) => (
            <QuickActionCard
              key={card.key}
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.href}
              gradient={card.gradient}
              iconBg={card.iconBg}
              isDark={card.isDark}
            />
      
          ))}

         

          

          
          
        </div>

        
      </div>
    </LayoutShell>
  );
}

function StatusCard({ status }: { status: any }) {
  if (!status) {
    return (
      <Card className="border-2 border-dashed border-orange-300 bg-orange-50/50 dark:bg-orange-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg font-bold text-orange-800 dark:text-orange-200">FSMA Coverage Status</CardTitle>
            <ShieldCheck className="h-6 w-6 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif font-bold mb-2 text-orange-700 dark:text-orange-300">Not Yet Determined</div>
          <p className="text-sm text-orange-600/80 dark:text-orange-400/80">
            Use this tool to find out if you're qualified exempt.
          </p>
        </CardContent>
        <CardFooter className="pt-2">
          <Link href="/onboarding">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Find out your coverage status</Button>
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
    ? (status.exemptionType === "qualified" ? "Qualified Exempt" : "Qualified Exempt") 
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
      <CardFooter className="pt-0">
        <Link href="/onboarding">
          <Button variant="ghost" size="sm" className={`bg-emerald-500 text-white style.text`}>Try the tool again</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
