"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

// Types for our game
type Player = "red" | "black"
type Piece = {
  player: Player
  isKing: boolean
}
type Cell = Piece | null
type Board = Cell[][]
type Position = {
  row: number
  col: number
}

// Initial board setup
const createInitialBoard = (): Board => {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Place black pieces (top of board)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { player: "black", isKing: false }
      }
    }
  }

  // Place red pieces (bottom of board)
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { player: "red", isKing: false }
      }
    }
  }

  return board
}

export default function CheckersGame() {
  const [board, setBoard] = useState<Board>(createInitialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>("black")
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [gameStatus, setGameStatus] = useState<string>("")

  // Reset the game
  const resetGame = () => {
    setBoard(createInitialBoard())
    setCurrentPlayer("black")
    setSelectedPiece(null)
    setValidMoves([])
    setGameStatus("")
  }

  // Check if a position is on the board
  const isValidPosition = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  // Get valid moves for a piece
  const getValidMoves = (row: number, col: number): Position[] => {
    const moves: Position[] = []
    const piece = board[row][col]

    if (!piece) return moves

    const directions = []
    // Forward moves (based on player)
    if (piece.player === "black" || piece.isKing) {
      directions.push({ rowOffset: 1, colOffset: -1 }) // Down-left
      directions.push({ rowOffset: 1, colOffset: 1 }) // Down-right
    }
    if (piece.player === "red" || piece.isKing) {
      directions.push({ rowOffset: -1, colOffset: -1 }) // Up-left
      directions.push({ rowOffset: -1, colOffset: 1 }) // Up-right
    }

    // Check regular moves
    for (const dir of directions) {
      const newRow = row + dir.rowOffset
      const newCol = col + dir.colOffset

      if (isValidPosition(newRow, newCol) && board[newRow][newCol] === null) {
        moves.push({ row: newRow, col: newCol })
      }
    }

    // Check jump moves
    for (const dir of directions) {
      const jumpRow = row + dir.rowOffset * 2
      const jumpCol = col + dir.colOffset * 2
      const adjacentRow = row + dir.rowOffset
      const adjacentCol = col + dir.colOffset

      if (
        isValidPosition(jumpRow, jumpCol) &&
        isValidPosition(adjacentRow, adjacentCol) &&
        board[jumpRow][jumpCol] === null &&
        board[adjacentRow][adjacentCol] !== null &&
        board[adjacentRow][adjacentCol]?.player !== piece.player
      ) {
        moves.push({ row: jumpRow, col: jumpCol })
      }
    }

    return moves
  }

  // Handle piece selection
  const handleCellClick = (row: number, col: number) => {
    // If no piece is selected and the cell contains a piece of the current player
    if (selectedPiece === null && board[row][col] && board[row][col]?.player === currentPlayer) {
      const moves = getValidMoves(row, col)
      setSelectedPiece({ row, col })
      setValidMoves(moves)
      return
    }

    // If a piece is already selected
    if (selectedPiece) {
      // Check if the clicked cell is a valid move
      const isValidMove = validMoves.some((move) => move.row === row && move.col === col)

      if (isValidMove) {
        // Move the piece
        movePiece(selectedPiece, { row, col })
      } else {
        // Deselect the piece if clicking on an invalid move
        setSelectedPiece(null)
        setValidMoves([])
      }
    }
  }

  // Move a piece from one position to another
  const movePiece = (from: Position, to: Position) => {
    const newBoard = [...board.map((row) => [...row])]
    const piece = newBoard[from.row][from.col]

    if (!piece) return

    // Check if this is a jump move
    const isJump = Math.abs(to.row - from.row) === 2 && Math.abs(to.col - from.col) === 2

    if (isJump) {
      // Remove the jumped piece
      const jumpedRow = (from.row + to.row) / 2
      const jumpedCol = (from.col + to.col) / 2
      newBoard[jumpedRow][jumpedCol] = null
    }

    // Move the piece
    newBoard[to.row][to.col] = piece
    newBoard[from.row][from.col] = null

    // Check for king promotion
    if ((piece.player === "black" && to.row === 7) || (piece.player === "red" && to.row === 0)) {
      newBoard[to.row][to.col] = { ...piece, isKing: true }
    }

    setBoard(newBoard)
    setSelectedPiece(null)
    setValidMoves([])

    // Check if the game is over
    const gameOver = checkGameOver(newBoard)
    if (gameOver) {
      setGameStatus(`${currentPlayer.toUpperCase()} wins!`)
    } else {
      // Switch players
      setCurrentPlayer(currentPlayer === "black" ? "red" : "black")
    }
  }

  // Check if the game is over
  const checkGameOver = (board: Board): boolean => {
    const nextPlayer = currentPlayer === "black" ? "red" : "black"

    // Check if the next player has any pieces left
    let hasPieces = false
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col]?.player === nextPlayer) {
          hasPieces = true

          // Check if this piece has any valid moves
          const moves = getValidMoves(row, col)
          if (moves.length > 0) {
            return false // Game is not over
          }
        }
      }
    }

    return hasPieces // If they have pieces but no moves, game is over
  }

  // Render the board
  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex items-center justify-between w-full">
          <div className="text-lg font-semibold">
            Current Player:{" "}
            <span className={`text-${currentPlayer === "red" ? "red-600" : "black"}`}>
              {currentPlayer.toUpperCase()}
            </span>
          </div>
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCw className="mr-2 h-4 w-4" /> Reset Game
          </Button>
        </div>

        {gameStatus && <div className="mb-4 text-xl font-bold text-green-600">{gameStatus}</div>}

        <div className="border-2 border-gray-800">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => {
                const isBlackCell = (rowIndex + colIndex) % 2 === 1
                const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
                const isValidMove = validMoves.some((move) => move.row === rowIndex && move.col === colIndex)

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center",
                      isBlackCell ? "bg-gray-700" : "bg-gray-300",
                      isSelected && "bg-blue-400",
                      isValidMove && "bg-green-400",
                    )}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell && (
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full border-2",
                          cell.player === "red" ? "bg-red-600 border-red-300" : "bg-black border-gray-400",
                          "flex items-center justify-center",
                        )}
                      >
                        {cell.isKing && <div className="text-white font-bold text-sm">K</div>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Rules: Click on your piece to select it, then click on a highlighted square to move.</p>
          <p>Capture opponent pieces by jumping over them.</p>
          <p>Reach the opposite end of the board to crown your piece as a king.</p>
        </div>
      </div>
    </Card>
  )
}

