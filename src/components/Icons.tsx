import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function IconFrame({ children, ...svgProps }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...svgProps}
    >
      {children}
    </svg>
  )
}

export function PencilIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <path d="M12.6 3.9l3.5 3.5M4 16l.8-3.9 8.6-8.6a1.6 1.6 0 0 1 2.3 0l.8.8a1.6 1.6 0 0 1 0 2.3l-8.6 8.6L4 16z" />
    </IconFrame>
  )
}

export function TrashIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <path d="M3.5 5.5h13M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5.5 5.5l.7 10a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4l.7-10M8.5 9v4.5M11.5 9v4.5" />
    </IconFrame>
  )
}

export function SearchIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <circle cx="8.75" cy="8.75" r="5.25" />
      <path d="M12.6 12.6l4 4" />
    </IconFrame>
  )
}

export function PlusIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <path d="M10 4v12M4 10h12" />
    </IconFrame>
  )
}
