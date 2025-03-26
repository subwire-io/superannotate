import { type ChessPiece, type Position, PieceType, Color } from "./chess-types"

// Deep clone the board
export function cloneBoard(board: (ChessPiece | null)[][]): (ChessPiece | null)[][] {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)))
}

// Check if a position is within the board boundaries
export function isValidPosition(position: Position): boolean {
  return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8
}

// Update the makeMove function to handle en passant captures
export function makeMove(
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position,
  lastMove: { from: Position; to: Position; piece: ChessPiece } | null = null,
): (ChessPiece | null)[][] {
  const newBoard = cloneBoard(board)
  const piece = newBoard[from.row][from.col]

  if (!piece) return newBoard

  // Update hasMoved flag for kings and rooks (for castling)
  if (piece.type === PieceType.King || piece.type === PieceType.Rook) {
    piece.hasMoved = true
  }

  // Handle castling
  if (piece.type === PieceType.King && Math.abs(to.col - from.col) === 2) {
    const isKingSide = to.col > from.col
    const rookCol = isKingSide ? 7 : 0
    const newRookCol = isKingSide ? 5 : 3

    // Move the rook
    newBoard[from.row][newRookCol] = newBoard[from.row][rookCol]
    newBoard[from.row][rookCol] = null
  }

  // Handle en passant capture
  if (piece.type === PieceType.Pawn && from.col !== to.col && newBoard[to.row][to.col] === null) {
    // This is a diagonal pawn move to an empty square - must be en passant
    newBoard[from.row][to.col] = null // Capture the pawn that moved two squares
  }

  // Handle pawn promotion (automatically to queen for simplicity)
  if (piece.type === PieceType.Pawn && (to.row === 0 || to.row === 7)) {
    piece.type = PieceType.Queen
  }

  // Make the move
  newBoard[to.row][to.col] = piece
  newBoard[from.row][from.col] = null

  return newBoard
}

// Update the isValidMove function to accept lastMove
export function isValidMove(
  board: (ChessPiece | null)[][],
  from: Position,
  to: Position,
  currentPlayer: Color,
  lastMove: { from: Position; to: Position; piece: ChessPiece } | null = null,
): boolean {
  const piece = board[from.row][from.col]

  // Basic checks
  if (!piece) return false
  if (piece.color !== currentPlayer) return false
  if (from.row === to.row && from.col === to.col) return false

  const validMoves = getValidMoves(board, from, currentPlayer, lastMove)
  return validMoves.some((move) => move.row === to.row && move.col === to.col)
}

// Update the getValidMoves function to pass lastMove to getPawnMoves
export function getValidMoves(
  board: (ChessPiece | null)[][],
  position: Position,
  currentPlayer: Color,
  lastMove: { from: Position; to: Position; piece: ChessPiece } | null = null,
): Position[] {
  const piece = board[position.row][position.col]
  if (!piece || piece.color !== currentPlayer) return []

  let moves: Position[] = []

  switch (piece.type) {
    case PieceType.Pawn:
      moves = getPawnMoves(board, position, lastMove)
      break
    case PieceType.Knight:
      moves = getKnightMoves(board, position)
      break
    case PieceType.Bishop:
      moves = getBishopMoves(board, position)
      break
    case PieceType.Rook:
      moves = getRookMoves(board, position)
      break
    case PieceType.Queen:
      moves = getQueenMoves(board, position)
      break
    case PieceType.King:
      moves = getKingMoves(board, position)
      break
  }

  // Filter out moves that would put the king in check
  return moves.filter((move) => {
    const newBoard = makeMove(cloneBoard(board), position, move, lastMove)
    return !isKingInCheck(newBoard, currentPlayer)
  })
}

// Find the king position for a given color
function findKingPosition(board: (ChessPiece | null)[][], color: Color): Position | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece?.type === PieceType.King && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

// Check if the king is in check
export function isKingInCheck(board: (ChessPiece | null)[][], color: Color): boolean {
  // Find the king
  const kingPosition = findKingPosition(board, color)
  if (!kingPosition) return false // Should never happen in a valid game

  // Check if any opponent piece can capture the king
  const oppositeColor = color === Color.White ? Color.Black : Color.White
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === oppositeColor) {
        const moves = getPieceMoves(board, { row, col }, false)
        if (moves.some((move) => move.row === kingPosition.row && move.col === kingPosition.col)) {
          return true
        }
      }
    }
  }

  return false
}

// Get all pieces that are attacking the king
function getCheckingPieces(board: (ChessPiece | null)[][], color: Color): Position[] {
  const kingPosition = findKingPosition(board, color)
  if (!kingPosition) return []

  const checkingPieces: Position[] = []
  const oppositeColor = color === Color.White ? Color.Black : Color.White

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === oppositeColor) {
        const moves = getPieceMoves(board, { row, col }, false)
        if (moves.some((move) => move.row === kingPosition.row && move.col === kingPosition.col)) {
          checkingPieces.push({ row, col })
        }
      }
    }
  }

  return checkingPieces
}

