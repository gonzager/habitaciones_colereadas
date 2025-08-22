const { WALL, DOOR, UP, DOWN, LEFT, RIGHT } = require("./constants");

const directions = [
  { directionRow: -1, directionCol: 0, name: UP },
  { directionRow: 1, directionCol: 0, name: DOWN },
  { directionRow: 0, directionCol: -1, name: LEFT },
  { directionRow: 0, directionCol: 1, name: RIGHT },
];

class Coordinate {
  #row;
  #col;
  constructor(row, col) {
    this.#row = row;
    this.#col = col;
  }

  getRow() {
    return this.#row;
  }
  getCol() {
    return this.#col;
  }
}

class Neighbor {
  #coordinate;
  #direction;
  constructor(value, coordinate, direction) {
    this.value = value;
    this.#coordinate = coordinate;
    this.#direction = direction;
  }
  getCoordinate() {
    return this.#coordinate;
  }
  getDirection() {
    return this.#direction;
  }
}

class Position {
  #coordinate;
  constructor(value, row, col) {
    this.value = value;
    this.#coordinate = new Coordinate(row, col);
    this.neighbors = [];
  }
  row() {
    return this.#coordinate.getRow();
  }
  col() {
    return this.#coordinate.getCol();
  }
  getCoordinate() {
    return this.#coordinate;
  }

  isWall() {
    return this.value === WALL;
  }

  isDoor() {
    if (this.value !== DOOR) return false;

    const verticalWalls = this.neighbors
      .filter((n) => n.getDirection() === UP || n.getDirection() === DOWN)
      .every((n) => n.value === WALL);

    const horizontalWalls = this.neighbors
      .filter((n) => n.getDirection() === LEFT || n.getDirection() === RIGHT)
      .every((n) => n.value === WALL);

    return verticalWalls || horizontalWalls;
  }

  buildNeighbors(matrix) {
    directions.forEach(({ directionRow, directionCol, name }) => {
      const dr = this.row() + directionRow;
      const dc = this.col() + directionCol;
      if (dr >= 0 && dr < matrix.length && dc >= 0 && dc < matrix[0].length) {
        this.neighbors.push(
          new Neighbor(matrix[dr][dc], new Coordinate(dr, dc), name)
        );
      }
    });
    return this;
  }
}

module.exports = Position;
