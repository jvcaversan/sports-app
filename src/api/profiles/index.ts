import { supabase } from "@/database/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  position: string;
}

export const useProfile = (userId?: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: ["profiles", userId],
    queryFn: async () => {
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
      return data as UserProfile;
    },
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const { data: updateUser, error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", data.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updateUser;
    },
    onSuccess: (updatedUser, { id }) => {
      queryClient.setQueryData(["profiles", id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};
