import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useSessionStore } from "@/store/useSessionStore";

export default function Index() {
  const { session, loading, initializeSession } = useSessionStore();

  useEffect(() => {
    initializeSession(); // Inicializa a sessão ao carregar o app
  }, [initializeSession]);

  if (loading) return null; // Exibe um carregamento enquanto a sessão é verificada

  return <Redirect href={session ? "/(user)/home" : "/(auth)/signin"} />;
}
