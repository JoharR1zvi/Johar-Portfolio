# Learning Journal

This document exists so you can actually explain this project to someone —
a recruiter, a friend, yourself in six months — without having to re-read
code. Same material as `PROJECT_NOTES.md`, but explained in plain language,
with the "why does the industry do it this way" context included. New
lessons get added every phase. Read it top to bottom once, then use it as
a reference.

---

## Lesson 1: What is this project, actually?

A website about you, but a smart one. Most portfolio sites are just a list
of projects. This one also has a little AI chatbot embedded in it that can
answer questions like "what's Johar's strongest project?" — and it only
answers using facts you've actually approved, so it can't accidentally lie
about you. There's also a hidden admin area only you can log into, where
you can write up a new project and have AI help turn your notes into a
polished project page — but it never publishes anything automatically; you
always approve it first. And the whole site works in both English and
German.

## Lesson 2: The toolbox — what each piece is and why we picked it

Think of building a website like building a house. You need a frame, walls,
paint, plumbing. Here's our toolbox:

- **React** — the basic building blocks. Instead of writing one giant
  HTML file, you write small reusable pieces called "components" (a
  button, a nav bar, a project card) and snap them together like Lego.
- **Next.js** — React plus a bunch of stuff every real website needs
  built in: which URL shows which page, building pages ahead of time so
  they load instantly, image optimization, and more. Almost nobody uses
  raw React for a real site anymore — you use a "framework" like Next.js
  on top of it, the same way nobody pours a house foundation by hand
  when there's a concrete truck.
- **TypeScript** — JavaScript with a built-in spell-checker for _types_.
  Normal JavaScript will happily let you try to do math on a piece of text
  and only crash when a real user hits that code path. TypeScript catches
  a huge class of "wait, that's not even a number" mistakes _before_ the
  code ever runs, while you're still writing it.
- **Tailwind CSS** — instead of writing custom styling rules in a separate
  file (`.background { color: blue; padding: 8px; }`), you write short
  class names directly on the element (`class="bg-blue-500 p-2"`). Faster
  to write, and you can see exactly how something looks just by reading
  its tag, no jumping between files.
- **shadcn/ui** — a set of pre-built pieces (buttons, dropdown menus,
  slide-out panels) that, unlike most component libraries, you _own_: the
  actual code gets copied into your project instead of hidden inside a
  package you can't edit. You get a head start without losing control.
- **Supabase** (coming in Phase 2) — think of it as "backend in a box": a
  real database, a login system, and file storage, all managed for you so
  you don't have to run your own server just to store data.

## Lesson 3: How does a webpage actually reach your screen?

When you type a website address, your browser sends a request across the
internet to a server, which sends back the page. That's the "client-server
model" — your browser is the client, the server does the work and answers.

For this specific site, when someone visits, here's the actual path:

1. A tiny piece of code called a **proxy** (older name: "middleware") runs
   first, before the real page. Its job here is small but important: look
   at what language the visitor's browser is set to, and send them to the
   English or German version of the site.
2. Next.js then builds (or, for speed, has already pre-built) the actual
   page and sends the finished HTML back.
3. The browser paints it on screen, and React "wakes up" in the background
   so buttons and menus become interactive.

## Lesson 4: Why does every URL start with `/en/` or `/de/`?

This is called **internationalization**, or "i18n" for short (there are
18 letters between the "i" and the "n" — programmers love shortening long
words like that). Instead of guessing the language from a cookie behind the
scenes, the language is baked right into the web address:
`yoursite.com/en/projects` vs `yoursite.com/de/projects`. This is the
industry-standard way to do multi-language sites, for a very practical
reason: search engines and social-media link previews need a stable,
shareable URL that _means_ a specific language — if the language depended
on invisible cookies, Google couldn't tell the difference between your
English and German pages, and you couldn't bookmark or share "the German
one" specifically.

## Lesson 5: Light mode and dark mode — how does that actually work?

Every color on the site (background, text, buttons) is stored once as a
"variable" with a name like `--primary` instead of being written directly
everywhere (`#5B5CE2`). Think of it like a paint company's color-naming
system: instead of every wall in a house being painted with its own custom
mixed color, everything uses "Wall Color #3," and if you ever want to
change what "#3" looks like, every wall using it updates at once.

