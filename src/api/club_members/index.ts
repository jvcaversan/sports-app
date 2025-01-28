import { supabase } from "@/database/supabase";
import { Tables } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";

export const useClubMembers = (clubId: string) => {
  return useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*, profiles(*)")
        .eq("club_id", clubId);

      if (error) throw error;
      return data as (Tables<"club_members"> & {
        profiles: Tables<"profiles"> | null;
      })[];
    },
    enabled: !!clubId,
  });
};

export const useClubMembersByQuery = (clubId: string, searchQuery: string) => {
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  return useQuery({
    queryKey: ["club_members", debouncedQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubId)
        .ilike("club_name", `%${debouncedQuery}%`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: debouncedQuery.length > 2,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    retry: false,
  });
};

export const useClubsByUserAdminId = (adminId: string) => {
  return useQuery({
    queryKey: ["clubs", adminId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*, clubs(club_name)")
        .eq("player_id", adminId)
        .eq("role", "admin");

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useIsClubAdmin = (clubId: string, userId: string) => {
  return useQuery({
    queryKey: ["club_admin", clubId, userId],
    queryFn: async () => {
      if (!clubId || !userId) return false;
      const { data, error } = await supabase
        .from("club_members")
        .select("role")
        .eq("club_id", clubId)
        .eq("player_id", userId)
        .single();

      return data?.role === "admin";
    },
    enabled: !!userId,
  });
};

export const useSendPlayersInvites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      playerIds,
    }: {
      matchId: string;
      playerIds: string[];
    }) => {
      const { data: existingInvites, error: invitesError } = await supabase
        .from("match_invitations")
        .select("id, player_id, status")
        .eq("match_id", matchId);

      if (invitesError) throw invitesError;

      const existingPlayers = existingInvites?.reduce((acc, invite) => {
        acc[invite.player_id] = invite;
        return acc;
      }, {} as Record<string, (typeof existingInvites)[number]>);

      const toUpdate: string[] = [];
      const toInsert: string[] = [];

      playerIds.forEach((playerId) => {
        const existing = existingPlayers?.[playerId];

        if (existing) {
          if (existing.status === "rejected") {
            toUpdate.push(existing.id);
          }
        } else {
          toInsert.push(playerId);
        }
      });

      if (toUpdate.length > 0) {
        const { error: updateError } = await supabase
          .from("match_invitations")
          .update({ status: "pending", updated_at: new Date().toISOString() })
          .in("id", toUpdate);

        if (updateError) throw updateError;
      }

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("match_invitations")
          .insert(
            toInsert.map((player_id) => ({
              match_id: matchId,
              player_id,
              status: "pending",
            }))
          );

        if (insertError) throw insertError;
      }

      return { updated: toUpdate.length, inserted: toInsert.length };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["matchInvitations", variables.matchId],
      });
    },
  });
};

export const useResendPlayerInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      playerId,
    }: {
      matchId: string;
      playerId: string;
    }) => {
      const { data: existingInvite, error: inviteError } = await supabase
        .from("match_invitations")
        .select("id, status")
        .eq("match_id", matchId)
        .eq("player_id", playerId)
        .single();

      if (inviteError && !inviteError.details?.includes("0 rows")) {
        throw inviteError;
      }

      if (existingInvite?.status === "rejected") {
        const { error: updateError } = await supabase
          .from("match_invitations")
          .update({
            status: "pending",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingInvite.id);

        if (updateError) throw updateError;
        return { action: "updated", id: existingInvite.id };
      }

      if (!existingInvite || existingInvite.status !== "pending") {
        const { error: insertError, data: newInvite } = await supabase
          .from("match_invitations")
          .insert({
            match_id: matchId,
            player_id: playerId,
            status: "pending",
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return { action: "created", id: newInvite.id };
      }

      return { action: "no_action" };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["matchInvitations", variables.matchId],
      });
    },
  });
};

export const useConfirmedPlayers = (matchId: string) => {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery({
    queryKey: ["match-confirmed-players", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_invitations")
        .select(
          `
          player_id,
          status,
          profiles (
            name,
            photo
          )
        `
        )
        .eq("match_id", matchId)
        .eq("status", "accepted");

      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });

  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel("match-invites-real-time")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_invitations",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["match-confirmed-players", matchId],
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [matchId, queryClient]);

  return {
    data: data || [],
    ...rest,
  };
};

export const usePositions = () => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("positions")
        .select("id, position_name");
      if (error) throw error;
      return data;
    },
  });
};
