import { supabase } from "@/database/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      if (!data.userId) {
        throw new Error("ID do usuário é obrigatório para criar o clube.");
      }

      const { error, data: newClub } = await supabase
        .from("clubs")
        .insert({
          name: data.name,
          created_by: data.userId, // Passa o ID validado
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newClub;
    },
    onSuccess: () => {
      // Invalida o cache para "clubs" e força o refetch
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
};

export const useListClubs = () => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clubs").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useClubsById = (id: string) => {
  return useQuery({
    queryKey: ["clubs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useClubsByUserId = (userId?: string) => {
  return useQuery({
    queryKey: ["clubs", userId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user.id; // ID do usuário logado
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      const { data, error } = await supabase
        .from("club_members")
        .select("club_id, clubs(name)")
        .eq("player_id", userId);
      if (error) {
        throw new Error(error.message);
      }
      return data.map((member) => ({
        id: member.club_id,
        name: member.clubs.name,
      }));
    },
  });
};
