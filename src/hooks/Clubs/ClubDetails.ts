import { useClubMembers } from "@/api/club_members";
import { useClubsById } from "@/api/clubs";
import { useMatchsByClubId } from "@/api/createMatch";

export const useClubDetails = (clubId: string) => {
  const { data: club, isLoading, isError } = useClubsById(clubId);
  const { data: members } = useClubMembers(clubId);
  const { data: matchs } = useMatchsByClubId(clubId);

  return { club, members, matchs, isLoading, isError };
};
