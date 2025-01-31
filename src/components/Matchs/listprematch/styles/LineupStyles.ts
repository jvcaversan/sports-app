import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 150,
    backgroundColor: "#FFFFFF",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    minHeight: 500,
    backgroundColor: "#FFFFFF",
  },
  separator: {
    width: 1,
    backgroundColor: "grey",
    marginHorizontal: 16,
    height: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
    textAlign: "center",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DFE6E9",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  shuffleButton: {
    backgroundColor: "#FF6B00",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
    marginTop: 8,
  },
});
