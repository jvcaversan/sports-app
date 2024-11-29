import { supabase } from "@/database/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateClub = () => {
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
