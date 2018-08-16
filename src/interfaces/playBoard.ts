import ITile from './tile';

interface IPlayBoard {
  gridSize: number;
  grid: ITile[][];
  totalScore: number;
}

export default IPlayBoard;