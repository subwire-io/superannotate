"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

// Game constants
const CELL_SIZE = 20
const BOARD_WIDTH = 19
const BOARD_HEIGHT = 21
const PLAYER_SPEED = 1.5 // Reverted back to original speed
const GHOST_SPEED = 1.2 // Reverted back to original speed
const GHOST_SCARED_SPEED = 1.0 // Reverted back to original speed
const GHOST_COLORS = ["#FF0000", "#00FFDE", "#FFB8DE", "#FFB847"]
const DIRECTION_CHANGE_THRESHOLD = 5 // Higher value = less frequent direction changes

// Direction constants
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

// Ghost start positions
const GHOST_START_POSITIONS = [
  { x: 8, y: 9 },
  { x: 9, y: 9 },
  { x: 10, y: 9 },
  { x: 9, y: 8 },
]

// Game board layout (0: path, 1: wall, 2: dot, 3: power pellet)
const INITIAL_BOARD = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

// Ghost type definition
interface Ghost {
  x: number
  y: number
  direction: { x: number; y: number }
  nextDirection: { x: number; y: number }
  color: string
  scared: boolean
  eaten: boolean
  initialMovementDone: boolean
  lastIntersection: { x: number; y: number }
  stuckCounter: number
  lastPositions: Array<{ x: number; y: number }>
  personality: number // 0: direct chase, 1: intercept, 2: ambush, 3: random
  directionChangeCounter: number // Counter to limit direction changes
  lastDirectionChange: number // Timestamp of last direction change
}

