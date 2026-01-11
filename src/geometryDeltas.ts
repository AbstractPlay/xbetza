import type { Geometry, Delta } from "./types";
export type GeometryDeltaTable = Record<string, Delta[]>;

export interface GeometryRegistry {
  [geometry: string]: GeometryDeltaTable;
}

/**
 * Canonical delta tables for all primitive Betza symbols.
 * Compound symbols (WF, WFN, sN, jW, etc.) are handled by the Betza parser.
 */
export const geometryDeltas: GeometryRegistry = {
  // ------------------------------------------------------------
  // SQUARE GEOMETRY (orthodox chessboard)
  // ------------------------------------------------------------
  square: {
    // Orthogonal step (Wazir)
    W: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],

    // Diagonal step (Ferz)
    F: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],

    // Knight
    N: [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ],

    // Dabbaba (2‑orthogonal)
    D: [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ],

    // Alfil (2‑diagonal)
    A: [
      [2, 2],
      [2, -2],
      [-2, 2],
      [-2, -2],
    ],

    // Elephant (3‑diagonal)
    E: [
      [3, 3],
      [3, -3],
      [-3, 3],
      [-3, -3],
    ],

    // Camel (1,3)
    C: [
      [1, 3],
      [3, 1],
      [3, -1],
      [1, -3],
      [-1, -3],
      [-3, -1],
      [-3, 1],
      [-1, 3],
    ],

    // Zebra (2,3)
    Z: [
      [2, 3],
      [3, 2],
      [3, -2],
      [2, -3],
      [-2, -3],
      [-3, -2],
      [-3, 2],
      [-2, 3],
    ],

    // Giraffe (1,4)
    G: [
      [1, 4],
      [4, 1],
      [4, -1],
      [1, -4],
      [-1, -4],
      [-4, -1],
      [-4, 1],
      [-1, 4],
    ],

    // Squirrel (your engine’s definition — placeholder)
    // Replace with your actual S deltas if you have them
    S: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
  },

  // ------------------------------------------------------------
  // HEX GEOMETRY (axial q,r coordinates)
  // ------------------------------------------------------------
  hex: {
    // Hex orthogonal (6 directions)
    W: [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ],

    // Hex diagonal (6 directions)
    F: [
      [2, -1],
      [1, -2],
      [-1, -1],
      [-2, 1],
      [-1, 2],
      [1, 1],
    ],

    // Hex knight (canonical distance‑2)
    N: [
      [2, -1],
      [1, -2],
      [-1, -1],
      [-2, 1],
      [-1, 2],
      [1, 1],
    ],

    // Hex Dabbaba (2‑orthogonal)
    D: [
      [2, 0],
      [2, -2],
      [0, -2],
      [-2, 0],
      [-2, 2],
      [0, 2],
    ],

    // Hex Alfil (2‑diagonal)
    A: [
      [4, -2],
      [2, -4],
      [-2, -2],
      [-4, 2],
      [-2, 4],
      [2, 2],
    ],

    // Hex Elephant (3‑diagonal)
    E: [
      [3, 0],
      [3, -3],
      [0, -3],
      [-3, 0],
      [-3, 3],
      [0, 3],
    ],

    // Hex Camel (1,3) axial equivalents
    C: [
      [1, 3],
      [3, 2],
      [2, -1],
      [-1, -3],
      [-3, -2],
      [-2, 1],
    ],

    // Hex Zebra (2,3) axial equivalents
    Z: [
      [2, 3],
      [3, 1],
      [1, -2],
      [-2, -3],
      [-3, -1],
      [-1, 2],
    ],

    // Hex Giraffe (1,4)
    G: [
      [1, 4],
      [4, 3],
      [3, -1],
      [-1, -4],
      [-4, -3],
      [-3, 1],
    ],

    // Hex Squirrel — undefined unless you define it
    S: [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ],
  },
};

/**
 * Allow users to register custom geometries.
 */
export function registerGeometry(
  geometry: Geometry,
  table: GeometryDeltaTable,
): void {
  geometryDeltas[geometry] = table;
}

export function getGeometryDeltas(
  geometry: Geometry,
): GeometryDeltaTable | undefined {
  return geometryDeltas[geometry];
}
