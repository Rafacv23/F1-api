---
title: "New Cache system with Redis"
description: "New caching system with Redis to make your API requests even faster and more efficient."
category: "changelog"
date: "17-04-2025"
author: "Rafa Canosa"
---

# ⚡ New Redis Cache Layer

We’ve introduced a new caching system using **Upstash Redis** to make your API requests even faster and more efficient.

- Responses from frequently used endpoints are now cached automatically.
- This reduces latency and improves performance for all users.
- It also helps keep our infrastructure stable during peak traffic.

This system uses a **Time-To-Live (TTL)** based strategy, so responses are stored for a short period of time and automatically refreshed when needed — meaning your data stays fresh while keeping everything snappy.

> ⚙️ No action is needed on your side. All caching is handled server-side transparently.

If you're building apps that rely on quick responses, this update will give you a noticeable performance boost out of the box.

## Contributting

We are always open to get PRs, translations, issues, articles and suggestions from the community in [Github](https://github.com/Rafacv23/F1-api).

F1 Connect it´s a free and open source project, so we aprecciate a lot any Github star or sharing our work with the community.

♥️ Thanks from the F1 Api team.
