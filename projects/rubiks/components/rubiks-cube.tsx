"use client"

import React from "react"
import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group, Mesh } from "three"

interface CubieProps {
  position: [number, number, number]
  colors: string[]
}

interface RubiksCubeProps {
  isSolved: boolean
  ref?: React.RefObject<Group>
}

// Individual cubie (small cube) component
function Cubie({ position, colors }: CubieProps) {
  const meshRef = useRef<Mesh>(null)

  // Map colors to faces: [right, left, top, bottom, front, back]
  const colorMap = {
    red: "#e53935",
    orange: "#ff9800",
    yellow: "#fdd835",
    green: "#43a047",
    blue: "#1e88e5",
    white: "#f5f5f5",
    black: "#212121",
  }

  // Store the original position and colors for solved state detection
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.originalPosition = [...position]
      meshRef.current.userData.originalColors = [...colors]

      // Set the name to the position for easy reset
      meshRef.current.name = `${position[0]}-${position[1]}-${position[2]}`
    }
  }, [])

  return (
    <mesh ref={meshRef} position={position} castShadow name={`${position[0]}-${position[1]}-${position[2]}`}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshStandardMaterial
        attach="material-0"
        color={colors[0] ? colorMap[colors[0] as keyof typeof colorMap] : colorMap.black}
      />
      <meshStandardMaterial
        attach="material-1"
        color={colors[1] ? colorMap[colors[1] as keyof typeof colorMap] : colorMap.black}
      />
      <meshStandardMaterial
        attach="material-2"
        color={colors[2] ? colorMap[colors[2] as keyof typeof colorMap] : colorMap.black}
      />
      <meshStandardMaterial
        attach="material-3"
        color={colors[3] ? colorMap[colors[3] as keyof typeof colorMap] : colorMap.black}
      />
      <meshStandardMaterial
        attach="material-4"
        color={colors[4] ? colorMap[colors[4] as keyof typeof colorMap] : colorMap.black}
      />
      <meshStandardMaterial
        attach="material-5"
        color={colors[5] ? colorMap[colors[5] as keyof typeof colorMap] : colorMap.black}
      />
    </mesh>
  )
}

// Main Rubik's Cube component
export const RubiksCube = React.forwardRef<Group, RubiksCubeProps>(({ isSolved }, ref) => {
  const localRef = useRef<Group>(null)
  const groupRef = ref || localRef

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle rotation when idle, but only if not being actively rotated
      const isRotating = groupRef.current.children.some((child) => child.userData.rotating)

      if (!isRotating) {
        // Gentle rotation when idle
        groupRef.current.rotation.y += delta * 0.1

        // Celebration rotation when solved
        if (isSolved) {
          groupRef.current.rotation.x += delta * 0.2
          groupRef.current.rotation.z += delta * 0.1
        }
      }
    }
  })

  // Create a 3x3x3 cube
  const createCube = () => {
    const cubies = []
    const positions = [-1, 0, 1]

    for (const x of positions) {
      for (const y of positions) {
        for (const z of positions) {
          // Skip the inner cube (not visible)
          if (x === 0 && y === 0 && z === 0) continue

          // Determine colors for each face
          const colors = [
            x === 1 ? "red" : "", // right
            x === -1 ? "orange" : "", // left
            y === 1 ? "yellow" : "", // top
            y === -1 ? "white" : "", // bottom
            z === 1 ? "green" : "", // front
            z === -1 ? "blue" : "", // back
          ]

          cubies.push(<Cubie key={`${x}-${y}-${z}`} position={[x, y, z]} colors={colors} />)
        }
      }
    }

    return cubies
  }

  return <group ref={groupRef}>{createCube()}</group>
})