Dark mode works by literally swapping which set of variable values is
active — light mode's `--primary` might be a certain purple, dark mode's
`--primary` is a lighter version of the same purple, tuned to still look
good against a dark background. A small helper library (`next-themes`)
remembers your choice (light, dark, or "match my computer's setting") and
adds a `dark` label to the page when dark mode is on, which is what
triggers the swap.

There's a subtle trap here worth knowing about, because it's a classic
web-development gotcha: the server that builds your page doesn't know
_your personal_ light/dark preference — that's stored in your browser, not
on the server. So there's a brief moment where the server has to guess, and
if the guess is wrong you'd see a flash of the wrong theme, or the page
could even show an error about the server and browser "disagreeing" on what
the page should look like. The fix is to explicitly wait until the browser
has taken over ("hydrated," in the jargon) before showing anything that
depends on the theme.

## Lesson 6: Why bother with "design tokens" instead of just picking colors as you go?

Imagine painting a house room by room, mixing a slightly different shade of
white each time because you eyeballed it instead of using a can labeled
"Eggshell White." A year later, every room is a subtly different white and
nobody knows why. Design tokens are the labeled paint can: one named value
per purpose (`primary`, `background`, `muted text`), used everywhere that
purpose applies. It's not just neat and tidy — it's the difference between
"change the brand color in one file" and "hunt through 50 files hoping you
didn't miss one."

## Lesson 7: Component libraries, and a real bug we hit because of one

A "component library" is a pre-made set of building blocks so you don't
reinvent a dropdown menu from scratch. Most of them work like a sealed
appliance — you use it through a small set of allowed buttons and can't see
or change what's inside. `shadcn/ui` is different on purpose: it copies the
actual source code of each component into your own project, so you can
open it up and change anything.

This project actually hit a real bug that's a great lesson in "read what
the tool actually does, don't assume." Two different popular component
libraries (Radix, which most tutorials online use, and Base UI, which this
project actually uses) both have dropdown menu items, but they listen for
clicks in subtly different ways — one uses a custom event named `onSelect`,
the other just uses the totally normal `onClick`. Code was written assuming
the Radix convention. It "compiled" without any error, because `onSelect`
happens to also be a real (but unrelated) built-in browser event — so the
type-checker had no way to know it was a mistake. It just... silently did
nothing when clicked. The dark-mode toggle button looked correct, was fully
clickable, and simply didn't work. It was caught by a different kind of
test (see Lesson 8), not by careful reading — which is exactly why that
kind of test exists.

## Lesson 8: How do you know a website works without a human clicking every button?

There are a few different kinds of automated checks, each catching a
different category of mistake:

- **Type-checking** catches "you're using the wrong _kind_ of value"
  mistakes (passing text where a number was expected) — but it has no idea
  what a button is _supposed_ to do when clicked.
- **Unit tests** check one small isolated piece of logic in complete
  isolation — no browser, no real page, just "does this one function
  return what it should."
- **Component tests** render one piece of the UI (say, a single card) in a
  fake, simplified browser environment and check what ends up in the HTML.
- **End-to-end (e2e) tests** are the most realistic: a real (if invisible)
  browser opens the actual site and clicks around exactly like a person
  would — click this button, check the page changed, type in this field.

The dark-mode bug from Lesson 7 is the perfect illustration of why you need
more than one layer: type-checking passed, and a narrower component test
might not have even simulated a real click. It took an end-to-end test
that actually clicked the "Dark" menu item and then checked the page's
real, final appearance to catch it.

## Lesson 9: Why run "lint," "format," and "build" checks automatically?

- **Formatting** (Prettier) makes sure everyone's code is indented and
  spaced the same way, automatically — nobody argues about tabs vs spaces
  because a tool just decides and applies it.
- **Linting** (ESLint) catches sketchy patterns that aren't outright
  broken but tend to cause bugs (unused variables, risky comparisons).
- **Type-checking** and **automated tests** were covered above.
- **Build** actually compiles the whole site the way it would run in
  production — catching mistakes that only show up when everything is
  assembled together, not just in one file.

