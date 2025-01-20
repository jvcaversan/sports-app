import { View, StyleSheet } from "react-native";
import FlatListWrapper from "./FlatListComponent";

interface TabRouteProps<T> {
  data: T[] | undefined;
  renderItem: ({ item }: { item: T }) => JSX.Element;
  keyExtractor: (item: T) => string;
  emptyMessage: string;
  sectionStyle: object;
}

export const TabRoute = <T,>({
  data,
  renderItem,
  keyExtractor,
  emptyMessage,
  sectionStyle,
}: TabRouteProps<T>) => (
  <View style={styles.tabContent}>
    <View style={sectionStyle}>
      <FlatListWrapper
        data={data ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        emptyMessage={emptyMessage}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
