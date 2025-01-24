import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";

export const useMemberMutations = (clubId: string, playerId: string) => {
  const queryClient = useQueryClient();
  const updateRole = useMutation({
    mutationFn: async (newRole: string) => {
      const { error } = await supabase
        .from("club_members")
        .update({ role: newRole })
        .eq("club_id", clubId)
        .eq("player_id", playerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["member", clubId, playerId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["clubMembers", clubId],
        exact: true,
      });
    },
  });

  const removeMember = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("club_members")
        .delete()
        .eq("club_id", clubId)
        .eq("player_id", playerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clubMembers", clubId],
        exact: true,
      });
    },
  });

  return { updateRole, removeMember };
};
