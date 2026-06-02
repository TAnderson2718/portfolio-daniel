export default function SvgFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed="7" />
          <feColorMatrix values="0 0 0 0 0.11
                                 0 0 0 0 0.10
                                 0 0 0 0 0.09
                                 0 0 0 0.06 0" />
        </filter>
        <filter id="torn" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="12.6" />
        </filter>
        <filter id="tornHi" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="8.4" />
        </filter>
        <filter id="inkRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.68" />
        </filter>
      </defs>
    </svg>
  );
}
