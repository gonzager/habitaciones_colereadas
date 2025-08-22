const { ReadPositions, ReadPositionsStringStrategy } = require("./readers");
const { PrinterConsoleStrategy, Printer } = require("./printers");
const Structure = require("./structure");

const asciiMap = `
##########
#   #    #
#   #    #
## #### ##
#        #
#        #
#  #######
#  #  #  #
#        #
##########
`.trim();

const positionsCallback = new ReadPositions(
  new ReadPositionsStringStrategy(asciiMap)
).getPositions;

const structure = new Structure(positionsCallback);

const doors = [...structure.findDoors()].map((p) => ({
  coordinate: p.getCoordinate(),
  value: p.value,
}));

const walls = [...structure.findWalls()].map((p) => ({
  coordinate: p.getCoordinate(),
  value: p.value,
}));

const rooms = [...structure.findRooms()].flatMap((room, value) =>
  room.map((p) => ({ coordinate: p.getCoordinate(), value }))
);

const printer = new Printer(new PrinterConsoleStrategy());
printer.print([...doors, ...walls, ...rooms]);
