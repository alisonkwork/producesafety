import { useMemo, useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { useChecklistStore } from "@/hooks/use-checklist";
import { getCategoryOrder, Task, TaskCategory, TaskFrequency, TaskStatus } from "@/lib/fsma-checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CheckCircle2, Clock, Filter, ShieldCheck, Trash2 } from "lucide-react";
import { Link } from "wouter";

type FrequencyTab = "annual" | "monthly" | "weekly" | "per-event" | "ongoing" | "all";

const FREQUENCY_LABELS: Record<TaskFrequency, string> = {
  "one-time": "One-time",
  annual: "Yearly",
  monthly: "Monthly",
  weekly: "Weekly",
  "per-event": "Per-event",
  ongoing: "Ongoing",
};

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

function formatDate(dateIso: string | null) {
  if (!dateIso) return "—";
  return format(new Date(dateIso), "MMM d, yyyy");
}

function groupByCategory(tasks: Task[]) {
  const grouped = new Map<string, Task[]>();
  tasks.forEach((task) => {
    const existing = grouped.get(task.category) ?? [];
    existing.push(task);
    grouped.set(task.category, existing);
  });
  return grouped;
}

export default function ChecklistPage() {
  const { tasks, completeTask, uncompleteTask, updateTaskFields, deleteTask, resetStore, addTask } = useChecklistStore();
  const [activeTab, setActiveTab] = useState<FrequencyTab>("annual");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory | "">("");
  const [newFrequency, setNewFrequency] = useState<TaskFrequency | "">("");
  const [newNotes, setNewNotes] = useState("");

  const categories = useMemo(() => getCategoryOrder(), []);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (activeTab !== "all") {
      filtered = filtered.filter((task) => task.frequency === activeTab);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter);
    }

    if (frequencyFilter !== "all") {
      filtered = filtered.filter((task) => task.frequency === frequencyFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, activeTab, categoryFilter, frequencyFilter, statusFilter, search]);

  const groupedTasks = useMemo(() => groupByCategory(filteredTasks), [filteredTasks]);

  return (
    <LayoutShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Produce Safety Checklist</h1>
              <p className="text-muted-foreground">
                Track routine tasks by category and frequency. All data stays in your browser.
              </p>
            </div>
          </div>
        </div>

        <Alert className="border-emerald-200 bg-emerald-50/70">
          <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          <AlertTitle>Privacy first</AlertTitle>
          <AlertDescription>
            No uploads and no sensitive data required. Use short, non-sensitive notes only.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-5">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Search</label>
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks..."
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Frequency</label>
                <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All frequencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All frequencies</SelectItem>
                    {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FrequencyTab)}>
            <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/40 px-2 py-1">
              <TabsTrigger value="annual" className="text-xs px-2.5 py-1">Yearly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-2.5 py-1">Monthly</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-2.5 py-1">Weekly</TabsTrigger>
              <TabsTrigger value="per-event" className="text-xs px-2.5 py-1">Per-Event</TabsTrigger>
              <TabsTrigger value="ongoing" className="text-xs px-2.5 py-1">Ongoing</TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2.5 py-1">All</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-amber-400 text-emerald-950 hover:bg-amber-300">
                  Add custom task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a custom task</DialogTitle>
                  <DialogDescription>
                    Keep details general and non-sensitive. No uploads.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
                    <Input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
                    <Select value={newCategory} onValueChange={(value) => setNewCategory(value as TaskCategory)}>
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
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Frequency</label>
                    <Select value={newFrequency} onValueChange={(value) => setNewFrequency(value as TaskFrequency)}>
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
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                    <Textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Notes (optional)
                    </label>
                    <Textarea value={newNotes} onChange={(event) => setNewNotes(event.target.value)} rows={2} />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (!newTitle.trim() || !newCategory || !newFrequency) return;
                      addTask({
                        title: newTitle.trim(),
                        description: newDescription.trim() || "Custom checklist task",
                        category: newCategory,
                        frequency: newFrequency,
                        notes: newNotes.trim(),
                      });
                      setNewTitle("");
                      setNewDescription("");
                      setNewCategory("");
                      setNewFrequency("");
                      setNewNotes("");
                      setIsAddOpen(false);
                    }}
                    disabled={!newTitle.trim() || !newCategory || !newFrequency}
                  >
                    Add task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Reset all data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset checklist data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears all checklist progress, notes, and completion history from your browser.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => resetStore()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Reset data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FrequencyTab)}>
          {(["annual", "monthly", "weekly", "per-event", "ongoing", "all"] as FrequencyTab[]).map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              {filteredTasks.length === 0 ? (
                <Card className="bg-muted/40 border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Filter className="mx-auto mb-3 h-6 w-6" />
                    <p className="text-lg font-medium">No matching tasks</p>
                    <p className="text-sm">Adjust filters or choose another tab.</p>
                  </CardContent>
                </Card>
              ) : (
                categories.map((category) => {
                  const categoryTasks = groupedTasks.get(category) ?? [];
                  if (categoryTasks.length === 0) return null;
                  return (
                    <Card key={category} className="border-muted/60">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{category}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {categoryTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex flex-col gap-3 rounded-xl border border-muted/60 bg-white/70 p-4 shadow-sm"
                          >
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
                                  <h3 className="font-semibold text-foreground">{task.title}</h3>
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={`${STATUS_STYLES[task.status]} border-0`}>
                                  {STATUS_LABELS[task.status]}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={task.frequency}
                                    onValueChange={(value) =>
                                      updateTaskFields(task.id, { frequency: value as TaskFrequency })
                                    }
                                  >
                                  <SelectTrigger className="h-7 w-[130px] text-[11px] text-muted-foreground">
                                    <SelectValue />
                                  </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                          {label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
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
                                          onClick={() => deleteTask(task.id)}
                                          className="bg-destructive hover:bg-destructive/90"
                                        >
                                          Delete task
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <Link href={`/checklist/${task.id}`}>
                                    <Button variant="outline" size="sm">View</Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {FREQUENCY_LABELS[task.frequency]}
                              </span>
                              <span>Last completed: {formatDate(task.lastCompletedAt)}</span>
                              <span>Next due: {formatDate(task.nextDueDate)}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </LayoutShell>
  );
}
