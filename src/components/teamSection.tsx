// TeamSection.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Jogador } from "@/types/types";

interface TeamSectionProps {
  title: string;
  color: string;
  jogadores: Jogador[];
}

const TeamSection = ({ title, color, jogadores }: TeamSectionProps) => {
  return (
    <View style={styles.teamsContainer}>
      <Text style={[styles.teamTitle, { color: color }]}>{title}</Text>
      <View style={styles.formacaoContainer}>
        {jogadores.map((jogador) => (
          <Pressable
            key={jogador.id}
            style={styles.jogadorButton}
            onPress={() => alert(`${jogador.nome} - Nota: ${jogador.nota}`)}
          >
            <View
              style={[
                styles.posicaoTag,
                {
                  backgroundColor:
                    color === "blue"
                      ? "rgba(0, 122, 255, 0.8)"
                      : "rgba(255, 59, 48, 0.8)",
                },
              ]}
            >
              <Text style={[styles.posicaoText, { color: "#FFFFFF" }]}>
                {jogador.posicao.charAt(0)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default TeamSection;

const styles = StyleSheet.create({
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: 10,
    marginBottom: 10,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    marginTop: -20,
  },
  formacaoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  jogadorButton: {
    alignItems: "center",
    padding: 6,
    marginVertical: 8,
  },
  posicaoTag: {
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  posicaoText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
