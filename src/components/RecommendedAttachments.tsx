'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'

interface RecommendedAttachmentsProps {
  weaponId: string
  weaponName: string
}

export function RecommendedAttachments({ weaponId, weaponName }: RecommendedAttachmentsProps) {
  const imageName = weaponName
    .replace(/[\s.]/g, '_')  // Replace spaces and dots with underscore
    .replace(/['"]/g, '')    // Remove quotes
    .toUpperCase()           // Convert to uppercase

  return (
    <Card className="p-4">
      <h2 className="text-sm font-medium mb-4">Recommended Attachments for Specific Macro</h2>
      <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
        <Image
          src={`/assets/images/weapons/recommended_attachments/${imageName}.png`}
          alt={`${weaponName} recommended attachments`}
          fill
          className="object-contain p-2"
        />
      </div>
    </Card>
  )
} 