import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user.id; // ID do usuário logado
      if (!userId) {
        throw new Error("Usuário não autenticado");
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
  });
};
