"use client"

import type { ChessPiece, Position } from "@/lib/chess-types"
import ChessPieceComponent from "./chess-piece"

interface ChessBoardProps {
  board: (ChessPiece | null)[][]
  selectedPiece: Position | null
  validMoves: Position[]
  onSquareClick: (position: Position) => void
}

export default function ChessBoard({ board, selectedPiece, validMoves, onSquareClick }: ChessBoardProps) {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col)
  }

  const isSelected = (row: number, col: number) => {
    return selectedPiece?.row === row && selectedPiece?.col === col
  }

  return (
    <div className="grid grid-cols-8 border-2 border-gray-800 shadow-lg w-full max-w-[35rem] md:max-w-[40rem] lg:max-w-[45rem]">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 === 0
          const squareColor = isLight ? "bg-amber-100" : "bg-amber-800"
          const isHighlighted = isSelected(rowIndex, colIndex)
          const isValidMoveSquare = isValidMove(rowIndex, colIndex)

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center relative
                ${squareColor}
                ${isHighlighted ? "ring-4 ring-blue-500 ring-inset" : ""}
                ${isValidMoveSquare ? "cursor-pointer" : ""}
              `}
              onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
            >
              {/* Valid move indicator */}
              {isValidMoveSquare && (
                <div className={`absolute inset-0 flex items-center justify-center ${piece ? "bg-red-500/30" : ""}`}>
                  {!piece && <div className="w-3 h-3 rounded-full bg-gray-500/50"></div>}
                </div>
              )}

              {/* Chess piece */}
              {piece && <ChessPieceComponent piece={piece} />}
            </div>
          )
        }),
      )}
    </div>
  )
}

