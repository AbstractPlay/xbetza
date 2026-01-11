import type { BoardState, SquareState } from "../src/types";
import type { GeometryContext } from "../src/Geometry";

export const EMPTY: SquareState = { kind: "empty" };
export const FRIEND: SquareState = { kind: "friendly" };
export const ENEMY: SquareState = { kind: "enemy" };

export function boardFromGrid(rows: string[]): BoardState {
  const height = rows.length;
  const width = rows[0].length;

  return {
    width,
    height,
    get(x, y) {
      if (x < 0 || x >= width) return undefined;
      if (y < 0 || y >= height) return undefined;

      const c = rows[y][x];
      if (c === ".") return EMPTY;
      if (c === "F") return FRIEND;
      if (c === "E") return ENEMY;
      return EMPTY;
    }
  };
}

export const squareCtx: GeometryContext = {
  boardWidth: 99,
  boardHeight: 99,
  wrapFiles: false,
  wrapRanks: false,
};
