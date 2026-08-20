interface P { size?: number; className?: string }
const S = ({ size = 20, children, className }: P & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>
)

export const IconSearch = (p: P) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></S>
export const IconCart = (p: P) => <S {...p}><circle cx="9" cy="21" r="1.6" /><circle cx="18" cy="21" r="1.6" /><path d="M2.5 3h2l2.2 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6" /></S>
export const IconHeart = (p: P) => <S {...p}><path d="M12 20s-7-4.4-9.3-8.5C1 8 2.6 4.6 6 4.6c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 5 3.4 3.3 6.9C19 15.6 12 20 12 20Z" /></S>
export const IconUser = (p: P) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></S>
export const IconMenu = (p: P) => <S {...p}><path d="M3 6h18M3 12h18M3 18h18" /></S>
export const IconClose = (p: P) => <S {...p}><path d="M18 6 6 18M6 6l12 12" /></S>
export const IconStar = (p: P) => <svg width={p.size ?? 14} height={p.size ?? 14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.9z" /></svg>
export const IconArrowR = (p: P) => <S {...p}><path d="M5 12h14M13 6l6 6-6 6" /></S>
export const IconRotate = (p: P) => <S {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></S>
export const IconZoomIn = (p: P) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="M11 8v6M8 11h6M21 21l-4.3-4.3" /></S>
export const IconZoomOut = (p: P) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="M8 11h6M21 21l-4.3-4.3" /></S>
export const IconShirt = (p: P) => <S {...p}><path d="M15 3l5 3-2 4-2-1v12H8V9L6 10 4 6l5-3a3 3 0 0 0 6 0Z" /></S>
export const IconPants = (p: P) => <S {...p}><path d="M6 3h12l-1 18h-4l-1-9-1 9H6L7 3" /></S>
export const IconJacket = (p: P) => <S {...p}><path d="M8 3 4 6v13h4V3ZM16 3l4 3v13h-4V3ZM8 3h8v16H8zM12 3v16" /></S>
export const IconShoe = (p: P) => <S {...p}><path d="M2 17h20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2ZM2 17l1-7 4 2 3-4c2 3 5 4.5 12 5v4Z" /></S>
export const IconWatch = (p: P) => <S {...p}><circle cx="12" cy="12" r="5" /><path d="M12 9v3l2 1M9 3h6l-.5 4M9 21h6l-.5-4" /></S>
export const IconGlasses = (p: P) => <S {...p}><circle cx="6.5" cy="14" r="3.2" /><circle cx="17.5" cy="14" r="3.2" /><path d="M9.7 13.5c.9-1 3.7-1 4.6 0M3 11l2-4M21 11l-2-4" /></S>
export const IconBag = (p: P) => <S {...p}><path d="M6 8h12l1 12H5L6 8ZM9 8V6a3 3 0 0 1 6 0v2" /></S>
export const IconCheck = (p: P) => <S {...p}><path d="M20 6 9 17l-5-5" /></S>
export const IconShield = (p: P) => <S {...p}><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6Z" /><path d="m9 12 2 2 4-4" /></S>
export const IconSparkle = (p: P) => <S {...p}><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6Z" /><path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" /></S>
export const IconLayers = (p: P) => <S {...p}><path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 16l9 5 9-5" /></S>
export const IconStore = (p: P) => <S {...p}><path d="M4 9V5h16v4M4 9l1 11h14l1-11M4 9h16M9 20v-6h6v6" /></S>
export const IconChart = (p: P) => <S {...p}><path d="M4 20V4M4 20h16M8 16v-5M13 16V8M18 16v-8" /></S>
export const IconTag = (p: P) => <S {...p}><path d="M20 12 12 20l-8-8V4h8Z" /><circle cx="8.5" cy="8.5" r="1.4" /></S>
export const IconRuler = (p: P) => <S {...p}><path d="M3 8h18v8H3zM7 8v3M11 8v4M15 8v3M19 8v4" /></S>
export const IconGrid = (p: P) => <S {...p}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /></S>
export const IconLink = (p: P) => <S {...p}><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></S>
