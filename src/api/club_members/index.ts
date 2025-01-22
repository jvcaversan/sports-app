import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export const useClubMembers = (clubId: string) => {
  return useQuery({
    queryKey: ["club_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*, profiles(name)")
        .eq("club_id", clubId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useClubMembersByQuery = (clubId: string, searchQuery: string) => {
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  return useQuery({
    queryKey: ["club_members", debouncedQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubId)
        .ilike("name", `%${debouncedQuery}%`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: debouncedQuery.length > 2,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    retry: false,
  });
};
