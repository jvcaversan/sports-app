import React, { useMemo, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { TabRoute } from "@/components/ClubsTabs/TabSection";
import { Tables } from "@/types/supabase";
import { MemberCard } from "./MemberCard";

interface TabMembersProps {
  members: Tables<"club_members">[];
  isMembersLoading: boolean;
  handleSelectUser: (user: Tables<"club_members">) => void;
}

export const TabMembers = ({
  members,
  isMembersLoading,
  handleSelectUser,
}: TabMembersProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <View style={[styles.membersContainer, { backgroundColor: "#F8FAFC" }]}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar membro..."
        onChangeText={handleSearchChange}
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
  searchInput: {
    height: 40,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "Inter-Regular",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  membersSection: {
    flex: 1,
    paddingTop: 4,
  },
});
