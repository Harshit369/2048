import * as React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  RegisteredStyle,
  TextStyle
} from "react-native";

import ITile from "../../interfaces/tile";

interface ITileProps {
  score: ITile["score"];
  color: ITile["color"];
}

interface IStyles {
  tile: RegisteredStyle<ViewStyle>;
  score: RegisteredStyle<TextStyle>;
}

const getTileStyles = (color: ITileProps["color"]): IStyles => {
  return StyleSheet.create({
    tile: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      width: "25%",
      backgroundColor: color
    },
    score: {
      color: "white"
    }
  });
};

const Tile: React.SFC<ITileProps> = ({ score, color }) => {
  const styles = getTileStyles(color);
  return (
    <View style={styles.tile}>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

export default Tile;
