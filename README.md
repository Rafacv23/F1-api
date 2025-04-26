# 🏎️ F1api.dev | Your free & open source F1 api, ready for development

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Star on GitHub](https://img.shields.io/github/stars/rafacv23/F1-api?style=social)](https://github.com/rafacv23/F1-api) [![Fork on GitHub](https://img.shields.io/github/forks/rafacv23/F1-api?style=social)](https://github.com/rafacv23/F1-api/fork)

Project made with Next.js and Turso to take all the data about the Formula 1 Championship.

[f1api.dev](https://f1api.dev)

![f1-connect-api-preview](https://i.imgur.com/BDxpw46.png)
![f1-connect-api-performance](https://i.imgur.com/9FiC5VK.png)

## 🛫 Endpoints

You can find all the available endpoints in the [docs](https://f1api.dev/docs) section of the website.

## 🪄 Official SDK to use the API

You can use the official SDK to use the API. This is not mandatory, you can simply use fetch to get the data.

[F1 API SDK GitHub](https://github.com/Rafacv23/f1api-sdk) <br>
[F1 API SDK NPM](https://www.npmjs.com/package/@f1api/sdk)

### Installation

You can use npm, pnpm, yarn or bun to install this package.

```bash
npm install @f1api/sdk
```

### Usage

#### Initialize the SDK

You can use coommonjs or ES6 import to initialize the SDK.

```js
import F1Api from "@f1api/sdk"

const f1Api = new F1Api()
```

#### Use any method to retrieve endpoint data

```js
const drivers = await f1Api.getDrivers()
```

## ⌨️ Stack

- Next.js
- React
- Turso
- JavaScript
- TypeScript
- Tailwind
- Shadcn
- HyperUi
- Playwright

## 📱 Contact

You can contact with us [contact](https://f1api.dev/contact) section of the website.

## 👀 Be part of the project

Feel free to check my code and make comments about it. And use it in your daily work.

```
git clone https://github.com/Rafacv23/F1-api
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mbhusty"><img src="https://avatars.githubusercontent.com/u/7149699?v=4?s=100" width="100px;" alt="Artem Anisimov"/><br /><sub><b>Artem Anisimov</b></sub></a><br /><a href="#translation-mbhusty" title="Translation">🌍</a> <a href="https://github.com/Rafacv23/F1-api/issues?q=author%3Ambhusty" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/brzzdev"><img src="https://avatars.githubusercontent.com/u/15687450?v=4?s=100" width="100px;" alt="Paul"/><br /><sub><b>Paul</b></sub></a><br /><a href="https://github.com/Rafacv23/F1-api/issues?q=author%3Abrzzdev" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
