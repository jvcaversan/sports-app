import CustomScreen from "@/components/CustomView";
import TeamLineup from "@/components/prematchsorteio/TeamLineup";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { View } from "react-native";

export default function MatchStatus() {
  const { id } = useGlobalSearchParams();

  console.log(id);

  return (
    <CustomScreen>
      <View
        style={{ flex: 1, justifyContent: "center", marginLeft: 20, gap: 5 }}
      >
        {/* <TeamLineup
          team={selectedPlayers.time1}
          showTotalScore={false}
          style={{ gap: 5 }}
        />
        <TeamLineup
          team={selectedPlayers.time2}
          showTotalScore={false}
          style={{ gap: 5 }}
        /> */}
      </View>
    </CustomScreen>
  );
}
