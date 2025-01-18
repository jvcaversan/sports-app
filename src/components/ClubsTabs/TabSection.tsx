import { View, StyleSheet } from "react-native";
import FlatListWrapper from ".";

interface TabRouteProps {
  data: any[] | undefined;
  renderItem: ({ item }: { item: any }) => JSX.Element;
  keyExtractor: (item: any) => string;
  emptyMessage: string;
  sectionStyle: object;
}

export const TabRoute = ({
  data,
  renderItem,
  keyExtractor,
  emptyMessage,
  sectionStyle,
}: TabRouteProps) => (
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
