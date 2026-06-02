import { ScribbleUnderline } from './Scrapbook';

export default function Nav({ brand, links }) {
  return (
    <nav className="nav" aria-label="Primary">
      <a className="nav-mark" href="#top" aria-label="home">
        <span className="term-prompt" aria-hidden="true">&gt;</span>
        <span className="term-path">{brand}</span>
        <span className="term-caret" aria-hidden="true"></span>
      </a>
      <div className="nav-links">
        {links.map((l, i) => (
          <a key={i} className="nav-link" href={l.href}>
            {l.label}
            <ScribbleUnderline />
          </a>
        ))}
      </div>
    </nav>
  );
}
