# Proofloom multilingual architecture — v0.3

A language selector is injected on **every** HTML page, not only the landing page. It persists the selection in a same-site HTTP-only cookie, respects `?lang=fa` shareable URLs and a safe local return path, updates the HTML `lang` and `dir`, and supports RTL for Persian/Arabic/Urdu. The application never sends user-authored submissions to an external translation provider. User-authored content, repo paths, UUIDs, URLs and tokens remain intact.

## Literal editorial translations

English is canonical. Translate each *platform-owned UI sentence* faithfully, with no embellishment, omitted qualifiers or exaggerated financial promises. Technical identifiers (GitHub, XP, WorkPacket, USDC) remain recognizable. Every locale has an editable `locales/<locale>.txt` source and a compiled `locales/<locale>.json` dictionary. Rebuild with `python scripts/build-locales.py` before shipping. The selector exposes only locales with at least 350 approved translations; an unready locale is never presented as fully translated.

Current complete dictionaries: **English, Persian, Arabic, Spanish, French, German, Brazilian Portuguese, Russian, Simplified Chinese and Hindi**. Other locale scaffolds are reserved for expansion; their empty dictionaries are intentionally not selectable.

## Coverage and QA

`node --test tests/i18n.test.mjs` tests 12 mission titles/descriptions/deliverables and critical conversion, data and legal text for every published locale. Platform-owned short validation messages are translated via the same locale dictionary. User-authored submissions remain as submitted; new copy requires an exact localized dictionary entry. Review localization on every new page. Do not translate arbitrary untrusted user submissions or signed payloads. The locale is visual only and does not affect the economics, authorization or stored content.

## New locale workflow

1. Create `locales/<BCP47>.txt` mapping exact English copy to direct target translations with `English => Translation` lines.
2. Run `python scripts/build-locales.py`. Add import and typed entry in `src/translations.ts` if new.
3. Meet the complete-coverage bar (at least 350 reviewed UI entries plus every mission string), add tests and check text overflow/RTL.
4. Deploy; newly completed locales automatically appear in the language selector.

## Live verification

`POST /__i18n_smoke` checks 60 page/locale combinations (10 languages × six routes) for HTTP 200, language direction, selected-language selector state, and visible localized headings. It does not create users or modify financial records. For additional languages, add an editorially reviewed glossary; do not silently fall back to a partially English interface.

## v0.4 addition

All nine published non-English dictionaries include the new q13 mission title/brief/deliverable and contributor WorkPacket evidence/timeline strings. The enforced canonical key set grows from 354 to 379 keys per language; the locale parity test must pass before release.
