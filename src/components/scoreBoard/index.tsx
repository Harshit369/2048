import { observer } from 'mobx-react';
import * as React from 'react';
import { View, StyleSheet, ViewStyle, RegisteredStyle } from 'react-native';

import IPlayBoard from '../../interfaces/playBoard';
import Score from '../score';

interface IScoreBoardProps {
  playBoardStore: IPlayBoard;
}

interface IStyles {
  mainWrapper: RegisteredStyle<ViewStyle>;
  highScore: RegisteredStyle<ViewStyle>;
}

const styles: IStyles = StyleSheet.create({
  mainWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  highScore: {
    justifyContent: 'flex-end'
  }
});

@observer
class ScoreBoard extends React.Component<IScoreBoardProps> {
  public render() {
    const {
      playBoardStore: { totalScore, highScore }
    } = this.props;
    return (
      <View style={styles.mainWrapper}>
        <Score score={totalScore} label="score" />
        <Score
          score={highScore}
          label={`${totalScore === highScore ? 'New' : 'Previous'} Best`}
          custonStyle={styles.highScore}
        />
      </View>
    );
  }
}

export default ScoreBoard;
