import { View, Text, StyleSheet, Pressable } from "react-native";
import { Href, router } from "expo-router";
import { useState } from "react";

interface AuthFooterProps {
  question: string;
  linkText: string;
  linkHref: Href<string | object>;
}

export function AuthFooter({ question, linkText, linkHref }: AuthFooterProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = async () => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      await router.push(linkHref);
    } finally {
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{question} </Text>
      <Pressable
        onPress={handleNavigation}
        disabled={isNavigating}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Text style={[styles.footerLink, isNavigating && styles.disabled]}>
          {linkText}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
