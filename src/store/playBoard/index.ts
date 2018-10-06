import { observable, computed, action, autorun, IReactionDisposer } from "mobx";
import { AsyncStorage, Alert } from "react-native";

import IPlayBoard from "../../interfaces/playBoard";
import ITile from "../../interfaces/tile";

import Tile from "./tile";

type IGrid = IPlayBoard["grid"];
type IRow = ITile[];

interface ITileAddress {
  i: number;
  j: number;
}

const getEmptySlots = (grid: IGrid): ITileAddress[] => {
  const emptySlots: ITileAddress[] = [];
  grid.forEach((row, i) => {
    row.forEach((tile, j) => {
      if (tile.power === 0) {
        emptySlots.push({ i, j });
      }
    });
  });
  return emptySlots;
};

const getRandomNumber = (max: number): number =>
  Math.floor(Math.random() * max);

const getNextRandomTile = (grid: IGrid): ITileAddress | null => {
  const emptySlots: ITileAddress[] = getEmptySlots(grid);
  return emptySlots.length
    ? emptySlots[getRandomNumber(emptySlots.length)]
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

const isDeadLock = (grid: IGrid): boolean => {
  const size = grid.length;
  let gameOver = true;
  grid.forEach((row, i) => {
    row.forEach((tile, j) => {
      [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j]].forEach(([x, y]) => {
        if (x < size && x > -1 && y < size && y > -1) {
          if (grid[i][j].power === grid[x][y].power) {
            gameOver = false;
          }
        }
      });
    });
  });
  return gameOver;
};

// main playboard store class
class PlayBoardStore implements IPlayBoard {
  constructor() {
    this.updateLocalStorage();
  }

  private localStorageDisposer: IReactionDisposer;

  private gridSize = 4;

  private updateLocalStorage = (): void => {
    this.localStorageDisposer = autorun(
      () => {
        AsyncStorage.setItem(
          "currentGame",
          JSON.stringify({
            grid: this.grid,
            totalScore: this.totalScore
          })
        );
      },
      {
        name: "localStorageUpdate",
        delay: 300
      }
    );
  };

  public disconnectLocalStorage = (): void => {
    this.localStorageDisposer();
  };

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

  private checkDeadLock(): void {
    if (isDeadLock(this.grid)) {
      Alert.alert("Game over!", "You want to restart?", [
        { text: "Cancel", style: "cancel" },
        { text: "Restart", onPress: () => this.reset() }
      ]);
    }
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

  // this is the functionthat finally sets the main grid with new random tile.
  private addNewRandomTile(grid: IGrid): void {
    const emptySlots = getEmptySlots(grid);
    if (isEqual(this.grid, grid)) {
      if (!emptySlots.length) {
        this.checkDeadLock();
      }
    } else {
      if (emptySlots.length) {
        const address = emptySlots[getRandomNumber(emptySlots.length)];
        grid[address.i][address.j].power = 1;
        this.grid = grid;
        if (emptySlots.length === 1) {
          this.checkDeadLock();
        }
      }
    }
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

  @action
  public reset = (): void => {
    this.grid = this.getInitialGrid();
    this.totalScore = 0;
  };
}

export default new PlayBoardStore();
