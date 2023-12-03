import Board from "./board";
import Cell from "./cell";
import { COLOR } from "./constants";
import MasterCell from "./masterCell";

export default function drawLine(
  firstCell: MasterCell | Cell,
  lastCell: MasterCell | Cell,
  element: HTMLDivElement,
  width: number
) {
  const lineElement = document.createElement("div");
  const [firstCellClientX, firstCellClientY] = [
    firstCell.element.offsetLeft + firstCell.element.clientWidth / 2,
    firstCell.element.offsetTop + firstCell.element.clientHeight / 2 - width,
  ];
  const [lastCellClientX, lastCellClientY] = [
    lastCell.element.offsetLeft + lastCell.element.clientWidth / 2,
    lastCell.element.offsetTop + lastCell.element.clientHeight / 2 - width,
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
    "rounded-full",
    "z-10",
    COLOR[firstCell.value!].border
  );
  lineElement.style.borderWidth = `${width}px`;
  element.appendChild(lineElement);
}

export function checkHorizontal(object: MasterCell | Board): {
  winner: "X" | "O" | false;
  firstCell: MasterCell | Cell | null;
  lastCell: MasterCell | Cell | null;
} {
  for (let i = 0; i < 3; i++) {
    const first = object.cells[i][0].value;
    if (!first) continue;

    for (let j = 0; j < 3; j++) {
      if (object.cells[i][j].value !== first) break;
      if (j === 2)
        return {
          winner: first,
          firstCell: object.cells[i][0],
          lastCell: object.cells[i][2],
        };
    }
  }

  return {
    winner: false,
    firstCell: null,
    lastCell: null,
  };
}

export function checkVertical(object: MasterCell | Board): {
  winner: "X" | "O" | false;
  firstCell: MasterCell | Cell | null;
  lastCell: MasterCell | Cell | null;
} {
  for (let i = 0; i < 3; i++) {
    const first = object.cells[0][i].value;
    if (!first) continue;

    for (let j = 0; j < 3; j++) {
      if (object.cells[j][i].value !== first) break;
      if (j === 2)
        return {
          winner: first,
          firstCell: object.cells[0][i],
          lastCell: object.cells[2][i],
        };
    }
  }

  return {
    winner: false,
    firstCell: null,
    lastCell: null,
  };
}

export function checkDiagonal(object: MasterCell | Board): {
  winner: "X" | "O" | false;
  firstCell: MasterCell | Cell | null;
  lastCell: MasterCell | Cell | null;
} {
  const first = object.cells[0][0].value;
  if (first) {
    if (
      object.cells[1][1].value === first &&
      object.cells[2][2].value === first
    ) {
      return {
        winner: first,
        firstCell: object.cells[0][0],
        lastCell: object.cells[2][2],
      };
    }
  }

  const second = object.cells[0][2].value;
  if (second) {
    if (
      object.cells[1][1].value === second &&
      object.cells[2][0].value === second
    ) {
      return {
        winner: second,
        firstCell: object.cells[0][2],
        lastCell: object.cells[2][0],
      };
    }
  }

  return {
    winner: false,
    firstCell: null,
    lastCell: null,
  };
}
