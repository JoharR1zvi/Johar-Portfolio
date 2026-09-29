# Launch Checklist

Seeded from the master prompt's pre-launch content checklist (section 26) and
acceptance criteria (section 27). Check items off as they're resolved —
most require Johar's input (content/assets/confirmations), not code.

## Content and assets

- [ ] Add a reviewed professional photo, or keep the JR monogram placeholder.
- [ ] Export and upload the current one-page resume as PDF.
- [ ] Confirm final MSc specialization wording; add expected graduation date once known (do not invent one before then).
- [ ] Synchronize the F1 GitHub README with actual project progress; confirm final target/metrics.
- [ ] Confirm which F1 metrics/charts are stable enough to publish.
- [ ] **F1 predictor: Johar confirmed (2026-09-29) the project is
      finished** — current site copy still frames it as "in progress, no
      metrics" (the local `F1_Race_Predictor_Project_Report.docx`, read
      directly in Phase 4, already hinted at this: a full 12-section EDA,
      three trained model classes, a defined primary target, a time-based
      cross-validation scheme, just no stated accuracy/ROC-AUC value).
      **Blocked on Johar uploading a newer/finished source doc.** Once it
      arrives: re-parse into `CONTENT_FACTS.md`, then update
      `supabase/seed/data/projects/f1-predictor.ts`, the published case
      study, and `messages/{en,de}.json`'s `labF1` section (used by
      `src/components/lab/f1-pipeline.tsx`) together, not just one of them.
- [ ] Confirm Swiggy repository/demo visibility and the exact extent of live-key testing. Never publish the key.
- [ ] **Swiggy: Johar confirmed (2026-09-29) the project is finished.**
      Same pattern as F1 — the published case study and Lab simulator both
      say "55+" tests (from `docs/CONTENT_FACTS.md`/the master prompt),
      but the local `Swiggy Instamart Agent - Project Notes v2.docx` (read
      directly, Phase 4) says 62 currently pass; the "v2" filename suggests
      it postdates the master prompt's figure. **Blocked on Johar
      uploading a newer/finished source doc** — once it arrives, re-parse
      into `CONTENT_FACTS.md`, then update
      `supabase/seed/data/projects/swiggy.ts`, the published case study,
      and `messages/{en,de}.json`'s `labSwiggy` section (used by
      `src/components/lab/swiggy-agent-simulator.tsx`) together.
- [ ] Add architecture diagrams and screenshots for PE-CDSS and Swiggy.
- [x] Confirm the 90% accuracy claim before it's shown publicly (Johar confirmed directly, 2026-07-31; now live).
- [ ] Document the skin-lesion dataset, split methodology, and evaluation details behind that confirmed figure (follow-up, not a blocker).
- [ ] Review all German translations (must be `reviewed`, not just `machine_assisted`, before public display).
- [ ] Replace the outdated GitHub profile README and pin the strongest repositories (draft lives in `GITHUB_PROFILE_README_DRAFT.md`, push only with explicit approval).

## Acceptance criteria (definition of done)

- [ ] A recruiter can identify Johar, his target role, strongest three projects, location, and contact options within ~30 seconds.
- [ ] Homepage stays sleek/scannable; every flagship project has a technically substantive case-study page.
- [ ] Project contribution boundaries and statuses are accurate: PE-CDSS group contribution, Swiggy working POC/MVP, F1 in progress, skin-lesion academic prototype.
- [ ] English and German routes are complete, navigable, SEO-aware, and preserve locale across actions.
- [ ] Theme toggle supports light, dark, and system preferences.
- [ ] The RAG assistant gives source-linked grounded answers, refuses unsupported facts, never accesses private/admin content.
- [ ] The interactive lab is useful and safe; public Swiggy interactions are mocked; F1 model UI is feature-flagged until stable.
- [ ] Admin can edit projects/translations, publish changes, upload media, and re-index changed content without code edits.
- [ ] All public pages are responsive, keyboard accessible, reduced-motion aware, free of obvious contrast/overflow defects.
- [ ] No private CV fields or credentials are present in source, database, logs, metadata, RAG index, or deployed client bundle.
- [ ] Formatting, lint, typecheck, tests, and production build pass in CI.
- [ ] Repo documents dev/format/lint/typecheck/test/build commands clearly (README + `docs/`).
- [ ] README and this launch checklist allow Johar to operate and update the site after handoff.
- [ ] Admin can upload a PDF/DOCX/Markdown project document, receive a structured extraction draft, inspect provenance, edit/approve fields, and publish only after human review.
- [ ] The importer never invents metrics or silently changes status/ownership/technical claims; older documents cannot override newer approved facts without explicit review.
- [ ] For an existing project, admin can upload a newer document and get a field-level comparison against current approved content (New/Changed/Removed/Unchanged/Conflict), with selective accept/reject/edit.
- [ ] Previous published revisions and source-document revisions remain recoverable after an update publishes.
- [ ] Only approved changed content is regenerated and re-indexed; rejected drafts and superseded chunks never stay active in retrieval.
- [ ] No project health/readiness score or interview-coach feature exists anywhere in the first release.
