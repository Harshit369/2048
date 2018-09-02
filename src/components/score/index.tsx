import * as React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  RegisteredStyle,
  TextStyle
} from 'react-native';

interface IScoreProps {
  score: number | string;
  label: string;
  custonStyle?: RegisteredStyle<ViewStyle>;
}

interface IStyles {
  card: RegisteredStyle<ViewStyle>;
  score: RegisteredStyle<TextStyle>;
  label: RegisteredStyle<TextStyle>;
}

const styles: IStyles = StyleSheet.create({
  card: {},
  score: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
  label: {
    fontWeight: '100',
    color: '#999'
  }
});

const Score: React.SFC<IScoreProps> = ({ score, label, custonStyle }) => {
  return (
    <View style={[styles.card, custonStyle]}>
      <Text style={styles.score}>{score.toString()}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default Score;
