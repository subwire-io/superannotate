export enum PieceType {
  King = "king",
  Queen = "queen",
  Rook = "rook",
  Bishop = "bishop",
  Knight = "knight",
  Pawn = "pawn",
}

export enum Color {
  White = "white",
  Black = "black",
}

export interface Position {
  row: number
  col: number
}

export interface ChessPiece {
  type: PieceType
  color: Color
  hasMoved?: boolean
}

export const initialBoardState: (ChessPiece | null)[][] = [
  [
    { type: PieceType.Rook, color: Color.Black },
    { type: PieceType.Knight, color: Color.Black },
    { type: PieceType.Bishop, color: Color.Black },
    { type: PieceType.Queen, color: Color.Black },
    { type: PieceType.King, color: Color.Black },
    { type: PieceType.Bishop, color: Color.Black },
    { type: PieceType.Knight, color: Color.Black },
    { type: PieceType.Rook, color: Color.Black },
  ],
  Array(8)
    .fill(null)
    .map(() => ({ type: PieceType.Pawn, color: Color.Black })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8)
    .fill(null)
    .map(() => ({ type: PieceType.Pawn, color: Color.White })),
  [
    { type: PieceType.Rook, color: Color.White },
    { type: PieceType.Knight, color: Color.White },
    { type: PieceType.Bishop, color: Color.White },
    { type: PieceType.Queen, color: Color.White },
    { type: PieceType.King, color: Color.White },
    { type: PieceType.Bishop, color: Color.White },
    { type: PieceType.Knight, color: Color.White },
    { type: PieceType.Rook, color: Color.White },
  ],
]

