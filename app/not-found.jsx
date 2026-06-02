import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell notfound">
      <p className="nf-kicker">— oops.</p>
      <h1 className="nf-code">404</h1>
      <p className="nf-term">
        <span className="nf-prompt">&gt;</span>cd ~/the-page-you-wanted
      </p>
      <p className="nf-err">cd: no such file or directory</p>
      <p className="nf-lede">
        This page either moved, never shipped, or wandered off the board.
        Not a bug — just a wrong turn. Let&apos;s get you back.
      </p>
      <Link href="/" className="nf-home">← back to home</Link>
    </div>
  );
}
