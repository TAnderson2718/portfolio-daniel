# Portfolio 内容填写指南

逐字段告诉你填什么、怎么填、长度多少。**前面例子都是举例,不要照抄,改成你自己的**。

## 总体调性提醒(适用全站)

- **不提平台评分**(5★/Top Rated/Job Success 等不出现)
- **不提资历长短**(避免"X 年经验"、"15 岁开始写代码"这种)
- **不要 buzzword 堆砌**("synergy / passionate / detail-oriented")
- **要具体不要抽象**("at 3 AM" > "always available"; "↓ p95 by 60%" > "performance improved")
- **写代码人的语气**:克制、诚实、有点无聊但靠谱(这就是你的卖点)

---

## Admin 编辑入口

打开 http://localhost:3000/admin/login,密码在 `.env.local`。改完点 `Save changes`,公开页自动刷新。

下面按 admin 的 tab 顺序写。

---

## 1. Meta / SEO

只 3 个字段,但每个都重要 —— **链接被分享到 LinkedIn / Slack / Twitter 时这些字段决定预览长什么样**。

| 字段 | 填什么 | 长度 | 例 |
|---|---|---|---|
| Site title | 浏览器标签 + 搜索结果标题 | ≤55 字符 | `Daniel Dong — Full-Stack Engineer` |
| Meta description | 搜索结果 + 分享 snippet | 120-160 字符 | `Full-stack engineer specializing in React, Node, and payments infrastructure. Building reliable software with AI-augmented workflows.` |
| OG image | 1200×630 自定义图(LinkedIn / Twitter 卡片预览) | 1200×630 px | 上传你的 portfolio 一张漂亮的截图,或一个简洁的"你的名字 + 一句 tagline"图 |

**OG image 建议**:可以截一张你 portfolio 主页的 hero 区域,或者用 Figma 做一张 1200×630 的卡(深色背景 + 大字白色你的名字 + 副标题 + 一个橘色 accent)。

---

## 2. Nav

| 字段 | 填什么 | 长度 | 例 |
|---|---|---|---|
| Brand text | 左上角 mono 字小标识 | ≤20 字符,推荐 `~/yourname` 格式 | `~/daniel` 或 `daniel.dev` 或 `dd.` |
| 3 个 links | 锚点导航 | 每个 1 词 | `about` / `work` / `connect`(默认就行,跟 section id 匹配,不要乱改 href) |

---

## 3. Hero ⭐(最重要的一区)

访客 5 秒内的判断全在这。**所有字段都填**。

### Role label
- **什么**:Tagline 上方的手写体小字
- **长度**:6-10 词
- **例**: `— hello, I'm Daniel ✦` / `→ hey there, building things ✦` / `— I make things on the internet ✦`

### Tagline(4 词,中间 1 个有橘色重音)
- **什么**:你的核心 value proposition,**承诺**不是介绍
- **格式**:4 个词,**用 `*星号*` 包住要重音的那个词**
- **长度**:4 个词,每词 ≤8 字符为佳
- **例**:
  - `Code that *just* works.` ✓
  - `Software that *ships* fast.` ✓
  - `Reliable code, *quietly* delivered.` ✓
  - `Built for *boring* Mondays.` ✓
- **避免**: "Senior Engineer" "Hi I'm X" "Full-stack everything" 这类无差异化的

### Role meta
- **什么**:Tagline 下方一行小灰字
- **长度**:2-4 个词,用 `·` 分隔
- **例**: `Full-Stack · Engineer` / `Backend · Payments · APIs` / `LLM apps · Infra`

### Availability(3 个字段)
- **status**:`Available now` / `Booking for July` / `Limited slots Q3` ← 真实状态
- **responseTime**:`Replies in <12h` / `Same-day reply` / `Replies in <24h` ← 你能保证的就行
- **engagement**:计费模式 — `Fixed-fee or weekly sprint` / `Hourly or sprint-based` / `Project-based, flat fee`

### Vibe badge(顶部黑色徽章)
- **enabled**: 留 true 就好
- **line1**:小白字一行 — 例:`now building with` / `currently shipping with`
- **line2Strong**:大字加粗那个词 — 例:`AI-augmented` / `Postgres-native` / `Type-safe end-to-end`

### Intro(3 句话)
- **格式**: 3 句话,每句独立信息点
- **结构推荐**:
  - 句 1:你做什么(领域 / 类型项目)
  - 句 2:你怎么做(方法 / 工具)
  - 句 3:你当下专注什么(技术 / 行业)
- **长度**:50-80 词
- **例**:
  > Full-stack engineer building reliable web apps for SaaS founders and small teams. I pair human craft with AI tools to ship faster without cutting corners on quality. Currently into payments infrastructure (Stripe + webhooks) and LLM-powered internal tools.

