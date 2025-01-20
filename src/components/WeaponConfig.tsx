'use client'

import { MacroVisualizer } from '@/components/MacroVisualizer'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'
import { parseXML, generateXML } from '@/lib/xml'
import { adjustMacroForSensitivity } from '@/lib/macro'
import { useState } from 'react'
import { MacroData } from '@/types/macro'
import Image from 'next/image'
import { RecommendedAttachments } from '@/components/RecommendedAttachments'
import { useTranslations } from 'next-intl'

interface WeaponConfigProps {
  universalMacroData: MacroData
  specificMacroData?: MacroData
  weaponImage: string
}

export function WeaponConfig({ universalMacroData, specificMacroData, weaponImage }: WeaponConfigProps) {
  const t = useTranslations()
  const [sensitivity, setSensitivity] = useState(4.0)
  const [macroType, setMacroType] = useState<'universal' | 'specific'>('universal')
  
  // Use the selected macro data with fallback to universal
  const currentMacroData = macroType === 'universal' || !specificMacroData 
    ? universalMacroData 
    : specificMacroData

  // Calculate adjusted values for display with rounded integers
  const adjustedSampleMoves = currentMacroData.mouseEvents
    .slice(0, 20)
    .map(event => ({
      // Round to integers after applying sensitivity adjustment
      x: Math.round(event.x * (4.0 / sensitivity)),
      y: Math.round(event.y * (4.0 / sensitivity)),
    }))

  const handleDownload = () => {
    const adjustedMacro = adjustMacroForSensitivity(currentMacroData, sensitivity)
    const xml = generateXML(adjustedMacro, true) // Add true for pretty printing
    const blob = new Blob([xml], { type: 'text/xml' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentMacroData.name}_${sensitivity}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const multiplicationFactor = (4.0 / sensitivity).toFixed(4)

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{universalMacroData.name}</h1>
          
          <div className="flex gap-4">
            <Button 
              variant={macroType === 'universal' ? 'default' : 'outline'}
              onClick={() => setMacroType('universal')}
            >
              {t('Common.universal')}
            </Button>
            {specificMacroData && (
              <Button 
                variant={macroType === 'specific' ? 'default' : 'outline'}
                onClick={() => setMacroType('specific')}
              >
                {t('Common.specific')}
              </Button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4 bg-muted/50">
              <h2 className="font-semibold mb-3">{t('Important.title')}</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• {t('Important.defaultSettings')}</p>
                <p>• {t('Important.adsFov')}</p>
                <p>• {t('Important.mouseDpi')}</p>
                <p>• {t('Important.aimHigh')}</p>
                <p>• {t('Important.aimLow')}</p>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">{t('Common.sensitivity')}</label>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{t('Common.sensitivityTip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-4">
                <Slider
                  min={0.01}
                  max={99.0}
                  step={0.01}
                  value={[sensitivity]}
                  onValueChange={([value]) => setSensitivity(value)}
                />
                <Input
                  type="number"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-2">{t('Common.multiplicationFactor')}</div>
              <div className="text-2xl font-bold">{multiplicationFactor}</div>
            </Card>

            <Button onClick={handleDownload} size="lg" className="w-full">
              {t('Common.download')}
            </Button>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-medium">{t('Common.sampleMovements')}</h2>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{t('Common.sampleMovementsTip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Card dir="ltr" className="bg-zinc-950 text-zinc-50 p-4 font-mono text-sm">
                {adjustedSampleMoves.map((event, i) => (
                  <div key={i} className="text-blue-400">
                    [{i}] x: {event.x}, y: {event.y}
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            <div className="relative bg-black w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={weaponImage}
                alt={currentMacroData.name}
                fill
                className="object-contain p-2"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-medium">{t('Common.recoilPattern')}</h2>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{t('Common.recoilPatternTip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative  bg-black rounded-lg overflow-hidden">
                <MacroVisualizer macroData={currentMacroData} />
              </div>
            </div>

            {macroType === 'specific' && (
              <RecommendedAttachments 
                weaponId={currentMacroData.name} 
                weaponName={currentMacroData.name}
              />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
} 