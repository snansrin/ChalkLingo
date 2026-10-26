# Validation record — Mochi 1.0.0

Date: 2026-10-26. Windows x64, Node.js 24.19.0, Electron 45.0.0, Playwright 1.62.1. This record separates observed behavior from product intentions.

## Automated checks

`npm run check`: JavaScript syntax checks passed and five model/data tests passed. These cover increasing review intervals and failed-recall reset, due-first selection, bounded imported records/settings, answer normalization and accent distinctions, unique lesson IDs and A1 game availability in all seven languages.

`npm run test:desktop`: passed in real Electron. Covers all four game modes; five-answer session completion; incorrect written answer; garden growth; no passive XP for displaying cards; settings changes; Japanese C2 display; theme and reduced-motion changes; persistence across reload; pet/widget dimensions; always-on-top; tray hide and paused animation class; renderer sandbox/context isolation/disabled Node; foreign-host and encoded traversal rejection; backup export and restore.

Screenshots captured from that real application: widget, game picker, garden, sentence feedback, settings and compact pet. Images were visually inspected. The GIF is a sequence of actual application frames, not a mockup.

## Runtime sampling

A five-second visible-window sample under the Playwright harness measured about 0.67 seconds of summed process CPU time after animation optimization, versus 2.65 seconds in the initial continuously redrawn version. That is about a 75% reduction within these short local samples, not a portable benchmark. The corresponding visible sample is roughly 13.5% of one CPU core; a five-second hidden-window sample was about 4.0% of one core, including the transition into hiding. GPU drivers, scale factor, development instrumentation and hardware affect these results.

Summed process working sets were approximately 406 MiB with animations visible. This sum can count shared pages more than once and is not a unique physical-memory measurement. Electron has a substantial baseline footprint. No claim of negligible memory consumption, zero CPU, long-term leak freedom or absence of all performance issues is made. Longer soak tests remain future work.

Implemented resource controls: only one reminder interval (15 seconds), bounded particle lifetimes, pointer updates coalesced to one animation frame, discrete low-frequency SVG detail updates, separately composited island movement, animation pause while a panel is open or window hidden, cancelled audio on hide, and OS/user reduced-motion preferences.

## Packaging and installation

Windows NSIS installer and portable executable built from the final application sources. No code-signing certificate is configured. Source and packaged application files are compared before delivery. Installed application smoke-test result is recorded after installation below.

The obsolete ChalkLingo installed application was removed through its uninstaller. Its exact roaming-data folder and exact Windows startup value were removed. Old installation packages and prior deliverables in the original task folder were removed. Repository history is preserved; the current source replaces the old chalkboard UI, character and optional LLM bridge.

## Limits

Only Windows was executed. macOS/Linux package definitions were retained but are unverified. OS TTS voice availability varies; English starter recordings are bundled. The 229-row corpus is a starter dataset, includes grammar rows not used by the new games, and does not supply a full A1–C2 curriculum. Exact schedule and garden mechanics have not undergone an educational efficacy study. Security checks are bounded regression tests, not an independent security audit.

## Installed build result

The NSIS installer exited with code 0. The complete desktop regression suite was then rerun with `MOCHI_EXE` pointing to `C:\Users\snans\AppData\Local\Programs\Mochi\Mochi.exe`; it passed. All seven runtime source/data files in the packaged ASAR match the final source after normalizing Windows line endings, and the packaged name/version match Mochi 1.0.0. Installer, portable, source archive and checksums are delivered together.
