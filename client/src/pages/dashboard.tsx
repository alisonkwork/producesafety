import { useFsmaStatus } from "@/hooks/use-fsma";
import { useRecords } from "@/hooks/use-records";
import { useChecklistStore } from "@/hooks/use-checklist";
import { LayoutShell } from "@/components/layout-shell";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, FileText, ArrowRight, Leaf, Droplets, Users, ClipboardList, Sparkles, SprayCan, AlertTriangle, CalendarClock, CheckCircle2, Briefcase, Square, CheckSquare, Carrot } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";


type StatusStyle = { bg: string; border: string; text: string };

function HeroSection({
  hasStatus,
  ongoingPreview,
  reminderStyle,
}: {
  hasStatus: boolean;
  ongoingPreview: Task[];
  reminderStyle: StatusStyle;
}) {
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
        <div className="mt-6 -mx-4 md:-mx-8 lg:-mx-12">
          <Card className={`w-full rounded-none ${reminderStyle.border} ${reminderStyle.bg}`}>
            <CardContent className="px-4 py-4 text-left md:px-8 lg:px-12">
              <div className="flex flex-wrap items-center gap-3">
                <Carrot className={`h-6 w-6 ${reminderStyle.text}`} />
                <span className={`text-base font-serif font-bold ${reminderStyle.text}`}>
                  Daily Produce Safety Reminder
                </span>
                <div className={`min-w-0 flex-1 text-base ${reminderStyle.text}`}>
                  {ongoingPreview.length > 0 ? (
                    <span className="line-clamp-1">
                      {ongoingPreview.map((task) => task.title).join(" • ")}
                    </span>
                  ) : (
                    <span className="opacity-80">No ongoing tasks yet.</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
  const { summary, tasks } = useChecklistStore();

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

  const ongoingPreview = tasks
    .filter((task) => task.frequency === "ongoing")
    .slice(0, 3);
  const reminderStyle: StatusStyle = {
    bg: "bg-lime-100",
    border: "border-0",
    text: "text-lime-900",
  };
  const weeklyCounts = tasks.reduce(
    (acc, task) => {
      if (task.frequency !== "weekly") return acc;
      if (task.status === "done") acc.done += 1;
      else acc.todo += 1;
      return acc;
    },
    { done: 0, todo: 0 }
  );

  return (
    <LayoutShell>
      <div className="space-y-8">
        <HeroSection hasStatus={!!status} ongoingPreview={ongoingPreview} reminderStyle={reminderStyle} />

        

      
        <div className="space-y-6">
          {summary && (
            <div className="-mx-4 md:-mx-8 lg:-mx-12">
              <Card className="relative my-6 w-full overflow-hidden rounded-none border-0 bg-white py-12 shadow-none md:my-8 md:py-14 lg:py-16">
                <svg
                  className="pointer-events-none absolute left-0 top-0 h-10 w-full fill-[hsl(var(--background))]"
                  viewBox="0 0 1440 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,128 1440,80 L1440,0 L0,0 Z" />
                </svg>
                <svg
                  className="pointer-events-none absolute bottom-0 left-0 h-10 w-full rotate-180 fill-[hsl(var(--background))]"
                  viewBox="0 0 1440 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,128 1440,80 L1440,0 L0,0 Z" />
                </svg>
                <CardHeader className="px-4 pb-3 pt-4 md:px-8 lg:px-12">
                <CardTitle className="text-3xl font-serif font-bold text-[#0a4d4f]">Task overview</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-4 space-y-6 md:px-8 lg:px-12">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-rose-200 bg-rose-50/60">
                    <CardContent className="space-y-4 p-8 min-h-[160px]">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-700" />
                        <span className="text-sm font-semibold text-rose-700">Overdue</span>
                      </div>
                      <span className="text-4xl font-bold text-rose-700">{summary.overdueCount}</span>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-200 bg-amber-50/60">
                    <CardContent className="space-y-4 p-8 min-h-[160px]">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-amber-700" />
                        <span className="text-sm font-semibold text-amber-700">Due soon (14 days)</span>
                      </div>
                      <span className="text-4xl font-bold text-amber-700">{summary.dueSoonCount}</span>
                    </CardContent>
                  </Card>
                  <Card className="border-emerald-200 bg-emerald-50/60">
                    <CardContent className="space-y-4 p-8 min-h-[160px]">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-emerald-700" />
                        <span className="text-sm font-semibold text-emerald-700">Weekly tasks</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-rose-600">
                          <Square className="h-4 w-4" />
                          <span className="text-xl font-semibold">{weeklyCounts.todo}</span>
                          <span className="text-xl font-semibold">to do</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckSquare className="h-4 w-4" />
                          <span className="text-xl font-semibold">{weeklyCounts.done}</span>
                          <span className="text-xl font-semibold">complete</span>
                        </div>
                      </div>
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
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <StatusCard status={status} />
            <QuickActionCard
              title="Produce Safety Toolkit"
              description="Templates, checklists, and guidance for FSMA compliance."
              icon={Briefcase}
              href="/resources"
              gradient="white"
              iconBg="bg-amber-200"
            />
          </div>
        </div>

       
        

        
      </div>
    </LayoutShell>
  );
}

function getStatusStyle(status: any): StatusStyle {
  if (status.isExempt && status.exemptionType === "qualified") {
    return { bg: "bg-[#f5fbd4] dark:bg-amber-950/30", border: "border-amber-200", text: "text-amber-800 dark:text-amber-200" };
  }
  if (status.isExempt) {
    return { bg: "bg-[#f5fbd4] dark:bg-emerald-950/30", border: "border-[#d5dbb9]", text: "text-emerald-800 dark:text-emerald-200" };
  }
  return { bg: "bg-sky-50/70 dark:bg-sky-950/30", border: "border-sky-200", text: "text-sky-800 dark:text-sky-200" };
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

  const style = getStatusStyle(status);
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
