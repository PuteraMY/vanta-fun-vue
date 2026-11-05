# VANTA FUN — Fun & Entertainment

Vue 3 + Vite entertainment portal, independently deployed on Vercel.

## Modules and API sources
- **Characters:** [Rick and Morty API](https://rickandmortyapi.com/) — selected unique API, pending confirmation against classmates' API selections.
- **Jokes:** [JokeAPI](https://v2.jokeapi.dev/) — categories, search and random jokes.
- **Activities:** [Bored API](https://bored-api.appbrewery.com/) — discovery and category filtering, with clearly labeled curated suggestions when the upstream service is unavailable or has no matches.

## Run
```sh
npm install
npm run dev
npm test
npm run build
```

## Assessment features
Semantic page sections, responsive dark UI, search/filter, character/joke/activity detail dialogs, loading skeletons, empty/error states, API error handling, accessible labels, reduced-motion support and Vercel deployment.

## Verification
Verification performed 6 November 2026: **9/9 API unit tests**, **11/11 live production API checks**, and **20/20 headless Chromium browser checks** across 1366px desktop and 390px mobile. These checks cover search, filters, content dialogs, Escape, JavaScript errors and horizontal overflow. They do not prove perfect accessibility, performance on every device, or lecturer approval.

## Deployment
Production: https://vanta-fun-vue.vercel.app

The original VANTA FUN deployment remains separate.

## Theme approval pending
The entertainment theme appears in the separate API-selection Word sheet, but is not among the four themes shown in the final-project PDF. **Lecturer confirmation is required before submission.** If declined, preserve this repository and build a separate project in an officially approved theme. Do not describe this project as approved before confirmation.

## Submission checklist
- [ ] Lecturer confirms Fun & Entertainment theme and Rick and Morty API uniqueness
- [ ] Confirm course code against official PDF (DFV 10023) and previous cover (DFK10023)
- [ ] Update report PDF to describe this Vue 3 repository, not the older Next.js version
- [ ] Download a fresh ZIP of this repository (main branch)
- [ ] Record a 5–10 minute demo of all three modules and loading/error handling
- [ ] Submit production Vercel URL and all required deliverables
