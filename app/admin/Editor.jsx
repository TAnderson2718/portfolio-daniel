'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import StorageWidget from './StorageWidget';
import StorageSection from './StorageSection';

const SECTIONS = [
  ['meta', 'Meta / SEO'],
  ['nav', 'Nav'],
  ['hero', 'Hero'],
  ['skills', 'Skills'],
  ['values', 'Values'],
  ['work', 'Work'],
  ['process', 'Process'],
  ['proof', 'Proof'],
  ['cta', 'CTA'],
  ['footer', 'Footer'],
  ['storage', 'Storage'],
];

const COLOR_PALETTE = ['paper', 'yellow', 'kraft', 'terra', 'moss'];
const BADGE_KINDS = ['', 'shipped', 'featured', 'demo'];
const TILT_OPTIONS = ['a', 'b', 'c', 'd'];
const TONE_OPTIONS = ['terra', 'moss'];
const ILLO_OPTIONS = ['pager', 'subtract', 'git'];
const CONTACT_KINDS = ['mail', 'whatsapp', 'upwork', 'freelance', 'github'];

// ───── small primitives ─────────────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div className="admin-field">
      <label>
        {label}
        {hint && <span className="hint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = 'text', ...rest }) {
  return (
    <input
      className="admin-input"
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      {...rest}
    />
  );
}