Professional teams run all of these automatically (often as a required
step before code can even be merged) for one simple reason: humans are
inconsistent and get tired; a script that runs the exact same checks every
single time never forgets to look.

## Lesson 10: Git, and a genuinely important privacy lesson

Git is a tool that records every change made to the project's files over
time, like an infinite "undo history" that's also shareable and
collaborative. Once something is recorded in that history, it's there
essentially forever, even if you delete the file afterward and even in a
private repository — anyone with access to the history can dig it back up.

That's why, before a single file was added to this project's git history,
a `.gitignore` file was created that explicitly excludes the folder holding
your older CV (which has your address, phone number, and other private
details in it). Order mattered here: the exclusion rule has to exist
_before_ the first "save everything" command, or the private file would
already be permanently in the history before the rule could stop it.

---

## Lesson 11: What is a database, actually, and why Supabase?

A database is just a very organized, very fast filing cabinet. Instead of
scattered folders, everything is stored in **tables** — think spreadsheets,
where each row is one "thing" (one project, one skill, one visitor
message) and each column is one property of that thing (a project's title,
its status, its GitHub link). A "query" is just a precise question you ask
the filing cabinet ("give me every project where `published` is true"),
and the database hands back exactly the matching rows, instantly, even
with millions of them.

Supabase gives you a real, professional-grade database (Postgres — one of
the most widely used database engines in the world) plus a few things
you'd otherwise have to build yourself: a login system, file storage for
images and PDFs, and a way to talk to the database directly from a website
without writing your own backend server. That combination is why it's a
popular choice for exactly this kind of project — one person, no
dedicated backend team, but still wanting a "real" production setup.

## Lesson 12: Row-level security — the database's own bouncer

Here's a problem: your website's public pages need to read from the same
database as your private admin panel. If you're not careful, a clever
visitor could ask the database for things they shouldn't see — draft
projects you haven't published yet, or private notes.

**Row-level security (RLS)** solves this at the _database's_ level, not
just in your website's code. You write a rule directly on the database
table, like "only hand back rows where `published` is true," and the
database itself refuses to return anything else — no matter what asks for
it, including a hacker who somehow bypasses your website's own code
entirely and talks to the database directly. It's a second, independent
lock, not just trusting your app code to always remember to check.

This project takes it further in one place: whether a metric (like an
accuracy percentage) is `verified` is also checked _inside_ the database
rule itself, not just in the website's display code. So an unconfirmed
number is structurally incapable of ever appearing publicly — even a bug
in the website code couldn't accidentally leak it, because the database
itself won't hand it over.

## Lesson 13: Two kinds of "keys," and why never mix them up

Supabase (and most cloud databases) gives you two different passwords for
talking to it, for two very different situations:

- A **publishable key**: safe to put directly in your website's code that
  runs in a visitor's browser. It's low-privilege on purpose — even if
  someone reads it (and they can, it's just sitting in your page's code),
  the database's row-level security rules still apply to whatever it asks
  for.
- A **secret key**: full, unrestricted access to everything in the
  database, ignoring all those row-level security rules entirely. This
  must only ever be used in code that runs on a server you control, never
  sent to a browser. If this leaked, anyone could read or delete anything.

This project keeps them in genuinely separate files on purpose:
`src/lib/db/client.ts`/`server.ts` use the publishable key,
`src/lib/db/admin.ts` uses the secret key and is wrapped with a package
(`server-only`) that makes it an actual build error — not just a
reminder in a comment — if that file is ever accidentally imported into
code that would ship to the browser.

## Lesson 14: Migrations — why you don't just click around in a database GUI

You _could_ create database tables by clicking buttons in Supabase's web
dashboard. Professionals mostly don't, for the same reason this project
uses git for code: you want a written, ordered history of every change,
that can be re-applied identically on another machine, reviewed before
it's applied, and rolled back if something's wrong. A **migration** is
just a text file containing the exact database changes to make, numbered
in the order they should run (`0001_extensions.sql`,
`0002_core_content.sql`, and so on). Running `supabase db push` applies
any migration files the live database hasn't seen yet, in order. This
means the database's entire structure is fully described in files sitting
right next to the website's code, not locked away in someone's memory of
what they clicked.

