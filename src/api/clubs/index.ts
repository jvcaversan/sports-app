import { supabase } from "@/database/supabase";
import { useMutation } from "@tanstack/react-query";

export const useCreateClub = () => {
  return useMutation({
    async mutationFn({ clubName, clubPhoto, userId }: any) {
      const { data: newClub, error: clubError } = await supabase
        .from("clubs")
        .insert({
          name: clubName,
          photo: clubPhoto,
          createdBy: userId,
        })
        .select()
        .single();

      if (clubError) {
        throw new Error(`Erro ao criar clube: ${clubError.message}`);
      }

      return newClub;
    },
  });
};
