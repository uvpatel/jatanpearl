import { PLAQUE_EDGE, PLAQUE_FILL } from "./paths";

/**
 * The "tap_to_open" plaque frame, inline so its fill and gold edge take the
 * theme colours from the stylesheet. `idPrefix` keeps the filter/gradient ids
 * unique per instance (the source uses ryCue* and ryReveal*).
 */
export function PlaqueFrame({ idPrefix }: { idPrefix: string }) {
  const filterId = `${idPrefix}Inset`;
  const edgeId = `${idPrefix}Edge`;
  return (
    <svg className="ry-plaque__frame" viewBox="0 0 300 78" fill="none" focusable="false">
      <g filter={`url(#${filterId})`}>
        <path className="ry-plaque__fill" d={PLAQUE_FILL} />
        <path d={PLAQUE_EDGE} stroke={`url(#${edgeId})`} strokeWidth="4" strokeLinejoin="round" />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="300"
          height="86"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="8" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        <linearGradient id={edgeId} x1="315" y1="39" x2="-9" y2="38.9999" gradientUnits="userSpaceOnUse">
          <stop className="ry-plaque__edge" />
          <stop className="ry-plaque__shine" offset="0.183134" />
          <stop className="ry-plaque__edge" offset="0.525864" />
          <stop className="ry-plaque__shine" offset="0.790922" />
          <stop className="ry-plaque__edge" offset="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
