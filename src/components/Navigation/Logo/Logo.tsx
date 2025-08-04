'use client'

import Link from 'next/link'

type TLogoProps = { size?: 'sm' | 'md' | 'lg' }

const LOGO_SIZES = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 72, height: 72 }
}

const Logo = ({ size = 'md' }: TLogoProps) => {
  const logoSize = LOGO_SIZES[size]

  return (
    <Link href="/">
      <img
        src="https://cdn.bettamax.com/dev/2025-06-26/logo_nhahaystudio.jpg"
        alt="logo"
        width={logoSize?.width}
        height={logoSize?.height}
      />
    </Link>
  )
}

export default Logo
