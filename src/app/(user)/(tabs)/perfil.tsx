import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomScreen from "@/components/CustomView";
import { useSessionStore } from "@/store/useSessionStore";
import { supabase } from "@/database/supabase";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/api/profiles";

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  position: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { clearSession } = useSessionStore();

  const { data, error, isLoading } = useProfile();

  useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  async function handleSave() {
    if (profile) {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          phone: profile.phone,
          photo: profile.photo,
          email: profile.email,
          position: profile.position,
        })
        .eq("id", profile.id); // Substitua 'id' pelo identificador correto
      if (error) {
        Alert.alert("Erro", "Falha ao salvar o perfil.");
      } else {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      }
    }
    setIsEditing(false);
  }

  function handleLogout() {
    clearSession();
    console.log("Sessão limpa:", useSessionStore.getState().session);
    router.replace("/(auth)/signin");
  }

  function handleChangePassword() {
    // Implementar navegação para tela de troca de senha
    // router.push("/change-password");
  }

  return (
    <CustomScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: profile?.photo || "https://github.com/jvcaversan.png",
              }}
              style={styles.avatar}
            />
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Ionicons
              name={isEditing ? "checkmark-outline" : "create-outline"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile?.name || ""}
              onChangeText={(text) =>
                setProfile((prev) => (prev ? { ...prev, name: text } : prev))
              }
              editable={isEditing}
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile?.phone}
              onChangeText={(text) =>
                setProfile((prev) => (prev ? { ...prev, phone: text } : prev))
              }
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile?.email}
              onChangeText={(text) =>
                setProfile((prev) => (prev ? { ...prev, email: text } : prev))
              }
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Posição</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile?.position}
              onChangeText={(text) =>
                setProfile((prev) =>
                  prev ? { ...prev, position: text } : prev
                )
              }
              editable={isEditing}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.changePasswordButton]}
            onPress={handleChangePassword}
          >
            <Ionicons name="key-outline" size={20} color="#666" />
            <Text style={styles.buttonText}>Trocar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#ff4444" />
            <Text style={[styles.buttonText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomScreen>
  );
}

// Add these new styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "relative",
    width: "100%",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    padding: 16,
    marginTop: "auto",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  changePasswordButton: {
    backgroundColor: "#f5f5f5",
  },
  logoutButton: {
    backgroundColor: "#fff0f0",
  },
  buttonText: {
    fontSize: 16,
    color: "#666",
  },
  logoutText: {
    color: "#ff4444",
  },
});
