export interface MouseBuffer {
  x: number
  y: number
  time: number
}

export interface MacroData {
  name: string
  type: 'universal' | 'specific'
  defaultSensitivity: number
  mouseEvents: MouseBuffer[]
  originalXml?: string
} 