import ITile from "./tile";

interface IPlayBoard {
  grid: ITile[][];
  totalScore: number;
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeUp: () => void;
  swipeDown: () => void;
}

export default IPlayBoard;
