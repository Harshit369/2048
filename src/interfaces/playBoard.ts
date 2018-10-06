import ITile from "./tile";

interface IPlayBoard {
  grid: ITile[][];
  totalScore: number;
  highScore: number;
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeUp: () => void;
  swipeDown: () => void;
  reset: () => void;
}

export default IPlayBoard;
