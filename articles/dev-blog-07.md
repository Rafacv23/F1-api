---
title: "Phase 2 API optimization (without Redis cache)"
description: "We reduced rows read with query refactors, better filtering, and safer edge behavior"
category: "changelog"
date: "28-03-2026"
author: "Rafa Canosa"
---

# Phase 2: reducing rows read without Redis

Last month we reached **3,000,000,000+ rows read**, so this phase focuses on reducing database scans in the most frequently requested race endpoints.

## What changed in the endpoints

We refactored the main season/round and current/last endpoints to avoid large multi-table joins as the first step.

Before:

- Big joins across session + races + championships + circuits + drivers + teams in a single query.
- Filters like `year` and `round` were applied after joining big datasets.

Now:

- Step 1 query: resolve the target race with indexed filters (`championshipId + round` or latest session date).
- Step 2 query: fetch only the session rows for that `raceId` and then join lightweight dimensions (`drivers`, `teams`).
- Reduced joins by removing `Championships` where we already have `championshipId` in `Races`.

Updated routes:

- `/api/[year]/[round]/race`
- `/api/[year]/[round]/qualy`
- `/api/[year]/[round]/fp1`
- `/api/[year]/[round]/fp2`
- `/api/[year]/[round]/fp3`
- `/api/current/last/race`
- `/api/current/last/qualy`
- `/api/current/last/fp1`
- `/api/current/last/fp2`
- `/api/current/last/fp3`

## Cache strategy used (without Redis)

We kept response caching at the HTTP layer:

- `revalidate = 600`
- `Cache-Control: public, max-age=600, stale-while-revalidate=60`

This gives lower database pressure for repeated requests while keeping the API fresh enough for race data use cases.

## Stability fixes included

- Middleware rate limiter now fails safely if Upstash environment values are missing or invalid.
- Blog page layout now uses `min-h-screen` instead of a fixed `h-screen`, preventing article-list collapse while scrolling.
- Fix error [#43](https://github.com/Rafacv23/F1-api/issues/43)

## Expected impact

- Fewer scanned rows in top endpoints.
- Lower repeated-read cost on hot paths.
- Better API behavior under traffic spikes.

## Contributting

We are always open to get PRs, translations, issues, articles and suggestions from the community in [Github](https://github.com/Rafacv23/F1-api).

F1 Connect it´s a free and open source project, so we aprecciate a lot any Github star or sharing our work with the community.

Thanks from the F1 Api team.
