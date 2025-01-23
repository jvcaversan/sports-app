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

export const useClubsByUserAdminId = (adminId: string) => {
  return useQuery({
    queryKey: ["clubs", adminId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*, clubs(name)")
        .eq("player_id", adminId)
        .eq("role", "admin");

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useIsClubAdmin = (clubId: string, userId: string) => {
  return useQuery({
    queryKey: ["club_admin", clubId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("role")
        .eq("club_id", clubId)
        .eq("player_id", userId)
        .single();

      return data?.role === "admin";
    },
    enabled: !!userId,
  });
};
