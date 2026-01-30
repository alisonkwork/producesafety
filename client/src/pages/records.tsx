import { LayoutShell } from "@/components/layout-shell";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function RecordsPage() {
  const [match, params] = useRoute("/resources/:type");
  const type = match ? params?.type : undefined;

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
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p className="mb-2 text-lg font-medium">No tasks shown here</p>
              <p>Use the checklist page to manage tasks.</p>
            </CardContent>
          </Card>
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
