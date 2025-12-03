"use client"

import { useEffect, useRef } from "react"

// NO MOCK DATA - Dark grid background for professional terminal look
export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const gridSize = 32
    let offset = 0

    const draw = () => {
      ctx.fillStyle = "#0f1117"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Subtle animated glow points at intersections
      const time = Date.now() * 0.001
      ctx.fillStyle = "rgba(45, 212, 191, 0.08)"

      for (let x = 0; x < canvas.width; x += gridSize * 4) {
        for (let y = 0; y < canvas.height; y += gridSize * 4) {
          const pulse = Math.sin(time + x * 0.01 + y * 0.01) * 0.5 + 0.5
          const size = 2 + pulse * 2
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      offset = (offset + 0.2) % gridSize
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-10" style={{ opacity: 0.4 }} />
}
