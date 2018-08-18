import { observer, inject } from "mobx-react";
import * as React from "react";
import { StyleSheet, View } from "react-native";

import Grid from "../../components/grid";
import IPlayBoard from "../../interfaces/playBoard";

interface IProps {
  playBoardStore: IPlayBoard;
}

@inject("playBoardStore")
@observer
class Main extends React.Component<IProps> {
  public render() {
    const {
      playBoardStore: { grid }
    } = this.props;
    return (
      <View style={styles.mainWrapper}>
        {/* <View style={styles.scoreBoardWrapper}>
          
        </View> */}
        <View style={styles.gridWrapper}>
          <Grid grid={grid} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ededed"
  },
  scoreBoardWrapper: {
    flex: 1,
    backgroundColor: "#fff"
  },
  gridWrapper: {
    height: 300,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "pink"
  }
});

export default Main;
