import { useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { router } from "expo-router";

export default function Index() {
  const { session, loading, initializeSession } = useSessionStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.replace("/(user)/home");
      } else {
        router.replace("/(auth)/signin");
      }
    }
  }, [loading, session]);

  return null;
}
