import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { fetchSession, useSessionStore } from "@/store/useSessionStore";
import { Session as SupabaseSession } from "@supabase/supabase-js";

export default function Index() {
  const { session, setSession } = useSessionStore(); // Acessando a store do Zustand
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const storedSession: SupabaseSession | null = await fetchSession(); // Obtendo a sessão do Supabase
      setSession(storedSession); // Atualizando a store com a sessão
      setLoading(false); // Atualizando o estado de loading
    };

    checkSession(); // Verifica a sessão quando o componente é montado
  }, [setSession]);

  if (loading) return null;

  return <Redirect href={session ? "/(user)/home" : "/(auth)/signin"} />;
}
