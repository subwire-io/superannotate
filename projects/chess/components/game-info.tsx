"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Color, PieceType } from "@/lib/chess-types"
import { RotateCcw, Clipboard, Download, Check, X } from "lucide-react"
import { toast } from "sonner"

interface GameInfoProps {
  currentPlayer: Color
  capturedPieces: {
    [Color.White]: PieceType[]
    [Color.Black]: PieceType[]
  }
  gameStatus: string
  moveHistory: string[]
  onResetGame: () => void
}

export default function GameInfo({
  currentPlayer,
  capturedPieces,
  gameStatus,
  moveHistory,
  onResetGame,
}: GameInfoProps) {
  const moveHistoryRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Auto-scroll to the bottom of move history when new moves are added
  useEffect(() => {
    if (moveHistoryRef.current) {
      moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight
    }
  }, [moveHistory])

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  // Check for game over status and show toast
  useEffect(() => {
    if (gameStatus.includes("Checkmate!")) {
      const winner = gameStatus.includes("Black wins") ? "Black" : "White"
      toast(`${winner} wins!`)
    }
  }, [gameStatus])

  const renderCapturedPieces = (color: Color) => {
    return capturedPieces[color].map((pieceType, index) => {
      const symbol = getPieceSymbol(pieceType, color)
      return (
        <span key={index} className="text-sm">
          {symbol}
        </span>
      )
    })
  }

  const getPieceSymbol = (type: PieceType, color: Color) => {
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

  const formatMoveHistoryForExport = () => {
    let formattedText = "Chess Game Move History\n\n"

    for (let i = 0; i < Math.ceil(moveHistory.length / 2); i++) {
      formattedText += `${i + 1}. ${moveHistory[i * 2] || ""} ${moveHistory[i * 2 + 1] || ""}\n`
    }

    return formattedText
  }

  const copyMoveHistory = () => {
    const text = formatMoveHistoryForExport()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast("Move history copied")
    })
  }

  const downloadMoveHistory = () => {
    const text = formatMoveHistoryForExport()
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "chess_game_history.txt"
    document.body.appendChild(a)
    a.click()

    // Cleanup
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast("Move history downloaded")
  }

  const handleResetConfirm = () => {
    onResetGame()
    setShowResetConfirm(false)
    toast("New game started. Good luck!")
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow-md w-full sm:max-w-100 md:max-w-[12.0rem] lg:max-w-[12.0rem] flex flex-col h-full">
      {/* Header with title and reset button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold leading-none">Game Info</h2>
        <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => setShowResetConfirm(true)}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" />
          <span className="text-xs">Reset</span>
        </Button>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-[300px] shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Reset Game</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowResetConfirm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reset the game? This will start a new game and clear the current board.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleResetConfirm}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current player status */}
      <div className="mb-4 bg-gray-50 p-2 rounded border">
        <div className="flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              currentPlayer === Color.White ? "bg-white border border-black" : "bg-black"
            }`}
          ></div>
          <p className="font-medium text-sm leading-tight">{gameStatus}</p>
        </div>
      </div>

      {/* Captured pieces section */}
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-1.5 text-gray-700 border-b pb-1">Captured Pieces</h3>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center flex-wrap">
            <span className="font-medium text-xs mr-1.5 text-gray-600 w-10">White:</span>
            <div className="flex gap-0.5 flex-wrap">
              {capturedPieces[Color.White].length > 0 ? (
                renderCapturedPieces(Color.White)
              ) : (
                <span className="text-xs text-gray-400 italic">None</span>
              )}
            </div>
          </div>
          <div className="flex items-center flex-wrap">
            <span className="font-medium text-xs mr-1.5 text-gray-600 w-10">Black:</span>
            <div className="flex gap-0.5 flex-wrap">
              {capturedPieces[Color.Black].length > 0 ? (
                renderCapturedPieces(Color.Black)
              ) : (
                <span className="text-xs text-gray-400 italic">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Move history section */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-medium text-sm text-gray-700">Move History</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyMoveHistory} title="Copy move history">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={downloadMoveHistory}
              title="Download move history"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div ref={moveHistoryRef} className="h-[40px] overflow-y-auto border rounded px-2 bg-gray-50 scroll-smooth">
          {moveHistory.length > 0 ? (
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2 text-sm">
              {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="font-medium text-gray-500">{i + 1}.</div>
                  <div>{moveHistory[i * 2]}</div>
                  <div>{moveHistory[i * 2 + 1] || ""}</div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">No moves yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

