import { observable, computed } from 'mobx';

import ITile from '../../interfaces/tile';

const hashCode = (str: string): number => { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
} 

const intToRGB = (i: number): string => {
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

class Tile implements ITile {
  @observable power = 0;

  @computed
  get score() {
    return this.power ? Math.pow(2, this.power) : null;
  }

  @computed
  get color() {
    return `#${intToRGB(hashCode((this.score || 0).toString()))}`;
  }
}

export default Tile;