import type { AvatarPreset } from '../types'

// Preset/demo avatars used by the free "Guest Explore" flow (blueprint: docs/guest-trial-strategy.md).
// Renders for these are "cached/shared" — represented here as instant, zero-cost selection.
export const AVATARS: AvatarPreset[] = [
  { id: 'a-slim',    label: 'Slim',     bodyType: 'slim',     skin: '#e8b98f', heightCm: 170, measurements: { chest: 90,  waist: 74,  hip: 92,  shoulder: 42, inseam: 79 }, confidence: 0.84 },
  { id: 'a-regular', label: 'Regular',  bodyType: 'regular',  skin: '#d29b6e', heightCm: 173, measurements: { chest: 98,  waist: 84,  hip: 100, shoulder: 45, inseam: 80 }, confidence: 0.86 },
  { id: 'a-athletic',label: 'Athletic', bodyType: 'athletic', skin: '#b87a4b', heightCm: 178, measurements: { chest: 104, waist: 82,  hip: 100, shoulder: 48, inseam: 83 }, confidence: 0.85 },
  { id: 'a-curvy',   label: 'Curvy',    bodyType: 'curvy',    skin: '#c98a5a', heightCm: 165, measurements: { chest: 102, waist: 82,  hip: 112, shoulder: 41, inseam: 74 }, confidence: 0.82 },
  { id: 'a-plus',    label: 'Plus',     bodyType: 'plus',     skin: '#8a5a36', heightCm: 168, measurements: { chest: 116, waist: 104, hip: 122, shoulder: 46, inseam: 75 }, confidence: 0.80 },
  { id: 'a-tall',    label: 'Tall',     bodyType: 'tall',     skin: '#e3ad7f', heightCm: 188, measurements: { chest: 100, waist: 86,  hip: 101, shoulder: 47, inseam: 90 }, confidence: 0.83 },
]

export const avatarById = (id: string) => AVATARS.find(a => a.id === id) ?? AVATARS[1]
