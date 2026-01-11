import builtinPieces from "./pieces.json";
import type { Piece } from "./types";

export class PieceRegistry {
  private pieces = new Map<string, Piece>();

  constructor() {
    this.loadBuiltinPieces();
  }

  private loadBuiltinPieces() {
    for (const p of builtinPieces.pieces) {
      this.registerPiece(p.id, {
        id: p.id,
        name: p.name,
        xbetza: p.xbetza,
      });
    }
  }

  registerPiece(id: string, def: Piece) {
    this.pieces.set(id, def);
  }

  getPiece(id: string): Piece | undefined {
    return this.pieces.get(id);
  }

  /**
   * Returns the Betza string for this piece.
   * Geometry-aware deltas are handled by the Betza parser.
   */
  getBetza(id: string): string | undefined {
    return this.pieces.get(id)?.xbetza;
  }
}