## Lesson 15: "Draft" content and why the site can hold data it doesn't show yet

The database is now full of real content — your four flagship projects, each with a dozen written sections, your skills, your timeline. And yet if you visited the live site right now, you'd see none of it. That's not a bug — it's a deliberate pattern called a **draft/review workflow**, and it's exactly how professional publishing systems (a newspaper's CMS, a company's blog platform) work: writing something and _publishing_ it are two separate, deliberate steps, with a review step in between.

Every piece of content has a `review_status` — `draft`, `machine_assisted`, or `reviewed` — and the database itself refuses to show anything to the public unless it's marked `reviewed` (see Lesson 12 on row-level security). So content can be fully written, sitting in the database, completely real — but invisible to any visitor — until a human explicitly signs off on it. This is what makes it safe to have an AI draft first-pass content: the drafting and the publishing are never the same action, so nothing goes live by accident.

**Update, 2026-08-01:** you reviewed the drafted case-study prose and approved it, so the seed script was re-run with `review_status='reviewed'` and `published=true`. The draft/review mechanism described above is still exactly how the site works — it's just that this particular content has now passed through it and is live.

## Lesson 16: Turning database rows into an actual webpage

Having reviewed content sitting in the database isn't the same as it appearing on the site — something still has to ask the database for it and turn the answer into HTML. That "something" is two files: `src/app/[locale]/projects/page.tsx` (the grid of all projects) and `.../projects/[slug]/page.tsx` (one project's full write-up), plus a helper file, `src/lib/db/projects.ts`, that actually talks to Supabase.

A few things worth understanding about how that works:

- **The database query already knows the rules, so the page doesn't have to re-check them.** Lesson 12 explained that row-level security means the database itself refuses to hand back unpublished or unreviewed content. Because of that, the page-building code never has to write its own "only show this if it's published" check — it just asks for the data, and anything it gets back is already safe to show. One rule, enforced in one place, instead of trusted to be remembered in every page that happens to query it.
- **Markdown, and why it needed a new tool.** Your case-study sections are written with light formatting — **bold** phrases, bullet lists, links — using a plain-text convention called **Markdown** (the same style GitHub comments and this very chat use). A browser doesn't understand `**bold**` on its own; something has to translate it into real HTML (`<strong>bold</strong>`). This project added a small library, `react-markdown`, to do exactly that translation, plus `@tailwindcss/typography` to make the translated result actually look good (readable paragraph spacing, styled bullet points) instead of plain, cramped text.
- **Two simple questions instead of one clever one.** Getting a project's technology names (like "Python," "FastAPI") required two related pieces of information: which technologies a project uses, and what each technology is actually called in the visitor's language. It would have been possible to ask the database one very deeply nested question for all of it at once, but that kind of query gets fragile and hard to read. Instead, the code asks two simple questions — "what are all the technology names in this language?" and "which technology IDs does this project use?" — and combines the answers itself. Slower to write once, much easier to trust and fix later.
- **Some pages can't be "pre-baked."** Earlier phases mentioned Next.js can build pages ahead of time for speed (Lesson 3). The projects pages can't do that, because they depend on live database content that can change — instead they're built fresh on every visit ("dynamic rendering," shown as a small `ƒ` symbol in the build output). That's a deliberate tradeoff: slightly slower than a pre-built page, but always shows current content without needing to rebuild and redeploy the whole site.

## Lesson 17: Building a page out of nine smaller pieces

The homepage went from a placeholder to nine real sections in one pass:
hero, selected work, more projects, a lab preview, a "capability map" of
skills, an about blurb, a career journey, a notes teaser, and contact
links. Rather than one enormous file, each section is its own small
component (`src/components/home/hero.tsx`, `.../about.tsx`, and so on),
and the actual homepage file just lists them in order. This is the same
idea as Lesson 1's Lego-block analogy: a page is easier to reason about,
fix, and reorder when it's nine labeled pieces instead of one 400-line
block.

A few smaller lessons came out of this pass specifically:

- **Don't fetch data one section at a time if you don't have to.** All
  five things the homepage needs (your profile, your projects, your
  skills, your career timeline, and two feature flags) get requested at
  the same time using `Promise.all`, not one after another. If each took
  even 100ms and there are five of them, fetching them one-by-one would
  add up to half a second of pure waiting; fetching them together, the
  total wait is just the slowest one of the five.
