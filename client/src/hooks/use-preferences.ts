import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { UserPreferences } from "@shared/schema";

export function usePreferences() {
  const { data: preferences, isLoading, error } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { dashboardBoxes: string[] }) => {
      const res = await apiRequest("PUT", "/api/preferences", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
