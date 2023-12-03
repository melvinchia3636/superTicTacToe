import Board from "./board";
import "./style.css";

const board = document.getElementById("board") as HTMLDivElement;

new Board(board);