### Terminal sticky(5 行)
- **什么**:右上角小黑框,装饰但要真实
- **每行**:模拟你真实跑过的命令或输出
- **可用 color**:`green`(用于命令行)、`muted`(用于注释)、留空(默认浅色)
- **例**:
  ```
  [0] $ git log --oneline       [color: green]
  [1] # last 30 days            [color: muted]
  [2] a3f02 fix: idempotent webhook
  [3] 9b1d8 feat: retry queue
  [4] 71ec4 chore: bump deps
  ```

### Testimonials(0-1 条)
**如果你有真实的(LinkedIn 同事推荐 / 之前同事 quote)就放 1 条;没有的话留空数组,Hero 右栏自动只显示 terminal,不会空荡**。

| 字段 | 例 |
|---|---|
| quote | 真实引用,不要编 |
| author | `— Jane S., Eng Manager · prior employer` |
| verified | true / false(显示绿色 "verified" 小 chip) |

---

## 4. Skills(6 张标签)

- **数量**:6 个(改成 5 也行,7 上限)
- **格式**:每个标签 1-3 个词,可用 `·` 连接
- **pinned** = 你的 1-2 个核心强项(显示带星 ✦)
- **color** 选择(影响视觉节奏,不影响含义):
  - `terra`(深橘)/ `paper`(米白)/ `kraft`(浅棕)/ `moss`(绿)/ `yellow`(黄)
- **rot** = 标签倾斜角度,-3 到 3 之间,**保留默认值即可**
- **tape**(有/无胶带装饰),想要的标签设 true 就好

**例**:
- `AI / LLM apps` · terra · pinned ✦
- `React · Next.js` · terra · pinned ✦
- `TypeScript` · paper
- `Postgres · Redis` · kraft + tape
- `Stripe / Payments` · moss
- `Vercel / AWS` · yellow

---

## 5. Values(3 条原则)⭐ 重点打磨

**这是你没有数字时最强的差异化区**。3 条原则你工作中真的会念叨的,**不是教科书**。

| 字段 | 填什么 | 长度 |
|---|---|---|
| Section mark | 上方手写小字 | 例:`↓ 3 things I strongly believe in` |
| Heading | 大标题 | 1 词:`Principles` |
| Heading accent | 标题旁手写斜体 | 2-4 词:`on the wall` |
| Lede | 引言一句 | ≤25 词,**带场景细节**:例 `Pinned to the wall above my desk. Each one earned the hard way — usually at 3 AM.` |
| 3 items × { illo, title, body } | 见下 | |

### 每条 belief:
- **illo**:从 `pager` / `subtract` / `git` 三个选一个,**视觉对应内容**:
  - `pager`(显示传呼机) — 适合 "运维 / on-call" 相关
  - `subtract`(显示删划线) — 适合 "做减法 / 不要做这" 相关
  - `git`(显示 git tree) — 适合 "commit 习惯 / 代码可读性" 相关
- **title**:一句陈述,像座右铭(8-12 词)
- **body**:2 句话展开,**带具体场景**(30-50 词)

**3 条推荐主题方向**(挑你真正信的 3 条):

1. **运维 / 可维护性方向**
   - title: `Ship code that survives the on-call rotation.`
   - body: `Boring, observable, and easy to roll back beats clever every Sunday at 3 AM. I write the runbook before I merge.`

2. **做减法 / 范围控制**
   - title: `The best feature is the one you didn't have to build.`
   - body: `Subtract before you add. Half the tickets in a backlog don't survive a real conversation with a user — and they shouldn't survive me either.`

3. **沟通透明度**(对 freelancer 特别重要)
   - title: `No surprises beats no bugs.`
   - body: `A delay you told me about on Monday is a non-event. A delay I find out on Friday is a problem. Async writeups, end-of-week demos, no exceptions.`

4. **AI 协作**(如果你做 LLM/AI 多)
   - title: `AI writes, I review. Not the other way.`
   - body: `Co-pilots are great for the first draft, useless at the architectural call. Every PR ships with a code review I actually did.`

---

## 6. Work(6 张作品卡)⭐ 转化主力

### 整体字段
| 字段 | 填什么 | 例 |
|---|---|---|
| Section mark | 顶部小字 | `↗ the cutting board · drag anything` |
| Heading + Accent | 标题 | `Work` / `in pieces` |
| Lede | 引言,**可用 `**bold**`** | `A few things I shipped recently — from greenfield builds to enterprise rescues. **Featured** are the ones I'd talk you through first.` |
| Footnote | 板下方小字 | `↑ everything you do, do it with care.` |

