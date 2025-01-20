import { MacroData, MouseBuffer } from "@/types/macro"

export function adjustMacroForSensitivity(
  macroData: MacroData, 
  newSensitivity: number
): MacroData {
  const sensitivityRatio = 4.0 / newSensitivity
  
  return {
    ...macroData,
    mouseEvents: macroData.mouseEvents.map((event: MouseBuffer) => ({
      x: Math.round(event.x * sensitivityRatio),
      y: Math.round(event.y * sensitivityRatio),
      time: event.time
    }))
  }
} 