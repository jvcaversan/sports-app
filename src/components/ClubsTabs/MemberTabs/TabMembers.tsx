import React, { useMemo, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { TabRoute } from "@/components/ClubsTabs/TabSection";
import { Tables } from "@/types/supabase";
import { MemberCard } from "./MemberCard";
import { router, useLocalSearchParams } from "expo-router";
import { SearchInput } from "../SearchInput";
import { useClubMembers } from "@/api/club_members";

interface TabMembersProps {
  members: (Tables<"club_members"> & {
    profiles: Tables<"profiles"> | null;
  })[];
  isMembersLoading: boolean;
}

export const TabMembers = () => {
  const { clubId } = useLocalSearchParams<{ clubId: string }>();

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: members,
    isLoading: isMembersLoading,
    error,
  } = useClubMembers(clubId);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectUser = (user: Tables<"club_members">) => {
    if (!clubId || !user.player_id) {
      console.error("IDs necessários não encontrados");
      return;
    }

    router.navigate({
      pathname: "/(user)/(tabs)/clubs/[clubId]/(members)/[memberId]",
      params: {
        clubId,
        memberId: user.player_id,
      },
    });
  };

  const filteredMembers = useMemo(() => {
    return (members || []).filter((member) =>
      member.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  if (isMembersLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.loadingText}>Carregando membros...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: "#DC2626" }]}>
          Erro ao carregar membros
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.membersContainer, { backgroundColor: "#F8FAFC" }]}>
      <SearchInput
        placeholder="Buscar membro..."
        onSearchChange={handleSearchChange}
      />

      <TabRoute<Tables<"club_members">>
        data={filteredMembers}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectUser(item)}>
            <MemberCard member={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.player_id}
        emptyMessage="Nenhum membro encontrado"
        sectionStyle={styles.membersSection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    fontSize: 14,
    color: "#16A34A",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Inter-SemiBold",
  },
  membersContainer: {
    flex: 1,
    padding: 8,
  },
  membersSection: {
    flex: 1,
    paddingTop: 4,
  },
});
