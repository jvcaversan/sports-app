import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";

export const useStats = (userId?: string) => {
  return useQuery({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*, statistics(*)")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
