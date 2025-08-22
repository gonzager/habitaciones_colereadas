const Position = require("./position");
const { WALL, DOOR, UP, DOWN, LEFT, RIGHT } = require("./constants");

describe("Position class", () => {
  test("should store and return correct row and col", () => {
    const pos = new Position("X", 2, 3);
    expect(pos.row()).toBe(2);
    expect(pos.col()).toBe(3);
    expect(pos.getCoordinate().getRow()).toBe(2);
    expect(pos.getCoordinate().getCol()).toBe(3);
  });

  test("isWall should return true only if value === WALL", () => {
    const wallPos = new Position(WALL, 0, 0);
    const doorPos = new Position(DOOR, 0, 1);
    const otherPos = new Position(" ", 0, 2);

    expect(wallPos.isWall()).toBe(true);
    expect(doorPos.isWall()).toBe(false);
    expect(otherPos.isWall()).toBe(false);
  });

  describe("isDoor logic", () => {
    test("should return false if value is not DOOR", () => {
      const pos = new Position(WALL, 1, 1);
      expect(pos.isDoor()).toBe(false);
    });

    test("should return true if vertical neighbors are walls", () => {
      const pos = new Position(DOOR, 1, 1);
      pos.neighbors = [
        { getDirection: () => UP, value: WALL },
        { getDirection: () => DOWN, value: WALL },
        { getDirection: () => LEFT, value: " " },
        { getDirection: () => RIGHT, value: " " },
      ];
      expect(pos.isDoor()).toBe(true);
    });

    test("should return true if horizontal neighbors are walls", () => {
      const pos = new Position(DOOR, 1, 1);
      pos.neighbors = [
        { getDirection: () => LEFT, value: WALL },
        { getDirection: () => RIGHT, value: WALL },
        { getDirection: () => UP, value: " " },
        { getDirection: () => DOWN, value: " " },
      ];
      expect(pos.isDoor()).toBe(true);
    });

    test("should return false if not enclosed by walls", () => {
      const pos = new Position(DOOR, 1, 1);
      pos.neighbors = [
        { getDirection: () => UP, value: WALL },
        { getDirection: () => DOWN, value: " " },
        { getDirection: () => LEFT, value: " " },
        { getDirection: () => RIGHT, value: WALL },
      ];
      expect(pos.isDoor()).toBe(false);
    });
  });

  describe("buildNeighbors", () => {
    test("should add valid neighbors based on matrix", () => {
      const matrix = [
        ["A", "B", "C"],
        ["D", "E", "F"],
        ["G", "H", "I"],
      ];

      const pos = new Position("E", 1, 1);
      pos.buildNeighbors(matrix);

      expect(pos.neighbors.length).toBe(4);

      const directions = pos.neighbors.map((n) => n.getDirection());
      expect(directions).toEqual(
        expect.arrayContaining([UP, DOWN, LEFT, RIGHT])
      );

      const values = pos.neighbors.map((n) => n.value);
      expect(values).toEqual(expect.arrayContaining(["B", "D", "F", "H"]));
    });

    test("should not add out-of-bounds neighbors", () => {
      const matrix = [
        ["A", "B"],
        ["C", "D"],
      ];
      const pos = new Position("A", 0, 0);
      pos.buildNeighbors(matrix);
      expect(pos.neighbors.length).toBe(2);
    });
  });
  test("getCoordinate should return a Coordinate instance with correct values", () => {
    const pos = new Position("X", 4, 5);
    const coord = pos.getCoordinate();

    // Verificamos que realmente sea un objeto con los métodos esperados
    expect(typeof coord.getRow).toBe("function");
    expect(typeof coord.getCol).toBe("function");

    // Verificamos que devuelva los valores correctos
    expect(coord.getRow()).toBe(4);
    expect(coord.getCol()).toBe(5);
  });
});
