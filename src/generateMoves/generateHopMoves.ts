import type { MoveAtom, BoardState, PathSquare } from "../types";
import { handleCaptureThenLeap } from ".";

export function generateHopMoves(
  atom: MoveAtom,
  x: number,
  y: number,
  board: BoardState,
  out: Array<[number, number]>,
) {
  if (!atom.deltasConcrete) return; // geometry not applied

  for (const { df, dr } of atom.deltasConcrete) {
    const ray = buildHopRayDirection(atom, x, y, df, dr, board);
    const annotated = annotateHopRay(ray, board);
    let landing = handleHopLogic(annotated, atom, board, df, dr);

    if (atom.captureThenLeap) {
      landing = handleCaptureThenLeap(landing, atom, board);
    }

    out.push(...emitHopMoves(landing));
  }
}

function buildHopRayDirection(
  atom: MoveAtom,
  x: number,
  y: number,
  df: number,
  dr: number,
  board: BoardState,
): Array<[number, number]> {
  const ray: Array<[number, number]> = [];
  let step = 1;

  while (step <= atom.maxSteps) {
    const nx = x + df * step;
    const ny = y + dr * step;

    if (!board.get(nx, ny)) break; // off board

    ray.push([nx, ny]);
    step++;
  }

  return ray;
}

function annotateHopRay(
  ray: Array<[number, number]>,
  board: BoardState,
): PathSquare[] {
  return ray.map(([x, y]) => ({ x, y, sq: board.get(x, y) }));
}

function handleHopLogic(
  path: PathSquare[],
  atom: MoveAtom,
  board: BoardState,
  df: number,
  dr: number,
): PathSquare[] {
  // 1. Find the hurdle
  const hurdle = path.find((sq) => sq.sq && sq.sq.kind !== "empty");
  if (!hurdle) return [];

  // 2. Landing square is one step beyond the hurdle
  const lx = hurdle.x + df;
  const ly = hurdle.y + dr;

  const landingSq = board.get(lx, ly);
  if (!landingSq) return []; // off board

  // 3. Apply capture/move restrictions
  if (landingSq.kind === "friendly") return [];

  if (landingSq.kind === "empty") {
    if (atom.captureOnly) return [];
    return [{ x: lx, y: ly, sq: landingSq }];
  }

  if (landingSq.kind === "enemy") {
    if (atom.moveOnly) return [];
    return [{ x: lx, y: ly, sq: landingSq }];
  }

  return [];
}

function emitHopMoves(path: PathSquare[]): Array<[number, number]> {
  return path.map((sq) => [sq.x, sq.y]);
}
