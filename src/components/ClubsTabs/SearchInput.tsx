import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

interface SearchInputProps {
  placeholder: string;
  onSearchChange: (query: string) => void;
}

export const SearchInput = ({
  placeholder,
  onSearchChange,
}: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (text: string) => {
    setQuery(text);
    onSearchChange(text);
  };

  return (
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder || "Buscar..."}
      placeholderTextColor="#94A3B8"
      value={query}
      onChangeText={handleChange}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "Inter-Regular",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
