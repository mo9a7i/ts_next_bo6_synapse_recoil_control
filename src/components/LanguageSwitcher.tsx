'use client'

import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'

export function LanguageSwitcher() {
  const pathname = usePathname()
  const locale = useLocale()
  
  // Remove the current locale from pathname to get the base path
  const basePath = pathname.replace(`/${locale}`, '/')
  
  // Toggle between 'en' and 'ar'
  const nextLocale = locale === 'en' ? 'ar' : 'en'

  return (
    <Button 
      variant="ghost" 
      size="sm"
      asChild
    >
      <Link href={basePath} locale={nextLocale}>
        {nextLocale === 'en' ? 'English' : 'العربية'}
      </Link>
    </Button>
  )
} 