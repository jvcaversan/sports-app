import { supabase } from "@/database/supabase";
import { Database } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profiles", userId],
    queryFn: async (): Promise<Profile> => {
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

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdate) => {
      if (!data.id) {
        throw new Error("ID do perfil é obrigatório");
      }

      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProfile;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profiles", updatedProfile.id], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};

export const useUsers = (searchQuery: string) => {
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  return useQuery({
    queryKey: ["allusers", debouncedQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`name.ilike.%${debouncedQuery}%`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: debouncedQuery.length > 2,
  });
};
