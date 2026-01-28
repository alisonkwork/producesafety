import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { CreateRecordRequest } from "@shared/schema";

// Schema depends on type, simplified here
const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string(),
  notes: z.string().optional(),
});

interface RecordFormProps {
  type: string;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function RecordForm({ type, onSubmit, isLoading }: RecordFormProps) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    }
  });

  const handleSubmit = (values: any) => {
    // Construct the payload with generic data structure
    const payload = {
      type,
      title: values.title,
      date: new Date(values.date).toISOString(),
      notes: values.notes,
      data: {} // In a real app, we'd add type-specific fields here
    };
    
    onSubmit(payload);
    setOpen(false);
    form.reset();
  };

  const getTitleLabel = () => {
    switch(type) {
      case 'training': return 'Training Topic';
      case 'water': return 'Water Source Name';
      case 'soil': return 'Amendment Type';
      default: return 'Record Title';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="capitalize">Add {type} Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getTitleLabel()}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any observations or details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Record"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
