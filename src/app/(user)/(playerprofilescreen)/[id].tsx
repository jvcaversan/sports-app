import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomScreen from "@/components/CustomView";
import { useProfile } from "@/api/profiles";
import { useClubsByUserAdminId } from "@/api/club_members";
import { ActivityIndicator } from "react-native";
import { useSessionStore } from "@/store/useSessionStore";
import {
  useCreateInvitation,
  isUserClubMember,
  hasPendingInvitation,
} from "@/api/club_invitation";

export default function PlayerProfileScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [clubId, setClubId] = useState("");

  const { id } = useLocalSearchParams();
  const userId = id as string;

  const { data: profile } = useProfile(userId);
  const { session } = useSessionStore();
  const adminId = session?.user.id;

  const {
    data: clubs,
    isLoading,
    error,
  } = useClubsByUserAdminId(adminId || "");

  const { mutate: createInvitation } = useCreateInvitation();

  const handleClubSelection = (clubId: string) => {
    setClubId(clubId);
    handleInviteToClub(clubId);
    console.log(clubId);
  };

  const { data: isMember } = isUserClubMember(clubId, userId);
  const { data: hasInvitation } = hasPendingInvitation(clubId, userId);

  const toggleModal = () => {
    setModalVisible((prevState) => !prevState);
  };

  const handleInviteToClub = async (clubInviteId: string) => {
    if (!adminId || !userId) {
      Alert.alert("Você não é administrador de nenhum clube");
      console.log("chegou aqui");
      return;
    }

    try {
      if (isMember) {
        Alert.alert("Erro", "O usuário já é membro do clube.");
        console.log("chegou aqui 2");
        return;
      }

      if (hasInvitation) {
        Alert.alert("Erro", "O usuário já possui um convite pendente.");
        console.log("chegou aqui 3");
        return;
      }

      createInvitation(
        { club_id: clubInviteId, user_id: userId, invited_by: adminId || "" },
        {
          onSuccess: () => {
            Alert.alert("Convite enviado com sucesso!");
            toggleModal();
          },
          onError: (error) => {
            Alert.alert("Erro", error.message);
          },
        }
      );
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao verificar os dados.");
      console.log(error);
    }
  };

  return (
    <CustomScreen>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Jogador</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: profile?.photo || "https://github.com/jvcaversan.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.playerName}>{profile?.name}</Text>
        </View>

        <TouchableOpacity style={styles.inviteButton} onPress={toggleModal}>
          <Text style={styles.inviteButtonText}>Convidar para o Clube</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Clube</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#16A34A" />
            ) : error ? (
              <Text style={styles.errorText}>
                Ocorreu um erro ao carregar os clubes.
              </Text>
            ) : (
              <FlatList
                data={clubs}
                keyExtractor={(item) => item.club_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.clubItem}
                    onPress={() => handleClubSelection(item.club_id)}
                  >
                    <Text style={styles.clubName}>{item.clubs.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inviteButton: {
    backgroundColor: "#16A34A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  inviteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  clubItem: {
    padding: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginBottom: 8,
    width: "100%",
    alignItems: "center",
  },
  clubName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#16A34A",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    textAlign: "center",
  },
});
