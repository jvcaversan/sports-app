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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shuffleButton: {
    backgroundColor: "#3498db",
  },
  editButton: {
    backgroundColor: "#f1c40f",
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