// Get all squares between two positions (for blocking checks)
function getSquaresBetween(from: Position, to: Position): Position[] {
  const squares: Position[] = []

  // Check if the positions are on the same row, column, or diagonal
  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col

  // If not on the same line, return empty array
  if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) {
    return squares
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1
  const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1

  let row = from.row + rowStep
  let col = from.col + colStep

  while (row !== to.row || col !== to.col) {
    squares.push({ row, col })
    row += rowStep
    col += colStep
  }

  return squares
}

// Update the getPieceMoves function to pass lastMove to getPawnMoves
function getPieceMoves(
  board: (ChessPiece | null)[][],
  position: Position,
  checkCastling = true,
  lastMove: { from: Position; to: Position; piece: ChessPiece } | null = null,
): Position[] {
  const piece = board[position.row][position.col]
  if (!piece) return []

  switch (piece.type) {
    case PieceType.Pawn:
      return getPawnMoves(board, position, lastMove)
    case PieceType.Knight:
      return getKnightMoves(board, position)
    case PieceType.Bishop:
      return getBishopMoves(board, position)
    case PieceType.Rook:
      return getRookMoves(board, position)
    case PieceType.Queen:
      return getQueenMoves(board, position)
    case PieceType.King:
      return getKingMoves(board, position, checkCastling)
    default:
      return []
  }
}

// Update the getPawnMoves function to include en passant
function getPawnMoves(
  board: (ChessPiece | null)[][],
  position: Position,
  lastMove: { from: Position; to: Position; piece: ChessPiece } | null = null,
): Position[] {
  const piece = board[position.row][position.col]
  if (!piece || piece.type !== PieceType.Pawn) return []

  const moves: Position[] = []
  const direction = piece.color === Color.White ? -1 : 1
  const startRow = piece.color === Color.White ? 6 : 1

  // Move forward one square
  const oneForward = { row: position.row + direction, col: position.col }
  if (isValidPosition(oneForward) && board[oneForward.row][oneForward.col] === null) {
    moves.push(oneForward)

    // Move forward two squares from starting position
    if (position.row === startRow) {
      const twoForward = { row: position.row + 2 * direction, col: position.col }
      if (isValidPosition(twoForward) && board[twoForward.row][twoForward.col] === null) {
        moves.push(twoForward)
      }
    }
  }

  // Capture diagonally
  const captureMoves = [
    { row: position.row + direction, col: position.col - 1 },
    { row: position.row + direction, col: position.col + 1 },
  ]

  for (const move of captureMoves) {
    if (isValidPosition(move)) {
      const targetPiece = board[move.row][move.col]
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(move)
      }
    }
  }

  // En passant capture
  if (lastMove && lastMove.piece.type === PieceType.Pawn) {
    const lastMoveDistance = Math.abs(lastMove.to.row - lastMove.from.row)

    // Check if the last move was a pawn moving two squares
    if (lastMoveDistance === 2) {
      // Check if our pawn is adjacent to the pawn that just moved
      if (
        position.row === lastMove.to.row &&
        Math.abs(position.col - lastMove.to.col) === 1 &&
        lastMove.piece.color !== piece.color
      ) {
        // Add the en passant capture move
        moves.push({
          row: position.row + direction,
          col: lastMove.to.col,
        })
      }
    }
  }

  return moves
}

// Get all valid moves for a knight
function getKnightMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const piece = board[position.row][position.col]
  if (!piece || piece.type !== PieceType.Knight) return []

  const moves: Position[] = []
  const knightMoves = [
    { row: position.row - 2, col: position.col - 1 },
    { row: position.row - 2, col: position.col + 1 },
    { row: position.row - 1, col: position.col - 2 },
    { row: position.row - 1, col: position.col + 2 },
    { row: position.row + 1, col: position.col - 2 },
    { row: position.row + 1, col: position.col + 2 },
    { row: position.row + 2, col: position.col - 1 },
    { row: position.row + 2, col: position.col + 1 },
  ]

  for (const move of knightMoves) {
    if (isValidPosition(move)) {
      const targetPiece = board[move.row][move.col]
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(move)
      }
    }
  }

  return moves
}

// Get all valid moves for a bishop
function getBishopMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const piece = board[position.row][position.col]
  if (!piece || piece.type !== PieceType.Bishop) return []

  return getDiagonalMoves(board, position)
}

// Get all valid moves for a rook
function getRookMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const piece = board[position.row][position.col]
  if (!piece || piece.type !== PieceType.Rook) return []

  return getStraightMoves(board, position)
}

