import { useFsmaStatus } from "@/hooks/use-fsma";
import { useRecords } from "@/hooks/use-records";
import { LayoutShell } from "@/components/layout-shell";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";

function StatusCard({ status }: { status: any }) {
  if (!status) {
    return (
      <Card className="border-2 border-muted bg-muted/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">FSMA Status</CardTitle>
            <ShieldCheck className="h-6 w-6 opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-serif font-bold mb-2 text-muted-foreground">Not Determined</div>
          <p className="text-sm text-muted-foreground">
            Complete the wizard to determine your status.
          </p>
        </CardContent>
        <CardFooter className="pt-2">
          <Link href="/onboarding">
            <Button variant="outline" size="sm">Take Wizard</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (status.isExempt && status.exemptionType === "qualified") return "text-amber-600 bg-amber-50 border-amber-200";
    if (status.isExempt) return "text-green-700 bg-green-50 border-green-200";
    return "text-blue-700 bg-blue-50 border-blue-200";
  };

  const getStatusTitle = () => {
    if (status.isExempt) {
      return status.exemptionType === "qualified" ? "Qualified Exempt" : "Exempt";
    }
    return "Covered (Not Exempt)";
  };

  return (
    <Card className={`border-2 ${getStatusColor()}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">FSMA Status</CardTitle>
          <ShieldCheck className="h-6 w-6 opacity-80" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-serif font-bold mb-2">{getStatusTitle()}</div>
        <p className="text-sm opacity-90">
          Based on your sales of <strong>{status.annualSales}</strong> and distribution channels.
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href="/onboarding">
          <Button variant="link" className="p-0 h-auto font-semibold underline opacity-80 hover:opacity-100">
            Recalculate Status
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function RecentRecords({ records }: { records: any[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Recent Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No records found.</p>
            <Link href="/records/training">
              <Button variant="outline" className="mt-4">Create First Record</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors border border-transparent hover:border-border">
                <div>
                  <h4 className="font-semibold text-sm">{record.title}</h4>
                  <p className="text-xs text-muted-foreground capitalize">
                    {record.type} • {format(new Date(record.date), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="outline" className="bg-background">
                  View
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {records.length > 0 && (
        <CardFooter>
          <Link href="/records/general" className="w-full">
            <Button variant="ghost" className="w-full">View All Records <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const { status, isLoading: statusLoading } = useFsmaStatus();
  const { records, isLoading: recordsLoading } = useRecords();
  const [, setLocation] = useLocation();

  if (statusLoading || recordsLoading) {
    return (
      <LayoutShell>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your farm's food safety compliance.</p>
          </div>
        </div>

        {!status && (
          <Alert className="border-secondary/50 bg-secondary/10">
            <AlertTriangle className="h-4 w-4 text-secondary" />
            <AlertTitle>Not sure about your FSMA status?</AlertTitle>
            <AlertDescription className="flex items-center justify-between mt-2">
              <span>Take our quick wizard to determine your compliance requirements.</span>
              <Link href="/onboarding">
                <Button size="sm" variant="secondary">Start Wizard</Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatusCard status={status} />
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Training Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold mb-2">Active</div>
              <p className="text-sm text-muted-foreground">No expired training records found.</p>
            </CardContent>
            <CardFooter>
              <Link href="/records/training">
                <Button variant="link" className="p-0 h-auto font-semibold">Log Training</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Water Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-bold mb-2">
                {records.filter((r: any) => r.type === 'water').length} Tests
              </div>
              <p className="text-sm text-muted-foreground">Recorded this season.</p>
            </CardContent>
            <CardFooter>
              <Link href="/records/water">
                <Button variant="link" className="p-0 h-auto font-semibold">Add Test Result</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <RecentRecords records={records} />
          </div>
          
          <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/records/soil">
                <Button variant="secondary" className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0">
                  <span className="mr-2">🌱</span> Log Soil Amendment
                </Button>
              </Link>
              <Link href="/records/training">
                <Button variant="secondary" className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0">
                  <span className="mr-2">👥</span> Record Training
                </Button>
              </Link>
              <Link href="/records/water">
                <Button variant="secondary" className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0">
                  <span className="mr-2">💧</span> Log Water Test
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}
