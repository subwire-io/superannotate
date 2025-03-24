"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RotateCw, Crown, AlertTriangle, Info, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMobile } from "@/hooks/use-mobile"

// Types for our game
type Player = "red" | "black"
type Piece = {
  player: Player
  isKing: boolean
  id: string
}
type Cell = Piece | null
type Board = Cell[][]
type Position = {
  row: number
  col: number
}
type GameHistory = {
  board: Board
  currentPlayer: Player
}[]

// Initial board setup
const createInitialBoard = (): Board => {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Place black pieces (top of board)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = {
          player: "black",
          isKing: false,
          id: `black-${row}-${col}`,
        }
      }
    }
  }

  // Place red pieces (bottom of board)
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = {
          player: "red",
          isKing: false,
          id: `red-${row}-${col}`,
        }
      }
    }
  }

  return board
}

export default function CheckersGame() {
  const [board, setBoard] = useState<Board>(createInitialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>("red")
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [gameStatus, setGameStatus] = useState<string>("")
  const [capturedPieces, setCapturedPieces] = useState<{ red: number; black: number }>({ red: 0, black: 0 })
  const [history, setHistory] = useState<GameHistory>([{ board: createInitialBoard(), currentPlayer: "red" }])
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const [multiJump, setMultiJump] = useState<boolean>(false)
  const [lastJumpedPosition, setLastJumpedPosition] = useState<Position | null>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Reset the game
  const resetGame = () => {
    const initialBoard = createInitialBoard()
    setBoard(initialBoard)
    setCurrentPlayer("red")
    setSelectedPiece(null)
    setValidMoves([])
    setGameStatus("")
    setCapturedPieces({ red: 0, black: 0 })
    setHistory([{ board: initialBoard, currentPlayer: "red" }])
    setHistoryIndex(0)
    setMultiJump(false)
    setLastJumpedPosition(null)

    toast({
      title: "Game Reset",
      description: "A new game has started. Red moves first.",
    })
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

    // Check both jump moves and regular moves
    const jumpMoves: Position[] = []
    const regularMoves: Position[] = []

    // Check for jump moves
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
        jumpMoves.push({ row: jumpRow, col: jumpCol })
      }
    }

    // Check for regular moves
    for (const dir of directions) {
      const newRow = row + dir.rowOffset
      const newCol = col + dir.colOffset

      if (isValidPosition(newRow, newCol) && board[newRow][newCol] === null) {
        regularMoves.push({ row: newRow, col: newCol })
      }
    }

    // Return both jump moves and regular moves
    return [...jumpMoves, ...regularMoves]
  }

  // Handle piece selection
  const handleCellClick = (row: number, col: number) => {
    // If game is over, don't allow any moves
    if (gameStatus) return

    // If no piece is selected and the cell contains a piece of the current player
    if (selectedPiece === null && board[row][col] && board[row][col]?.player === currentPlayer) {
      // Get all valid moves for this piece
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
      } else if (board[row][col]?.player === currentPlayer) {
        // If clicking on another piece of the same player, select that piece instead
        const moves = getValidMoves(row, col)
        setSelectedPiece({ row, col })
        setValidMoves(moves)
      } else {
        // Deselect the piece if clicking on an invalid move
        setSelectedPiece(null)
        setValidMoves([])
      }
    }
  }

  // Move a piece from one position to another
  const movePiece = (from: Position, to: Position) => {
    const newBoard = JSON.parse(JSON.stringify(board))
    const piece = newBoard[from.row][from.col]

    if (!piece) return

    // Check if this is a jump move
    const isJump = Math.abs(to.row - from.row) === 2 && Math.abs(to.col - from.col) === 2

    if (isJump) {
      // Remove the jumped piece
      const jumpedRow = (from.row + to.row) / 2
      const jumpedCol = (from.col + to.col) / 2
      const jumpedPiece = newBoard[jumpedRow][jumpedCol]

      if (jumpedPiece) {
        // Update captured pieces count
        setCapturedPieces((prev) => ({
          ...prev,
          [jumpedPiece.player]: prev[jumpedPiece.player] + 1,
        }))

        // Remove the jumped piece
        newBoard[jumpedRow][jumpedCol] = null
      }
    }

    // Move the piece
    newBoard[to.row][to.col] = piece
    newBoard[from.row][from.col] = null

    // Check for king promotion
    if ((piece.player === "black" && to.row === 7) || (piece.player === "red" && to.row === 0)) {
      newBoard[to.row][to.col] = { ...piece, isKing: true }

      toast({
        title: "King Promotion!",
        description: `${piece.player.charAt(0).toUpperCase() + piece.player.slice(1)} piece promoted to king!`,
      })
    }

    // Update the board state
    setBoard(newBoard)

    // End the turn and switch players
    setMultiJump(false)
    setLastJumpedPosition(null)
    setSelectedPiece(null)
    setValidMoves([])

    // Save game state to history
    const newHistory = history.slice(0, historyIndex + 1)
    const nextPlayer = currentPlayer === "black" ? "red" : "black"
    newHistory.push({
      board: JSON.parse(JSON.stringify(newBoard)),
      currentPlayer: nextPlayer,
    })
    setHistory(newHistory)
    setHistoryIndex(historyIndex + 1)

    // Check if the game is over
    const gameOver = checkGameOver(newBoard, nextPlayer)
    if (gameOver) {
      setGameStatus(`${currentPlayer.toUpperCase()} wins!`)
      toast({
        title: "Game Over!",
        description: `${currentPlayer.toUpperCase()} wins the game!`,
      })
    } else {
      // Switch players
      setCurrentPlayer(nextPlayer)
    }
  }

  // Check if the game is over
  const checkGameOver = (board: Board, nextPlayer: Player): boolean => {
    // Check if the next player has any pieces left
    let hasPieces = false
    let hasValidMoves = false

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col]?.player === nextPlayer) {
          hasPieces = true

          // Check if this piece has any valid moves
          const moves = getValidMoves(row, col)
          if (moves.length > 0) {
            hasValidMoves = true
            break
          }
        }
      }
      if (hasPieces && hasValidMoves) break
    }

    return (hasPieces && !hasValidMoves) || !hasPieces
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus) return // Don't allow keyboard navigation if game is over

      if (e.key === "Escape") {
        setSelectedPiece(null)
        setValidMoves([])
        return
      }

      if (!selectedPiece) return

      if (e.key === "Enter" || e.key === " ") {
        // If a piece is selected and there's only one valid move, make that move
        if (validMoves.length === 1) {
          movePiece(selectedPiece, validMoves[0])
        }
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedPiece, validMoves, gameStatus])

  // Calculate the cell size to ensure the board is perfectly square and centered
  const getCellSize = () => {
    if (!isMobile) return "w-14 h-14"

    // For mobile, we want to make sure all 8 cells fit perfectly
    return "w-[calc(100%/8)] h-[calc(100%/8)]"
  }

  // Render the board
  return (
    <Card className="w-full max-w-2xl bg-white shadow-xl">
      <CardHeader className="pb-2 mb-3">
        <CardTitle className={cn("flex items-center justify-between", isMobile ? "flex-col gap-2" : "flex-row")}>
          <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-md shadow-sm">
            <div
              className={cn(
                "w-4 h-4 rounded-full mr-2 border-2",
                currentPlayer === "red" ? "bg-red-600 border-red-300" : "bg-black border-gray-400",
              )}
            />
            <span className="font-bold text-base">
              {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn
            </span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="border-2 border-gray-400 hover:border-gray-600 shadow-md px-4 py-1.5 h-auto transition-all"
                variant="outline"
                size="sm"
              >
                <RotateCw className="mr-1 h-3.5 w-3.5" /> Reset Game
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Game</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset the game?
                  <br />
                  All progress will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetGame}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center pt-0 px-0 md:px-6">
        {gameStatus && (
          <div className="mb-3 text-base font-bold text-green-600 flex items-center">
            <AlertTriangle className="mr-1.5 h-4 w-4" />
            {gameStatus}
          </div>
        )}

        {multiJump && (
          <div className="mb-3 text-amber-600 flex items-center text-xs">
            <Info className="mr-1.5 h-3.5 w-3.5" />
            Multi-jump in progress! Continue jumping with the same piece.
          </div>
        )}

        <div className="flex justify-center items-center w-full">
          <div className="border-2 border-gray-800 rounded overflow-hidden aspect-square w-full max-w-md">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex w-full h-[12.5%]">
                {row.map((cell, colIndex) => {
                  const isBlackCell = (rowIndex + colIndex) % 2 === 1
                  const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
                  const isValidMove = validMoves.some((move) => move.row === rowIndex && move.col === colIndex)

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "flex items-center justify-center transition-colors w-[12.5%] h-full",
                        isBlackCell ? "bg-gray-700" : "bg-gray-300",
                        isSelected && "bg-purple-500",
                        isValidMove && "bg-green-500",
                        "hover:opacity-90 cursor-pointer",
                      )}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Cell ${rowIndex}, ${colIndex}${cell ? ` with ${cell.player} piece` : ""}`}
                    >
                      {cell && (
                        <div
                          className={cn(
                            "rounded-full border-2 flex items-center justify-center transition-transform",
                            "w-[75%] h-[75%]",
                            cell.player === "red" ? "bg-red-600 border-red-300" : "bg-black border-gray-400",
                            isSelected && "scale-110",
                            "hover:scale-105",
                          )}
                        >
                          {cell.isKing && <Crown className={cn("text-white", "h-[50%] w-[50%]")} />}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col pt-0 pb-3">
        <div className="mt-0.5 text-xs text-gray-600 space-y-1 px-4 md:px-0">
          <div className="flex items-start">
            <ChevronRight className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            <p>Click on your piece to select it, then click on a highlighted square to move.</p>
          </div>
          <div className="flex items-start">
            <ChevronRight className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            <p>Capture opponent pieces by jumping over them. Multiple jumps in a row are not allowed.</p>
          </div>
          <div className="flex items-start">
            <ChevronRight className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            <p>
              Reach the opposite end of the board to crown your piece as a king that can move in any diagonal direction.
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

