'use client'

import { useEffect, useRef } from 'react'
import { MacroData } from '@/types/macro'

interface MacroVisualizerProps {
  macroData: MacroData
  width?: number
  height?: number
}

export function MacroVisualizer({ macroData, width = 300, height = 300 }: MacroVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with black background
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    // Set up styling
    ctx.strokeStyle = '#3b82f6' // blue-500
    ctx.lineWidth = 2
    ctx.lineCap = 'round'

    // Find the bounds of the pattern
    const xValues = macroData.mouseEvents.map(e => e.x)
    const yValues = macroData.mouseEvents.map(e => e.y)
    
    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues)
    const yMax = Math.max(...yValues)

    // Calculate scaling to fit the pattern in the canvas with padding
    const padding = 20
    const xScale = (width - padding * 2) / (xMax - xMin)
    const yScale = (height - padding * 2) / (yMax - yMin)
    const scale = Math.min(xScale, yScale)

    // Draw the recoil pattern
    ctx.beginPath()
    macroData.mouseEvents.forEach((event, index) => {
      const x = (event.x - xMin) * scale + padding
      const y = (event.y - yMin) * scale + padding

      if (index === 0) {
        ctx.moveTo(x, y)
        // Mark start point
        ctx.fillStyle = '#22c55e'
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.lineTo(x, y)
        // Mark points
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    })
    ctx.stroke()

  }, [macroData, width, height])

  return (
    <div className="relative border rounded-lg p-6 bg-black shadow-lg">
      <div className="absolute top-4 left-4 text-sm text-white/70">
        Recoil Pattern
      </div>
      <div className="flex items-center justify-center pt-6">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
        />
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-white/50">
        {macroData.mouseEvents.length} points
      </div>
    </div>
  )
} 