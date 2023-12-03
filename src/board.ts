import Cell from "./cell";
import MasterCell from "./masterCell";
import drawLine, {
  checkDiagonal,
  checkHorizontal,
  checkVertical,
} from "./utils";

export default class Board {
  public element: HTMLDivElement;
  public cells: Array<Array<MasterCell>>;
  public currentTurn: "X" | "O";
  public lastPlacedCell: Cell | null = null;

  constructor(boardElement: HTMLDivElement) {
    this.element = boardElement;
    this.currentTurn = "X";

    this.cells = Array<Array<MasterCell>>();
    for (let i = 0; i < 3; i++) {
      this.cells[i] = Array<MasterCell>();
      for (let j = 0; j < 3; j++) {
        this.cells[i][j] = new MasterCell(this, i, j);
      }
    }

    this.initElement();
  }

  initElement() {
    this.element.classList.add("grid", "grid-cols-3", "grid-rows-3");
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === "X" ? "O" : "X";
    if (this.lastPlacedCell) {
      if (
        this.cells[this.lastPlacedCell.coordinates.x][
          this.lastPlacedCell.coordinates.y
        ].value
      ) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) this.cells[i][j].enable();
        }
        return;
      }

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) this.cells[i][j].disable();
      }

      this.cells[this.lastPlacedCell.coordinates.x][
        this.lastPlacedCell.coordinates.y
      ].enable();
    }
  }

  checkWin() {
    const horizontalWin = checkHorizontal(this);
    const verticalWin = checkVertical(this);
    const diagonalWin = checkDiagonal(this);

    const winner = horizontalWin.winner
      ? horizontalWin
      : verticalWin.winner
      ? verticalWin
      : diagonalWin.winner
      ? diagonalWin
      : false;

    if (winner) {
      drawLine(winner.firstCell!, winner.lastCell!, this.element, 8);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) this.cells[i][j].enable();
      }
    }
  }

  disable() {
    this.element.style.pointerEvents = "none";
  }

  enable() {
    this.element.style.pointerEvents = "auto";
  }
}
