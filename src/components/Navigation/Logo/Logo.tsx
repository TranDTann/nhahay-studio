'use client'

import Link from 'next/link'

type TLogoProps = { size?: 'xs' | 'sm' | 'md' | 'lg' }

const LOGO_SIZES = {
  xs: { width: 16, height: 16 },
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 72, height: 72 }
}

const Logo = ({ size = 'md' }: TLogoProps) => {
  const logoSize = LOGO_SIZES[size]

  return (
    <Link href="/" style={{ width: logoSize.width, height: logoSize.height }}>
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