// Get all valid moves for a queen
function getQueenMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const piece = board[position.row][position.col]
  if (!piece || piece.type !== PieceType.Queen) return []

  return [...getStraightMoves(board, position), ...getDiagonalMoves(board, position)]
}

// Get all valid moves for a king
function getKingMoves(board: (ChessPiece | null)[][], position: Position, checkCastling = true): Position[] {
  const piece = board[position.row][position.col]
  if (!piece || piece.type !== PieceType.King) return []

  const moves: Position[] = []
  const kingMoves = [
    { row: position.row - 1, col: position.col - 1 },
    { row: position.row - 1, col: position.col },
    { row: position.row - 1, col: position.col + 1 },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col + 1 },
    { row: position.row + 1, col: position.col - 1 },
    { row: position.row + 1, col: position.col },
    { row: position.row + 1, col: position.col + 1 },
  ]

  for (const move of kingMoves) {
    if (isValidPosition(move)) {
      const targetPiece = board[move.row][move.col]
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(move)
      }
    }
  }

  // Castling
  if (checkCastling && !piece.hasMoved && !isKingInCheck(board, piece.color)) {
    const row = position.row

    // Kingside castling
    if (board[row][7]?.type === PieceType.Rook && !board[row][7]?.hasMoved && !board[row][5] && !board[row][6]) {
      // Check if the king would pass through check
      const tempBoard1 = cloneBoard(board)
      tempBoard1[row][5] = piece
      tempBoard1[row][4] = null

      if (!isKingInCheck(tempBoard1, piece.color)) {
        moves.push({ row, col: 6 })
      }
    }

    // Queenside castling
    if (
      board[row][0]?.type === PieceType.Rook &&
      !board[row][0]?.hasMoved &&
      !board[row][1] &&
      !board[row][2] &&
      !board[row][3]
    ) {
      // Check if the king would pass through check
      const tempBoard1 = cloneBoard(board)
      tempBoard1[row][3] = piece
      tempBoard1[row][4] = null

      if (!isKingInCheck(tempBoard1, piece.color)) {
        moves.push({ row, col: 2 })
      }
    }
  }

  return moves
}

// Get all diagonal moves (for bishop and queen)
function getDiagonalMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const piece = board[position.row][position.col]
  if (!piece) return []

  const moves: Position[] = []

  // Check all four diagonal directions
  const directions = [
    { rowDir: -1, colDir: -1 }, // top-left
    { rowDir: -1, colDir: 1 }, // top-right
    { rowDir: 1, colDir: -1 }, // bottom-left
    { rowDir: 1, colDir: 1 }, // bottom-right
  ]

  for (const dir of directions) {
    let row = position.row + dir.rowDir
    let col = position.col + dir.colDir

    while (isValidPosition({ row, col })) {
      const targetPiece = board[row][col]

      if (!targetPiece) {
        // Empty square, can move here
        moves.push({ row, col })
      } else if (targetPiece.color !== piece.color) {
        // Opponent's piece, can capture and then stop
        moves.push({ row, col })
        break
      } else {
        // Own piece, can't move here or beyond
        break
      }

      row += dir.rowDir
      col += dir.colDir
    }
  }

  return moves
}

// Get all straight moves (for rook and queen)
function getStraightMoves(board: (ChessPiece | null)[][], position: Position): Position[] {
  const piece = board[position.row][position.col]
  if (!piece) return []

  const moves: Position[] = []

  // Check all four straight directions
  const directions = [
    { rowDir: -1, colDir: 0 }, // up
    { rowDir: 1, colDir: 0 }, // down
    { rowDir: 0, colDir: -1 }, // left
    { rowDir: 0, colDir: 1 }, // right
  ]

  for (const dir of directions) {
    let row = position.row + dir.rowDir
    let col = position.col + dir.colDir

    while (isValidPosition({ row, col })) {
      const targetPiece = board[row][col]

      if (!targetPiece) {
        // Empty square, can move here
        moves.push({ row, col })
      } else if (targetPiece.color !== piece.color) {
        // Opponent's piece, can capture and then stop
        moves.push({ row, col })
        break
      } else {
        // Own piece, can't move here or beyond
        break
      }

      row += dir.rowDir
      col += dir.colDir
    }
  }

  return moves
}

// Check if the current player is in check
export function isCheck(board: (ChessPiece | null)[][], currentPlayer: Color): boolean {
  return isKingInCheck(board, currentPlayer)
}

// Check if the current player is in checkmate
export function isCheckmate(board: (ChessPiece | null)[][], currentPlayer: Color): boolean {
  // If not in check, can't be checkmate
  if (!isKingInCheck(board, currentPlayer)) return false

  // Check if any move can get out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === currentPlayer) {
        const moves = getValidMoves(board, { row, col }, currentPlayer)
        if (moves.length > 0) {
          return false // Found at least one legal move
        }
      }
    }
  }

  // No legal moves and in check = checkmate
  return true
}

