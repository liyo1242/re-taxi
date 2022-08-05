<div id="top"></div>
<div align="center">
  <div align="center" style="width: 50px">

![docs-logo.png](.asset/docs-logo.png)

  </div>
  <h3 align="center">Re-Taxi</h3>

  <p align="center">
    This is a refactoring project from my last work project
    <br />
    <br />
  </p>
</div>

<details open="open">
<summary> 🗻 Table of Contents</summary>

- [About This Project](#about-this-project)
  - [Prerequisites](#prerequisites)
- [Useful Links](#useful-links)
- [My Strategy](#my-strategy)
- [Usage](#usage)
- [Project structure](#project-structure)

</details>

## About This Project

This project includes 1 main part, optimize API efficiency when relying on **google map API** to select addresses

The main reason for refactoring this project is to bring to a close what I did not do before.

### Prerequisites

This project start from **TypeScript** and **React**, and has some base lint rule (eslint and commitlint), so the development may need to pay attention to

## Useful Links

React Router 6
https://reactrouter.com/docs/en/v6/getting-started/tutorial

RTKQ
https://redux-toolkit.js.org/rtk-query/overview

## My Strategy

In my previous work experience, I learned that the most traffic-consuming points were predictive queries and map selection

- I expect to use RTKQ and IndexDB for optimizing the **prediction queries** part.
- The **map selection** part will use a slow trigger strategy

Other areas that could be optimized are the user experience of selecting addresses

## Usage

After you have cloned, there are a few things you must do

- Add local env `.env.local` to place your **google map key**

```json
REACT_APP_GOOGLE_KEY="YOUR_KEY"
```

- Install the dependencies

```bash
yarn
```

- Start this project

```bash
yarn run start
```

- If you just want to see the UI, you can find him through **storybook** (not yet 😂)

```bash
yarn run storybook
```

## Project structure

My folder structure is separated by feature, as the project is still small, so I want to avoid over-design.

```shell
Project
├─ .asset                                   #  docs asset
├─ .husky                                   #  husky config folder (lint check before commit)
├─ .vscode                                  #  vscode config folder (extension convenience)
├─ public
│  ├─ mainifest.json                        #  I will add PWA feature after refactor
│  └─ index.html
├─ src
│  ├─ feature                               #  core Logic Components
│  ├─ layout                                #  UI that is not part of the main program
│  ├─ router                                #  the act of splitting the router
│  ├─ store                                 #  RTK slice
│  ├─ stories                               #  storybook component stories (not yet 😂)
│  └─ ...
└─ ...
```
