import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useSessionStore } from "@/store/useSessionStore";

export default function Index() {
  const { session, loading, initializeSession } = useSessionStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  if (loading) return null;

  return <Redirect href={session ? "/(user)/home" : "/(auth)/signin"} />;
}
