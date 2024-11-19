import { supabase } from "@/database/supabase";
import { create } from "zustand";
import { Session as SupabaseSession } from "@supabase/supabase-js";

// Definindo os tipos de dados
interface SessionStore {
  session: SupabaseSession | null;
  setSession: (session: SupabaseSession | null) => void;
  clearSession: () => void;
}

// Criando a store do Zustand
export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));

// Função para obter a sessão do Supabase
export const fetchSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};
