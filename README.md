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
  - [Another Notice](#another-notice)
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

#### Another Notice

1.  When dragging the map to select a location, somethings should be noted

    - Normally, we may want to use debounces to save Api traffic
      ![notice-1.png](.asset/notice-1.png)
    - When the setting is triggered at the end of dragging, this may run into a trap, You can see that there is one more event trigger in the diagram
      ![notice-2.png](.asset/notice-2.png)
    - You should do the reset timer at the start of the next drag
      ![notice-3.png](.asset/notice-3.png)

2.  When fetch history data, you may encounter a situation where the default display usually specifies a certain number of orders to be displayed, and the origin and destination information may exist at the same time as the history of orders, so you may have the problem of **not knowing how many orders to take to just meet the demand**.
    - only need 3 order (`/orders?query=3`)
      ![notice-4.png](.asset/notice-4.png)
    - need 4 order (`/orders?query=4`), but the last order destination is ignored
      ![notice-5.png](.asset/notice-5.png)
3.  There is one of user action you should be noted, in this situation, The user may take the following four actions (Let's ignore the possibility that it will just close and go away)
    - **Press the previous button**, but the input text `taipei macdona` is need to be handle, In this project, it will revert to the previous input state
    - **Continue entering text**, normal operation
    - **Click on the address element**, normal operation
    - **Press the map select button**, but the input text `taipei macdona` is need to be handle, In this project, it will use the first prediction as input and move the map center to the location
      ![notice-6.png](.asset/notice-6.png)

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
