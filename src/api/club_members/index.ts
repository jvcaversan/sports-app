import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";

export const useClubMembers = (clubId: string) => {
  return useQuery({
    queryKey: ["club_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useClubMembersByQuery = (clubId: string, searchQuery: string) => {
  return useQuery({
    queryKey: ["club_members", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubId)
        .ilike("name", `%${searchQuery}%`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: searchQuery.length > 2,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    retry: false,
  });
};
