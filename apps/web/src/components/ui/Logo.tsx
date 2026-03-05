// Use a plain <img> tag so the path is never transformed by next/image.
// NEXT_PUBLIC_BASE_PATH is set to '/SalonShop' in the GitHub Actions workflow.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 36, className = '' }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${base}/logo.png`}
      alt="SalonShop"
      width={size}
      height={size}
      className={`object-contain rounded-lg ${className}`}
    />
  )
}
