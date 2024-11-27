import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockData } from "@/data";
import CustomScreen from "@/components/CustomView";

interface Group {
  id: number;
  nomeGrupo: string;
  partidas: Match[];
}

interface Match {
  id: number;
  nomePartida: string;
}

export default function Groups() {
  // Mock data for groups
  const data: Group[] = mockData.user.grupos;
  const renderGroupItem = ({ item }: { item: Group }) => (
    <Link href={`/(user)/(times)/${item.id}`} asChild>
      <TouchableOpacity style={styles.groupCard}>
        <Text style={styles.groupName}>{item.nomeGrupo}</Text>
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
            onPress={() => console.log("criando clube")}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={data}
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
