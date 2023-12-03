import Cell from "./cell";
import Board from "./board";
import { COLOR, ICON } from "./constants";
import drawLine from "./utils";

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

  checkWin() {
    const horizontalWin = this.checkHorizontal();
    const verticalWin = this.checkVertical();
    const diagonalWin = this.checkDiagonal();

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
      this.parent.checkWin();
    }
  }

  checkHorizontal(): {
    winner: "X" | "O" | false;
    firstCell: Cell | null;
    lastCell: Cell | null;
  } {
    for (let i = 0; i < 3; i++) {
      const first = this.cells[i][0].value;
      if (!first) continue;

      for (let j = 0; j < 3; j++) {
        if (this.cells[i][j].value !== first) break;
        if (j === 2)
          return {
            winner: first,
            firstCell: this.cells[i][0],
            lastCell: this.cells[i][2],
          };
      }
    }

    return {
      winner: false,
      firstCell: null,
      lastCell: null,
    };
  }

  checkVertical(): {
    winner: "X" | "O" | false;
    firstCell: Cell | null;
    lastCell: Cell | null;
  } {
    for (let i = 0; i < 3; i++) {
      const first = this.cells[0][i].value;
      if (!first) continue;

      for (let j = 0; j < 3; j++) {
        if (this.cells[j][i].value !== first) break;
        if (j === 2)
          return {
            winner: first,
            firstCell: this.cells[0][i],
            lastCell: this.cells[2][i],
          };
      }
    }

    return {
      winner: false,
      firstCell: null,
      lastCell: null,
    };
  }

  checkDiagonal(): {
    winner: "X" | "O" | false;
    firstCell: Cell | null;
    lastCell: Cell | null;
  } {
    const first = this.cells[0][0].value;
    if (first) {
      if (
        this.cells[1][1].value === first &&
        this.cells[2][2].value === first
      ) {
        return {
          winner: first,
          firstCell: this.cells[0][0],
          lastCell: this.cells[2][2],
        };
      }
    }

    const second = this.cells[0][2].value;
    if (second) {
      if (
        this.cells[1][1].value === second &&
        this.cells[2][0].value === second
      ) {
        return {
          winner: second,
          firstCell: this.cells[0][2],
          lastCell: this.cells[2][0],
        };
      }
    }

    return {
      winner: false,
      firstCell: null,
      lastCell: null,
    };
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
}
