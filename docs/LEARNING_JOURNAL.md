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

---

_Next lessons (Phase 2 onward) will cover: what "embeddings" and vector
search are and how they let a chatbot find relevant facts about you, and
how a RAG (retrieval-augmented generation) assistant is different from
just asking ChatGPT a question._
