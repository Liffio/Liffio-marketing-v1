import Image from 'next/image'
import Link from 'next/link'

type theme = 'light' | 'dark'
type size = 'small' | 'medium' | 'large'
type LogoProps = {
    theme?: theme
    size?: size
    className?: string
}
const Logo = ({ theme = 'light', size = 'large', className = '' }: LogoProps) => {
    const sizeClass = size === 'small' ? 'h-8' : size === 'medium' ? 'h-10' : 'h-12' 
    const themeImage = theme === 'light' ? '/logo/inline transparent.png' : '/logo/logo-light.png'
    return (
        <Link href="/" className={`w-auto ${sizeClass} flex items-start justify-start ${className}`}>
            <img src={themeImage} alt="Liffio" className={`${sizeClass} object-contain ${className}`} />
        </Link>
    )
};

export default Logo;