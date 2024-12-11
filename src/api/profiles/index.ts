import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      if (!userId) {
        const { data: session } = await supabase.auth.getSession();
        userId = session?.session?.user.id;
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!userId,
  });
};
