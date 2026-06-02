import SectionHeading from './SectionHeading';

export default function Proof({ proof }) {
  // Empty stamps array = section is intentionally hidden.
  // We keep the component so admin Proof tab still works and users can re-add
  // stamps later (e.g. once they've accumulated real platform metrics).
  if (!proof?.stamps || proof.stamps.length === 0) return null;

  return (
    <section className="proof">
      <span className="section-mark">{proof.mark}</span>
      <SectionHeading heading={proof.heading} accent={proof.headingAccent} />
      <div className="proof-row">
        {proof.stamps.map((s, i) => {
          const inner = (
            <>
              <div className="big">{s.big}</div>
              <div className="lbl">{s.lbl}</div>
              {s.verify && <div className="verify-mark">{s.verify} ↗</div>}
            </>
          );
          const cls = `badge-stamp tilt-${s.tilt} tone-${s.tone}` + (s.href ? ' is-link' : '');
          return s.href ? (
            <a key={i} className={cls} href={s.href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : (
            <div key={i} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
