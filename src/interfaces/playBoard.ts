import ITile from './tile';

interface IPlayBoard {
  grid: ITile[][];
  totalScore: number;
  swipeLeft: () => void;
}

export default IPlayBoard;
