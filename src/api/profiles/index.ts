import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const user = supabase.auth.getUser();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
