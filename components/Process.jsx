import SectionHeading from './SectionHeading';

// "Process" — visual step-bar in the scrapbook aesthetic. 3-4 steps shown as
// taped index-card style chunks with hand-drawn arrows between them. Visual
// purpose: a predictability signal for clients who haven't worked with you
// before. Returns null if no steps configured.

function StepArrow() {
  return (
    <svg className="process-arrow" viewBox="0 0 60 30" aria-hidden="true">
      <g filter="url(#inkRough)">
        <path d="M4 15 C 20 6, 38 24, 54 15" stroke="var(--terra-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M48 9 L 54 15 L 46 19" stroke="var(--terra-deep)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function Process({ process }) {
  const steps = process?.steps || [];
  if (steps.length === 0) return null;

  return (
    <section className="process" id="process">
      <span className="section-mark">{process.mark}</span>
      <SectionHeading heading={process.heading} accent={process.headingAccent} />
      {process.lede && <p className="process-lede">{process.lede}</p>}
      <div className="process-row">
        {steps.map((s, i) => (
          <div key={i} className="process-step-wrap">
            <article className={`process-step ps-${(i % 4) + 1}`}>
              <div className="mask"></div>
              <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="process-title">{s.title}</h3>
              <p className="process-body">{s.body}</p>
            </article>
            {i < steps.length - 1 && <StepArrow />}
          </div>
        ))}
      </div>
    </section>
  );
}
