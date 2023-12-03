import Cell from "./cell";
import { COLOR, ICON } from "./constants";
import MasterCell from "./masterCell";
import drawLine, {
  checkDiagonal,
  checkHorizontal,
  checkVertical,
} from "./utils";

export default class Board {
  public element: HTMLDivElement;
  private currentPlayerIndicator: HTMLSpanElement;
  private endGameScreen: HTMLDivElement;
  private resetButton: HTMLButtonElement;

  public cells: Array<Array<MasterCell>>;
  public currentTurn: "X" | "O";
  public lastPlacedCell: Cell | null = null;

  constructor(
    boardElement: HTMLDivElement,
    currentPlayerIndicator: HTMLSpanElement,
    endGameScreen: HTMLDivElement,
    resetButton: HTMLButtonElement
  ) {
    this.element = boardElement;
    this.currentPlayerIndicator = currentPlayerIndicator;
    this.endGameScreen = endGameScreen;
    this.resetButton = resetButton;

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
    this.endGameScreen.classList.remove("flex");
    this.endGameScreen.classList.add("hidden");
    this.updatePlayerIndicator();

    this.resetButton.addEventListener("click", this.reset.bind(this));
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === "X" ? "O" : "X";
    this.updatePlayerIndicator();

    if (this.lastPlacedCell) {
      if (
        this.cells[this.lastPlacedCell.coordinates.x][
          this.lastPlacedCell.coordinates.y
        ].value ||
        this.cells[this.lastPlacedCell.coordinates.x][
          this.lastPlacedCell.coordinates.y
        ].cells.every((row) => row.every((cell) => cell.value))
      ) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) this.cells[i][j].enable();
        }
        return;
      }

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (
            i === this.lastPlacedCell.coordinates.x &&
            j === this.lastPlacedCell.coordinates.y
          ) {
            this.cells[i][j].enable();
            continue;
          }
          this.cells[i][j].disable();
        }
      }
    }
  }

  checkWin(): boolean {
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

      this.showEndGameScreen(winner.winner as "X" | "O");
    }

    return Boolean(winner);
  }

  updatePlayerIndicator() {
    this.currentPlayerIndicator.classList.remove(
      "text-blue-500",
      "text-rose-500"
    );

    this.currentPlayerIndicator.classList.add(COLOR[this.currentTurn].text);

    this.currentPlayerIndicator.innerHTML = ICON[this.currentTurn];
  }

  showEndGameScreen(winner: "X" | "O") {
    const winnerIndicator = this.endGameScreen.querySelector("#winner");
    const resetButton = this.endGameScreen.querySelector(
      "#restart-button"
    ) as HTMLDivElement;

    this.endGameScreen.classList.remove(COLOR.O.bg, COLOR.X.bg);
    this.endGameScreen.classList.add(COLOR[winner].bg);

    this.endGameScreen.classList.remove("hidden");
    this.endGameScreen.classList.add("flex");

    winnerIndicator!.innerHTML = ICON[winner];

    resetButton.addEventListener("click", () => {
      this.endGameScreen.classList.remove("flex");
      this.endGameScreen.classList.add("hidden");
      this.reset();
    });

    resetButton.classList.remove(COLOR.O.text, COLOR.X.text);
    resetButton.classList.add(COLOR[winner].text);
  }

  reset() {
    this.lastPlacedCell = null;
    this.currentTurn = "X";
    this.element.innerHTML = "";
    this.updatePlayerIndicator();
    this.cells.forEach((row) => row.forEach((cell) => cell.reset()));

    this.initElement();
  }
}
