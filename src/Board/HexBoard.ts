import type { SquareState, SquareKind } from "../types";

export interface HexBoardOptions {
  wrapQ?: boolean;
  wrapR?: boolean;
}

export class HexBoard {
  private grid: Map<string, SquareState>;
  private width: number;
  private height: number;

  private wrapQ: boolean;
  private wrapR: boolean;

  constructor(rows: (string | SquareState[])[], options: HexBoardOptions = {}) {
    this.grid = new Map();

    this.wrapQ = options.wrapQ ?? false;
    this.wrapR = options.wrapR ?? false;

    this.height = rows.length;
    this.width =
      typeof rows[0] === "string"
        ? (rows[0] as string).length
        : (rows[0] as SquareState[]).length;

    // Convert rectangular input into axial coordinates
    // q = column, r = row
    for (let r = 0; r < this.height; r++) {
      const row = rows[r];

      if (typeof row === "string") {
        for (let q = 0; q < row.length; q++) {
          const c = row[q];
          if (c === ".") this.grid.set(`${q},${r}`, { kind: "empty" });
          else if (c === "F") this.grid.set(`${q},${r}`, { kind: "friendly" });
          else if (c === "E") this.grid.set(`${q},${r}`, { kind: "enemy" });
          else this.grid.set(`${q},${r}`, { kind: "empty" });
        }
      } else {
        const cells = row as SquareState[];
        for (let q = 0; q < cells.length; q++) {
          this.grid.set(`${q},${r}`, cells[q]);
        }
      }
    }
  }

  private key(q: number, r: number): string {
    return `${q},${r}`;
  }

  /**
   * Normalize axial coordinates according to wrapQ / wrapR.
   */
  private resolve(q: number, r: number): { q: number; r: number } | null {
    let nq = q;
    let nr = r;

    if (this.wrapQ) {
      nq = ((q % this.width) + this.width) % this.width;
    } else {
      if (q < 0 || q >= this.width) return null;
    }

    if (this.wrapR) {
      nr = ((r % this.height) + this.height) % this.height;
    } else {
      if (r < 0 || r >= this.height) return null;
    }

    return { q: nq, r: nr };
  }

  /**
   * Returns the square at (q, r), or undefined if off-board.
   */
  get(q: number, r: number): SquareState | undefined {
    const pos = this.resolve(q, r);
    if (!pos) return undefined;

    return this.grid.get(this.key(pos.q, pos.r));
  }

  /**
   * Sets a square to ".", "F", "E", or a custom piece object.
   */
  set(
    q: number,
    r: number,
    value: "." | "F" | "E" | { piece: string; kind: SquareKind },
  ): void {
    const pos = this.resolve(q, r);
    if (!pos) return;

    const key = this.key(pos.q, pos.r);

    if (typeof value === "string") {
      if (value === ".") this.grid.set(key, { kind: "empty" });
      if (value === "F") this.grid.set(key, { kind: "friendly" });
      if (value === "E") this.grid.set(key, { kind: "enemy" });
    } else {
      this.grid.set(key, { piece: value.piece, kind: value.kind });
    }
  }

  /**
   * Axial hex boards have width = number of q columns,
   * height = number of r rows.
   */
  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}
