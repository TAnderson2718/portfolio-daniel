import SectionHeading from './SectionHeading';

function BeliefIllo({ kind }) {
  if (kind === 'pager') {
    return (
      <svg viewBox="0 0 200 150" fill="none">
        <g filter="url(#inkRough)">
          <rect x="35" y="22" width="130" height="100" rx="10" stroke="#1C1C1C" strokeWidth="2.2" />
          <rect x="50" y="38" width="100" height="46" rx="3" stroke="#1C1C1C" strokeWidth="1.8" fill="#EDE3C2" />
          <path d="M58 58 L 66 70 L 78 50 L 92 76 L 104 60 L 116 70 L 142 64" stroke="#C46B47" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="60" cy="100" r="5" stroke="#1C1C1C" strokeWidth="1.8" />
          <circle cx="80" cy="100" r="5" stroke="#1C1C1C" strokeWidth="1.8" />
          <circle cx="100" cy="100" r="5" stroke="#1C1C1C" strokeWidth="1.8" />
          <circle cx="120" cy="100" r="5" stroke="#1C1C1C" strokeWidth="1.8" />
          <circle cx="140" cy="100" r="5" stroke="#1C1C1C" strokeWidth="1.8" />
          <path d="M75 22 L 75 14 M 125 22 L 125 14" stroke="#1C1C1C" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M150 35 L 170 25 L 168 32 L 175 28" stroke="#C46B47" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <text x="35" y="138" fontFamily="Caveat" fontSize="14" fill="#C46B47">3 AM. still works.</text>
        </g>
      </svg>
    );
  }
  if (kind === 'subtract') {
    return (
      <svg viewBox="0 0 200 150" fill="none">
        <g filter="url(#inkRough)">
          <rect x="30" y="25" width="140" height="22" rx="3" stroke="#1C1C1C" strokeWidth="1.8" />
          <rect x="30" y="55" width="140" height="22" rx="3" stroke="#1C1C1C" strokeWidth="1.8" />
          <rect x="30" y="85" width="140" height="22" rx="3" stroke="#1C1C1C" strokeWidth="1.8" />
          <path d="M22 56 L 178 78" stroke="#C46B47" strokeWidth="3" strokeLinecap="round" />
          <path d="M22 76 L 178 56" stroke="#C46B47" strokeWidth="3" strokeLinecap="round" />
          <text x="38" y="40" fontFamily="JetBrains Mono" fontSize="11" fill="#1C1C1C">feature_a()</text>
          <text x="38" y="70" fontFamily="JetBrains Mono" fontSize="11" fill="#1C1C1C" opacity="0.55">feature_b()</text>
          <text x="38" y="100" fontFamily="JetBrains Mono" fontSize="11" fill="#1C1C1C">feature_c()</text>
          <text x="36" y="138" fontFamily="Caveat" fontSize="14" fill="#C46B47">— didn't build it.</text>
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 150" fill="none">
      <g filter="url(#inkRough)">
        <path d="M30 30 L 30 120" stroke="#1C1C1C" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="30" cy="40" r="5" fill="#C46B47" stroke="#1C1C1C" strokeWidth="1.6" />
        <circle cx="30" cy="68" r="5" fill="#C46B47" stroke="#1C1C1C" strokeWidth="1.6" />
        <circle cx="30" cy="96" r="5" fill="#C46B47" stroke="#1C1C1C" strokeWidth="1.6" />
        <path d="M30 68 C 50 68, 50 80, 60 80 L 80 80" stroke="#1C1C1C" strokeWidth="1.4" fill="none" />
        <circle cx="80" cy="80" r="4" stroke="#1C1C1C" strokeWidth="1.4" fill="#F7F4EE" />
        <text x="44" y="44" fontFamily="JetBrains Mono" fontSize="10" fill="#1C1C1C">feat: add retry queue</text>
        <text x="44" y="72" fontFamily="JetBrains Mono" fontSize="10" fill="#1C1C1C">fix: idempotent webhook</text>
        <text x="44" y="100" fontFamily="JetBrains Mono" fontSize="10" fill="#1C1C1C">refactor: split worker</text>
        <text x="90" y="83" fontFamily="JetBrains Mono" fontSize="9" fill="#5B554A">wip/retry</text>
        <text x="30" y="138" fontFamily="Caveat" fontSize="14" fill="#C46B47">tell the future me.</text>
      </g>
    </svg>
  );
}

export default function Values({ values }) {
  return (
    <section className="values">
      <div className="values-intro">
        <span className="section-mark">{values.mark}</span>
        <SectionHeading heading={values.heading} accent={values.headingAccent} />
        <p className="values-lede">{values.lede}</p>
        <svg className="values-connectors" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <g filter="url(#inkRough)">
            <path d="M180 10 C 180 60, 200 90, 220 110" stroke="var(--terra-deep)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="2 6" />
            <path d="M180 10 C 400 50, 500 80, 600 110" stroke="var(--terra-deep)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="2 6" />
            <path d="M180 10 C 600 40, 800 70, 980 110" stroke="var(--terra-deep)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="2 6" />
          </g>
        </svg>
      </div>
      <div className="values-row">
        {values.items.map((item, i) => (
          <article key={i} className={`belief b${i + 1}`}>
            <div className="mask"></div>
            <span className="pin"></span>
            <span className="belief-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="belief-illo">
              <BeliefIllo kind={item.illo} />
            </div>
            <h3 className="belief-title">{item.title}</h3>
            <p className="belief-body">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
