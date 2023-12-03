import Board from "./board";
import "./style.css";

const board = document.getElementById("board") as HTMLDivElement;
const currentPlayerIndicator = document.getElementById(
  "current-player"
) as HTMLSpanElement;
const endGameScreen = document.getElementById(
  "endgame-screen"
) as HTMLDivElement;
const resetButton = document.getElementById(
  "reset-button"
) as HTMLButtonElement;

new Board(board, currentPlayerIndicator, endGameScreen, resetButton);
