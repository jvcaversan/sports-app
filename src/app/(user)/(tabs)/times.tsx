import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomScreen from "@/components/CustomView";
import { useListClubs } from "@/api/clubs";

interface Group {
  id: string;
  name: string;
}

export default function Groups() {
  const { data: clubs, error, isLoading } = useListClubs();
  // Mock data for groups
  const renderGroupItem = ({ item }: { item: Group }) => (
    <Link href={`/(user)/(times)/${item.id}`} asChild>
      <TouchableOpacity style={styles.groupCard}>
        <Text style={styles.groupName}>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <CustomScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Grupos</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.navigate("/(times)/createTeam")}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={clubs}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    paddingVertical: 8,
  },
});
