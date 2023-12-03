import { COLOR, ICON } from "./constants";
import MasterCell from "./masterCell";

export default class Cell {
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
      "font-bold"
    );
    if (this.coordinates.y !== 2) this.element.classList.add("border-r");
    if (this.coordinates.x !== 2) this.element.classList.add("border-b");
    this.parent.element.appendChild(this.element);

    this.element.addEventListener("click", this.onClick.bind(this));
  }

  updateElement() {
    if (this.value) {
      this.element.innerHTML = ICON[this.value];
      this.element.classList.add(COLOR[this.value].text);
    }
  }

  onClick() {
    if (this.value) return;
    this.value = this.parent.parent.currentTurn;
    this.parent.parent.lastPlacedCell = this;
    this.updateElement();
    const isFinalWin = this.parent.checkWin();
    if (!isFinalWin) {
      this.parent.parent.switchTurn();
    }
  }

  reset() {
    this.value = null;
    this.element.innerHTML = "";
    this.element.classList.remove(COLOR.O.text, COLOR.X.text);

    this.initElement();
  }
}
