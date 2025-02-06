import { StyleSheet } from "react-native";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 150,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    minHeight: 500,
    gap: 0,
  },
  teamContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 8,
    borderWidth: 0,
  },
  separator: {
    width: 1,
    backgroundColor: "#000000",

    height: "100%",
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2d3436",
    marginBottom: 8,
    textAlign: "center",
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  teamRating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636e72",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Roboto-Regular",
  },
  playersList: {
    gap: 5,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  playerPosition: {
    width: 28,
    marginRight: 8,
    fontSize: 12,
    fontWeight: "900",
  },
  playerName: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    includeFontPadding: false,
    color: "#2d3436",
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 8,
  },
  actionButton: {
    flex: 0.48,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#3498db",
    alignItems: "center",
  },
  editButton: {
    flex: 0.48,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f39c12",
    alignItems: "center",
  },
  confirmButtonActive: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },
  substitutesTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#000000",
    marginTop: 8,
    marginBottom: 2,
    paddingVertical: 4,
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: "#fff3f3",
    borderWidth: 1,
    borderColor: "#ffcccc",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    textAlign: "center",
  },
  suplenteName: {
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  placeholderText: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  disabledButton: {
    backgroundColor: "#95a5a6", // Cor cinza
  },
});
