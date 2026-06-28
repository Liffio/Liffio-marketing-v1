
import Image from 'next/image'

type Theme = 'light' | 'dark'
type Size = 'xs' | 'small' | 'medium' | 'large'

export const LIFFIO_LOGO_SRC = {
  light: '/logo/inline-transparent.webp',
  dark: '/logo/logo-light.webp',
} as const

const SIZE_CLASS: Record<Size, string> = {
  xs: 'h-5',
  small: 'h-8',
  medium: 'h-10',
  large: 'h-12',
}

type LiffioLogoMarkProps = {
  theme?: Theme
  size?: Size
  className?: string
  priority?: boolean
}

/** Logo image without navigation - for mockups, avatars, and animations. */
export function LiffioLogoMark({ theme = 'light', size = 'large', className = '', priority = false }: LiffioLogoMarkProps) {
  const src = theme === 'light' ? LIFFIO_LOGO_SRC.light : LIFFIO_LOGO_SRC.dark
  return (
    <Image
      src={src}
      alt="Liffio"
      width={160}
      height={53}
      priority={priority}
      className={`w-auto object-contain ${SIZE_CLASS[size]} ${className}`}
    />
  )
}

type LiffioAvatarProps = {
  size?: number
  className?: string
}

/** Circular avatar for phone / chat simulations. */
export function LiffioAvatar({ size = 6, className = '' }: LiffioAvatarProps) {
  const px = size * 4
  return (
    <div
      className={`rounded-full flex-shrink-0 overflow-hidden bg-white flex items-center justify-center ${className}`}
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
    >
      <LiffioLogoMark theme="light" size="xs" className="!h-[78%] max-h-full w-auto" />
    </div>
  )
}

type LogoProps = {
  theme?: Theme
  size?: 'small' | 'medium' | 'large'
  className?: string
  priority?: boolean
}

const Logo = ({ theme = 'light', size = 'large', className = '', priority = false }: LogoProps) => {
  const markSize: Size = size === 'small' ? 'small' : size === 'medium' ? 'medium' : 'large'
  return (
    <a href="/" className={`flex w-auto items-start justify-start ${className}`}>
      <LiffioLogoMark theme={theme} size={markSize} priority={priority} />
    </a>
  )
}

export default Logo
