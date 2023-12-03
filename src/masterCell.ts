import Cell from "./cell";
import Board from "./board";
import { COLOR, ICON } from "./constants";
import drawLine, {
  checkDiagonal,
  checkHorizontal,
  checkVertical,
} from "./utils";

export default class MasterCell {
  public parent: Board;
  public element = document.createElement("div");
  public cells = Array<Array<Cell>>();
  public coordinates: { x: number; y: number };
  public value: null | "X" | "O";
  private cover = document.createElement("div");

  constructor(parent: Board, x: number, y: number) {
    this.parent = parent;
    this.coordinates = { x, y };
    this.value = null;

    for (let i = 0; i < 3; i++) {
      this.cells[i] = Array<Cell>();
      for (let j = 0; j < 3; j++) {
        this.cells[i][j] = new Cell(this, i, j);
      }
    }

    this.initElement();
  }

  initElement() {
    this.element.classList.add(
      "grid",
      "grid-cols-3",
      "grid-rows-3",
      "relative",
      "border-neutral-900"
    );
    if (this.coordinates.y !== 2) this.element.classList.add("border-r-2");
    if (this.coordinates.x !== 2) this.element.classList.add("border-b-2");
    this.parent.element.appendChild(this.element);

    this.cover.classList.add(
      "absolute",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "bg-neutral-900/10",
      "z-10"
    );
    this.cover.style.display = "none";
    this.element.appendChild(this.cover);
  }

  checkWin(): boolean {
    const horizontalWin = checkHorizontal(this);
    const verticalWin = checkVertical(this);
    const diagonalWin = checkDiagonal(this);

    let winner = horizontalWin.winner
      ? horizontalWin
      : verticalWin.winner
      ? verticalWin
      : diagonalWin.winner
      ? diagonalWin
      : false;

    if (winner) {
      this.value = winner.winner as "X" | "O";
      drawLine(winner.firstCell!, winner.lastCell!, this.element, 4);
      this.putBigValue();
      const isFinalWin = this.parent.checkWin();

      return isFinalWin;
    }

    return false;
  }

  putBigValue() {
    const bigValueElement = document.createElement("div");
    bigValueElement.classList.add(
      "absolute",
      "top-1/2",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "text-[12rem]",
      "font-bold",
      "w-full",
      "h-full",
      "flex",
      "justify-center",
      "items-center",
      "z-20",
      "bg-opacity-20",
      COLOR[this.value!].bg,
      COLOR[this.value!].text
    );

    if (this.value) bigValueElement.innerHTML = ICON[this.value];
    this.element.appendChild(bigValueElement);
  }

  disable() {
    this.element.style.pointerEvents = "none";
    this.cover.style.display = "block";
  }

  enable() {
    this.element.style.pointerEvents = "auto";
    this.cover.style.display = "none";
  }

  reset() {
    this.value = null;
    this.element.innerHTML = "";
    this.cells.forEach((row) => row.forEach((cell) => cell.reset()));

    this.initElement();
  }
}
