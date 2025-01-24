import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import { SearchInput } from "../ClubsTabs/SearchInput";
import { Text } from "react-native";
import FlatListWrapper from "../ClubsTabs/FlatListComponent";
import { useUsers } from "@/api/profiles";
import { ProfileCard } from "../profile/ProfileCard";
import { Tables } from "@/types/supabase";
import { router } from "expo-router";

interface InviteClubModalProps {
  visible: boolean;
  onClose: () => void;
  clubId: string;
}

export default function InviteClubModal({
  visible,
  onClose,
}: InviteClubModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<Tables<"profiles">[]>([]);

  const { data: users } = useUsers(searchQuery);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleProfilePress = (user: Tables<"profiles">) => {
    onClose();
    router.navigate(`/(public-profile)/${user.id}`);
  };

  useEffect(() => {
    if (visible) {
      setSearchQuery("");
      setFilteredUsers([]);
    }
  }, [visible]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <SearchInput
            placeholder="Buscar usuário"
            onSearchChange={handleSearchChange}
          />

          <FlatListWrapper
            data={filteredUsers}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleProfilePress(item)}>
                <ProfileCard user={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            emptyMessage="Nenhum usuário encontrado"
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#16A34A",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