- **A derived fact doesn't need its own database column.** Whether a
  skill shows as "confirmed" or "(exploring)" on the capability map isn't
  a value stored anywhere; it's computed by asking "does this skill have
  at least one piece of real project evidence, or only exploratory
  evidence?" every time the page loads. Storing a separate `confirmed`
  column that you'd have to remember to keep in sync would be a second
  source of truth that could quietly drift from the real evidence over
  time — computing it fresh from the actual evidence rows can't drift,
  because there's nothing to drift.
- **When reviewed content doesn't exist yet in a language, say so
  honestly instead of showing nothing.** The About and Journey sections
  have no German text yet (matching Lesson 15's draft/review system — no
  one has written and approved a German version). Instead of a heading
  with a blank space under it, which would look like something broke,
  those sections show an explicit "German version coming soon" message.
  Small difference, but it's the gap between "this looks broken" and
  "this is honestly still in progress."
- **A test that was right once can become wrong later, and that's not a
  reason to leave it broken.** An old automated test checked that the
  homepage's big heading contained your name, because the very first,
  placeholder version of the homepage happened to display the site title
  (which includes your name) as its heading. Once real content replaced
  the placeholder, the heading correctly changed to your actual mission
  statement instead ("Building reliable AI systems from data to
  deployment") — your name still appears elsewhere on the page (the logo,
  the footer), just not duplicated in the big heading too. The test was
  quietly checking an accident of the placeholder, not an actual
  requirement, so it got updated to check what the page is genuinely
  supposed to show.

## Lesson 18: Reusing a component in a new place can reveal it wasn't reusable yet

The resume page needed the exact same "skills grouped by category" display the homepage already has. The obvious move was to import the homepage's existing component and drop it onto the resume page. It didn't work cleanly: that component came with its own built-in spacing and section wrapper baked in specifically for the homepage's layout, so reusing it as-is on the narrower resume page would have produced doubled-up padding and an oddly wide section squeezed into a narrow column.

The fix wasn't to force it to fit, and it wasn't to copy-paste the skill-rendering code into a second file either (copy-pasting means the next bug fix or design tweak has to happen twice, in two places, and eventually the two copies drift apart). Instead, the actual "list of skills as little badges" part got pulled out into its own small, layout-free piece, and both the homepage and the resume page now wrap that same core piece with their own layout around it. This is a common pattern: the first time you actually reuse something in a second place is often the first time you find out which parts of it were genuinely general-purpose and which parts were quietly specific to where it was first built.

## Lesson 19: The contact form, and why "just save it to the database" isn't the whole job

Every page built so far only ever reads from the database. The contact form is the first thing on the public site that writes to it, and a public write path is exactly where a website is most exposed to abuse, so it's worth walking through why it isn't just "take the three text boxes and insert a row."

- **Checking on two levels isn't redundant, it's two different jobs.** The actual `<input>` and `<textarea>` fields are marked `required` with a minimum length, so a browser refuses to even submit the form if you leave the message empty. But that check runs on _your visitor's own computer_, which means it's trivial for anyone to skip it entirely just by sending a request straight to the server instead of using your form. So the server checks everything again, independently, using the same rules (via a tool called Zod, which describes "a valid submission looks like this" once and enforces it). The browser check is there for a nicer, instant experience for a real visitor; the server check is there because you can never actually trust anything that arrives from outside your own server.
- **Rate limiting stops one visitor from flooding you.** Without it, someone (or some bot) could submit the form hundreds of times a second, filling your inbox with junk or just running up costs. The fix here: a small database table counts how many messages a given visitor has sent in the last 10 minutes, and once they hit 5, the 6th is rejected outright rather than accepted and dealt with later.
- **You can't fairly count "a given visitor" using their name or email, since those can be faked.** The one honest signal a visitor can't easily fake is their IP address, which is why it's what gets counted. But storing someone's raw IP address is itself a small privacy problem, so instead of storing the real one, the server runs it through a one-way scrambling function first and only ever stores the scrambled version. Critically, that scrambling uses a secret key only the server knows, not a generic scrambling formula anyone could look up: an IPv4 address only has about 4 billion possible values, which is small enough that anyone could pre-compute every possible scrambled result in advance and reverse yours in an instant if the scrambling formula were public. The secret key is what makes that reversal actually infeasible.
- **A feature isn't actually done until you've tried to break it, not just tried to use it correctly.** Before calling this finished, the form got tested with an invalid email, a too-short message, and then six submissions in a row on purpose, specifically to confirm the 6th one gets rejected. All three of those are the visitor doing something "wrong," and a feature that's only ever been tested by doing everything right hasn't really been tested.

