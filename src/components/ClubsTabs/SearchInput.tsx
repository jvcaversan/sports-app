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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
});
