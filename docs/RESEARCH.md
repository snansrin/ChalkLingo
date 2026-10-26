# Research and design decisions

Date: 2026-10-26. The goal is an engaging desktop language companion with observable learning interactions, not an unsupported claim to be the best language-learning system.

## Companion interaction

Reference: https://github.com/ayangweb/BongoCat

BongoCat demonstrates the appeal of immediate motion feedback, a compact desktop presence, and a character with expressive reactions. Its README describes a Live2D cat reacting to system-wide input. Mochi takes the immediate-feedback principle into an original SVG island and character. It deliberately limits observation to pointer and keyboard events in its own window. No BongoCat source, Live2D runtime, model, or visual assets were incorporated; its Apache-2.0 code is not redistributed here.

Product mapping: idle breathing and blinking; bounded pointer-following eyes; petting and answer-success hops; idle sleep; compact companion mode; persistent visible garden progression.

## Retention

Kim, S. K., & Webb, S. (2022). The Effects of Spaced Practice on Second Language Learning: A Meta-Analysis. Language Learning. https://doi.org/10.1111/lang.12479

Karpicke, J. D., & Roediger, H. L. (2008). The Critical Importance of Retrieval for Learning. Science. https://doi.org/10.1126/science.1152408

These studies motivate spaced practice and active retrieval. They do not validate this specific product, garden mechanic, five-question session length, or exact interval schedule. The 1/3/7/14/30/60/120 day schedule is an intentionally transparent heuristic, not FSRS or a fitted forgetting model.

Product mapping: due reviews precede fresh cards; a failed response returns after one minute; recognition, listening and written production offer different retrieval tasks; showing a translation or changing the displayed card earns no learning credit; hinted sentence construction preserves the existing schedule; optional practice of future cards does not move their due dates. Recognition is easier than free production, and these modes currently share one per-card schedule. A future efficacy study should compare delayed written recall across modes, rather than use time spent or pet taps as a retention metric.

## Accessibility and visual design

A quiet paper-and-sage palette, sparse ornament, original vector illustration and brief motion support a calm desktop presence. Motion can be disabled in settings and respects the OS preference. All primary interactions are buttons with keyboard focus states; petting also supports Enter/Space. Feedback uses text as well as color. No countdown pressure or lost-pet punishment is used. Full assistive-technology testing has not been conducted.

## Runtime and privacy

Primary documentation consulted:
- https://www.electronjs.org/docs/latest/api/browser-window
- https://www.electronjs.org/docs/latest/tutorial/security

Product mapping: frameless transparent BrowserWindow, sandboxed renderer, context isolation, no renderer Node access, strict local protocol host and path checks, denied permissions and navigation, validated IPC action values, local persistence, explicit user-controlled autostart. Speech outside the bundled English recordings relies on OS voices and their availability. Global input hooks, online AI and microphone access are absent.

## Scope

229 inherited curated starter rows across seven languages, including grammar rows retained in the dataset. The new learning UI uses vocabulary and sentence rows. This is a working companion and practice system with a limited starter corpus, not a complete A1–C2 curriculum. Content expansion, native-speaker review, speech assessment, cross-platform QA, localization beyond Turkish and outcome studies remain future work.
