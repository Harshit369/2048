import { observable, computed } from 'mobx';

import IPlayBoard from '../../interfaces/playBoard';
import ITile from '../../interfaces/tile';

import Tile from './tile';

class PlayBoardStore implements IPlayBoard {
  gridSize = 4;

  gertInitialGrid() {
    const grid = new Array(this.gridSize);
    for (let i = 0; i < this.gridSize; i++) {
      grid[i] = new Array(this.gridSize);
      for (let j = 0; j < this.gridSize; j++) {
        grid[i][j] = new Tile();
      }
    }
    return grid;
  }

  @observable
  grid = this.gertInitialGrid();

  @computed
  get totalScore(): number {
    let total: number = 0;
    this.grid.forEach(row =>
      row.forEach((tile: ITile) => (total += tile.score || 0))
    );
    return total;
  }
}

export default new PlayBoardStore();
