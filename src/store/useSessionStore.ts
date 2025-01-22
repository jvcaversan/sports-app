import { supabase } from "@/database/supabase";
import { create } from "zustand";
import { Session as SupabaseSession } from "@supabase/supabase-js";

interface SessionStore {
  session: SupabaseSession | null;
  loading: boolean;
  setSession: (session: SupabaseSession | null) => void;
  clearSession: () => void;
  initializeSession: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => set({ session }),
  clearSession: () => {
    supabase.auth.signOut();
    set({ session: null });
  },
  initializeSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, loading: false });
  },
}));
