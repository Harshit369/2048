import { observable, computed, action } from 'mobx';

import IPlayBoard from '../../interfaces/playBoard';
import ITile from '../../interfaces/tile';

import Tile from './tile';

type IGrid = IPlayBoard['grid'];
type IRow = ITile[];

interface ITileAddress {
  i: number;
  j: number;
}

const getNextRandomTile = (grid: IGrid): ITileAddress | null => {
  const emptySlots: ITileAddress[] = [];
  grid.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile.power === 0) {
        emptySlots.push({ i, j });
      }
    });
  });
  return emptySlots.length
    ? emptySlots[Math.floor(Math.random() * emptySlots.length)]
    : null;
};

class PlayBoardStore implements IPlayBoard {
  private gridSize = 4;

  private getNewRow = (length: number): IRow => {
    const sizeRow = Array(length).fill(null);
    return Array.from(sizeRow, () => new Tile());
  };

  private getNewEmptyGrid = (): IGrid => {
    const sizeRow = Array(this.gridSize).fill(null);
    return Array.from(sizeRow, () => this.getNewRow(sizeRow.length));
  };

  private transposeGrid = (grid: IGrid): IGrid => {
    const emptyTp = this.getNewEmptyGrid();
    grid.forEach((row, i) => {
      grid[i].forEach((tile, j) => {
        emptyTp[j][i] = tile;
      });
    });
    return emptyTp;
  };

  private getInitialGrid(): IGrid {
    const grid = this.getNewEmptyGrid();
    const address = getNextRandomTile(grid);
    if (address) {
      grid[address.i][address.j].power = 1;
    }
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
        newrow[n].power += 1;
        r++;
      }
    }
    return newrow;
  }

  private addNewRandomTile(grid: IGrid): void {
    const address = getNextRandomTile(grid);
    if (address) {
      grid[address.i][address.j].power = 1;
    }
    this.grid = grid;
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

  @computed
  get highScore(): number {
    const highScore = 2;
    return this.totalScore > highScore ? this.totalScore : highScore;
  }

  @action
  public swipeLeft = (): void => {
    const newGrid = this.grid.map(row => this.fragmentRow(row));
    this.addNewRandomTile(newGrid);
  };

  @action
  public swipeRight = (): void => {
    const newGrid = this.grid.map(row =>
      this.fragmentRow(row.slice().reverse()).reverse()
    );
    this.addNewRandomTile(newGrid);
  };

  @action
  public swipeUp = (): void => {
    const transposedGrid = this.transposeGrid(this.grid);
    const newGrid = this.transposeGrid(
      transposedGrid.map(row => this.fragmentRow(row))
    );
    this.addNewRandomTile(newGrid);
  };

  @action
  public swipeDown = (): void => {
    const transposedGrid = this.transposeGrid(this.grid);
    const newGrid = this.transposeGrid(
      transposedGrid.map(row =>
        this.fragmentRow(row.slice().reverse()).reverse()
      )
    );
    this.addNewRandomTile(newGrid);
  };
}

export default new PlayBoardStore();
