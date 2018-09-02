import { inject } from "mobx-react";
import * as React from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  PanResponderInstance,
  PanResponderGestureState
} from "react-native";

import Grid from "../../components/grid";
import IPlayBoard from "../../interfaces/playBoard";

interface IProps {
  playBoardStore: IPlayBoard;
}

@inject("playBoardStore")
class Main extends React.Component<IProps> {
  private panResponder: PanResponderInstance;

  private bindSwipeToAction = ({ dx, dy }: PanResponderGestureState) => {
    const { playBoardStore } = this.props;
    const swipeAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (swipeAxis === "x") {
      if (dx > 0) {
        playBoardStore.swipeRight();
      } else {
        playBoardStore.swipeLeft();
      }
    } else {
      if (dy > 0) {
        playBoardStore.swipeDown();
      } else {
        playBoardStore.swipeUp();
      }
    }
  };

  public componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderRelease: (e, gestureState) => {
        this.bindSwipeToAction(gestureState);
      }
    });
  }

  public render() {
    const { playBoardStore } = this.props;
    return (
      <View style={styles.mainWrapper}>
        {/* <View style={styles.scoreBoardWrapper}>
          
        </View> */}
        <View style={styles.gridWrapper} {...this.panResponder.panHandlers}>
          <Grid playBoardStore={playBoardStore} />
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
