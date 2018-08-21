import { observable, computed, action } from "mobx";

import IPlayBoard from "../../interfaces/playBoard";
import ITile from "../../interfaces/tile";

import Tile from "./tile";

type IGrid = IPlayBoard["grid"];
type IRow = ITile[];

interface ITileAddress {
  i: number;
  j: number;
}

const getNextRandomTile = (grid: IGrid): ITileAddress => {
  const emptySlots: ITileAddress[] = [];
  grid.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile.power === 0) {
        emptySlots.push({ i, j });
      }
    });
  });
  return emptySlots[Math.floor(Math.random() * emptySlots.length)];
};

class PlayBoardStore implements IPlayBoard {
  private gridSize = 4;

  private getNewRow = (length: number): IRow => {
    const sizeRow = Array(length).fill(null);
    return Array.from(sizeRow, () => new Tile());
  };

  private getInitialGrid(): IGrid {
    const sizeRow = Array(this.gridSize).fill(null);
    const grid: IGrid = Array.from(sizeRow, () =>
      this.getNewRow(sizeRow.length)
    );
    const { i: x, j: y } = getNextRandomTile(grid);
    grid[x][y].power = 1;
    return grid;
  }

  private fragmentRow(row: IRow): IRow {
    const newrow = this.getNewRow(row.length);
    let r = 0;
    let n = 0;
    while (r < row.length && n < newrow.length) {
      if (row[r].power === 0) {
        r++;
      } else if (row[r].power !== newrow[n].power) {
        if (r > n && newrow[n].power !== 0) {
          n++;
        }
        newrow[n].power = row[r].power;
        r++;
      } else {
        newrow[n].power = newrow[n].power + row[r].power;
        r++;
      }
    }
    return newrow;
  }

  @observable
  public grid = this.getInitialGrid();

  @computed
  get totalScore(): number {
    let total: number = 0;
    this.grid.forEach(row =>
      row.forEach((tile: ITile) => (total += tile.score || 0))
    );
    return total;
  }

  @action
  public swipeLeft(): void {
    debugger;
    const newGrid = this.grid.map(row => this.fragmentRow(row));
    this.grid = newGrid;
  }
}

export default new PlayBoardStore();
