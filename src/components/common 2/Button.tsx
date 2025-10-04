import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-aperol text-brand-vanilla hover:bg-brand-aperol/90 focus-visible:outline-brand-aperol',
  secondary:
    'bg-white/10 text-brand-vanilla hover:bg-white/20 focus-visible:outline-white/40',
  ghost: 'bg-transparent text-brand-vanilla hover:bg-white/10 focus-visible:outline-white/30',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', fullWidth, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={
        `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium ` +
        `transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ` +
        `${VARIANT_STYLES[variant]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`
      }
      {...props}
    />
  )
})

export default Button