### 每张作品卡(6 张)
| 字段 | 填什么 | 长度 |
|---|---|---|
| client | 客户/项目名 | 1-3 词;真实公司**或类别名**(`E-commerce platform` 这种脱敏) |
| label | 技术栈 | 2-4 个技术,用 `·` 分隔(`React · tRPC · Postgres`) |
| outcome | **带数字的成果** | 1 句话,**有数字**(`↓ p95 by 60%` / `+38% search CTR` / `saved $4k/mo`)|
| thumb | 真实截图 | 上传一张作品截图(admin 自动 resize) |
| badge | "featured" / "shipped" / "demo" / 无 | 1-2 张 featured,demo 限**真能点开的** |
| demoUrl | 可点击链接 | 设了之后整张卡变 `<a>` |
| bg | 占位色 | 默认就好(只在 thumb 空时显示) |

### 6 张卡的内容组合建议

| # | 卡片定位 | 例子模板 |
|---|---|---|
| 1 | **Featured 大牌** | 过往全职最亮眼项目:`E-commerce platform` / `React · tRPC · Stripe` / `↓ checkout abandonment 35%` |
| 2 | 个人项目 / 副业 | 你做的 side project,有 demoUrl 加分:`SnipURL (side project)` / `Next.js · Edge functions` / `1k+ daily users` |
| 3 | **Demo 可点** | 开源 / GitHub repo:`open-source CLI` / `Rust · clap` / `500+ GitHub stars` + demoUrl 指 GitHub |
| 4 | 全职项目 | `Legal SaaS rescue` / `Node · Postgres · Redis` / `Recovered $1.2M overdue invoices via webhook fix` |
| 5 | **Demo 可点** | 副业 demo 站:`my AI side project` / `Next.js · OpenAI · pgvector` / `40k documents indexed` + demoUrl |
| 6 | **Featured 另一面** | 不同领域显示广度:`Internal tooling for design team` / `TypeScript · Tauri · OAuth` / `Onboarding 2 days → 2 hours` |

**outcome 公式**:
- 性能数字:`↓ p95 by N%` / `↑ TTI by Ns` / `cut bundle to NkB`
- 业务数字:`+X% CTR / conversion / retention`
- 钱:`saved $X/mo` / `unblocked $X deal`
- 规模:`Nk users` / `N concurrent` / `processes N docs/day`
- 时间:`onboarding Nd → Nh` / `release cycle weekly → daily`

---

## 7. About

### 主体字段
| 字段 | 填什么 | 长度 |
|---|---|---|
| Section mark | `⌒ a little about me` 这类 | |
| Heading + Accent | `The human` / `behind the commits` | 保持就好 |
| Lede(bio 段)| **写"现在"**,3 句:**当下** 在哪/做什么 + 喜欢什么 + 不工作干啥 | 50-90 词 |
| Handnote | 头像旁手写小字 | 1 句 1 行,例 `(yes — that's actually me under the orange ↓)` |
| Portrait | **真实的工作生活照** | 一张你 |

### Bio 写"现在"的例子
- ❌ 不要这种:`I started coding at age 14, have 8 years experience, joined a Series B as employee #8...`
- ✓ 要这种:
  > Currently based in Boston, building backend services and AI tools for a handful of solo founders. I like quiet Saturday mornings with a fresh Postgres dump, well-written runbooks, and the rare client who replies before 24h is up. Off-keyboard you'll find me on a bike trail or learning a new language poorly.

### 3 个 stickers(不是时间线!主题型)
| sticker | year (顶部小字)| caption (主体)| 例 |
|---|---|---|---|
| #0 | `RECENT` | 最近一次发布的事 | `Just shipped a billing reconciliation system that catches dropped Stripe webhooks within 2 minutes.` |
| #1 | `NOW` | 当下专注 | `Going deep on RAG patterns — pgvector + Claude — for a legal-doc search startup.` |
| #2 | `OFF-KEYS` | 个人/兴趣 | `Currently learning to bake sourdough. The starter has a name. Don't ask.` |
| Image | sticker 配图 | 任意视觉相关图,可留空显示占位 |

**Portrait 注意**:不要标准 LinkedIn 头像。要一张**有生活气**的工作照(在自己工作环境里,自然不僵硬)。被坐着拍下电脑前的照片是黄金构图。

---

## 8. Process(4 步流程)⭐ 新人 freelancer 的信任补丁

| 字段 | 填什么 |
|---|---|
| Section mark | `→ how working together looks` 这类 |
| Heading + Accent | `Process` / `start to handoff` |
| Lede | 一句,例 `Predictable, async-friendly, no surprises.` |
| 4 steps × { title, body } | 见下 |

