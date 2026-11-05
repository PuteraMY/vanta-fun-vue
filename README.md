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
Unit tests in `tests/api.test.js` use mock API responses; they are **not** a substitute for live endpoint and browser tests. Confirm live API results, keyboard navigation and mobile behavior before submission.

## Deployment
Production: https://vanta-fun-vue.vercel.app

The original VANTA FUN deployment remains separate.
