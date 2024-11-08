import { View, StyleSheet } from "react-native";

export default function Campo() {
  return (
    <View style={styles.linhasCampo}>
      <View style={styles.linhaCentral} />
      <View style={styles.circuloCentral} />
      <View style={styles.areaGoleiroEsquerda} />
      <View style={styles.areaGoleiroDireita} />
      <View style={styles.pequenaAreaEsquerda} />
      <View style={styles.pequenaAreaDireita} />
    </View>
  );
}

const styles = StyleSheet.create({
  linhasCampo: {
    ...StyleSheet.absoluteFillObject,
  },

  linhaCentral: {
    position: "absolute",
    width: 2,
    height: "100%",
    backgroundColor: "#FFFFFF",
    left: "50%",
  },
  circuloCentral: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  areaGoleiroEsquerda: {
    position: "absolute",
    left: 0,
    top: "25%",
    width: "15%",
    height: "50%",
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FFFFFF",
  },
  areaGoleiroDireita: {
    position: "absolute",
    right: 0,
    top: "25%",
    width: "15%",
    height: "50%",
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FFFFFF",
  },
  pequenaAreaEsquerda: {
    position: "absolute",
    left: 0,
    top: "35%",
    width: "8%",
    height: "30%",
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FFFFFF",
  },
  pequenaAreaDireita: {
    position: "absolute",
    right: 0,
    top: "35%",
    width: "8%",
    height: "30%",
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FFFFFF",
  },
});
