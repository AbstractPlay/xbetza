export type Geometry = "square" | "hex" | string;

export type Delta = [number, number];
export type DeltaSet = Delta[];

export type Piece = {
  id: string;
  xbetza: string;
  name?: string;
  geometry?: Geometry;
};

export type ParsedPiece = Piece & {
  atoms: MoveAtom[];
};

export type Direction = [number, number];

export type Orthogonal = "N" | "E" | "S" | "W";
export type Diagonal = "NE" | "SE" | "SW" | "NW";

export type SlideSymbol =
  | "R" // rook
  | "B" // bishop
  | "Q" // queen
  | "W" // wazir (orthogonal step)
  | "F" // ferz (diagonal step)
  | "D" // dabbaba slide? (rare but allowed)
  | "A" // alfil slide? (rare but allowed)
  | string; // custom slide

export type LeapSymbol =
  | "N" // knight
  | "D" // dabbaba
  | "A" // alfil
  | "H" // camel
  | string; // custom leap

export type HopSymbol =
  | "g" // grasshopper
  | "h" // locust
  | string; // custom hop

export interface Modifiers {
  t?: boolean; // take and continue
  u?: boolean; // unblockable
  o?: boolean; // must capture first
  x?: boolean; // must not capture first
  y?: boolean; // capture then leap
  p?: boolean; // requires clear path
  z?: boolean; // zig-zag
  g?: boolean; // grasshopper movement
  h?: boolean; // locust movement
  m?: boolean; // move only
  c?: boolean; // capture only
}

export type MoveAtom = {
  kind: "leap" | "slide" | "hop";

  deltas: Direction[]; // resolved geometry directions
  maxSteps: number; // ∞ for slides, 1 for leaps, 1 for hops

  hopCount: number; // 0 = normal, 1 = grasshopper/locust, >1 = cannon
  hopStyle?: "cannon" | "grasshopper";

  moveOnly: boolean; // m
  captureOnly: boolean; // c

  directionsRestricted: boolean;
  allowedDirections?: Direction[];

  requiresClearPath: boolean; // p
  againRider: boolean; // a

  zigzag?: boolean; // z
  takeAndContinue?: boolean; // t
  unblockable?: boolean; // u
  mustCaptureFirst?: boolean; // o
  mustNotCaptureFirst?: boolean; // x
  captureThenLeap?: boolean; // y
};

export type SquareKind = "empty" | "friendly" | "enemy";

export type SquareState = {
  kind: SquareKind;
  piece?: string;
};

export type BoardState = {
  width: number;
  height: number;
  get(x: number, y: number): SquareState | undefined;
};

export type PathSquare = {
  x: number;
  y: number;
  sq: SquareState | undefined;
};
