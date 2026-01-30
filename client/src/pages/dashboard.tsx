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
    <div className="relative overflow-hidden rounded-2xl bg-transparent text-[#0a4d4f] p-0 md:p-0">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-[#0a4d4f]/80 uppercase tracking-wide">Produce Safety Tasks</span>
        </div>
        <h1 className="text-3xl md:text-4xl text-[#0a4d4f] font-serif font-bold mb-3">
          {hasStatus ? "Welcome back!" : "Grow Safely, Sell Confidently"}
        </h1>
        <p className="text-lg text-[#0a4d4f]/80 max-w-2xl mb-0">
          {hasStatus 
            ? "Reduce produce safety risks on the farm one step at a time."
            : "Stay organized and on track with your produce safety tasks."}
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
      <Card
        className={`${gradient} ${isDark ? 'text-white' : 'text-stone-600'} border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full`}
      >
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
      title: "Soil Amendments",
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
    {
      title: "Wildlife & Domesticated Animals",
      description: "Document monitoring and risk assessments for animal activity",
      icon: FileText,
      href: "/resources/wildlife",
      gradient: "white",
      iconBg: "bg-emerald-200",
    },
  ];

  const visibleCards = quickActionCards;

  return (
    <LayoutShell>
      <div className="space-y-8">
        <HeroSection hasStatus={!!status} />

        

      
        <div className="grid items-stretch gap-6 lg:auto-rows-fr lg:grid-cols-[2fr_1fr]">
          {summary && (
            <Card className="rounded-2xl border border-slate-200/70 bg-white">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-2xl font-serif font-bold text-foreground">Task overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4 space-y-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="border-rose-200 bg-rose-50/60">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-700" />
                        <span className="text-sm font-semibold text-rose-700">Overdue</span>
                      </div>
                      <span className="text-2xl font-bold text-rose-700">{summary.overdueCount}</span>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-200 bg-amber-50/60">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-amber-700" />
                        <span className="text-sm font-semibold text-amber-700">Due soon (14 days)</span>
                      </div>
                      <span className="text-2xl font-bold text-amber-700">{summary.dueSoonCount}</span>
                    </CardContent>
                  </Card>
                  <Card className="border-emerald-200 bg-emerald-50/60">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        <span className="text-sm font-semibold text-emerald-700">Completed this month</span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700">{summary.completedThisMonth}</span>
                    </CardContent>
                  </Card>
                </div>
                <Link href="/checklist">
                  <Button variant="ghost" size="sm" className="mt-8 bg-emerald-500 text-white">
                    Go to task list
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <div className="lg:max-w-sm h-full">
            <StatusCard status={status} />
          </div>
        </div>

       
        

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
      <Card className="h-full border border-dashed border-orange-200 bg-orange-50/70 dark:bg-orange-950/20">
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
      return { bg: "bg-[#f5fbd4] dark:bg-amber-950/30", border: "border-amber-200", text: "text-amber-800 dark:text-amber-200" };
    }
    if (status.isExempt) {
      return { bg: "bg-[#f5fbd4] dark:bg-emerald-950/30", border: "border-[#d5dbb9]", text: "text-emerald-800 dark:text-emerald-200" };
    }
    return { bg: "bg-sky-50/70 dark:bg-sky-950/30", border: "border-sky-200", text: "text-sky-800 dark:text-sky-200" };
  };

  const style = getStatusStyle();
  const statusTitle = status.isExempt 
    ? (status.exemptionType === "qualified" ? "Qualified Exempt" : "Qualified Exempt") 
    : "Covered";

  return (
    <Card className={`h-full border ${style.border} ${style.bg}`}>
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
