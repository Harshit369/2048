import { observer } from "mobx-react";
import * as React from "react";
import { View, StyleSheet } from "react-native";

import IPlayBoard from "../../interfaces/playBoard";
import ITile from "../../interfaces/tile";
import Tile from "../tile";

interface IRowProps {
  tiles: ITile[];
}

interface IGridProps {
  playBoardStore: IPlayBoard;
}

const Row: React.SFC<IRowProps> = ({ tiles }) => {
  return (
    <View style={styles.row}>
      {tiles.map((tile, i) => (
        <Tile score={tile.score} color={tile.color} key={i} />
      ))}
    </View>
  );
};

@observer
class Grid extends React.Component<IGridProps> {
  public render() {
    const {
      playBoardStore: { grid }
    } = this.props;
    return (
      <View style={styles.grid}>
        {grid.map((row, i) => (
          <Row tiles={row} key={i} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "cyan",
    justifyContent: "center",
    flexWrap: "nowrap"
  },
  row: {
    height: "25%",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "green"
  }
});

export default Grid;
