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
    name: string;
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
  disabledButton: {
    backgroundColor: "#888",
  },
});
