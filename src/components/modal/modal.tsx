import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Jogador } from "@/types/types";

interface ModalSelectPlayerProps {
  jogadores: Jogador[];
  onClose: () => void;
  onSelect: (jogador: Jogador) => void;
  posicao: string;
  visible: boolean;
}

const itemStyle = (jogador: Jogador) => ({
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#ccc",
  width: "100%" as const,
  opacity: jogador.disabled ? 0.5 : 1,
});

const ModalSelectPlayer = ({
  visible,
  jogadores,
  onClose,
  onSelect,
  posicao,
}: ModalSelectPlayerProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Selecione um {posicao}</Text>
          <FlatList
            data={jogadores}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                disabled={item.disabled}
                style={itemStyle(item)}
              >
                <Text
                  style={{
                    textDecorationLine: item.disabled ? "line-through" : "none",
                  }}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  playerButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
  },
  playerText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    textAlign: "center",
  },
});

export default ModalSelectPlayer;
