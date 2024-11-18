import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

interface PlayerPositionProps {
  onPress?: () => void;
  onClear?: () => void;
  playerId?: string | number;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function PlayerPosition({
  onPress,
  onClear,
  playerId,
  label,
  style,
}: PlayerPositionProps) {
  return (
    <Pressable style={[styles.position, style]} onPress={onPress}>
      <Text style={styles.text}>{playerId || label}</Text>
      {playerId && (
        <Pressable
          style={styles.clearButton}
          onPress={() => {
            onClear?.();
          }}
        >
          <Text style={styles.clearButtonText}>×</Text>
        </Pressable>
      )}
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
  clearButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
