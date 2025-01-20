import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomScreen from "@/components/CustomView";
import { useSessionStore } from "@/store/useSessionStore";
import { useProfile, useEditProfile } from "@/api/profiles";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});

  const { session, clearSession } = useSessionStore();

  if (!session) {
    throw new Error("Usuario não conectado");
  }
  const userId = session.user.id;

  const { data: profile, error, isLoading } = useProfile(userId);
  const editProfileMutation = useEditProfile();

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Erro", "ID do usuário não encontrado.");
      return;
    }

    try {
      await editProfileMutation.mutateAsync({
        ...editedProfile,
        id: userId,
      } as ProfileUpdate);
      setIsEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar o perfil.");
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditedProfile(profile);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar o perfil.</Text>
      </View>
    );
  }

  function handleLogout() {
    clearSession();
    router.replace("/(auth)/signin");
  }

  function handleChangePassword() {}

  return (
    <CustomScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  editedProfile?.photo || "https://github.com/jvcaversan.png",
              }}
              style={styles.avatar}
            />
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleCancelEdit : () => setIsEditing(true)}
          >
            <Ionicons
              name={isEditing ? "close-outline" : "create-outline"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {isEditing && (
            <Text style={styles.editingText}>Modo de edição ativado</Text>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile?.name || ""}
              onChangeText={(text) =>
                setEditedProfile((prev) => ({ ...prev, name: text }))
              }
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile?.phone || ""}
              onChangeText={(text) =>
                setEditedProfile((prev) => ({ ...prev, phone: text }))
              }
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={editedProfile?.email || ""}
              onChangeText={(text) =>
                setEditedProfile((prev) => ({ ...prev, email: text }))
              }
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { marginBottom: 40 }]}
              onPress={handleSave}
              onPressOut={() => setIsEditing(false)}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <>
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
            </>
          )}
        </View>
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
  formContainer: {
    padding: 16,
  },
  editingText: {
    fontSize: 16,
    color: "#ffa500",
    textAlign: "center",
    marginBottom: 16,
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
    fontSize: 16,
    color: "#333",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
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
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  saveButtonText: {
    color: "#fff",
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
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginTop: 20,
  },
});
