import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";

type FlatListWrapperProps<T> = {
  data: T[];
  renderItem: ({ item }: { item: T }) => JSX.Element;
  keyExtractor: (item: T) => string;
  emptyMessage: string;
};

export default function FlatListWrapper<T>({
  data,
  renderItem,
  keyExtractor,
  emptyMessage,
}: FlatListWrapperProps<T>) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});
