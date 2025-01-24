import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";
import { useSessionStore } from "@/store/useSessionStore";

export const useMemberProfile = (clubId: string, playerId: string) => {
  const { session } = useSessionStore();

  if (!session) {
    throw new Error("no session");
  }
  const currentUserId = session?.user.id;

  const memberQuery = useQuery({
    queryKey: ["member", clubId, playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*, profiles:player_id(*)")
        .eq("club_id", clubId)
        .eq("player_id", playerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clubId && !!playerId,
  });

  const isAdminQuery = useQuery({
    queryKey: ["isAdmin", clubId, currentUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("club_members")
        .select("role")
        .eq("club_id", clubId)
        .eq("player_id", currentUserId)
        .single();

      return data?.role === "admin";
    },
    enabled: !!currentUserId && !!clubId,
  });

  return {
    member: memberQuery.data,
    isLoading: memberQuery.isLoading || isAdminQuery.isLoading,
    error: memberQuery.error || isAdminQuery.error,
    isAdmin: isAdminQuery.data,
    currentUserId,
  };
};
