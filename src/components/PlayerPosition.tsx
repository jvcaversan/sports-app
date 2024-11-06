import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

interface PlayerPositionProps {
  onPress: () => void;
  playerId?: string | number; // ID do jogador selecionado
  label: string; // Label para mostrar quando não há jogador (ex: "GOL", "LE")
  style?: StyleProp<ViewStyle>; // Estilo customizado opcional
}

export function PlayerPosition({
  onPress,
  playerId,
  label,
  style,
}: PlayerPositionProps) {
  return (
    <Pressable style={[styles.position, style]} onPress={onPress}>
      <Text style={styles.text}>{playerId || label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  position: {
    backgroundColor: "#4CAF50",
    padding: 3,
    borderRadius: 50,
    borderWidth: 1,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 12,
  },
});
