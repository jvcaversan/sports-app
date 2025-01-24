import { supabase } from "@/database/supabase";
import { Tables } from "@/types/supabase";
import { Club } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: Omit<Club, "id" | "created_at">) {
      const { error, data: newClub } = await supabase
        .from("clubs")
        .insert({
          club_name: data.name,
          photo: data.photo || null,
          created_by: data.created_by,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newClub;
    },
    onSuccess: () => {
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

export const useClubsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["clubs", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select(
          `
          club_id,
          clubs (
            id,
            club_name,
            created_at
          )
        `
        )
        .eq("player_id", userId);

      if (error) throw error;
      return data as (Tables<"club_members"> & {
        clubs: Tables<"clubs">;
      })[];
    },
  });
};

export const useDeleteClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(clubId: string) {
      const { error: updateError } = await supabase
        .from("matches")
        .update({ clubid: null })
        .eq("clubid", clubId);

      if (updateError) throw new Error("Falha ao desvincular partidas");

      const { error: deleteError } = await supabase
        .from("clubs")
        .delete()
        .eq("id", clubId);

      if (deleteError) throw new Error("Falha ao excluir clube");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
};
