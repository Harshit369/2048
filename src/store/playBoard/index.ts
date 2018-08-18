import { observable, computed } from "mobx";

import IPlayBoard from "../../interfaces/playBoard";
import ITile from "../../interfaces/tile";

import Tile from "./tile";

interface ITileAddress {
  i: number;
  j: number;
}

class PlayBoardStore implements IPlayBoard {
  public gridSize = 4;

  public getNexRandomTile(grid: IPlayBoard["grid"]): ITileAddress {
    const emptySlots: ITileAddress[] = [];
    grid.forEach((row, i) => {
      row.forEach((tile, j) => {
        if (tile.power === 0) {
          emptySlots.push({ i, j });
        }
      });
    });
    return emptySlots[Math.floor(Math.random() * emptySlots.length)];
  }

  public gertInitialGrid(): IPlayBoard["grid"] {
    const grid = new Array(this.gridSize);
    for (let i = 0; i < this.gridSize; i++) {
      grid[i] = new Array(this.gridSize);
      for (let j = 0; j < this.gridSize; j++) {
        grid[i][j] = new Tile();
      }
    }
    const { i: x, j: y } = this.getNexRandomTile(grid);
    grid[x][y].power = 1;
    return grid;
  }

  @observable
  public grid = this.gertInitialGrid();

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
