import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertFsmaStatus, FsmaStatus } from "@shared/schema";

export function useFsmaStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [api.fsma.getStatus.path],
    queryFn: async () => {
      const res = await fetch(api.fsma.getStatus.path);
      if (res.status === 404) return null;
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch status");
      return api.fsma.getStatus.responses[200].parse(await res.json());
    },
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Omit<InsertFsmaStatus, "userId">) => {
      const res = await fetch(api.fsma.updateStatus.path, {
        method: api.fsma.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to update status");
      }
      return api.fsma.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.fsma.getStatus.path], data);
      toast({
        title: "Status Updated",
        description: "Your FSMA compliance status has been saved.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    status: query.data,
    isLoading: query.isLoading,
    updateStatus: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
