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

const isEqual = (grid1: IGrid, grid2: IGrid): boolean => {
  let equal = true;
  grid1.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile.power !== grid2[i][j].power) {
        equal = false;
      }
    });
  });
  return equal;
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

  private fragmentRow(row: IRow): { row: IRow; score: number } {
    const newrow = this.getNewRow(row.length);
    let score = 0;
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
        score += newrow[n].score || 0;
        r++;
      }
    }
    return {
      row: newrow,
      score
    };
  }

  private addNewRandomTile(grid: IGrid): void {
    if (isEqual(this.grid, grid)) {
      return;
    }
    const address = getNextRandomTile(grid);
    if (address) {
      grid[address.i][address.j].power = 1;
    }
    this.grid = grid;
  }

  @observable
  public grid: IGrid = this.getInitialGrid();

  @observable
  public totalScore: number = 0;

  @computed
  get highScore(): number {
    const highScore = 2;
    return this.totalScore > highScore ? this.totalScore : highScore;
  }

  @action
  public swipeLeft = (): void => {
    let scoreIncrement = 0;
    const newGrid = this.grid.map(row => {
      const { row: newrow, score } = this.fragmentRow(row);
      scoreIncrement += score;
      return newrow;
    });
    this.totalScore += scoreIncrement;
    this.addNewRandomTile(newGrid);
  };

  @action
  public swipeRight = (): void => {
    let scoreIncrement = 0;
    const newGrid = this.grid.map(row => {
      const { row: newrow, score } = this.fragmentRow(row.slice().reverse());
      scoreIncrement += score;
      return newrow.reverse();
    });
    this.totalScore += scoreIncrement;
    this.addNewRandomTile(newGrid);
  };

  @action
  public swipeUp = (): void => {
    let scoreIncrement = 0;
    const transposedGrid = this.transposeGrid(this.grid);
    const newGrid = this.transposeGrid(
      transposedGrid.map(row => {
        const { row: newrow, score } = this.fragmentRow(row);
        scoreIncrement += score;
        return newrow;
      })
    );
    this.totalScore += scoreIncrement;
    this.addNewRandomTile(newGrid);
  };

  @action
  public swipeDown = (): void => {
    let scoreIncrement = 0;
    const transposedGrid = this.transposeGrid(this.grid);
    const newGrid = this.transposeGrid(
      transposedGrid.map(row => {
        const { row: newrow, score } = this.fragmentRow(row.slice().reverse());
        scoreIncrement += score;
        return newrow.reverse();
      })
    );
    this.totalScore += scoreIncrement;
    this.addNewRandomTile(newGrid);
  };
}

export default new PlayBoardStore();
