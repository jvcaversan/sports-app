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

export const checkIsClubMember = async (clubId: string, userId: string) => {
  const { data, error } = await supabase
    .from("club_members")
    .select("*")
    .eq("club_id", clubId)
    .eq("player_id", userId)
    .single();

  return !!data && !error;
};

export const checkPendingInvitation = async (
  clubId: string,
  userId: string
) => {
  const { data, error } = await supabase
    .from("club_invitations")
    .select("*")
    .eq("club_id", clubId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .single();

  return !!data && !error;
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

export const acceptClubInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: {
      invitation_id: string;
      club_id: string;
      user_id: string;
    }) {
      const { data: updatedInvitation, error: updateError } = await supabase
        .from("club_invitations")
        .update({ status: "accepted" })
        .eq("id", data.invitation_id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const { data: membership, error: insertError } = await supabase
        .from("club_members")
        .insert({ club_id: data.club_id, user_id: data.user_id });

      if (insertError) {
        throw new Error(insertError.message);
      }

      return { updatedInvitation, membership };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club_invitations"] });
      queryClient.invalidateQueries({ queryKey: ["club_members"] });
    },
  });
};

export const rejectClubInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(invite_id: string) {
      const { data, error } = await supabase
        .from("club_invitations")
        .delete()
        .eq("id", invite_id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club_invitations"] });
    },
  });
};
