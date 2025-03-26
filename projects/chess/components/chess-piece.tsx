import { type ChessPiece, PieceType, Color } from "@/lib/chess-types"

interface ChessPieceProps {
  piece: ChessPiece
}

export default function ChessPieceComponent({ piece }: ChessPieceProps) {
  const getPieceSymbol = () => {
    const { type, color } = piece

    switch (type) {
      case PieceType.King:
        return color === Color.White ? "♔" : "♚"
      case PieceType.Queen:
        return color === Color.White ? "♕" : "♛"
      case PieceType.Rook:
        return color === Color.White ? "♖" : "♜"
      case PieceType.Bishop:
        return color === Color.White ? "♗" : "♝"
      case PieceType.Knight:
        return color === Color.White ? "♘" : "♞"
      case PieceType.Pawn:
        return color === Color.White ? "♙" : "♟"
      default:
        return ""
    }
  }

  return <div className="text-4xl select-none">{getPieceSymbol()}</div>
}

