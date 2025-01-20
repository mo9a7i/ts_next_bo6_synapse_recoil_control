'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const t = useTranslations()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {t('Common.title')}
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('Common.lightMode') : t('Common.darkMode')}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  )
} 