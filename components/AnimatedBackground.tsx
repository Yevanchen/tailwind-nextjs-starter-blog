'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface Circle {
  id: string
  x: number
  y: number
  color: string
}

const lightColors = ['#90EE90', '#87CEEB', '#DDA0DD', '#FFFFE0']
const darkColors = ['#FF0000', '#0000FF', '#FFFF00', '#FF0000']

const generateRandomPosition = () => ({
  x: Math.random(),
  y: Math.random(),
})

const AnimatedBackground: React.FC = () => {
  const [circles, setCircles] = useState<Circle[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    const colors = theme === 'dark' ? darkColors : lightColors
    const initialCircles = colors.map((color) => ({
      id: Math.random().toString(),
      ...generateRandomPosition(),
      color,
    }))
    setCircles(initialCircles)

    const intervalId = setInterval(() => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => ({
          ...circle,
          ...generateRandomPosition(),
        }))
      )
    }, 3000)

    return () => clearInterval(intervalId)
  }, [theme])

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
    >
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full blur-[130px] transition-all duration-4000"
          style={{
            backgroundColor: circle.color,
            left: `${circle.x * 100}%`,
            top: `${circle.y * 100}%`,
            width: '50%',
            height: '50%',
          }}
        />
      ))}
    </div>
  )
}

export default AnimatedBackground
