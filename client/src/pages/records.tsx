import { LayoutShell } from "@/components/layout-shell";
import { useChecklistStore } from "@/hooks/use-checklist";
import { useRoute } from "wouter";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";

export default function RecordsPage() {
  const [match, params] = useRoute("/resources/:type");
  const type = match ? params?.type : undefined;
  const { tasks, completeTask, uncompleteTask } = useChecklistStore();

  const getTypeTitle = () => {
    switch(type) {
      case 'training': return 'Worker Training';
      case 'water': return 'Agricultural Water';
      case 'soil': return 'Soil Amendments';
      case 'postharvest': return 'Postharvest Handling & Sanitation';
      case 'wildlife': return 'Wildlife & Domesticated Animals';
      case 'recordkeeping': return 'Recordkeeping';
      default: return 'General Records';
    }
  };

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground capitalize">{getTypeTitle()}</h1>
            <p className="text-muted-foreground">Manage your produce safety recordkeeping.</p>
          </div>
        </div>

        {type && (type === "training" || type === "water" || type === "soil" || type === "postharvest" || type === "wildlife" || type === "recordkeeping") ? (
          <div className="grid gap-4">
            {tasks
              .filter((task) =>
                type === "training"
                  ? task.category === "Worker Training & Hygiene"
                  : type === "water"
                    ? task.category === "Agricultural Water"
                    : type === "soil"
                      ? task.category === "Soil Amendments"
                      : type === "postharvest"
                        ? task.category === "Postharvest Handling & Sanitation"
                        : type === "wildlife"
                          ? task.category === "Wildlife & Pre-harvest Assessments"
                          : task.category === "Records & Documentation"
              )
              .map((task) => (
                <Card key={task.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-col gap-4 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.status === "done"}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              completeTask(task.id);
                            } else {
                              uncompleteTask(task.id);
                            }
                          }}
                          aria-label={`Mark ${task.title} complete`}
                        />
                        <div>
                          <h3 className="font-bold text-lg">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{task.frequency}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Last completed: {task.lastCompletedAt ? format(new Date(task.lastCompletedAt), "MMM d, yyyy") : "—"}
                      </span>
                      <Link href={`/checklist/${task.id}`}>
                        <Button variant="outline" size="sm">View details</Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p className="mb-2 text-lg font-medium">Page not available</p>
              <p>Select a checklist section from the sidebar.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutShell>
  );
}
