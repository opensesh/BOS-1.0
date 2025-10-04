import { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: keyof JSX.IntrinsicElements
}

export default function Card({ as: Tag = 'div', className, ...props }: CardProps) {
  return (
    <Tag
      className={`rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 shadow-sm ${className ?? ''}`}
      {...props}
    />
  )
}


