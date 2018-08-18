import { observable, computed } from "mobx";

import ITile from "../../interfaces/tile";

const colorMap = ["lightgrey", "orange"];

class Tile implements ITile {
  @observable
  public power = 0;

  @computed
  public get score() {
    return this.power ? Math.pow(2, this.power) : null;
  }

  @computed
  public get color() {
    return colorMap[this.power % 2];
  }
}

export default Tile;