## Lesson 20: A database row isn't the same as you actually knowing about it

Right after the contact form went in, a real gap showed up: a message saved to the database is genuinely invisible to you unless you go open Supabase and look at a table by hand. There's no admin dashboard yet that would show it to you automatically (that's a later phase). "It's saved" and "you'll actually see it" turned out to be two different things, and only one of them was built at first.

The fix is a notification email: the moment a message saves successfully, the server also asks a third-party email service (Resend) to send you a quick email with what the visitor wrote. Two small choices worth understanding:

- **The email is set up to fail quietly if it fails at all.** If Resend has an outage right when someone messages you, the visitor should still see "message sent" and not a scary error, because their message really did save; the only thing that failed is a bonus notification they don't even know exists. So a failed email gets logged for you to notice later, but it never makes the visitor's experience look broken over something that isn't really their problem.
- **"It compiled" and "it actually sent" are different claims, so both got checked.** The code could easily look correct while silently failing to reach Resend (wrong key, wrong sender, etc.), so before calling this done, two real emails were actually sent through Resend's real service and each one came back with a real confirmation ID, not just "no error was thrown."

## Lesson 21: Testing "does it look right on a phone" with code instead of your eyes

Phase 2's last two items were filtering the projects page and a
responsive pass (checking the site looks right at every screen size). The
filters were the easy part. The responsive check is the interesting
lesson: instead of manually resizing a browser window and squinting at
every page, a small script drove a real (invisible, "headless") browser
to four different screen widths — phone, two tablet sizes, and desktop —
and asked each page one exact question: "is anything on this page wider
than the screen itself?" That's a programmatic, exact version of the
"does anything look cut off" check you'd otherwise do by eye.

It found a real bug: at exactly tablet width (768 pixels), the header was
switching from the mobile hamburger-menu button to the full desktop
navigation bar (your name, six links, two buttons, language switcher,
theme toggle), but there genuinely wasn't enough room for all of that yet
at that width — it overflowed the screen by about 2 pixels on every
single page. The fix was to simply make the switch happen at a wider
point (1024 pixels instead of 768), so tablet-width visitors keep getting
the hamburger menu, which was always going to fit, instead of a
too-early, too-cramped desktop bar. This is exactly why "responsive QA"
is its own checklist item and not just an assumption that flexible CSS
means everything automatically fits — the components can each be
individually correct and still not fit together at a specific width
nobody explicitly checked.

While starting that browser to test it, something else turned up
completely by accident: the site's live database has become unreachable.
Every page that reads real content from Supabase is currently failing,
and it's an infrastructure issue outside the code entirely — the
project's database address doesn't resolve on the internet at all
anymore, most likely because Supabase's free tier automatically pauses a
project after it goes unused for a while (nothing had touched this
database since early August). This isn't something fixable by writing
code; it needs Johar to log into the Supabase dashboard and restore the
project. It's flagged clearly in `IMPLEMENTATION_STATUS.md` as the
current top blocker.

That discovery led to one more small but genuinely useful addition:
Next.js lets you define a page that automatically catches any error a
page throws while loading and shows a friendly message instead of a raw
technical crash screen. The site didn't have one of these yet, so any
future hiccup like this one (even a brief, real one after launch) would
have shown visitors a broken-looking error page instead of a calm
"something went wrong, try again" message with the rest of the site
(header, footer, navigation) still working normally around it.

---

_Next lessons (Phase 2 onward) will cover: what "embeddings" and vector
search are and how they let a chatbot find relevant facts about you, and
how a RAG (retrieval-augmented generation) assistant is different from
just asking ChatGPT a question._
