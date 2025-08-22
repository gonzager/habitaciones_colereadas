const { WALL, DOOR } = require("./constants");

const reset = "\x1b[0m";
const gray = "\x1b[37m";
const yellow = "\x1b[43m";
const colors = [
  "\x1b[41m", // rojo de fondo
  "\x1b[42m", // verde de fondo
  "\x1b[44m", // azul de fondo
  "\x1b[45m", // magenta de fondo
  "\x1b[46m", // cyan de fondo
];

class PrinterConsoleStrategy {
  print = (array) => {
    const maxRow = Math.max(...array.map((item) => item.coordinate.getRow()));
    const maxCol = Math.max(...array.map((item) => item.coordinate.getCol()));

    const matrix = Array.from({ length: maxRow + 1 }, () =>
      Array(maxCol + 1).fill(" ")
    );

    array.forEach((item) => {
      matrix[item.coordinate.getRow()][item.coordinate.getCol()] = item.value;
    });

    matrix.forEach((row) => {
      let line = "";
      row.forEach((cell) => {
        if (cell === WALL) line += gray + cell + reset;
        else if (cell === DOOR) {
          line += yellow + " " + reset;
        } else if (!isNaN(cell))
          line += colors[cell % colors.length] + " " + reset;
        else line += cell;
      });
      console.log(line);
    });
  };
}

class Printer {
  constructor(printerStrategy) {
    this.printerStrategy = printerStrategy;
  }
  setPrinterStretegy(printerStrategy) {
    this.printerStrategy = printerStrategy;
  }
  print = (arrayObject) => this.printerStrategy.print(arrayObject);
}
module.exports = { PrinterConsoleStrategy, Printer };
