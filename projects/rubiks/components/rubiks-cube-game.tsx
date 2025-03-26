"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { RubiksCube } from "./rubiks-cube"
import { RotateControls } from "./rotate-controls"
import * as THREE from "three"

export default function RubiksCubeGame() {
  const [cubeState, setCubeState] = useState<string[][][]>([])
  const [isSolved, setIsSolved] = useState(false)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [key, setKey] = useState(0) // Key to force re-render of the cube
  const groupRef = useRef<THREE.Group>(null)

  // Initialize cube state
  useEffect(() => {
    if (!gameStarted) return

    // Create a solved cube state (3x3x3)
    const colors = ["red", "orange", "yellow", "green", "blue", "white"]
    const newCubeState = colors.map((color) =>
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(color)),
    )

    setCubeState(newCubeState)
    setIsSolved(true)
    setMoves(0)
  }, [gameStarted, key])

  // Scramble the cube
  const scrambleCube = () => {
    if (!groupRef.current) return

    // Perform a series of random rotations
    const faces = ["front", "back", "left", "right", "top", "bottom"]
    const directions = ["clockwise", "counterclockwise"]

    // Apply 20 random rotations
    const scrambleCount = 20
    let scrambleIndex = 0

    const performScramble = () => {
      if (scrambleIndex >= scrambleCount) {
        setIsSolved(false)
        setMoves(0)
        return
      }

      const randomFace = faces[Math.floor(Math.random() * faces.length)]
      const randomDirection = directions[Math.floor(Math.random() * directions.length)]

      rotateFace(randomFace, randomDirection)

      // Schedule the next rotation
      setTimeout(() => {
        scrambleIndex++
        performScramble()
      }, 100)
    }

    performScramble()
  }

  // Reset the cube to solved state
  const resetCube = () => {
    // Completely reset the cube by forcing a re-render with a new key
    setKey((prevKey) => prevKey + 1)

    // Reset the internal state
    const colors = ["red", "orange", "yellow", "green", "blue", "white"]
    const newCubeState = colors.map((color) =>
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(color)),
    )

    setCubeState(newCubeState)
    setIsSolved(true)
    setMoves(0)
  }

  // Handle cube face rotation
  const rotateFace = (face: string, direction: string) => {
    if (!cubeState.length) return

    // Create a deep copy of the current cube state
    const newCubeState = JSON.parse(JSON.stringify(cubeState))

    // Update the cube state based on the rotation
    // This is a simplified implementation that will visually rotate the cube
    if (groupRef.current) {
      let axis = [0, 0, 0]
      const angle =
        direction.includes("clockwise") || direction === "right" || direction === "up" ? Math.PI / 2 : -Math.PI / 2

      switch (face) {
        case "front":
          axis = [0, 0, 1]
          break
        case "back":
          axis = [0, 0, -1]
          break
        case "left":
          axis = [-1, 0, 0]
          break
        case "right":
          axis = [1, 0, 0]
          break
        case "top":
          axis = [0, 1, 0]
          break
        case "bottom":
          axis = [0, -1, 0]
          break
      }

      // Trigger the rotation animation
      rotateLayer(face, axis, angle)
    }

    setCubeState(newCubeState)
    setMoves((prev) => prev + 1)

    // Check if cube is solved after rotation
    // In a real implementation, this would check the actual state
    checkIfSolved()
  }

  const rotateLayer = (face: string, axis: number[], angle: number) => {
    if (!groupRef.current) return

    // Find the cubies that belong to the face being rotated
    const faceGroup = new THREE.Group()
    const threshold = 0.5 // Distance threshold to determine if a cubie is on the face

    groupRef.current.children.forEach((child) => {
      const position = child.position.clone()

      // Check if the cubie is on the specified face
      let isOnFace = false
      if (face === "front" && Math.abs(position.z - 1) < threshold) isOnFace = true
      if (face === "back" && Math.abs(position.z + 1) < threshold) isOnFace = true
      if (face === "left" && Math.abs(position.x + 1) < threshold) isOnFace = true
      if (face === "right" && Math.abs(position.x - 1) < threshold) isOnFace = true
      if (face === "top" && Math.abs(position.y - 1) < threshold) isOnFace = true
      if (face === "bottom" && Math.abs(position.y + 1) < threshold) isOnFace = true

      if (isOnFace) {
        // Add this cubie to the rotation group
        faceGroup.add(child.clone())

        // Store the original position
        child.userData.originalPosition = position.clone()
        child.userData.rotating = true
      }
    })

    // Animate the rotation
    const axisVector = new THREE.Vector3(axis[0], axis[1], axis[2])
    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axisVector.normalize(), angle)

    // Apply rotation to each cubie in the face
    groupRef.current.children.forEach((child) => {
      if (child.userData.rotating) {
        const newPosition = child.userData.originalPosition.clone().applyMatrix4(rotationMatrix)
        child.position.copy(newPosition)
        child.rotation.setFromRotationMatrix(
          new THREE.Matrix4()
            .makeRotationAxis(axisVector.normalize(), angle)
            .multiply(new THREE.Matrix4().makeRotationFromEuler(child.rotation)),
        )
        delete child.userData.rotating
      }
    })
  }

  const checkIfSolved = () => {
    if (!groupRef.current) return

    // Get all cubies
    const cubies = groupRef.current.children

    // Check if each face has the same color
    const faces = [
      { name: "right", axis: "x", value: 1 },
      { name: "left", axis: "x", value: -1 },
      { name: "top", axis: "y", value: 1 },
      { name: "bottom", axis: "y", value: -1 },
      { name: "front", axis: "z", value: 1 },
      { name: "back", axis: "z", value: -1 },
    ]

    let allFacesSolved = true

    // For each face, check if all visible cubies have the same orientation
    faces.forEach((face) => {
      const faceCubies = []

      // Find cubies on this face
      cubies.forEach((cubie) => {
        const position = cubie.position
        const threshold = 0.5

        if (face.axis === "x" && Math.abs(position.x - face.value) < threshold) {
          faceCubies.push(cubie)
        } else if (face.axis === "y" && Math.abs(position.y - face.value) < threshold) {
          faceCubies.push(cubie)
        } else if (face.axis === "z" && Math.abs(position.z - face.value) < threshold) {
          faceCubies.push(cubie)
        }
      })

      // Check if all cubies on this face have the same orientation
      if (faceCubies.length > 0) {
        const referenceRotation = faceCubies[0].rotation.clone()

        for (let i = 1; i < faceCubies.length; i++) {
          const rotation = faceCubies[i].rotation

          // Compare rotations (with some tolerance for floating point errors)
          const tolerance = 0.1
          if (
            Math.abs(rotation.x - referenceRotation.x) > tolerance ||
            Math.abs(rotation.y - referenceRotation.y) > tolerance ||
            Math.abs(rotation.z - referenceRotation.z) > tolerance
          ) {
            allFacesSolved = false
            break
          }
        }
      }
    })

    setIsSolved(allFacesSolved)
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {!gameStarted ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-background p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-4">Rubik's Cube Game</h1>
            <p className="mb-6">Rotate the cube and solve the puzzle!</p>
            <Button onClick={() => setGameStarted(true)} className="px-6 py-3">
              Start Game
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 z-10 bg-background/80 p-4 rounded-lg">
            <div className="text-lg font-bold mb-2">Moves: {moves}</div>
            {isSolved && moves > 0 && <div className="text-green-500 font-bold mb-2">Solved! 🎉</div>}
            <div className="flex gap-2">
              <Button onClick={scrambleCube} variant="outline">
                Scramble
              </Button>
              <Button onClick={resetCube} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          <Canvas camera={{ position: [0, 0, 8], fov: 50 }} key={key}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <RubiksCube isSolved={isSolved} ref={groupRef} />
            <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />
            <Environment preset="city" />
          </Canvas>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <RotateControls onRotate={rotateFace} />
          </div>
        </>
      )}
    </div>
  )
}

