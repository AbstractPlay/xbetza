import type { BoardState, MoveAtom } from "./types";
import {
  generateHopMoves,
  generateLeapMoves,
  generateSlideMoves,
} from "./generateMoves/index";

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
