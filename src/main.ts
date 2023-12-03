import "./style.css";

const board = document.getElementById("board") as HTMLDivElement;

class Cell {
  private parent: MasterCell;
  public element = document.createElement("div");
  public coordinates: { x: number; y: number };
  public value: null | "X" | "O";

  constructor(parent: MasterCell, x: number, y: number) {
    this.parent = parent;
    this.coordinates = { x, y };
    this.value = null;

    this.initElement();
  }

  initElement() {
    this.element.classList.add(
      "border-neutral-400",
      "w-16",
      "h-16",
      "flex",
      "justify-center",
      "items-center",
      "text-2xl",
      "font-bold",
      "text-white"
    );
    if (this.coordinates.y !== 2) this.element.classList.add("border-r");
    if (this.coordinates.x !== 2) this.element.classList.add("border-b");
    this.parent.element.appendChild(this.element);

    this.element.addEventListener("click", this.onClick.bind(this));
  }

  updateElement() {
    switch (this.value) {
      case "O":
        this.element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z"/></svg>`;
        break;
      case "X":
        this.element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m13.41 12l6.3-6.29a1 1 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1 1 0 0 0-1.42 1.42l6.3 6.29l-6.3 6.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l6.29-6.3l6.29 6.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"/></svg>`;
        break;
      default:
        this.element.innerHTML = "";
        break;
    }
  }

  onClick() {
    if (this.value) return;
    this.value = this.parent.parent.currentTurn;
    this.updateElement();
    this.parent.checkWin();
    this.parent.parent.switchTurn();
  }
}

class MasterCell {
  public parent: Board;
  public element = document.createElement("div");
  private cells = Array<Array<Cell>>();
  public coordinates: { x: number; y: number };
  private value: null | "X" | "O";

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
      "border-amber-500"
    );
    if (this.coordinates.y !== 2) this.element.classList.add("border-r-2");
    if (this.coordinates.x !== 2) this.element.classList.add("border-b-2");
    this.parent.element.appendChild(this.element);
  }

  checkWin() {
    const horizontalWin = this.checkHorizontal();
    const verticalWin = this.checkVertical();
    const diagonalWin = this.checkDiagonal();

    if (horizontalWin.winner) {
      this.value = horizontalWin.winner;
      this.drawLine(horizontalWin.firstCell!, horizontalWin.lastCell!);
      this.putBigValue();
    }
    if (verticalWin.winner) {
      this.value = verticalWin.winner;
      this.drawLine(verticalWin.firstCell!, verticalWin.lastCell!);
      this.putBigValue();
    }
    if (diagonalWin.winner) {
      this.value = diagonalWin.winner;
      this.drawLine(diagonalWin.firstCell!, diagonalWin.lastCell!);
      this.putBigValue();
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

  drawLine(firstCell: Cell, lastCell: Cell) {
    const lineElement = document.createElement("div");
    const [firstCellClientX, firstCellClientY] = [
      firstCell.element.offsetLeft + firstCell.element.clientWidth / 2,
      firstCell.element.offsetTop + firstCell.element.clientHeight / 2,
    ];
    const [lastCellClientX, lastCellClientY] = [
      lastCell.element.offsetLeft + lastCell.element.clientWidth / 2,
      lastCell.element.offsetTop + lastCell.element.clientHeight / 2,
    ];
    const distance = Math.sqrt(
      Math.pow(firstCellClientX - lastCellClientX, 2) +
        Math.pow(firstCellClientY - lastCellClientY, 2)
    );

    lineElement.style.width = `${distance}px`;
    lineElement.style.transform = `rotate(${Math.atan2(
      lastCellClientY - firstCellClientY,
      lastCellClientX - firstCellClientX
    )}rad)`;
    lineElement.style.top = `${firstCellClientY}px`;
    lineElement.style.left = `${firstCellClientX}px`;
    lineElement.classList.add(
      "origin-left",
      "absolute",
      "border-amber-500",
      "border-2",
      "rounded-full",
      "z-10"
    );
    this.element.appendChild(lineElement);
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
      "text-9xl",
      "font-bold",
      "text-white",
      "bg-amber-500/20",
      "w-full",
      "h-full",
      "flex",
      "justify-center",
      "items-center",
      "z-20"
    );

    switch (this.value) {
      case "O":
        bigValueElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z"/></svg>`;
        break;
      case "X":
        bigValueElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m13.41 12l6.3-6.29a1 1 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1 1 0 0 0-1.42 1.42l6.3 6.29l-6.3 6.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l6.29-6.3l6.29 6.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"/></svg>`;
        break;
      default:
        bigValueElement.innerHTML = "";
        break;
    }

    this.element.appendChild(bigValueElement);
  }
}

class Board {
  public element: HTMLDivElement;
  private board: Array<Array<MasterCell>>;
  public currentTurn: "X" | "O";

  constructor(boardElement: HTMLDivElement) {
    this.element = boardElement;
    this.currentTurn = "X";

    this.board = Array<Array<MasterCell>>();
    for (let i = 0; i < 3; i++) {
      this.board[i] = Array<MasterCell>();
      for (let j = 0; j < 3; j++) {
        this.board[i][j] = new MasterCell(this, i, j);
      }
    }

    this.initElement();
  }

  initElement() {
    this.element.classList.add("grid", "grid-cols-3", "grid-rows-3");
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === "X" ? "O" : "X";
  }
}

const game = new Board(board);
