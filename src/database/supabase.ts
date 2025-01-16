import { Database } from "@/types/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://czftvvwpwvcqznhiucxa.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZnR2dndwd3ZjcXpuaGl1Y3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMjU4NjEsImV4cCI6MjA0NzYwMTg2MX0.moa0IyJ50a8giHj77Vf5BfhnVZemXZ1ezfHlReSfHGc";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
