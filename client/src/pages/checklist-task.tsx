import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { LayoutShell } from "@/components/layout-shell";
import { useChecklistStore } from "@/hooks/use-checklist";
import { getCategoryOrder, TaskStatus, TaskFrequency, TaskCategory } from "@/lib/fsma-checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
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

const STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
  overdue: "Overdue",
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  not_started: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
  overdue: "bg-rose-100 text-rose-800",
};

const FREQUENCY_LABELS: Record<TaskFrequency, string> = {
  "one-time": "One-time",
  annual: "Yearly",
  monthly: "Monthly",
  weekly: "Weekly",
  "per-event": "Per-event",
  ongoing: "Ongoing",
};

function formatDate(dateIso: string | null) {
  if (!dateIso) return "—";
  return format(new Date(dateIso), "MMM d, yyyy");
}

export default function ChecklistTaskPage() {
  const [match, params] = useRoute("/checklist/:id");
  const taskId = match ? params?.id : undefined;
  const [, setLocation] = useLocation();
  const { tasks, completionHistory, setTaskStatus, updateNotes, updateTaskFields, completeTask, uncompleteTask, deleteTask } =
    useChecklistStore();
  const task = useMemo(() => tasks.find((item) => item.id === taskId), [tasks, taskId]);
  const [notes, setNotes] = useState(task?.notes ?? "");
  const [draftTitle, setDraftTitle] = useState(task?.title ?? "");
  const [draftDescription, setDraftDescription] = useState(task?.description ?? "");
  const [draftCategory, setDraftCategory] = useState(task?.category ?? "");
  const [draftFrequency, setDraftFrequency] = useState<TaskFrequency | "">(task?.frequency ?? "");
  const categories = useMemo(() => getCategoryOrder(), []);

  useEffect(() => {
    setNotes(task?.notes ?? "");
    setDraftTitle(task?.title ?? "");
    setDraftDescription(task?.description ?? "");
    setDraftCategory(task?.category ?? "");
    setDraftFrequency(task?.frequency ?? "");
  }, [task?.notes, task?.title, task?.description, task?.category, task?.frequency]);

  if (!taskId) {
    return (
      <LayoutShell>
        <Card className="border-dashed bg-muted/30">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">Task not found</p>
            <p className="text-muted-foreground">Return to the checklist to pick a task.</p>
            <Link href="/checklist">
              <Button className="mt-4">Back to checklist</Button>
            </Link>
          </CardContent>
        </Card>
      </LayoutShell>
    );
  }

  if (!task) {
    return (
      <LayoutShell>
        <Card className="border-dashed bg-muted/30">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">Task not found</p>
            <p className="text-muted-foreground">This task may have been removed.</p>
            <Link href="/checklist">
              <Button className="mt-4">Back to checklist</Button>
            </Link>
          </CardContent>
        </Card>
      </LayoutShell>
    );
  }

  const history = completionHistory[task.id] ?? [];

  return (
    <LayoutShell>
      <div className="space-y-6">
        <Link href="/checklist" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to checklist
        </Link>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">{task.title}</h1>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className={`${STATUS_STYLES[task.status]} border-0`}>
            {STATUS_LABELS[task.status]}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            {FREQUENCY_LABELS[task.frequency]}
          </Badge>
          <span className="text-xs text-muted-foreground">{task.category}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task status</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
              <Select
                value={task.status}
                onValueChange={(value) => {
                  const nextStatus = value as TaskStatus;
                  if (nextStatus === "done") {
                    completeTask(task.id);
                  } else {
                    setTaskStatus(task.id, nextStatus);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full md:w-auto"
              onClick={() => (task.status === "done" ? uncompleteTask(task.id) : completeTask(task.id))}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {task.status === "done" ? "Undo completion" : "Mark complete"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customize task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50/60">
              <AlertTitle>Keep edits non-sensitive</AlertTitle>
              <AlertDescription>
                Avoid names, addresses, test results, or confidential details.
              </AlertDescription>
            </Alert>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
                <Input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
                <Select value={draftCategory} onValueChange={setDraftCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                <Textarea
                  value={draftDescription}
                  onChange={(event) => setDraftDescription(event.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Frequency</label>
                <Select value={draftFrequency} onValueChange={(value) => setDraftFrequency(value as TaskFrequency)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  updateTaskFields(task.id, {
                    title: draftTitle.trim() || task.title,
                    description: draftDescription.trim() || task.description,
                    category: (draftCategory || task.category) as TaskCategory,
                    frequency: (draftFrequency || task.frequency) as TaskFrequency,
                  })
                }
              >
                Save changes
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                    Delete task
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes the task and its completion history from your browser.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteTask(task.id);
                        setLocation("/checklist");
                      }}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete task
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="border-amber-200 bg-amber-50/60">
              <AlertTitle>Do not enter confidential information</AlertTitle>
              <AlertDescription>
                Keep notes short and non-sensitive. This tool is for self-tracking only.
              </AlertDescription>
            </Alert>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={() => updateNotes(task.id, notes)}
              placeholder="Add a short, non-sensitive note (optional)."
              rows={5}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dates</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last completed</p>
              <p className="text-base text-foreground">{formatDate(task.lastCompletedAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next due</p>
              <p className="text-base text-foreground">{formatDate(task.nextDueDate)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last reviewed</p>
              <p className="text-base text-foreground">{formatDate(task.lastReviewedAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completion history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {history.length === 0 ? (
              <p>No completion history yet.</p>
            ) : (
              <ul className="space-y-2">
                {history
                  .slice()
                  .reverse()
                  .map((dateIso) => (
                    <li key={dateIso} className="flex items-center justify-between rounded-lg border border-muted/50 bg-muted/20 px-3 py-2">
                      <span>{formatDate(dateIso)}</span>
                      <Badge variant="secondary">Completed</Badge>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
