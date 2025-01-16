import { supabase } from "@/database/supabase";
import { Database } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";

type ClubMember = Database["public"]["Tables"]["club_members"]["Row"];

export const useClubMembers = (clubId: string) => {
  return useQuery({
    queryKey: ["club_members", clubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("player_id, role, name")
        .eq("club_id", clubId);

      if (error) {
        throw new Error(error.message);
      }

      return data as ClubMember[];
    },
  });
};