### 4 步推荐 + 例子

| # | title | body | 长度 |
|---|---|---|---|
| 01 | `Discovery call (free, 30 min)` | `We hop on a quick call to figure out if your project and I are a match. No pressure, no slides. You leave knowing whether I'm the right person.` | 25-40 词 |
| 02 | `Scoped proposal` | `Within 48h I send you a 1-page proposal: scope, milestones, fixed fee (or weekly sprint rate), and what we're explicitly not doing. You approve or counter, no back-and-forth.` | 25-40 词 |
| 03 | `Async weekly rhythm` | `Daily writeup in Slack. End-of-week demo video. Always know what shipped and what's next. Sync calls only when something needs decisions.` | 25-40 词 |
| 04 | `Handoff with docs` | `Code, tests, runbook, and a 15-min loom walkthrough — not just a Git URL. Your engineer-of-the-future will thank you.` | 25-40 词 |

**关键**:body 都要带**具体细节**(48h / Slack / Friday demo / 15-min loom)。"flexible communication"这种空话直接扣分。

---

## 9. Proof

**留空,不渲染**。等你积累了真实数字(完成 10+ 项目、有 4★+ 评分等)再回来填。

---

## 10. CTA

### 主体字段
| 字段 | 填什么 |
|---|---|
| Section mark | `↓ if this is you, say hi` |
| Heading + Accent | `What I look for` / `in a project` |
| Intro | `Tick the ones that sound like your project. The sketch fills in as you go.` |
| Checklist 4 项 | 见下 |
| Button label | `Book a 30-min intro call` |
| Button href | **你的 Calendly 链接**(没有就先填 `mailto:你@邮箱`) |
| Contacts lead | `or find me at` / `or reach me on` |
| Contact pills | 见下 |

### Checklist 4 项(你真的接的项目特征)
- ☑ `An interesting technical challenge`
- ☑ `Remote-first, async-friendly team`
- ☑ `Greenfield build or thoughtful rebuild`
- ☑ `Long-term partnership, not just a sprint`

或换成你真的关心的(例):
- ☑ `Founder or small team (≤10 people)`
- ☑ `Willing to pair on hard decisions`
- ☑ `Has at least one real user already`
- ☑ `Budget aligned with monthly retainer or fixed fee`

### Contact pills(可加任意数量)
**去掉跟 button 重复的 mail pill**(主按钮已经是 mail / Calendly 主入口)。剩下:

| kind | label | href |
|---|---|---|
| upwork | `Upwork` | 你的 Upwork profile URL |
| freelance | `Freelancer` | 你的 Freelancer.com profile URL |
| github | `GitHub` | 你的 GitHub URL |
| mail | `Email` | mailto:你的邮箱 *(可选,如果 button 是 Calendly,留这个 mail pill 作辅助)* |

如果你在 Guru / Fiverr 也有,**复用 `kind: "freelance"` 或 `kind: "mail"`**(图标会用通用 briefcase 图)。

---

## 11. Footer

| 字段 | 填什么 | 例 |
|---|---|---|
| sig | 手写体大字签名 | `— daniel, made with too much coffee.` |
| copyright | 版权一行 | `© 2026 · daniel · boston` |

---

## 填完后的检查清单

- [ ] 每个 `‹...›` placeholder 都被替换了(可以在 admin 切到任意 tab 看,或在浏览器 Ctrl+F 搜 `‹`)
- [ ] OG image 已上传(meta.ogImage 不为空)
- [ ] Calendly URL 真实可用,自己点一次确认
- [ ] 所有 contact pills 链接打开都是你的真实 profile
- [ ] Hero terminal 5 行内容真实(不是默认的)
- [ ] Work 6 张卡都有 outcome,且 outcome 里有具体数字
- [ ] Work 至少 1 张有 demoUrl(可点击)
- [ ] About portrait 是你的真实照片
- [ ] 整页 Ctrl+F 搜"experience" / "year" / "since" 看有没有提资历(预期 0 个)
- [ ] 整页 Ctrl+F 搜"Top Rated" / "Job Success" 看有没有 Upwork 专属称号(预期 0 个)

---

## 之后想做的事(后续 v2)

- 攒到 3+ 条真实推荐 → 加回 Hero 的 testimonial,或单建一个 Testimonials section
- 积累到平台评分 → 重新启用 Proof section(Storage tab → Proof → 加 stamps)
- 想给作品做深度页面 → 加 `/work/[slug]` 路由,从作品卡跳转
- 上 Vercel → 设环境变量 + 推到 GitHub + 接入 Cloudinary admin role(用 Master Admin 或新建一个 admin role 的 key)
