import type { AvatarPreset, Product } from '../types'

interface Garments {
  top?: Product; bottom?: Product; outer?: Product; shoes?: Product;
  watch?: Product; sunglasses?: Product; accessory?: Product;
}
interface Props { avatar: AvatarPreset; garments: Garments; angle: number; zoom: number }

const WIDTHS: Record<string, { sh: number; wa: number; hip: number; vScale: number }> = {
  slim:     { sh: 44, wa: 30, hip: 38, vScale: 1 },
  regular:  { sh: 50, wa: 38, hip: 46, vScale: 1 },
  athletic: { sh: 56, wa: 38, hip: 46, vScale: 1 },
  curvy:    { sh: 48, wa: 36, hip: 58, vScale: 0.98 },
  plus:     { sh: 60, wa: 56, hip: 66, vScale: 0.98 },
  tall:     { sh: 50, wa: 38, hip: 46, vScale: 1.08 },
}

export default function Avatar({ avatar, garments, angle, zoom }: Props) {
  const b = WIDTHS[avatar.bodyType] ?? WIDTHS.regular
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const mirror = Math.sin(rad) < 0 ? -1 : 1
  const scaleX = 0.32 + 0.68 * Math.abs(cos)
  const isBack = cos < -0.35
  const isProfile = Math.abs(cos) < 0.42

  const cx = 100
  const skin = avatar.skin
  const topC = garments.top?.hex
  const botC = garments.bottom?.hex
  const outC = garments.outer?.hex
  const shoeC = garments.shoes?.hex ?? '#c9c6d6'
  const legFill = botC ?? skin

  // shoulder/hip x positions
  const shL = cx - b.sh, shR = cx + b.sh
  const waL = cx - b.wa, waR = cx + b.wa
  const hipL = cx - b.hip, hipR = cx + b.hip

  return (
    <div style={{
      width: '100%', height: '100%', display: 'grid', placeItems: 'center',
      transform: `scale(${zoom})`, transition: 'transform .25s ease',
    }}>
      <div style={{ transform: `scaleX(${mirror * scaleX})`, transition: 'transform .35s cubic-bezier(.2,.7,.3,1)', width: '78%' }}>
        <svg viewBox="0 0 200 330" style={{ width: '100%', filter: 'drop-shadow(0 12px 18px rgba(60,40,110,.16))' }} role="img"
          aria-label={`${avatar.label} avatar${garments.top ? ' wearing ' + garments.top.name : ''}${isBack ? ', back view' : isProfile ? ', side view' : ', front view'}`}>
          {/* shadow floor */}
          <ellipse cx={cx} cy="322" rx="52" ry="7" fill="rgba(60,40,110,.10)" />

          {/* legs */}
          <path d={`M${waL + 4} 190 L${cx - 3} 300 L${cx - 20} 300 L${hipL + 4} 195 Z`} fill={legFill} />
          <path d={`M${waR - 4} 190 L${cx + 3} 300 L${cx + 20} 300 L${hipR - 4} 195 Z`} fill={legFill} />
          {/* feet / shoes */}
          <path d={`M${cx - 23} 298 q-10 0 -12 9 l0 4 h22 l2 -13 Z`} fill={shoeC} />
          <path d={`M${cx + 23} 298 q10 0 12 9 l0 4 h-22 l-2 -13 Z`} fill={shoeC} />

          {/* arms (skin), far arm hidden in profile */}
          {!isProfile && (
            <path d={`M${shL + 3} 120 L${shL - 16} 205 L${shL - 6} 208 L${shL + 14} 128 Z`} fill={skin} />
          )}
          <path d={`M${shR - 3} 120 L${shR + 16} 205 L${shR + 6} 208 L${shR - 14} 128 Z`} fill={skin} />
          {/* watch on right wrist */}
          {garments.watch && <rect x={shR + 8} y={196} width="10" height="7" rx="2" fill={garments.watch.hex} stroke="#fff" strokeWidth="1" />}

          {/* torso: top garment or skin */}
          <path d={`M${shL} 116 Q${cx} 106 ${shR} 116 L${waR} 196 Q${cx} 204 ${waL} 196 Z`} fill={topC ?? skin} />
          {/* sleeves if top */}
          {topC && !isProfile && <path d={`M${shL + 3} 118 L${shL - 12} 168 L${shL - 2} 171 L${shL + 15} 126 Z`} fill={topC} />}
          {topC && <path d={`M${shR - 3} 118 L${shR + 12} 168 L${shR + 2} 171 L${shR - 15} 126 Z`} fill={topC} />}

          {/* outer jacket: open panels over torso sides */}
          {outC && (
            <>
              <path d={`M${shL - 2} 116 L${shL - 6} 200 L${cx - 10} 200 L${cx - 8} 120 Z`} fill={outC} opacity="0.96" />
              <path d={`M${shR + 2} 116 L${shR + 6} 200 L${cx + 10} 200 L${cx + 8} 120 Z`} fill={outC} opacity="0.96" />
            </>
          )}

          {/* belt / accessory line at waist */}
          {garments.accessory && <rect x={waL} y={190} width={b.wa * 2} height="6" rx="2" fill={garments.accessory.hex} />}

          {/* neck */}
          <rect x={cx - 8} y={96} width="16" height="24" rx="6" fill={skin} />
          {/* head */}
          <ellipse cx={cx} cy={72} rx="26" ry="30" fill={skin} />
          {/* hair back / face */}
          {isBack ? (
            <ellipse cx={cx} cy={66} rx="27" ry="26" fill="rgba(40,25,20,.55)" />
          ) : (
            <>
              <path d={`M${cx - 26} 62 Q${cx} 34 ${cx + 26} 62 L${cx + 24} 50 Q${cx} 40 ${cx - 24} 50 Z`} fill="rgba(40,25,20,.5)" />
              {!isProfile ? (
                <>
                  <circle cx={cx - 9} cy={72} r="2.4" fill="#3a2a25" />
                  <circle cx={cx + 9} cy={72} r="2.4" fill="#3a2a25" />
                  <path d={`M${cx - 6} 84 q6 4 12 0`} stroke="rgba(60,30,25,.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx={cx + 12} cy={72} r="2.4" fill="#3a2a25" />
                  <path d={`M${cx + 22} 74 q4 0 4 4`} stroke="rgba(60,30,25,.4)" strokeWidth="2" fill="none" />
                </>
              )}
            </>
          )}
          {/* sunglasses */}
          {garments.sunglasses && !isBack && (
            <g fill={garments.sunglasses.hex}>
              <rect x={cx - 20} y={67} width="16" height="9" rx="3" />
              <rect x={cx + 4} y={67} width="16" height="9" rx="3" />
              <rect x={cx - 5} y={70} width="10" height="3" />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
