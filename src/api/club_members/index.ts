import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";

export const useClubMembers = (clubId: string) => {
  return useQuery({
    queryKey: ["club_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("player_id, role, profiles(name)")
        .eq("club_id", clubId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
