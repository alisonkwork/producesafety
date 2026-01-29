import { useRecords } from "@/hooks/use-records";
import { LayoutShell } from "@/components/layout-shell";
import { RecordForm } from "@/components/record-form";
import { useParams, useRoute } from "wouter";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RecordsPage() {
  const [match, params] = useRoute("/records/:type");
  const type = match ? params?.type : "general";
  const { records, isLoading, createRecord, isCreating, deleteRecord } = useRecords(type);

  const getTypeTitle = () => {
    switch(type) {
      case 'training': return 'Worker Training Records';
      case 'water': return 'Agricultural Water Records';
      case 'soil': return 'Soil Amendment Records';
      case 'cleaning': return 'Cleaning & Sanitization';
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
          <RecordForm 
            type={type || 'general'} 
            onSubmit={createRecord} 
            isLoading={isCreating} 
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : (
          <div className="grid gap-4">
            {records.length === 0 ? (
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <p className="mb-2 text-lg font-medium">No records found</p>
                  <p>Add your first {type} record.</p>
                </CardContent>
              </Card>
            ) : (
              records.map((record: any) => (
                <Card key={record.id} className="group hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-start justify-between p-4 sm:p-6">
                    <div>
                      <h3 className="font-bold text-lg">{record.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {format(new Date(record.date), "MMMM d, yyyy")}
                      </p>
                      {record.notes && (
                        <p className="mt-2 text-sm bg-secondary/50 p-2 rounded-md inline-block">
                          {record.notes}
                        </p>
                      )}
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this record? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteRecord(record.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
