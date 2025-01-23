import { supabase } from "@/database/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: {
      club_id: string;
      user_id: string;
      invited_by: string;
    }) {
      const { data: newInvitation, error } = await supabase
        .from("club_invitations")
        .insert([
          {
            club_id: data.club_id,
            user_id: data.user_id,
            invited_by: data.invited_by,
            status: "pending",
          },
        ]);

      if (error) {
        throw new Error(error.message);
      }

      return newInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club_invitations"] });
    },
  });
};

export const useUpdateInvitationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: {
      invitation_id: string;
      status: "accepted" | "rejected";
    }) {
      const { data: updatedInvitation, error } = await supabase
        .from("club_invitations")
        .update({ status: data.status })
        .eq("id", data.invitation_id);

      if (error) {
        throw new Error(error.message);
      }

      return updatedInvitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club_invitations"] });
    },
  });
};

export const useAddMemberToClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: { club_id: string; player_id: string }) {
      const { data: newMember, error } = await supabase
        .from("club_members")
        .insert([
          {
            club_id: data.club_id,
            player_id: data.player_id,
            role: "member",
            joined_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw new Error(error.message);
      }

      return newMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club_members"] });
    },
  });
};

export const isUserClubMember = (clubId: string, userId: string) => {
  return useQuery({
    queryKey: ["club_members", clubId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubId)
        .eq("player_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message);
      }
      return !!data;
    },
  });
};

export const hasPendingInvitation = (clubId: string, userId: string) => {
  return useQuery({
    queryKey: ["club_invitations", clubId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_invitations")
        .select("*")
        .eq("club_id", clubId)
        .eq("user_id", userId)
        .eq("status", "pending")
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message);
      }

      return !!data;
    },
  });
};

export const InvitationsByUserLogged = (userId: string) => {
  return useQuery({
    queryKey: ["club_invitations", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_invitations")
        .select(
          `
          *,
          invited_by:profiles!invited_by (name),  
          club_id:clubs!club_id (name, photo, id)            
        `
        )
        .eq("user_id", userId);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
