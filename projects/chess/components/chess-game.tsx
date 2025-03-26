"use client"

import { useState, useEffect } from "react"
import ChessBoard from "./chess-board"
import GameInfo from "./game-info"
import { initialBoardState, PieceType, Color, type Position, type ChessPiece } from "@/lib/chess-types"
import { isValidMove, getValidMoves, makeMove, isCheck, isCheckmate } from "@/lib/chess-logic"

export default function ChessGame() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initialBoardState)
  const [currentPlayer, setCurrentPlayer] = useState<Color>(Color.White)
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [capturedPieces, setCapturedPieces] = useState<{
    [Color.White]: PieceType[]
    [Color.Black]: PieceType[]
  }>({
    [Color.White]: [],
    [Color.Black]: [],
  })
  const [gameStatus, setGameStatus] = useState<string>("White's Turn") // Initialize with White's Turn
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<{ from: Position; to: Position; piece: ChessPiece } | null>(null)

  // Update valid moves when a piece is selected
  useEffect(() => {
    if (selectedPiece) {
      const moves = getValidMoves(board, selectedPiece, currentPlayer, lastMove)
      setValidMoves(moves)
    } else {
      setValidMoves([])
    }
  }, [selectedPiece, board, currentPlayer, lastMove])

  // Check for check/checkmate after each move
  useEffect(() => {
    if (isCheck(board, currentPlayer)) {
      if (isCheckmate(board, currentPlayer)) {
        setGameStatus(`Checkmate! ${currentPlayer === Color.White ? "Black" : "White"} wins!`)
      } else {
        setGameStatus(`${currentPlayer === Color.White ? "White" : "Black"} is in check!`)
      }
    } else {
      setGameStatus(`${currentPlayer === Color.White ? "White's" : "Black's"} Turn`)
    }
  }, [board, currentPlayer])

  const handleSquareClick = (position: Position) => {
    // If no piece is selected and the clicked square has a piece of the current player's color
    if (!selectedPiece && board[position.row][position.col]?.color === currentPlayer) {
      setSelectedPiece(position)
      return
    }

    // If a piece is already selected
    if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === position.row && selectedPiece.col === position.col) {
        setSelectedPiece(null)
        return
      }

      // If clicking on another piece of the same color, select that piece instead
      if (board[position.row][position.col]?.color === currentPlayer) {
        setSelectedPiece(position)
        return
      }

      // Check if the move is valid
      if (isValidMove(board, selectedPiece, position, currentPlayer, lastMove)) {
        const capturedPiece = board[position.row][position.col]

        // Update captured pieces
        if (capturedPiece) {
          setCapturedPieces((prev) => {
            const oppositeColor = currentPlayer === Color.White ? Color.Black : Color.White
            return {
              ...prev,
              [oppositeColor]: [...prev[oppositeColor], capturedPiece.type],
            }
          })
        }

        // Make the move
        const newBoard = makeMove(board, selectedPiece, position, lastMove)
        setBoard(newBoard)

        setLastMove({
          from: selectedPiece,
          to: position,
          piece: board[selectedPiece.row][selectedPiece.col]!,
        })

        // Add to move history with proper chess notation
        const piece = board[selectedPiece.row][selectedPiece.col]
        let moveNotation = ""

        // Handle castling
        if (piece?.type === PieceType.King && Math.abs(position.col - selectedPiece.col) === 2) {
          moveNotation = position.col > selectedPiece.col ? "O-O" : "O-O-O"
        } else {
          const pieceNotation = getPieceNotation(piece?.type)
          const fromCol = String.fromCharCode(97 + selectedPiece.col) // Convert 0-7 to a-h
          const fromRow = 8 - selectedPiece.row // Convert 0-7 to 8-1
          const toCol = String.fromCharCode(97 + position.col) // Convert 0-7 to a-h
          const toRow = 8 - position.row // Convert 0-7 to 8-1

          // Check if it's a capture
          const isCapture =
            board[position.row][position.col] !== null ||
            (piece?.type === PieceType.Pawn && selectedPiece.col !== position.col) // En passant

          // For pawns, include the file only on captures
          if (piece?.type === PieceType.Pawn) {
            moveNotation = isCapture ? `${fromCol}x${toCol}${toRow}` : `${toCol}${toRow}`

            // Check for pawn promotion (pawns automatically promote to queen in our implementation)
            const isPromotion =
              (piece.color === Color.White && position.row === 0) || (piece.color === Color.Black && position.row === 7)
            if (isPromotion) {
              moveNotation += "=Q"
            }
          } else {
            // For other pieces, include the piece symbol and capture notation if needed
            moveNotation = `${pieceNotation}${isCapture ? "x" : ""}${toCol}${toRow}`
          }
        }

        // Make the move to check if it results in check or checkmate
        const newBoardAfterMove = makeMove(board, selectedPiece, position, lastMove)
        const nextPlayer = currentPlayer === Color.White ? Color.Black : Color.White

        // Add check or checkmate notation
        if (isCheckmate(newBoardAfterMove, nextPlayer)) {
          moveNotation += "#"
        } else if (isCheck(newBoardAfterMove, nextPlayer)) {
          moveNotation += "+"
        }

        setMoveHistory((prev) => [...prev, moveNotation])

        // Switch player
        setCurrentPlayer(currentPlayer === Color.White ? Color.Black : Color.White)
        setSelectedPiece(null)
      }
    }
  }

  const getPieceNotation = (pieceType?: PieceType): string => {
    if (!pieceType) return ""
    switch (pieceType) {
      case PieceType.King:
        return "K"
      case PieceType.Queen:
        return "Q"
      case PieceType.Rook:
        return "R"
      case PieceType.Bishop:
        return "B"
      case PieceType.Knight:
        return "N"
      case PieceType.Pawn:
        return ""
    }
  }

  const resetGame = () => {
    setBoard(initialBoardState)
    setCurrentPlayer(Color.White)
    setSelectedPiece(null)
    setValidMoves([])
    setCapturedPieces({
      [Color.White]: [],
      [Color.Black]: [],
    })
    setGameStatus("White's Turn") // Set to White's Turn directly
    setMoveHistory([])
    setLastMove(null)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-stretch">
      <ChessBoard
        board={board}
        selectedPiece={selectedPiece}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
      />
      <GameInfo
        currentPlayer={currentPlayer}
        capturedPieces={capturedPieces}
        gameStatus={gameStatus}
        moveHistory={moveHistory}
        onResetGame={resetGame}
      />
    </div>
  )
}

