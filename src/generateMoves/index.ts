import { generateHopMoves } from "./generateHopMoves";
import { generateLeapMoves } from "./generateLeapMoves";
import { generateSlideMoves } from "./generateSlideMoves";

import type { MoveAtom, BoardState, PathSquare } from "../types";

export function generateMoves(
  piece: { atoms: MoveAtom[] },
  x: number,
  y: number,
  board: BoardState,
): Array<[number, number]> {
  const results: Array<[number, number]> = [];

  for (const atom of piece.atoms) {
    switch (atom.kind) {
      case "leap":
        generateLeapMoves(atom, x, y, board, results);
        break;

      case "slide":
        generateSlideMoves(atom, x, y, board, results);
        break;

      case "hop":
        generateHopMoves(atom, x, y, board, results);
        break;
    }
  }

  return results;
}

export function handleCaptureThenLeap(
  path: PathSquare[],
  atom: MoveAtom,
  board: BoardState,
): PathSquare[] {
  // 1. Find the first enemy square in the path
  const capture = path.find((sq) => sq.sq?.kind === "enemy");
  if (!capture) return []; // no capture → no second leap

  const results: PathSquare[] = [];

  // 2. From the capture square, perform a normal leap using atom.deltas
  for (const [dx, dy] of atom.deltas) {
    const nx = capture.x + dx;
    const ny = capture.y + dy;

    const sq = board.get(nx, ny);
    if (!sq) continue; // off board

    // must obey moveOnly / captureOnly semantics
    if (sq.kind === "empty" && !atom.captureOnly) {
      results.push({ x: nx, y: ny, sq });
    }

    if (sq.kind === "enemy" && !atom.moveOnly) {
      results.push({ x: nx, y: ny, sq });
    }
  }

  return results;
}
