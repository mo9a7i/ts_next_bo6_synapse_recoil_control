import { Card } from '@/components/ui/card'
import { weapons } from '@/data/weapons'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { TwitterIcon, GithubIcon } from 'lucide-react'

export const dynamic = 'force-static'

export default function Home() {
  const t = useTranslations()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('Common.title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weapons Grid (2/3) */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {weapons.map(weapon => (
              <Card key={weapon.id} className="overflow-hidden">
                <Link href={`/weapons/${weapon.id}`}>
                  <div className="relative aspect-video">
                    <Image
                      src={weapon.image}
                      alt={weapon.name}
                      fill
                      className="object-contain p-2"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{weapon.name}</h2>
                    <div className="flex gap-2 mt-2">
                      {weapon.hasUniversal && (
                        <Badge variant="secondary">{t('Common.universal')}</Badge>
                      )}
                      {weapon.hasSpecific && (
                        <Badge variant="outline">{t('Common.specific')}</Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('About.title')}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>{t('About.description')}</p>
              
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">{t('About.universal.title')}</h3>
                <p>• {t('About.universal.bullet1')}</p>
                <p>• {t('About.universal.bullet2')}</p>
                <p>• {t('About.universal.bullet3')}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-foreground">{t('About.specific.title')}</h3>
                <p>• {t('About.specific.bullet1')}</p>
                <p>• {t('About.specific.bullet2')}</p>
                <p>• {t('About.specific.bullet3')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('Settings.title')}</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>• {t('Settings.mouseSensitivity')}</p>
              <p>• {t('Settings.adsSensitivity')}</p>
              <p>• {t('Settings.adsFov')}</p>
            </div>
          </Card>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <a 
                href="https://twitter.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{t('Footer.copyright')}</p>
              <p className="mt-1">{t('Footer.disclaimer')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 