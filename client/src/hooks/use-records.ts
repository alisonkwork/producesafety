import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertRecord, RecordItem } from "@shared/schema";

export function useRecords(type?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey = [api.records.list.path, ...(type ? [type] : [])];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const url = type 
        ? `${api.records.list.path}?type=${encodeURIComponent(type)}`
        : api.records.list.path;
      
      const res = await fetch(url);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch records");
      
      return api.records.list.responses[200].parse(await res.json());
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<InsertRecord, "userId">) => {
      const res = await fetch(api.records.create.path, {
        method: api.records.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create record");
      return api.records.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.records.list.path] });
      toast({
        title: "Record Created",
        description: "The record has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.records.delete.path, { id });
      const res = await fetch(url, { method: api.records.delete.method });
      if (!res.ok) throw new Error("Failed to delete record");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.records.list.path] });
      toast({
        title: "Record Deleted",
        description: "The record has been permanently removed.",
      });
    },
  });

  return {
    records: query.data || [],
    isLoading: query.isLoading,
    createRecord: createMutation.mutate,
    isCreating: createMutation.isPending,
    deleteRecord: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useRecord(id: number) {
  return useQuery({
    queryKey: [api.records.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.records.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch record");
      return api.records.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
