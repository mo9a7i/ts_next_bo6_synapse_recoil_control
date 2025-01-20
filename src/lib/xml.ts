import { MacroData, MouseBuffer } from '@/types/macro'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'
import format from 'xml-formatter'

export function parseXML(xmlContent: string): MacroData & { originalXml: string } {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')

  const name = xmlDoc.getElementsByTagName('Name')[0]?.textContent || 'Unknown'
  const buffers: MouseBuffer[] = []

  const bufferNodes = xmlDoc.getElementsByTagName('Buffer')
  for (let i = 0; i < bufferNodes.length; i++) {
    const buffer = bufferNodes[i]
    buffers.push({
      x: parseInt(buffer.getElementsByTagName('x')[0]?.textContent || '0'),
      y: parseInt(buffer.getElementsByTagName('y')[0]?.textContent || '0'),
      time: parseFloat(buffer.getElementsByTagName('time')[0]?.textContent || '0')
    })
  }

  return {
    name,
    type: 'universal',
    defaultSensitivity: 4.0,
    mouseEvents: buffers,
    originalXml: xmlContent // Store the original XML
  }
}

// Client-side XML generation
export function generateXML(macroData: MacroData & { originalXml?: string }, pretty = false): string {
  if (typeof window === 'undefined') {
    throw new Error('generateXML must be called on the client')
  }

  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(macroData.originalXml || '<Macro></Macro>', 'text/xml')

  const macroEvents = xmlDoc.getElementsByTagName('MacroEvent')
  for (let i = 0; i < macroEvents.length; i++) {
    const macroEvent = macroEvents[i]
    const type = macroEvent.getElementsByTagName('Type')[0]
    
    if (type && type.textContent === '3') {
      const mouseEvent = macroEvent.getElementsByTagName('MouseEvent')[0]
      if (mouseEvent) {
        const oldBuffers = mouseEvent.getElementsByTagName('Buffer')
        while (oldBuffers.length > 0) {
          oldBuffers[0].parentNode?.removeChild(oldBuffers[0])
        }

        macroData.mouseEvents.forEach(event => {
          const buffer = xmlDoc.createElement('Buffer')
          
          const x = xmlDoc.createElement('x')
          x.textContent = Math.round(event.x).toString()
          buffer.appendChild(x)

          const y = xmlDoc.createElement('y')
          y.textContent = Math.round(event.y).toString()
          buffer.appendChild(y)

          const time = xmlDoc.createElement('time')
          time.textContent = event.time.toFixed(3)
          buffer.appendChild(time)

          mouseEvent.appendChild(buffer)
        })
      }
    }
  }

  const serializer = new XMLSerializer()
  const xml = serializer.serializeToString(xmlDoc)
  
  if (pretty) {
    return format(xml, {
      indentation: '  ',
      collapseContent: true,
      lineSeparator: '\n'
    })
  }
  
  return xml
} 