import { expect } from "chai";
import { GeometryContext } from "../../src/Geometry";

export const squareCtx: GeometryContext = {
  boardWidth: 8,
  boardHeight: 8,
  wrapFiles: false,
  wrapRanks: false,
};

export const hexCtx: GeometryContext = {
  boardWidth: 9,
  boardHeight: 9,
  wrapFiles: false,
  wrapRanks: false,
};

export interface Coord {
  file: number;
  rank: number;
}

export function expectCoord(
  actual: Coord | null,
  file: number,
  rank: number
): void {
  expect(actual).to.not.equal(null);
  expect(actual).to.deep.equal({ file, rank });
}
