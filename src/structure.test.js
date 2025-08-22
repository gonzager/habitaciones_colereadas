const Structure = require("./structure");
const { ROOMSPACE, WALL, DOOR } = require("./constants");

describe("Structure", () => {
  const makeCoordinate = (row, col) => ({
    getRow: () => row,
    getCol: () => col,
  });

  const makePosition = ({
    row,
    col,
    value,
    isDoor = () => false,
    isWall = () => false,
    neighbors = [],
  }) => ({
    value,
    getCoordinate: () => makeCoordinate(row, col),
    isDoor,
    isWall,
    neighbors,
  });

  test("key() should generate a coordinate key", () => {
    const coord = makeCoordinate(2, 3);
    expect(Structure.key(coord)).toBe("2,3");
  });

  test("findDoors() should return only positions where isDoor() is true", () => {
    const positions = [
      makePosition({ row: 0, col: 0, value: DOOR, isDoor: () => true }),
      makePosition({ row: 0, col: 1, value: WALL, isDoor: () => false }),
    ];

    const s = new Structure(() => positions);
    const doors = s.findDoors();

    expect(doors.size).toBe(1);
    expect([...doors][0].value).toBe(DOOR);
  });

  test("findWalls() should return only positions where isWall() is true", () => {
    const positions = [
      makePosition({ row: 0, col: 0, value: WALL, isWall: () => true }),
      makePosition({ row: 0, col: 1, value: ROOMSPACE, isWall: () => false }),
    ];

    const s = new Structure(() => positions);
    const walls = s.findWalls();

    expect(walls.size).toBe(1);
    expect([...walls][0].value).toBe(WALL);
  });

  test("findRooms() should flood fill connected ROOMSPACE cells", () => {
    const p1 = makePosition({ row: 0, col: 0, value: ROOMSPACE });
    const p2 = makePosition({ row: 0, col: 1, value: ROOMSPACE });
    const p3 = makePosition({ row: 1, col: 1, value: ROOMSPACE });

    // Establecemos vecinos
    p1.neighbors = [
      { value: ROOMSPACE, getCoordinate: () => makeCoordinate(0, 1) },
    ];
    p2.neighbors = [
      { value: ROOMSPACE, getCoordinate: () => makeCoordinate(0, 0) },
      { value: ROOMSPACE, getCoordinate: () => makeCoordinate(1, 1) },
    ];
    p3.neighbors = [
      { value: ROOMSPACE, getCoordinate: () => makeCoordinate(0, 1) },
    ];

    const positions = [p1, p2, p3];
    const s = new Structure(() => positions);

    const rooms = s.findRooms();
    expect(rooms.size).toBe(1);

    const roomArray = [...rooms][0];
    expect(roomArray).toHaveLength(3);
    expect(roomArray.map((p) => Structure.key(p.getCoordinate()))).toEqual(
      expect.arrayContaining(["0,0", "0,1", "1,1"])
    );
  });

  test("flood() should not revisit already visited positions", () => {
    const p1 = makePosition({ row: 0, col: 0, value: ROOMSPACE });
    const p2 = makePosition({ row: 0, col: 1, value: ROOMSPACE });

    p1.neighbors = [
      { value: ROOMSPACE, getCoordinate: () => makeCoordinate(0, 1) },
    ];
    p2.neighbors = [
      { value: ROOMSPACE, getCoordinate: () => makeCoordinate(0, 0) },
    ];

    const positions = [p1, p2];
    const s = new Structure(() => positions);

    const room = s.flood(p1);
    expect(room.length).toBe(2);
    expect(s.visited.size).toBe(2); // Ningún ciclo infinito
  });

  test("findRooms() should skip doors even if they are ROOMSPACE", () => {
    const doorPos = makePosition({
      row: 0,
      col: 0,
      value: ROOMSPACE,
      isDoor: () => true,
    });
    const s = new Structure(() => [doorPos]);
    const rooms = s.findRooms();
    expect(rooms.size).toBe(0);
  });
});
