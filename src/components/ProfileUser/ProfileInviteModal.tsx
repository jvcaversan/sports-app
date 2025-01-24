import React, { memo } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type ClubType = {
  club_id: string;
  id: string;
  joined_at: string;
  player_id: string;
  role: string;
  clubs: {
    club_name: string;
  };
};

type ModalClubsProps = {
  visible: boolean;
  clubs: ClubType[] | undefined;
  isLoading: boolean;
  error: any;
  processingClubId: string | null;
  onClose: () => void;
  renderItem: any;
};

export const ProfileInviteModal = memo(
  ({
    visible,
    clubs = [],
    isLoading,
    error,
    processingClubId,
    onClose,
    renderItem,
  }: ModalClubsProps) => (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
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
              initialNumToRender={8}
              maxToRenderPerBatch={5}
              windowSize={5}
              getItemLayout={(_, index) => ({
                length: 60,
                offset: 60 * index,
                index,
              })}
              renderItem={renderItem}
            />
          )}

          <TouchableOpacity
            style={[
              styles.closeButton,
              !!processingClubId && styles.disabledButton,
            ]}
            onPress={onClose}
            disabled={!!processingClubId}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E293B",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#16A34A",
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
  disabledButton: {
    backgroundColor: "#888",
  },
});
