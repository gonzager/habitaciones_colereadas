const { ROOMSPACE } = require("./constants");

class Structure {
  constructor(fnPositionsCallback) {
    this.positions = fnPositionsCallback();
    this.visited = new Set();
    this.positionMap = new Map(
      this.positions.map((p) => [Structure.key(p.getCoordinate()), p])
    );
  }

  static key(coordinate) {
    return `${coordinate.getRow()},${coordinate.getCol()}`;
  }

  findDoors() {
    return new Set(this.positions.filter((position) => position.isDoor()));
  }

  findWalls() {
    return new Set(this.positions.filter((position) => position.isWall()));
  }

  findRooms() {
    const rooms = new Set();

    this.positions.forEach((position) => {
      const posKey = Structure.key(position.getCoordinate());

      if (
        position.value === ROOMSPACE &&
        !this.visited.has(posKey) &&
        !position.isDoor()
      ) {
        const room = this.flood(position);
        if (room.length > 0) {
          rooms.add(room);
        }
      }
    });
    return rooms;
  }

  flood(firstPosition) {
    const stack = [firstPosition];
    const room = [];

    while (stack.length > 0) {
      const position = stack.pop();
      const posKey = Structure.key(position.getCoordinate());

      if (this.visited.has(posKey)) continue;

      this.visited.add(posKey);
      room.push(position);

      position.neighbors.forEach((neighbor) => {
        const neighborKey = Structure.key(neighbor.getCoordinate());
        const neighborPosition = this.positionMap.get(neighborKey);
        if (
          neighbor.value === ROOMSPACE &&
          !this.visited.has(neighborKey) &&
          !neighborPosition.isDoor()
        ) {
          if (neighborPosition) stack.push(neighborPosition);
        }
      });
    }
    return room;
  }
}

module.exports = Structure;