function Textarea({ value, onChange, mono = false, rows = 3, ...rest }) {
  return (
    <textarea
      className={'admin-textarea' + (mono ? ' mono' : '')}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      {...rest}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className="admin-select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => {
        const v = typeof o === 'object' ? o.value : o;
        const l = typeof o === 'object' ? o.label : o || '(none)';
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
    </select>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function ItemCard({ title, onDelete, onMoveUp, onMoveDown, children }) {
  return (
    <div className="admin-item">
      <div className="admin-item-head">
        <div className="admin-item-title">{title}</div>
        <div className="admin-item-actions">
          {onMoveUp && <button type="button" className="admin-btn" onClick={onMoveUp} title="Move up">↑</button>}
          {onMoveDown && <button type="button" className="admin-btn" onClick={onMoveDown} title="Move down">↓</button>}
          {onDelete && <button type="button" className="admin-btn danger" onClick={onDelete} title="Delete">Delete</button>}
        </div>
      </div>
      {children}
    </div>
  );
}

function ArrayEditor({ items, onChange, render, blank, label }) {
  const update = (i, next) => onChange(items.map((x, j) => (j === i ? next : x)));
  const remove = (i) => onChange(items.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const add = () => onChange([...items, blank()]);
  return (
    <>
      {items.map((item, i) =>
        render(item, {
          index: i,
          update: (next) => update(i, next),
          remove: () => remove(i),
          moveUp: i > 0 ? () => move(i, -1) : null,
          moveDown: i < items.length - 1 ? () => move(i, 1) : null,
        })
      )}
      <button type="button" className="admin-add" onClick={add}>
        + Add {label || 'item'}
      </button>
    </>
  );
}

// ───── per-section forms ────────────────────────────────────────────────────

function MetaForm({ data, setData }) {
  const m = data.meta;
  const set = (k, v) => setData({ ...data, meta: { ...m, [k]: v } });
  return (
    <>
      <Field label="Site title" hint="shown in browser tab + LinkedIn cards">
        <Input value={m.siteTitle} onChange={(v) => set('siteTitle', v)} />
      </Field>
      <Field label="Meta description" hint="1-2 sentences, ~160 chars">
        <Textarea value={m.description} onChange={(v) => set('description', v)} rows={2} />
      </Field>
      <Field label="OG image" hint="shown when the URL is shared on LinkedIn/Twitter/Slack — recommended 1200×630">
        <ImageUpload value={m.ogImage} onChange={(v) => set('ogImage', v)} />
      </Field>
    </>
  );
}

function NavForm({ data, setData }) {
  const n = data.nav;
  const set = (next) => setData({ ...data, nav: next });
  return (
    <>
      <Field label="Brand text" hint="e.g. ~/daniel">
        <Input value={n.brand} onChange={(v) => set({ ...n, brand: v })} />
      </Field>
      <Field label="Links">
        <ArrayEditor
          items={n.links}
          onChange={(links) => set({ ...n, links })}
          blank={() => ({ label: '', href: '#' })}
          label="link"
          render={(link, ctx) => (
            <ItemCard key={ctx.index} title={`Link ${ctx.index + 1}`} {...ctx}>
              <div className="admin-row">
                <Field label="Label">
                  <Input value={link.label} onChange={(v) => ctx.update({ ...link, label: v })} />
                </Field>
                <Field label="Href">
                  <Input value={link.href} onChange={(v) => ctx.update({ ...link, href: v })} />
                </Field>
              </div>
            </ItemCard>
          )}
        />
      </Field>
    </>
  );
}

function HeroForm({ data, setData }) {
  const h = data.hero;
  const set = (next) => setData({ ...data, hero: next });
  return (
    <>
      <Field label="Role label" hint="hand-script line above the tagline">
        <Input value={h.roleLabel} onChange={(v) => set({ ...h, roleLabel: v })} />
      </Field>
      <Field label="Tagline" hint="space-separated; wrap one word in *asterisks* to make it the orange accent">
        <Input
          value={h.tagline.join(' ')}
          onChange={(v) => set({ ...h, tagline: v.split(' ').filter(Boolean) })}
        />
      </Field>
      <Field label="Role meta" hint="e.g. Full-Stack · Senior Engineer">
        <Input value={h.roleMeta} onChange={(v) => set({ ...h, roleMeta: v })} />
      </Field>
      <Field label="Intro paragraph">
        <Textarea value={h.intro} onChange={(v) => set({ ...h, intro: v })} rows={4} />
      </Field>

      <Field label="Availability">
        <div className="admin-row-3">
          <Input value={h.availability.status} onChange={(v) => set({ ...h, availability: { ...h.availability, status: v } })} placeholder="status" />
          <Input value={h.availability.responseTime} onChange={(v) => set({ ...h, availability: { ...h.availability, responseTime: v } })} placeholder="response time" />
          <Input value={h.availability.engagement} onChange={(v) => set({ ...h, availability: { ...h.availability, engagement: v } })} placeholder="engagement model" />
        </div>
      </Field>

      <Field label="AI-augmented badge">
        <Toggle value={h.vibeBadge.enabled} onChange={(b) => set({ ...h, vibeBadge: { ...h.vibeBadge, enabled: b } })} label="Show the dark badge below the role line" />
        {h.vibeBadge.enabled && (
          <div className="admin-row" style={{ marginTop: 8 }}>
            <Input value={h.vibeBadge.line1} onChange={(v) => set({ ...h, vibeBadge: { ...h.vibeBadge, line1: v } })} placeholder="caption line (e.g. now building with)" />
            <Input value={h.vibeBadge.line2Strong} onChange={(v) => set({ ...h, vibeBadge: { ...h.vibeBadge, line2Strong: v } })} placeholder="strong word (e.g. AI-augmented)" />
          </div>
        )}
      </Field>

      <Field label="Portrait image" hint="your face — shown in the hero right column; visitor drags the orange mask aside to reveal">
        <ImageUpload value={h.portrait} onChange={(x) => set({ ...h, portrait: x })} />
      </Field>

      <Field label="Handwritten note next to portrait" hint="small terra caveat text above the portrait">
        <Input value={h.handnote || ''} onChange={(x) => set({ ...h, handnote: x })} />
      </Field>

      <Field label="Testimonials">
        <ArrayEditor
          items={h.testimonials}
          onChange={(testimonials) => set({ ...h, testimonials })}
          blank={() => ({ quote: '', author: '', verified: false, position: { top: 200, right: 20, rot: 0, width: 240, tapeX: 30, tapeR: 0 } })}
          label="testimonial"
          render={(t, ctx) => (
            <ItemCard key={ctx.index} title={t.author || `Testimonial ${ctx.index + 1}`} {...ctx}>
              <Field label="Quote"><Textarea value={t.quote} onChange={(v) => ctx.update({ ...t, quote: v })} rows={3} /></Field>
              <Field label="Author / source"><Input value={t.author} onChange={(v) => ctx.update({ ...t, author: v })} /></Field>
              <Toggle value={t.verified} onChange={(b) => ctx.update({ ...t, verified: b })} label="Show 'verified client' chip" />
            </ItemCard>
          )}
        />
      </Field>
    </>
  );
}

function SkillsForm({ data, setData }) {
  return (
    <Field label="Skill tags" hint="pin your top 1-2 with the star">
      <ArrayEditor
        items={data.skills}
        onChange={(skills) => setData({ ...data, skills })}
        blank={() => ({ label: '', color: 'paper', rot: 0, tape: false, pinned: false })}
        label="skill"
        render={(s, ctx) => (
          <ItemCard key={ctx.index} title={s.label || `Skill ${ctx.index + 1}`} {...ctx}>
            <div className="admin-row">
              <Field label="Label"><Input value={s.label} onChange={(v) => ctx.update({ ...s, label: v })} /></Field>
              <Field label="Color"><Select value={s.color} onChange={(v) => ctx.update({ ...s, color: v })} options={COLOR_PALETTE} /></Field>
            </div>
            <div className="admin-row-3">
              <Field label="Rotation (deg)"><Input type="number" value={s.rot} onChange={(v) => ctx.update({ ...s, rot: v })} step="0.5" /></Field>
              <Toggle value={s.tape} onChange={(b) => ctx.update({ ...s, tape: b })} label="Tape strip" />
              <Toggle value={s.pinned} onChange={(b) => ctx.update({ ...s, pinned: b })} label="Pinned (★)" />
            </div>
          </ItemCard>
        )}
      />
    </Field>
  );
}

function ValuesForm({ data, setData }) {
  const v = data.values;
  const set = (next) => setData({ ...data, values: next });
  return (
    <>
      <Field label="Section mark"><Input value={v.mark} onChange={(x) => set({ ...v, mark: x })} /></Field>
      <div className="admin-row">
        <Field label="Heading"><Input value={v.heading} onChange={(x) => set({ ...v, heading: x })} /></Field>
        <Field label="Heading accent"><Input value={v.headingAccent} onChange={(x) => set({ ...v, headingAccent: x })} /></Field>
      </div>
      <Field label="Lede"><Textarea value={v.lede} onChange={(x) => set({ ...v, lede: x })} rows={2} /></Field>
      <Field label="Three beliefs" hint="3 cards, fixed">
        <ArrayEditor
          items={v.items}
          onChange={(items) => set({ ...v, items })}
          blank={() => ({ illo: 'git', title: '', body: '' })}
          label="belief"
          render={(item, ctx) => (
            <ItemCard key={ctx.index} title={`0${ctx.index + 1} — ${item.title || 'untitled'}`} {...ctx}>
              <div className="admin-row">
                <Field label="Illustration"><Select value={item.illo} onChange={(x) => ctx.update({ ...item, illo: x })} options={ILLO_OPTIONS} /></Field>
                <Field label="Title"><Input value={item.title} onChange={(x) => ctx.update({ ...item, title: x })} /></Field>
              </div>
              <Field label="Body"><Textarea value={item.body} onChange={(x) => ctx.update({ ...item, body: x })} rows={3} /></Field>
            </ItemCard>
          )}
        />
      </Field>
    </>
  );
}

function WorkForm({ data, setData }) {
  const w = data.work;
  const set = (next) => setData({ ...data, work: next });
  return (
    <>
      <Field label="Section mark"><Input value={w.mark} onChange={(x) => set({ ...w, mark: x })} /></Field>
      <div className="admin-row">
        <Field label="Heading"><Input value={w.heading} onChange={(x) => set({ ...w, heading: x })} /></Field>
        <Field label="Heading accent"><Input value={w.headingAccent} onChange={(x) => set({ ...w, headingAccent: x })} /></Field>
      </div>
      <Field label="Lede" hint="use **double asterisks** for bold"><Textarea value={w.lede} onChange={(x) => set({ ...w, lede: x })} rows={2} /></Field>
      <Field label="Footnote"><Input value={w.footnote} onChange={(x) => set({ ...w, footnote: x })} /></Field>
      <Field label="Work cards" hint="position/rotation are saved when you drag on the live site — edit them here too if you want">
        <ArrayEditor
          items={w.items}
          onChange={(items) => set({ ...w, items })}
          blank={() => ({ x: 100, y: 100, w: 250, h: 200, r: 0, client: '', label: '', outcome: '', bg: '#D9C7B2', thumb: '', shots: [], summary: '', demoUrl: '', badge: null })}
          label="work card"
          render={(it, ctx) => (
            <ItemCard key={ctx.index} title={it.client || `Card ${ctx.index + 1}`} {...ctx}>
              <div className="admin-row">
                <Field label="Client / project"><Input value={it.client} onChange={(x) => ctx.update({ ...it, client: x })} /></Field>
                <Field label="Label / tech"><Input value={it.label} onChange={(x) => ctx.update({ ...it, label: x })} /></Field>
              </div>
              <Field label="Outcome" hint="the one-line hook shown on the card"><Input value={it.outcome} onChange={(x) => ctx.update({ ...it, outcome: x })} /></Field>
              <Field label="Summary" hint="1-3 sentences shown in the case-study popup — problem / what you did / result">
                <Textarea value={it.summary || ''} onChange={(x) => ctx.update({ ...it, summary: x })} rows={3} />
              </Field>
              <Field label="Card thumbnail" hint="the small image on the card; leave blank for the colored placeholder">
                <ImageUpload value={it.thumb} onChange={(x) => ctx.update({ ...it, thumb: x })} />
              </Field>
              <Field label="Thumbnail fit" hint="Cover = crop to fill the card (good for landscape screenshots). Contain = show the whole image with the placeholder bg filling around it (good for portrait / mobile shots).">
                <Select
                  value={it.thumbFit || 'cover'}
                  onChange={(v) => ctx.update({ ...it, thumbFit: v === 'cover' ? undefined : v })}
                  options={[
                    { value: 'cover', label: 'Cover — crop to fill' },
                    { value: 'contain', label: 'Contain — show whole image' },
                  ]}
                />
              </Field>
              <Field label="Screenshots" hint="shown inside the case-study popup; add as many as you like">
                <ArrayEditor
                  items={it.shots || []}
                  onChange={(shots) => ctx.update({ ...it, shots })}
                  blank={() => ''}
                  label="screenshot"
                  render={(url, sctx) => (
                    <ItemCard key={sctx.index} title={`Screenshot ${sctx.index + 1}`} {...sctx}>
                      <ImageUpload value={url} onChange={(x) => sctx.update(x)} />
                    </ItemCard>
                  )}
                />
              </Field>
              <Field label="Live URL" hint="optional — shows a 'View live ↗' link inside the popup (does not change the card click)">
                <Input value={it.demoUrl || ''} onChange={(x) => ctx.update({ ...it, demoUrl: x })} placeholder="https://… (leave blank for private client work)" />
              </Field>
              <div className="admin-row">
                <Field label="Placeholder bg" hint="hex; shown when no thumb"><Input value={it.bg} onChange={(x) => ctx.update({ ...it, bg: x })} /></Field>
                <Field label="Badge">
                  <Select
                    value={it.badge?.kind || ''}
                    onChange={(kind) => {
                      if (!kind) return ctx.update({ ...it, badge: null });
                      const labelDefault = { shipped: 'shipped', featured: '★ featured', demo: '▶ demo' }[kind] || kind;
                      ctx.update({ ...it, badge: { kind, label: it.badge?.label || labelDefault } });
                    }}
                    options={BADGE_KINDS}
                  />
                </Field>
              </div>
              {it.badge?.kind && (
                <Field label="Badge label">
                  <Input value={it.badge.label} onChange={(x) => ctx.update({ ...it, badge: { ...it.badge, label: x } })} />
                </Field>
              )}
              <Field label="Position (rarely edited here — drag on live site)">
                <div className="admin-row-3">
                  <Input type="number" value={it.x} onChange={(x) => ctx.update({ ...it, x })} placeholder="x" />
                  <Input type="number" value={it.y} onChange={(x) => ctx.update({ ...it, y: x })} placeholder="y" />
                  <Input type="number" value={it.r} onChange={(x) => ctx.update({ ...it, r: x })} placeholder="rotation" step="0.5" />
                </div>
                <div className="admin-row" style={{ marginTop: 8 }}>
                  <Input type="number" value={it.w} onChange={(x) => ctx.update({ ...it, w: x })} placeholder="width" />
                  <Input type="number" value={it.h} onChange={(x) => ctx.update({ ...it, h: x })} placeholder="height" />
                </div>
              </Field>
            </ItemCard>
          )}
        />
      </Field>
    </>
  );
}

function ProcessForm({ data, setData }) {
  const p = data.process || { mark: '', heading: '', headingAccent: '', lede: '', steps: [] };
  const set = (next) => setData({ ...data, process: next });
  return (
    <>
      <Field label="Section mark"><Input value={p.mark} onChange={(x) => set({ ...p, mark: x })} /></Field>
      <div className="admin-row">
        <Field label="Heading"><Input value={p.heading} onChange={(x) => set({ ...p, heading: x })} /></Field>
        <Field label="Heading accent"><Input value={p.headingAccent} onChange={(x) => set({ ...p, headingAccent: x })} /></Field>
      </div>
      <Field label="Lede" hint="one-line intro under the heading"><Input value={p.lede} onChange={(x) => set({ ...p, lede: x })} /></Field>
      <Field label="Steps" hint="3-4 steps describe how working together actually looks. Numbered cards rendered left-to-right.">
        <ArrayEditor
          items={p.steps}
          onChange={(steps) => set({ ...p, steps })}
          blank={() => ({ title: '', body: '' })}
          label="step"
          render={(s, ctx) => (
            <ItemCard key={ctx.index} title={`${String(ctx.index + 1).padStart(2, '0')} — ${s.title || 'untitled step'}`} {...ctx}>
              <Field label="Title (e.g. 'Discovery call')"><Input value={s.title} onChange={(x) => ctx.update({ ...s, title: x })} /></Field>
              <Field label="Body"><Textarea value={s.body} onChange={(x) => ctx.update({ ...s, body: x })} rows={2} /></Field>
            </ItemCard>
          )}
        />
      </Field>
    </>
  );
}

function ProofForm({ data, setData }) {
  const p = data.proof;
  const set = (next) => setData({ ...data, proof: next });
  const hidden = !p.stamps || p.stamps.length === 0;
  return (
    <>
      {hidden && (
        <div style={{ background: 'rgba(196,107,71,0.08)', border: '1px solid rgba(196,107,71,0.25)', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#7a3a1f' }}>
          ⓘ Proof section is currently <strong>hidden on the public site</strong> because the stamps list is empty. Add a stamp below to make the section appear.
        </div>
      )}
      <Field label="Section mark"><Input value={p.mark} onChange={(x) => set({ ...p, mark: x })} /></Field>
      <div className="admin-row">
        <Field label="Heading"><Input value={p.heading} onChange={(x) => set({ ...p, heading: x })} /></Field>
        <Field label="Heading accent"><Input value={p.headingAccent} onChange={(x) => set({ ...p, headingAccent: x })} /></Field>
      </div>
      <Field label="Stamps">
        <ArrayEditor
          items={p.stamps}
          onChange={(stamps) => set({ ...p, stamps })}
          blank={() => ({ big: '', lbl: '', tilt: 'a', tone: 'terra' })}
          label="stamp"
          render={(s, ctx) => (
            <ItemCard key={ctx.index} title={`${s.big || '—'} ${s.lbl || ''}`} {...ctx}>
              <div className="admin-row">
                <Field label="Big number"><Input value={s.big} onChange={(x) => ctx.update({ ...s, big: x })} /></Field>
                <Field label="Label"><Input value={s.lbl} onChange={(x) => ctx.update({ ...s, lbl: x })} /></Field>
              </div>
              <div className="admin-row-3">
                <Field label="Tilt"><Select value={s.tilt} onChange={(x) => ctx.update({ ...s, tilt: x })} options={TILT_OPTIONS} /></Field>
                <Field label="Tone"><Select value={s.tone} onChange={(x) => ctx.update({ ...s, tone: x })} options={TONE_OPTIONS} /></Field>
                <Field label="Link URL"><Input value={s.href || ''} onChange={(x) => ctx.update({ ...s, href: x })} placeholder="optional" /></Field>
              </div>
              <Field label="Verification note (shown if link present)">
                <Input value={s.verify || ''} onChange={(x) => ctx.update({ ...s, verify: x })} placeholder="e.g. verified · Upwork" />
              </Field>
            </ItemCard>
          )}
        />
      </Field>
    </>
  );
}

function CTAForm({ data, setData }) {
  const c = data.cta;
  const set = (next) => setData({ ...data, cta: next });
  return (
    <>
      <Field label="Section mark"><Input value={c.mark} onChange={(x) => set({ ...c, mark: x })} /></Field>
      <div className="admin-row">
        <Field label="Heading"><Input value={c.heading} onChange={(x) => set({ ...c, heading: x })} /></Field>
        <Field label="Heading accent"><Input value={c.headingAccent} onChange={(x) => set({ ...c, headingAccent: x })} /></Field>
      </div>
      <Field label="Intro"><Textarea value={c.intro} onChange={(x) => set({ ...c, intro: x })} rows={2} /></Field>
      <Field label="Checklist items">
        <ArrayEditor
          items={c.checklist}
          onChange={(checklist) => set({ ...c, checklist })}
          blank={() => ''}
          label="item"
          render={(item, ctx) => (
            <ItemCard key={ctx.index} title={`Item ${ctx.index + 1}`} {...ctx}>
              <Input value={item} onChange={(x) => ctx.update(x)} />
            </ItemCard>
          )}
        />
      </Field>
      <div className="admin-row">
        <Field label="Primary CTA button label"><Input value={c.buttonLabel} onChange={(x) => set({ ...c, buttonLabel: x })} /></Field>
        <Field label="Primary CTA URL" hint="mailto: or Calendly"><Input value={c.buttonHref} onChange={(x) => set({ ...c, buttonHref: x })} /></Field>
      </div>
      <Field label="Contacts lead text"><Input value={c.contactsLead} onChange={(x) => set({ ...c, contactsLead: x })} /></Field>
      <Field label="Contact pills" hint="kind controls the icon">
        <ArrayEditor
          items={c.contacts}
          onChange={(contacts) => set({ ...c, contacts })}
          blank={() => ({ kind: 'mail', label: '', href: '' })}
          label="contact"
          render={(p, ctx) => (
            <ItemCard key={ctx.index} title={p.label || `Contact ${ctx.index + 1}`} {...ctx}>
              <div className="admin-row-3">
                <Field label="Kind"><Select value={p.kind} onChange={(x) => ctx.update({ ...p, kind: x })} options={CONTACT_KINDS} /></Field>
                <Field label="Label"><Input value={p.label} onChange={(x) => ctx.update({ ...p, label: x })} /></Field>
                <Field label="Href"><Input value={p.href} onChange={(x) => ctx.update({ ...p, href: x })} /></Field>
              </div>
            </ItemCard>
          )}
        />
      </Field>
    </>
  );
}

function FooterForm({ data, setData }) {
  const f = data.footer;
  const set = (next) => setData({ ...data, footer: next });
  return (
    <>
      <Field label="Signature line"><Input value={f.sig} onChange={(x) => set({ ...f, sig: x })} /></Field>
      <Field label="Copyright line"><Input value={f.copyright} onChange={(x) => set({ ...f, copyright: x })} /></Field>
    </>
  );
}

// ───── root component ───────────────────────────────────────────────────────

const FORMS = {
  meta: MetaForm,
  nav: NavForm,
  hero: HeroForm,
  skills: SkillsForm,
  values: ValuesForm,
  work: WorkForm,
  process: ProcessForm,
  proof: ProofForm,
  cta: CTAForm,
  footer: FooterForm,
};

export default function Editor({ initial }) {
  const [data, setData] = useState(initial);
  const [active, setActive] = useState('hero');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [busy, setBusy] = useState(false);
  const [usageRefresh, setUsageRefresh] = useState(0);
  const router = useRouter();

  const dirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initial), [data, initial]);

  async function save() {
    setBusy(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: data, message: 'admin: update content' }),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus({ type: 'err', msg: result.error || `save failed (${res.status})` });
        return;
      }
      const where = result.mode === 'github' ? `GitHub commit ${result.commit?.slice(0, 7)}` : 'local file';
      setStatus({ type: 'ok', msg: `Saved → ${where}` });
      router.refresh();
    } catch (e) {
      setStatus({ type: 'err', msg: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const Form = FORMS[active];
  const activeLabel = SECTIONS.find(([k]) => k === active)?.[1];
  const isStorage = active === 'storage';

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <h1>
          Admin
          <small>portfolio editor</small>
        </h1>
        <div className="admin-nav">
          {SECTIONS.map(([k, label]) => (
            <button key={k} className={active === k ? 'active' : ''} onClick={() => setActive(k)}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <StorageWidget refreshKey={usageRefresh} />
          <a href="/" target="_blank" className="admin-btn" style={{ display: 'block', textAlign: 'center', marginTop: 12, marginBottom: 8 }}>
            View site ↗
          </a>
          <button type="button" className="admin-btn" onClick={logout} style={{ width: '100%' }}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <h2 className="admin-h">{activeLabel}</h2>
        {!isStorage && <p className="admin-sub">All changes are local until you click Save.</p>}
        {isStorage ? (
          <StorageSection onCleanup={() => setUsageRefresh((n) => n + 1)} />
        ) : (
          <>
            <Form data={data} setData={setData} />
            <div className="admin-savebar">
              <button type="button" className="admin-btn primary" onClick={save} disabled={busy || !dirty}>
                {busy ? 'Saving…' : dirty ? 'Save changes' : 'No changes'}
              </button>
              {status.msg && <span className={`status ${status.type}`}>{status.msg}</span>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