function MobileControls({ onDirectionChange }: { onDirectionChange: (direction: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 w-48 mt-4">
      <div className="col-start-2">
        <button
          className="w-full h-12 bg-yellow-500/80 rounded-md flex items-center justify-center"
          onClick={() => onDirectionChange("ArrowUp")}
          aria-label="Move Up"
        >
          <ArrowUp className="text-black" />
        </button>
      </div>
      <div className="col-start-1 row-start-2">
        <button
          className="w-full h-12 bg-yellow-500/80 rounded-md flex items-center justify-center"
          onClick={() => onDirectionChange("ArrowLeft")}
          aria-label="Move Left"
        >
          <ArrowLeft className="text-black" />
        </button>
      </div>
      <div className="col-start-2 row-start-2">
        <button
          className="w-full h-12 bg-yellow-500/80 rounded-md flex items-center justify-center"
          onClick={() => onDirectionChange("ArrowDown")}
          aria-label="Move Down"
        >
          <ArrowDown className="text-black" />
        </button>
      </div>
      <div className="col-start-3 row-start-2">
        <button
          className="w-full h-12 bg-yellow-500/80 rounded-md flex items-center justify-center"
          onClick={() => onDirectionChange("ArrowRight")}
          aria-label="Move Right"
        >
          <ArrowRight className="text-black" />
        </button>
      </div>
    </div>
  )
}

export default function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [board, setBoard] = useState<number[][]>([])
  const [dotsCount, setDotsCount] = useState(0)
  const dotsCountRef = useRef(0)
  const gameLoopActiveRef = useRef(false) // Track if game loop is active
  const pausedPlayerStateRef = useRef({
    mouthAngle: 0.25, // Fixed mouth angle during pause
  })

  // Game state
  const gameStateRef = useRef({
    player: {
      x: 9 * CELL_SIZE + CELL_SIZE / 2,
      y: 15 * CELL_SIZE + CELL_SIZE / 2,
      direction: DIRECTIONS.RIGHT,
      nextDirection: DIRECTIONS.RIGHT,
      mouthAngle: 0,
      mouthSpeed: 0.07,
      mouthDirection: 1,
      lastAnimationTime: 0,
    },
    ghosts: [] as Ghost[],
    powerMode: false,
    powerModeTimer: 0,
    animationId: 0,
    lastFrameTime: 0,
  })

  // Initialize the game
  useEffect(() => {
    resetGame()

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return

      handleDirectionChange(e.key)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      stopGameLoop()
    }
  }, [gameStarted])

  // Start game loop when game starts
  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon) {
      startGameLoop()
    } else {
      stopGameLoop()
    }
  }, [gameStarted, gameOver, gameWon])

  // Sync dotsCount with ref for animation frame access
  useEffect(() => {
    dotsCountRef.current = dotsCount
  }, [dotsCount])

  // Stop the game loop and cancel animation frame
  const stopGameLoop = () => {
    if (gameStateRef.current.animationId) {
      cancelAnimationFrame(gameStateRef.current.animationId)
      gameStateRef.current.animationId = 0
    }
    gameLoopActiveRef.current = false
  }

  // Start the game loop
  const startGameLoop = () => {
    // Only start if not already running
    if (!gameLoopActiveRef.current) {
      gameLoopActiveRef.current = true
      const startTime = performance.now()
      gameStateRef.current.lastFrameTime = startTime
      gameStateRef.current.player.lastAnimationTime = startTime
      gameLoop(startTime)
    }
  }

  // Reset a ghost to its initial state
  const resetGhost = (ghost: Ghost, index: number) => {
    const startPos = GHOST_START_POSITIONS[index]
    ghost.x = startPos.x * CELL_SIZE + CELL_SIZE / 2
    ghost.y = startPos.y * CELL_SIZE + CELL_SIZE / 2
    ghost.direction = index % 2 === 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT
    ghost.nextDirection = ghost.direction
    ghost.scared = false // Always set scared to false when a ghost is eaten
    ghost.eaten = false
    ghost.initialMovementDone = false
    ghost.stuckCounter = 0
    ghost.lastPositions = []
    ghost.personality = index // Each ghost keeps its original personality
    ghost.directionChangeCounter = 0
    ghost.lastDirectionChange = 0
  }

  const resetGame = () => {
    // Stop any existing game loop
    stopGameLoop()

    // Copy the initial board
    const newBoard = JSON.parse(JSON.stringify(INITIAL_BOARD))
    setBoard(newBoard)

    // Count dots
    let dots = 0
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (newBoard[y][x] === 2 || newBoard[y][x] === 3) {
          dots++
        }
      }
    }
    setDotsCount(dots)
    dotsCountRef.current = dots

    // Initialize ghosts
    const ghosts: Ghost[] = []
    const currentTime = performance.now()

    for (let i = 0; i < 4; i++) {
      const startPos = GHOST_START_POSITIONS[i]
      ghosts.push({
        x: startPos.x * CELL_SIZE + CELL_SIZE / 2,
        y: startPos.y * CELL_SIZE + CELL_SIZE / 2,
        direction: i % 2 === 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT,
        nextDirection: i % 2 === 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT,
        color: GHOST_COLORS[i],
        scared: false,
        eaten: false,
        initialMovementDone: false,
        lastIntersection: { x: -1, y: -1 },
        stuckCounter: 0,
        lastPositions: [],
        personality: i, // Each ghost has a different personality
        directionChangeCounter: 0,
        lastDirectionChange: currentTime,
      })
    }

    // Reset game state
    gameStateRef.current = {
      player: {
        x: 9 * CELL_SIZE + CELL_SIZE / 2,
        y: 15 * CELL_SIZE + CELL_SIZE / 2,
        direction: DIRECTIONS.RIGHT,
        nextDirection: DIRECTIONS.RIGHT,
        mouthAngle: 0,
        mouthSpeed: 0.07,
        mouthDirection: 1,
        lastAnimationTime: 0,
      },
      ghosts,
      powerMode: false,
      powerModeTimer: 0,
      animationId: 0,
      lastFrameTime: 0,
    }

    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameWon(false)
  }

  const startGame = () => {
    // Make sure to stop any existing game loop first
    stopGameLoop()

    // Reset game state
    resetGame()

    // Reset game state flags
    setGameStarted(true)
    setGameOver(false)
    setGameWon(false)

    // Ensure gameLoopActiveRef is reset
    gameLoopActiveRef.current = false

    // Start the game loop with a slight delay to ensure state is updated
    setTimeout(() => {
      startGameLoop()
    }, 50)
  }

  const gameLoop = (timestamp: number) => {
    // Check if game loop should still be active
    if (!gameLoopActiveRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calculate delta time for smooth animation
    const deltaTime = timestamp - gameStateRef.current.lastFrameTime
    gameStateRef.current.lastFrameTime = timestamp

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update game state
    updatePlayer(deltaTime, timestamp)
    updateGhosts(deltaTime, timestamp)

    // Check collisions AFTER updating positions
    checkCollisions()

    // Draw game
    drawBoard(ctx)
    drawPlayer(ctx)
    drawGhosts(ctx)

    // Check win condition
    if (dotsCountRef.current <= 0) {
      setGameWon(true)
      gameLoopActiveRef.current = false
      return
    }

    // Continue game loop only if still active
    if (gameLoopActiveRef.current) {
      gameStateRef.current.animationId = requestAnimationFrame(gameLoop)
    }
  }

  // Check if a position is valid (not a wall)
  const isValidPosition = (x: number, y: number) => {
    // Get the cell coordinates
    const cellX = Math.floor(x / CELL_SIZE)
    const cellY = Math.floor(y / CELL_SIZE)

    // Check bounds
    if (cellX < 0 || cellX >= BOARD_WIDTH || cellY < 0 || cellY >= BOARD_HEIGHT) {
      return false
    }

    // Check if it's not a wall
    return board[cellY][cellX] !== 1
  }

  // Check if a position is at a tunnel entrance
  const isTunnelPosition = (x: number, y: number) => {
    const cellX = Math.floor(x / CELL_SIZE)
    const cellY = Math.floor(y / CELL_SIZE)

    // Tunnel is at row 9 (index), columns 0 and 18
    return cellY === 9 && (cellX === 0 || cellX === BOARD_WIDTH - 1)
  }

  // Check if a position is in the center ghost area
  const isInCenterArea = (x: number, y: number) => {
    const cellX = Math.floor(x / CELL_SIZE)
    const cellY = Math.floor(y / CELL_SIZE)

    // Center area is roughly from (7,7) to (11,10)
    return cellX >= 7 && cellX <= 11 && cellY >= 7 && cellY <= 10
  }

  const updatePlayer = (deltaTime: number, timestamp: number) => {
    const { player } = gameStateRef.current

    // Calculate current cell position and center position
    const currentCellX = Math.floor(player.x / CELL_SIZE)
    const currentCellY = Math.floor(player.y / CELL_SIZE)
    const centerX = currentCellX * CELL_SIZE + CELL_SIZE / 2
    const centerY = currentCellY * CELL_SIZE + CELL_SIZE / 2

    // Check if we're at or very near a cell center (intersection)
    const atCenterX = Math.abs(player.x - centerX) < PLAYER_SPEED
    const atCenterY = Math.abs(player.y - centerY) < PLAYER_SPEED

    // Check for teleportation (tunnel)
    if (isTunnelPosition(player.x, player.y)) {
      if (currentCellX === 0 && player.direction === DIRECTIONS.LEFT) {
        // Teleport to right side
        player.x = (BOARD_WIDTH - 2) * CELL_SIZE + CELL_SIZE / 2
      } else if (currentCellX === BOARD_WIDTH - 1 && player.direction === DIRECTIONS.RIGHT) {
        // Teleport to left side
        player.x = 1 * CELL_SIZE + CELL_SIZE / 2
      }
    }

    // At an intersection, we can try to change direction
    if (atCenterX && atCenterY) {
      // Snap to center position for precise alignment
      player.x = centerX
      player.y = centerY

      // Try to change direction if requested
      if (player.nextDirection !== player.direction) {
        const nextCellX = currentCellX + player.nextDirection.x
        const nextCellY = currentCellY + player.nextDirection.y

        // Check if the next cell is valid (not a wall)
        if (
          nextCellX >= 0 &&
          nextCellX < BOARD_WIDTH &&
          nextCellY >= 0 &&
          nextCellY < BOARD_HEIGHT &&
          board[nextCellY][nextCellX] !== 1
        ) {
          player.direction = player.nextDirection
        }
      }

      // Check for dots and power pellets
      if (board[currentCellY][currentCellX] === 2) {
        // Collect dot
        const newBoard = [...board]
        newBoard[currentCellY][currentCellX] = 0
        setBoard(newBoard)
        setScore((prev) => prev + 10)
        setDotsCount((prev) => prev - 1)
        dotsCountRef.current -= 1
      } else if (board[currentCellY][currentCellX] === 3) {
        // Collect power pellet
        const newBoard = [...board]
        newBoard[currentCellY][currentCellX] = 0
        setBoard(newBoard)
        setScore((prev) => prev + 50)
        setDotsCount((prev) => prev - 1)
        dotsCountRef.current -= 1

        // Activate power mode
        gameStateRef.current.powerMode = true
        gameStateRef.current.powerModeTimer = 300 // ~10 seconds at 60fps

        // Make all ghosts scared
        gameStateRef.current.ghosts.forEach((ghost) => {
          if (!ghost.eaten) {
            ghost.scared = true
          }
        })
      }
    }

    // Calculate next position
    const nextX = player.x + player.direction.x * PLAYER_SPEED
    const nextY = player.y + player.direction.y * PLAYER_SPEED

    // Check if the next position is valid (not a wall)
    // We need to check both the center and the edges of Pacman to prevent wall clipping
    const playerRadius = CELL_SIZE / 2 - 1 // Slightly smaller than half cell to prevent wall clipping

    const nextPosValid =
      isValidPosition(nextX, nextY) &&
      isValidPosition(
        nextX + playerRadius * Math.sign(player.direction.x),
        nextY + playerRadius * Math.sign(player.direction.y),
      ) &&
      isValidPosition(
        nextX + playerRadius * Math.sign(player.direction.x),
        nextY - playerRadius * Math.sign(player.direction.y),
      ) &&
      isValidPosition(
        nextX - playerRadius * Math.sign(player.direction.x),
        nextY + playerRadius * Math.sign(player.direction.y),
      ) &&
      isValidPosition(
        nextX - playerRadius * Math.sign(player.direction.x),
        nextY - playerRadius * Math.sign(player.direction.y),
      )

    if (nextPosValid) {
      // Move in the current direction
      player.x = nextX
      player.y = nextY

      // When moving horizontally, ensure we're centered vertically
      if (player.direction.x !== 0 && !atCenterY) {
        player.y = centerY
      }

      // When moving vertically, ensure we're centered horizontally
      if (player.direction.y !== 0 && !atCenterX) {
        player.x = centerX
      }
    } else {
      // We've hit a wall, stop and align with the grid
      if (player.direction.x !== 0) {
        // Moving horizontally, align with the last valid cell center
        player.x = centerX
      }
      if (player.direction.y !== 0) {
        // Moving vertically, align with the last valid cell center
        player.y = centerY
      }
    }

    // Smooth mouth animation based on time
    const mouthAnimationSpeed = 0.003 * deltaTime // Scale with deltaTime for consistent speed
    player.mouthAngle += mouthAnimationSpeed * player.mouthDirection

    // Limit the mouth angle between 0 and 0.5 (0 to 90 degrees)
    if (player.mouthAngle >= 0.5) {
      player.mouthAngle = 0.5
      player.mouthDirection = -1
    } else if (player.mouthAngle <= 0) {
      player.mouthAngle = 0
      player.mouthDirection = 1
    }

    // Update power mode timer
    if (gameStateRef.current.powerMode) {
      gameStateRef.current.powerModeTimer--
      if (gameStateRef.current.powerModeTimer <= 0) {
        gameStateRef.current.powerMode = false
        // Make all ghosts not scared
        gameStateRef.current.ghosts.forEach((ghost) => {
          ghost.scared = false
        })
      }
    }
  }

  const isGhostTrappedInWall = (ghost: Ghost) => {
    const cellX = Math.floor(ghost.x / CELL_SIZE)
    const cellY = Math.floor(ghost.y / CELL_SIZE)

    // If the ghost is in a wall cell, it's trapped
    return cellX >= 0 && cellX < BOARD_WIDTH && cellY >= 0 && cellY < BOARD_HEIGHT && board[cellY][cellX] === 1
  }

  // Get target position for ghost based on personality
  const getGhostTargetPosition = (ghost: Ghost, playerCell: { x: number; y: number }) => {
    const { player } = gameStateRef.current

    // Default target is player's position (direct chase)
    let targetX = playerCell.x
    let targetY = playerCell.y

    // Different targeting strategies based on personality
    switch (ghost.personality) {
      case 0: // Red ghost - direct chase
        // Already set to player position
        break
      case 1: // Pink ghost - try to get ahead of player
        // Target 4 cells ahead of player
        targetX = playerCell.x + 4 * player.direction.x
        targetY = playerCell.y + 4 * player.direction.y

        // Keep target in bounds
        targetX = Math.max(0, Math.min(BOARD_WIDTH - 1, targetX))
        targetY = Math.max(0, Math.min(BOARD_HEIGHT - 1, targetY))
        break
      case 2: // Cyan ghost - ambush from player's flank
        // Target position is based on player position and red ghost position
        const redGhost = gameStateRef.current.ghosts[0]
        const redGhostCell = {
          x: Math.floor(redGhost.x / CELL_SIZE),
          y: Math.floor(redGhost.y / CELL_SIZE),
        }

        // Target is twice the vector from red ghost to position 2 tiles ahead of player
        const aheadX = playerCell.x + 2 * player.direction.x
        const aheadY = playerCell.y + 2 * player.direction.y

        targetX = aheadX + (aheadX - redGhostCell.x)
        targetY = aheadY + (aheadY - redGhostCell.y)

        // Keep target in bounds
        targetX = Math.max(0, Math.min(BOARD_WIDTH - 1, targetX))
        targetY = Math.max(0, Math.min(BOARD_HEIGHT - 1, targetY))
        break
      case 3: // Orange ghost - patrol/scatter behavior
        // If far from player, chase directly
        const ghostCell = {
          x: Math.floor(ghost.x / CELL_SIZE),
          y: Math.floor(ghost.y / CELL_SIZE),
        }

        const distanceToPlayer = Math.sqrt(
          Math.pow(ghostCell.x - playerCell.x, 2) + Math.pow(ghostCell.y - playerCell.y, 2),
        )

        if (distanceToPlayer > 8) {
          // Target player directly when far away
          // Already set to player position
        } else {
          // Target bottom-left corner when close
          targetX = 1
          targetY = BOARD_HEIGHT - 2
        }
        break
    }

    return { x: targetX, y: targetY }
  }

  // Check if the direction is along the current path (straight line)
  const isDirectionAlongPath = (
    ghost: Ghost,
    direction: { x: number; y: number },
    currentCellX: number,
    currentCellY: number,
  ) => {
    // If continuing in the same direction, it's along the path
    if (direction.x === ghost.direction.x && direction.y === ghost.direction.y) {
      return true
    }

    // Check if the direction is perpendicular to current direction and there's a wall ahead
    if (ghost.direction.x !== 0 && direction.y !== 0) {
      // Currently moving horizontally, trying to move vertically
      const nextCellX = currentCellX + ghost.direction.x
      if (nextCellX >= 0 && nextCellX < BOARD_WIDTH && board[currentCellY][nextCellX] === 1) {
        return true // Wall ahead, so turning is along the path
      }
    } else if (ghost.direction.y !== 0 && direction.x !== 0) {
      // Currently moving vertically, trying to move horizontally
      const nextCellY = currentCellY + ghost.direction.y
      if (nextCellY >= 0 && nextCellY < BOARD_HEIGHT && board[nextCellY][currentCellX] === 1) {
        return true // Wall ahead, so turning is along the path
      }
    }

    return false
  }

  const updateGhosts = (deltaTime: number, timestamp: number) => {
    const { ghosts, player } = gameStateRef.current

    // Get player cell position for targeting
    const playerCell = {
      x: Math.floor(player.x / CELL_SIZE),
      y: Math.floor(player.y / CELL_SIZE),
    }

    ghosts.forEach((ghost, index) => {
      // Skip if ghost is eaten - it's already been reset to its initial position
      if (ghost.eaten) {
        return
      }

      // First check if ghost is trapped in a wall and rescue it
      if (isGhostTrappedInWall(ghost)) {
        // Find the nearest valid position
        const cellX = Math.floor(ghost.x / CELL_SIZE)
        const cellY = Math.floor(ghost.y / CELL_SIZE)

        // Try to move to a neighboring cell that's not a wall
        const neighbors = [
          { x: cellX, y: cellY - 1 }, // up
          { x: cellX + 1, y: cellY }, // right
          { x: cellX, y: cellY + 1 }, // down
          { x: cellX - 1, y: cellY }, // left
        ]

        // Find a valid neighbor
        for (const neighbor of neighbors) {
          if (
            neighbor.x >= 0 &&
            neighbor.x < BOARD_WIDTH &&
            neighbor.y >= 0 &&
            neighbor.y < BOARD_HEIGHT &&
            board[neighbor.y][neighbor.x] !== 1
          ) {
            // Move ghost to the center of this valid cell
            ghost.x = neighbor.x * CELL_SIZE + CELL_SIZE / 2
            ghost.y = neighbor.y * CELL_SIZE + CELL_SIZE / 2
            break
          }
        }
      }

      // Track last positions to detect if ghost is stuck
      if (ghost.lastPositions.length >= 10) {
        ghost.lastPositions.shift()
      }
      ghost.lastPositions.push({ x: ghost.x, y: ghost.y })

      // Calculate current cell position and center position
      const currentCellX = Math.floor(ghost.x / CELL_SIZE)
      const currentCellY = Math.floor(ghost.y / CELL_SIZE)
      const centerX = currentCellX * CELL_SIZE + CELL_SIZE / 2
      const centerY = currentCellY * CELL_SIZE + CELL_SIZE / 2

      // Check if ghost is stuck
      if (ghost.lastPositions.length === 10) {
        const firstPos = ghost.lastPositions[0]
        const lastPos = ghost.lastPositions[9]
        const moveDistance = Math.sqrt(Math.pow(lastPos.x - firstPos.x, 2) + Math.pow(lastPos.y - firstPos.y, 2))

        if (moveDistance < CELL_SIZE / 2) {
          ghost.stuckCounter++

          if (ghost.stuckCounter > 3) {
            // Increased threshold to reduce unnecessary direction changes
            // Ghost is stuck, force realignment to grid and pick a new direction
            ghost.x = centerX
            ghost.y = centerY

            const validDirections = getValidDirections(ghost.x, ghost.y)
            if (validDirections.length > 0) {
              const randomIndex = Math.floor(Math.random() * validDirections.length)
              ghost.direction = validDirections[randomIndex]
              ghost.nextDirection = ghost.direction

              // Apply a larger push in the new direction to escape
              ghost.x += ghost.direction.x * 8
              ghost.y += ghost.direction.y * 8
            }
            ghost.stuckCounter = 0
          }
        } else {
          ghost.stuckCounter = 0
        }
      }

      // Special handling for initial movement to help ghosts escape the center
      if (!ghost.initialMovementDone) {
        // Apply a larger initial movement to help ghosts escape
        const initialOffset = 15 // Increased from 10

        // Different initial directions for each ghost to avoid clustering

        const initialDirections = [DIRECTIONS.UP, DIRECTIONS.LEFT, DIRECTIONS.RIGHT, DIRECTIONS.DOWN]
        ghost.direction = initialDirections[index]
        ghost.nextDirection = ghost.direction

        ghost.x += ghost.direction.x * initialOffset
        ghost.y += ghost.direction.y * initialOffset
        ghost.initialMovementDone = true
      }
      // Check if ghost is in center area and needs help escaping
      else if (isInCenterArea(ghost.x, ghost.y)) {
        // Force movement upward to escape
        ghost.direction = DIRECTIONS.UP
        ghost.nextDirection = DIRECTIONS.UP

        // Apply extra movement to escape faster
        ghost.y -= GHOST_SPEED * 2 // Increased from 1.5
      }
      // Normal ghost movement
      else {
        // Check for teleportation (tunnel)
        if (isTunnelPosition(ghost.x, ghost.y)) {
          if (currentCellX === 0 && ghost.direction === DIRECTIONS.LEFT) {
            // Teleport to right side
            ghost.x = (BOARD_WIDTH - 2) * CELL_SIZE + CELL_SIZE / 2
          } else if (currentCellX === BOARD_WIDTH - 1 && ghost.direction === DIRECTIONS.RIGHT) {
            // Teleport to left side
            ghost.x = 1 * CELL_SIZE + CELL_SIZE / 2
          }
        }

        // Check if we're at or very near a cell center (intersection)
        // Reduced threshold for more precise alignment
        const atCenterX = Math.abs(ghost.x - centerX) < 1.5
        const atCenterY = Math.abs(ghost.y - centerY) < 1.5

        // At an intersection, decide which way to go
        if (atCenterX && atCenterY) {
          // Snap to center position for precise alignment
          ghost.x = centerX
          ghost.y = centerY

          // Remember this intersection to avoid getting stuck
          if (ghost.lastIntersection.x !== currentCellX || ghost.lastIntersection.y !== currentCellY) {
            ghost.lastIntersection = { x: currentCellX, y: currentCellY }
          }

          // Check if enough time has passed since the last direction change
          const timeSinceLastChange = timestamp - ghost.lastDirectionChange
          const canChangeDirection = timeSinceLastChange > 500 // Minimum 500ms between direction changes

          // Only consider changing direction if enough time has passed
          if (canChangeDirection) {
            // Get valid directions (not walls)
            const validDirections = getValidDirections(ghost.x, ghost.y)

            // Remove the opposite direction to prevent 180-degree turns
            // unless it's the only option
            const oppositeDirection = {
              x: -ghost.direction.x,
              y: -ghost.direction.y,
            }

            const filteredDirections = validDirections.filter(
              (dir) => !(dir.x === oppositeDirection.x && dir.y === oppositeDirection.y),
            )

            // Prefer continuing in the same direction if possible
            const currentDirection = filteredDirections.find(
              (dir) => dir.x === ghost.direction.x && dir.y === ghost.direction.y,
            )

            // If we can continue in the same direction, do so most of the time
            if (currentDirection && Math.random() < 0.8) {
              // Continue in the same direction
              ghost.direction = currentDirection
            }
            // Otherwise, choose a new direction based on targeting
            else if (filteredDirections.length > 0) {
              const availableDirections = filteredDirections

              // Choose a direction based on ghost behavior
              if (ghost.scared) {
                // In scared mode, move away from player with some randomness
                // Sort directions by which gets us furthest from player
                availableDirections.sort((a, b) => {
                  const newPosA = { x: currentCellX + a.x, y: currentCellY + a.y }
                  const newPosB = { x: currentCellX + b.x, y: currentCellY + b.y }

                  const distA = Math.abs(newPosA.x - playerCell.x) + Math.abs(newPosA.y - playerCell.y)
                  const distB = Math.abs(newPosB.x - playerCell.x) + Math.abs(newPosB.y - playerCell.y)

                  return distB - distA // Reverse sort to get furthest first
                })

                // Choose direction with minimal randomness (95% furthest, 5% random)
                if (Math.random() < 0.95) {
                  const newDirection = availableDirections[0]

                  // Only change direction if it's significantly better or we're at a forced turn
                  if (
                    isDirectionAlongPath(ghost, newDirection, currentCellX, currentCellY) ||
                    availableDirections.length === 1
                  ) {
                    ghost.direction = newDirection
                    ghost.lastDirectionChange = timestamp
                  }
                }
              } else {
                // Normal mode: use personality-based targeting
                const targetPos = getGhostTargetPosition(ghost, playerCell)

                // Sort directions by which gets us closest to target
                availableDirections.sort((a, b) => {
                  const newPosA = { x: currentCellX + a.x, y: currentCellY + a.y }
                  const newPosB = { x: currentCellX + b.x, y: currentCellY + b.y }

                  const distA = Math.abs(newPosA.x - targetPos.x) + Math.abs(newPosA.y - targetPos.y)
                  const distB = Math.abs(newPosB.x - targetPos.x) + Math.abs(newPosB.y - targetPos.y)

                  return distA - distB
                })

                // Choose the best direction with almost no randomness (98% best, 2% random)
                if (Math.random() < 0.98) {
                  const newDirection = availableDirections[0]

                  // Only change direction if it's significantly better or we're at a forced turn
                  if (
                    isDirectionAlongPath(ghost, newDirection, currentCellX, currentCellY) ||
                    availableDirections.length === 1
                  ) {
                    ghost.direction = newDirection
                    ghost.lastDirectionChange = timestamp
                  }
                }
              }
            }
          }
        }

        // Calculate ghost speed based on mode
        const ghostSpeed = ghost.scared ? GHOST_SCARED_SPEED : GHOST_SPEED

        // Calculate next position
        const nextX = ghost.x + ghost.direction.x * ghostSpeed
        const nextY = ghost.y + ghost.direction.y * ghostSpeed

        // More thorough check if the next position is valid (not a wall)
        // Reduced ghost radius for more precise collision detection
        const ghostRadius = CELL_SIZE / 2 - 3

        // Check multiple points around the ghost to prevent wall clipping
        const nextPosValid =
          isValidPosition(nextX, nextY) &&
          isValidPosition(nextX + ghostRadius * Math.sign(ghost.direction.x), nextY) &&
          isValidPosition(nextX, nextY + ghostRadius * Math.sign(ghost.direction.y)) &&
          isValidPosition(nextX - ghostRadius * Math.sign(ghost.direction.x), nextY) &&
          isValidPosition(nextX, nextY - ghostRadius * Math.sign(ghost.direction.y))

        if (nextPosValid) {
          // Move in the current direction
          ghost.x = nextX
          ghost.y = nextY

          // When moving horizontally, ensure we're centered vertically
          if (ghost.direction.x !== 0 && !atCenterY) {
            // Gradually center to avoid abrupt movements
            ghost.y = ghost.y + (centerY - ghost.y) * 0.4 // Increased from 0.3
          }

          // When moving vertically, ensure we're centered horizontally
          if (ghost.direction.y !== 0 && !atCenterX) {
            // Gradually center to avoid abrupt movements
            ghost.x = ghost.x + (centerX - ghost.x) * 0.4 // Increased from 0.3
          }
        } else {
          // We've hit a wall, align with the grid and choose a new direction
          ghost.x = centerX
          ghost.y = centerY

          // Choose a new valid direction
          const validDirections = getValidDirections(ghost.x, ghost.y)
          if (validDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * validDirections.length)
            ghost.direction = validDirections[randomIndex]
            ghost.lastDirectionChange = timestamp
          }
        }
      }
    })
  }

  // Get valid directions from a position (not walls)
  const getValidDirections = (x: number, y: number) => {
    const cellX = Math.floor(x / CELL_SIZE)
    const cellY = Math.floor(y / CELL_SIZE)

    const validDirections = []

    // Check each direction more thoroughly
    // UP
    if (cellY > 0 && board[cellY - 1][cellX] !== 1) {
      // Also check diagonally to avoid getting stuck at corners
      if (cellX > 0 && cellX < BOARD_WIDTH - 1) {
        if (board[cellY - 1][cellX - 1] !== 1 || board[cellY - 1][cellX + 1] !== 1) {
          validDirections.push(DIRECTIONS.UP)
        }
      } else {
        validDirections.push(DIRECTIONS.UP)
      }
    }

    // DOWN
    if (cellY < BOARD_HEIGHT - 1 && board[cellY + 1][cellX] !== 1) {
      // Also check diagonally to avoid getting stuck at corners
      if (cellX > 0 && cellX < BOARD_WIDTH - 1) {
        if (board[cellY + 1][cellX - 1] !== 1 || board[cellY + 1][cellX + 1] !== 1) {
          validDirections.push(DIRECTIONS.DOWN)
        }
      } else {
        validDirections.push(DIRECTIONS.DOWN)
      }
    }

    // LEFT
    if (cellX > 0 && board[cellY][cellX - 1] !== 1) {
      // Also check diagonally to avoid getting stuck at corners
      if (cellY > 0 && cellY < BOARD_HEIGHT - 1) {
        if (board[cellY - 1][cellX - 1] !== 1 || board[cellY + 1][cellX - 1] !== 1) {
          validDirections.push(DIRECTIONS.LEFT)
        }
      } else {
        validDirections.push(DIRECTIONS.LEFT)
      }
    }

    // RIGHT
    if (cellX < BOARD_WIDTH - 1 && board[cellY][cellX + 1] !== 1) {
      // Also check diagonally to avoid getting stuck at corners
      if (cellY > 0 && cellY < BOARD_HEIGHT - 1) {
        if (board[cellY - 1][cellX + 1] !== 1 || board[cellY + 1][cellX + 1] !== 1) {
          validDirections.push(DIRECTIONS.RIGHT)
        }
      } else {
        validDirections.push(DIRECTIONS.RIGHT)
      }
    }

    // If no valid directions found with the enhanced checks, fall back to basic checks
    if (validDirections.length === 0) {
      if (cellY > 0 && board[cellY - 1][cellX] !== 1) validDirections.push(DIRECTIONS.UP)
      if (cellY < BOARD_HEIGHT - 1 && board[cellY + 1][cellX] !== 1) validDirections.push(DIRECTIONS.DOWN)
      if (cellX > 0 && board[cellY][cellX - 1] !== 1) validDirections.push(DIRECTIONS.LEFT)
      if (cellX < BOARD_WIDTH - 1 && board[cellY][cellX + 1] !== 1) validDirections.push(DIRECTIONS.RIGHT)
    }

    return validDirections
  }

  const checkCollisions = () => {
    const { player, ghosts, powerMode } = gameStateRef.current

    // Check for collisions with ghosts
    for (let i = 0; i < ghosts.length; i++) {
      const ghost = ghosts[i]
      if (ghost.eaten) continue

      const distance = Math.sqrt(Math.pow(player.x - ghost.x, 2) + Math.pow(player.y - ghost.y, 2))

      // Collision detected - reduced collision threshold for more accurate detection
      if (distance < CELL_SIZE - 4) {
        if (powerMode && ghost.scared) {
          // Player eats the ghost - immediately reset to initial position
          ghost.scared = false // Ensure scared is set to false before resetting
          resetGhost(ghost, i)
          setScore((prev) => prev + 200)
        } else {
          // Ghost kills player
          setLives((prevLives) => {
            const newLives = prevLives - 1

            // Reset player position immediately without pausing
            player.x = 9 * CELL_SIZE + CELL_SIZE / 2
            player.y = 15 * CELL_SIZE + CELL_SIZE / 2
            player.direction = DIRECTIONS.RIGHT
            player.nextDirection = DIRECTIONS.RIGHT

            // Reset ghost positions
            resetGhostPositions()

            // Check game over
            if (newLives <= 0) {
              setGameOver(true)
              stopGameLoop()
            }

            return newLives
          })

          // Break out of the loop after collision is handled
          break
        }
      }
    }
  }

  const resetGhostPositions = () => {
    const { ghosts } = gameStateRef.current
    const currentTime = performance.now()

    ghosts.forEach((ghost, i) => {
      resetGhost(ghost, i)
      ghost.lastDirectionChange = currentTime
    })
  }

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    const { player } = gameStateRef.current

    // Save the current context state
    ctx.save()

    // Move to Pacman's position
    ctx.translate(player.x, player.y)

    // Rotate based on direction
    let rotation = 0
    if (player.direction === DIRECTIONS.RIGHT) rotation = 0
    else if (player.direction === DIRECTIONS.DOWN) rotation = Math.PI / 2
    else if (player.direction === DIRECTIONS.LEFT) rotation = Math.PI
    else if (player.direction === DIRECTIONS.UP) rotation = (Math.PI * 3) / 2

    ctx.rotate(rotation)

    // Draw Pacman with a smooth mouth animation
    ctx.fillStyle = "#ffff00"
    ctx.beginPath()

    // The mouth angle is between 0 and 0.5 (representing 0 to 90 degrees)
    const mouthAngle = player.mouthAngle * Math.PI

    // Draw the arc with the mouth opening
    ctx.arc(0, 0, CELL_SIZE / 2 - 1, mouthAngle, 2 * Math.PI - mouthAngle)

    // Close the path to the center
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fill()

    // Restore the context to its original state
    ctx.restore()
  }

  const drawGhosts = (ctx: CanvasRenderingContext2D) => {
    const { ghosts, powerMode, powerModeTimer } = gameStateRef.current

    ghosts.forEach((ghost) => {
      // Save the current context state
      ctx.save()

      // Move to ghost's position
      ctx.translate(ghost.x, ghost.y)

      // Determine ghost color
      let ghostColor = ghost.color
      if (ghost.scared) {
        // Flashing blue/white when power mode is about to end
        if (powerMode && powerModeTimer < 90 && Math.floor(powerModeTimer / 15) % 2 === 0) {
          ghostColor = "#FFFFFF"
        } else {
          ghostColor = "#0000FF"
        }
      } else if (ghost.eaten) {
        // Eyes only when eaten
        ghostColor = "transparent"
      }

      // Draw ghost body
      ctx.fillStyle = ghostColor

      // Draw semi-circle for the top of the ghost
      ctx.beginPath()
      ctx.arc(0, 0, CELL_SIZE / 2 - 1, Math.PI, 0, false)

      // Draw the bottom part with waves
      const ghostBottom = CELL_SIZE / 2 - 1
      ctx.lineTo(ghostBottom, ghostBottom / 2)

      // Draw wavy bottom
      for (let i = 0; i < 3; i++) {
        const startX = ghostBottom - (i * ghostBottom) / 1.5
        const endX = ghostBottom - ((i + 1) * ghostBottom) / 1.5
        ctx.quadraticCurveTo((startX + endX) / 2, ghostBottom, endX, ghostBottom / 2)
      }

      ctx.closePath()
      ctx.fill()

      // Draw eyes (white part)
      const eyeRadius = CELL_SIZE / 6
      const eyeOffsetX = CELL_SIZE / 5
      const eyeOffsetY = -CELL_SIZE / 8

      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.arc(-eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw pupils (black part)
      const pupilRadius = eyeRadius / 2
      let pupilOffsetX = 0
      let pupilOffsetY = 0

      // Move pupils based on direction
      if (ghost.direction === DIRECTIONS.LEFT) pupilOffsetX = -pupilRadius / 2
      else if (ghost.direction === DIRECTIONS.RIGHT) pupilOffsetX = pupilRadius / 2
      else if (ghost.direction === DIRECTIONS.UP) pupilOffsetY = -pupilRadius / 2
      else if (ghost.direction === DIRECTIONS.DOWN) pupilOffsetY = pupilRadius / 2

      ctx.fillStyle = "#000000"
      ctx.beginPath()
      ctx.arc(-eyeOffsetX + pupilOffsetX, eyeOffsetY + pupilOffsetY, pupilRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(eyeOffsetX + pupilOffsetX, eyeOffsetY + pupilOffsetY, pupilRadius, 0, Math.PI * 2)
      ctx.fill()

      // Restore the context to its original state
      ctx.restore()
    })
  }

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = board[y][x]

        if (cell === 1) {
          // Wall
          ctx.fillStyle = "#2121ff"
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        } else if (cell === 2) {
          // Dot
          ctx.fillStyle = "#ffb8de"
          ctx.beginPath()
          ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 10, 0, Math.PI * 2)
          ctx.fill()
        } else if (cell === 3) {
          // Power pellet
          ctx.fillStyle = "#ffb8de"
          ctx.beginPath()
          ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }

  const handleDirectionChange = (direction: string) => {
    if (!gameStarted) return

    switch (direction) {
      case "ArrowUp":
      case "w":
      case "W":
        gameStateRef.current.player.nextDirection = DIRECTIONS.UP
        break
      case "ArrowDown":
      case "s":
      case "S":
        gameStateRef.current.player.nextDirection = DIRECTIONS.DOWN
        break
      case "ArrowLeft":
      case "a":
      case "A":
        gameStateRef.current.player.nextDirection = DIRECTIONS.LEFT
        break
      case "ArrowRight":
      case "d":
      case "D":
        gameStateRef.current.player.nextDirection = DIRECTIONS.RIGHT
        break
    }
  }

  return (
    <div className="flex flex-col items-center max-h-full">
      <div className="mb-4 flex items-center justify-between w-full max-w-md">
        <div className="text-white">Score: {score}</div>
        <div className="text-white">Lives: {lives}</div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * CELL_SIZE}
          height={BOARD_HEIGHT * CELL_SIZE}
          className="border-2 border-blue-500 bg-black"
        />

        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Retro Arcade</h2>
            <Button onClick={startGame} className="bg-yellow-400 text-black hover:bg-yellow-500">
              Start Game
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over</h2>
            <p className="text-white mb-4">Final Score: {score}</p>
            <Button onClick={startGame} className="bg-yellow-400 text-black hover:bg-yellow-500">
              Play Again
            </Button>
          </div>
        )}

        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-2xl font-bold text-green-500 mb-2">You Win!</h2>
            <p className="text-white mb-4">Final Score: {score}</p>
            <Button onClick={startGame} className="bg-yellow-400 text-black hover:bg-yellow-500">
              Play Again
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-white text-center md:block hidden">
        <p>Use arrow keys to control your character</p>
      </div>

      {/* Mobile Controls */}
      <div className="mt-2">
        <MobileControls onDirectionChange={handleDirectionChange} />
      </div>
    </div>
  )
}

