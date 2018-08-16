import { observer, inject } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IPlayBoard from '../../interfaces/playBoard';

interface IProps {
  playBoardStore: IPlayBoard;
}

@inject('playBoardStore')
@observer
class Main extends React.Component<IProps> {
  render() {
    const { playBoardStore } = this.props;
    return (
      <View style={styles.container}>
        <Text>
          Changes you make will automatically reload.{' '}
          {playBoardStore.totalScore}
        </Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center'
  }
});

export default Main;
