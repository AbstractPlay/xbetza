import type { MoveAtom, BoardState, PathSquare } from "../types";
import { handleCaptureThenLeap } from ".";

export function generateSlideMoves(
  atom: MoveAtom,
  x: number,
  y: number,
  board: BoardState,
  out: Array<[number, number]>,
) {
  if (!atom.deltasConcrete) return; // geometry not applied

  const path = buildRay(atom, x, y, board);
  let annotated = annotateRay(path, board);

  annotated = applyUnblockable(annotated, atom);
  annotated = applyRequiresClearPath(annotated, atom);
  annotated = applyCaptureRules(annotated, atom, board);

  if (atom.takeAndContinue) {
    annotated = handleTakeAndContinue(annotated);
  }

  const moves = emitMoves(annotated, atom);
  out.push(...moves);
}

function buildRay(
  atom: MoveAtom,
  x: number,
  y: number,
  board: BoardState,
): Array<[number, number]> {
  const ray: Array<[number, number]> = [];

  for (const { df, dr } of atom.deltasConcrete!) {
    let step = 1;

    while (step <= atom.maxSteps) {
      const nx = x + df * step;
      const ny = y + dr * step;

      // stop when leaving the board
      if (!board.get(nx, ny)) break;

      ray.push([nx, ny]);
      step++;
    }
  }

  return ray;
}

function annotateRay(
  ray: Array<[number, number]>,
  board: BoardState,
): PathSquare[] {
  return ray.map(([x, y]) => ({ x, y, sq: board.get(x, y) }));
}

function applyUnblockable(path: PathSquare[], atom: MoveAtom): PathSquare[] {
  if (!atom.unblockable) return path;
  return path; // nothing blocks, so no filtering
}

function applyRequiresClearPath(
  path: PathSquare[],
  atom: MoveAtom,
): PathSquare[] {
  if (!atom.requiresClearPath) return path;

  const out: PathSquare[] = [];
  for (const sq of path) {
    if (!sq.sq || sq.sq.kind !== "empty") break;
    out.push(sq);
  }
  return out;
}

function applyCaptureRules(
  path: PathSquare[],
  atom: MoveAtom,
  board: BoardState,
): PathSquare[] {
  if (atom.captureThenLeap) {
    return handleCaptureThenLeap(path, atom, board);
  }
  if (atom.mustCaptureFirst) {
    return path.filter((s) => s.sq?.kind === "enemy");
  }
  if (atom.mustNotCaptureFirst) {
    return path.filter((s) => s.sq?.kind === "empty");
  }
  return path;
}

function handleTakeAndContinue(path: PathSquare[]): PathSquare[] {
  const out: PathSquare[] = [];

  for (const sq of path) {
    if (!sq.sq) break; // off board
    if (sq.sq.kind === "friendly") break;

    out.push(sq); // empty or enemy both legal

    if (sq.sq.kind === "enemy") {
      continue; // capture → keep sliding
    }

    // empty → keep sliding
  }

  return out;
}

function emitMoves(
  path: PathSquare[],
  atom: MoveAtom,
): Array<[number, number]> {
  const out: Array<[number, number]> = [];

  for (const sq of path) {
    if (!sq.sq) break; // off board

    // ─────────────────────────────────────────────
    // EMPTY SQUARE
    // ─────────────────────────────────────────────
    if (sq.sq.kind === "empty") {
      if (!atom.captureOnly && !atom.mustCaptureFirst) {
        out.push([sq.x, sq.y]);
      }
      // empty never blocks
      continue;
    }

    // ─────────────────────────────────────────────
    // ENEMY SQUARE
    // ─────────────────────────────────────────────
    if (sq.sq.kind === "enemy") {
      if (!atom.moveOnly && !atom.mustNotCaptureFirst) {
        out.push([sq.x, sq.y]);
      }

      // take‑and‑continue: DO NOT STOP
      if (atom.takeAndContinue) {
        continue;
      }

      // unblockable: DO NOT STOP
      if (atom.unblockable) {
        continue;
      }

      // normal slider: stop after capture
      break;
    }

    // ─────────────────────────────────────────────
    // FRIENDLY SQUARE
    // ─────────────────────────────────────────────
    if (sq.sq.kind === "friendly") {
      // cannot land on friendly

      // unblockable: skip but continue
      if (atom.unblockable) {
        continue;
      }

      // normal slider: blocked
      break;
    }
  }

  return out;
}
