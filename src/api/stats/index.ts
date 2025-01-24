import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";

export const useStats = (userId: string) => {
  return useQuery({
    queryKey: ["user_stats", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("profile_id", userId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });
};
