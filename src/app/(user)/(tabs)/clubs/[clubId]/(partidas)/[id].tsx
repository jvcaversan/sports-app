import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useEffect, useState } from "react";
import CustomScreen from "@/components/CustomView";
import { useSessionStore } from "@/store/useSessionStore";
import { useIsClubAdmin } from "@/api/club_members";
import PreMatchTab from "@/components/Matchs/listprematch/pre-match";
import LiveMatchTab from "@/components/Matchs/match";
import ConvocacaoTab from "@/components/Matchs/listconvocacao/convocacao";

export default function MatchScreen() {
  const { id, clubId } = useLocalSearchParams();
  const { session } = useSessionStore();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<{ key: string; title: string }[]>([]);
  const [isCreating, setIsCreating] = useState(true); // Novo estado para controle do loading

  const normalizedClubId = Array.isArray(clubId) ? clubId[0] : clubId;
  const matchId = Array.isArray(id) ? id[0] : id;
  const userId = session?.user.id;

  const {
    data: isAdmin,
    isLoading: adminLoading,
    isError: adminError,
  } = useIsClubAdmin(normalizedClubId || "", userId || "");

  useEffect(() => {
    // Simula o tempo de criação da partida
    const creationTimer = setTimeout(() => {
      setIsCreating(false);
    }, 1000);

    return () => clearTimeout(creationTimer);
  }, []);

  useEffect(() => {
    const baseRoutes = [{ key: "liveMatch", title: "Partida" }];

    if (isAdmin) {
      baseRoutes.unshift(
        { key: "convocacao", title: "Convocação" },
        { key: "preMatch", title: "Pré-Partida" }
      );
    }

    setRoutes(baseRoutes);
  }, [isAdmin]);

  // Tela de loading global
  if (isCreating) {
    return (
      <CustomScreen>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2F80ED" />
          <Text style={styles.loadingText}>Criando Partida...</Text>
        </View>
      </CustomScreen>
    );
  }

  if (!session) {
    return (
      <CustomScreen>
        <Text>Usuário não autenticado</Text>
      </CustomScreen>
    );
  }

  if (!matchId || !normalizedClubId) {
    return (
      <CustomScreen>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2F80ED" />
          <Text style={styles.loadingText}>Carregando Partida...</Text>
        </View>
      </CustomScreen>
    );
  }

  if (adminLoading) {
    return (
      <CustomScreen>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2F80ED" />
          <Text style={styles.loadingText}>Verificando Permissões...</Text>
        </View>
      </CustomScreen>
    );
  }

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "convocacao":
        return <ConvocacaoTab matchId={matchId} clubId={normalizedClubId!} />;
      case "preMatch":
        return <PreMatchTab matchId={matchId} clubId={normalizedClubId!} />;
      case "liveMatch":
        return <LiveMatchTab matchId={matchId} />;
      default:
        return null;
    }
  };

  return (
    <CustomScreen>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            activeColor="#2F80ED"
            inactiveColor="#828282"
          />
        )}
      />
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: "#2F80ED",
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#2F80ED",
  },
  campoContainer: {
    width: "100%",
    height: 260,
    position: "relative",
  },
  campoImage: {
    width: "100%",
    height: "105%",
    resizeMode: "contain",
    alignSelf: "center",
  },
});
