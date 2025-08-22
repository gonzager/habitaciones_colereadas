const Position = require("./position");

class ReadPositionsStringStrategy {
  constructor(str) {
    this.str = str;
  }

  getPositions = () => {
    const matrix = this.str.split("\n").map((row) => row.split(""));
    return matrix.flatMap((values, row) =>
      values.map((value, col) =>
        new Position(value, row, col).buildNeighbors(matrix)
      )
    );
  };
}

class ReadPositions {
  constructor(readPositionsStrategy) {
    this.readPositionsStrategy = readPositionsStrategy;
  }

  getPositions = () => this.readPositionsStrategy.getPositions();

  setReadPositionsStrategy(readPositionsStrategy) {
    this.readPositionsStrategy = readPositionsStrategy;
  }
}

module.exports = { ReadPositions, ReadPositionsStringStrategy };
