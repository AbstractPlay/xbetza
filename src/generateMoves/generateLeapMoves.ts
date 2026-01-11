import type { MoveAtom, BoardState, PathSquare } from "../types";
import { handleCaptureThenLeap } from ".";

export function generateLeapMoves(
  atom: MoveAtom,
  x: number,
  y: number,
  board: BoardState,
  out: Array<[number, number]>,
) {
  if (!atom.deltasConcrete) return; // geometry not applied

  const targets = buildLeapTargets(atom, x, y);
  let annotated = annotateLeapTargets(targets, board);
  annotated = applyLeapModifiers(annotated, atom, board);
  out.push(...emitLeapMoves(annotated));
}

function buildLeapTargets(
  atom: MoveAtom,
  x: number,
  y: number,
): Array<[number, number]> {
  return atom.deltasConcrete!.map(({ df, dr }) => [x + df, y + dr]);
}

function annotateLeapTargets(
  targets: Array<[number, number]>,
  board: BoardState,
): PathSquare[] {
  return targets.map(([x, y]) => ({ x, y, sq: board.get(x, y) }));
}

function applyLeapModifiers(
  path: PathSquare[],
  atom: MoveAtom,
  board: BoardState,
): PathSquare[] {
  // capture-then-leap overrides everything
  if (atom.captureThenLeap) {
    return handleCaptureThenLeap(path, atom, board);
  }

  return path.filter((sq) => {
    if (!sq.sq) return false; // off board

    if (sq.sq.kind === "friendly") return false;

    if (sq.sq.kind === "empty") {
      if (atom.captureOnly) return false;
      if (atom.mustCaptureFirst) return false;
      return true;
    }

    if (sq.sq.kind === "enemy") {
      if (atom.moveOnly) return false;
      if (atom.mustNotCaptureFirst) return false;
      return true;
    }

    return false;
  });
}

function emitLeapMoves(path: PathSquare[]): Array<[number, number]> {
  return path.map((sq) => [sq.x, sq.y]);
}
