import { observable, computed } from 'mobx';

import ITile from '../../interfaces/tile';

const colorMap = [
  'lightgray',
  '#e51c23',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#5677fc',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#259b24',
  '#8bc34a',
  '#afb42b',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b'
];

class Tile implements ITile {
  @observable
  public power = 0;

  @computed
  public get score() {
    return this.power ? Math.pow(2, this.power) : null;
  }

  @computed
  public get color() {
    return colorMap[this.power % colorMap.length];
  }
}

export default Tile;
