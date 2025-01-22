import { supabase } from "@/database/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
