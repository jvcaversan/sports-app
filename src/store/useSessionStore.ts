import { supabase } from "@/database/supabase";
import { create } from "zustand";
import { Session as SupabaseSession } from "@supabase/supabase-js";

// Definindo os tipos de dados
interface SessionStore {
  session: SupabaseSession | null;
  loading: boolean;
  setSession: (session: SupabaseSession | null) => void;
  clearSession: () => void;
  initializeSession: () => Promise<void>;
}

// Criando a store do Zustand
export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => set({ session }),
  clearSession: () => {
    supabase.auth.signOut(); // Encerra a sessão no Supabase
    set({ session: null });
  },
  initializeSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession(); // Obtém a sessão atual
    set({ session, loading: false }); // Atualiza a sessão e encerra o carregamento
  },
}));
