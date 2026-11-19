[English](README.en.md) | [Русский](README.md)

# React Kanban

![React](https://img.shields.io/badge/react-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-5-8DD6F9?style=flat&logo=webpack&logoColor=black)
![Node.js](https://img.shields.io/badge/node.js-18.18.0-339933?style=flat&logo=nodedotjs&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-2-6E9F18?style=flat&logo=vitest&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CSS3-CC6699?style=flat&logo=sass&logoColor=white)
![Responsive](https://img.shields.io/badge/responsive-768–1920px-brightgreen?style=flat)

**[Live Demo](https://alekstar79.github.io/react-kanban/)**

---

## Table of Contents

<!-- TOC -->
* [React Kanban](#react-kanban)
  * [Table of Contents](#table-of-contents)
  * [About](#about)
  * [Key Features](#key-features)
  * [Implementation](#implementation)
    * [State and Persistence](#state-and-persistence)
    * [Drag & Drop](#drag--drop)
    * [Search](#search)
    * [Responsive Layout](#responsive-layout)
    * [Render Optimization](#render-optimization)
  * [Installation and Usage](#installation-and-usage)
    * [Requirements](#requirements)
    * [Install dependencies](#install-dependencies)
    * [Run in development mode](#run-in-development-mode)
    * [Build for production](#build-for-production)
    * [Available Scripts](#available-scripts)
  * [Testing](#testing)
  * [Project Structure](#project-structure)
  * [License](#license)
<!-- TOC -->

---

## About

A Kanban task board built with **Webpack + React + TypeScript** and **SCSS** for styling. The application strictly follows requirements for sorting, overdue highlighting, cross-column drag & drop, text and date search, state persistence, and responsive layout across 768–1920 pixels.

The project is built without third-party UI libraries or drag & drop frameworks: it uses the native HTML5 Drag and Drop API, per-component isolated SCSS modules, and local `woff2` fonts.

---

## Key Features

- **Four columns** (`To Do`, `In Progress`, `Review`, `Done`); within each column tasks are sorted by `startDay` ascending.
- **Overdue tasks** receive a red border (`endDay < today` and `type !== 'done'`); cards in `Done` are not highlighted.
- **Deletion** is available in every column on card hover; **editing** is available only in `To Do`, matching the mockup.
- **Drag & Drop** — move tasks between columns, with automatic re-sorting by `startDay` after status change.
- **Search** — incremental, by description (case-insensitive) and by `dd.mm.yyyy` dates.
- **Persistence** — state is saved to `localStorage` after every change.
- **Responsive** — horizontal scroll below 768px, constrained and centered above 1920px.
- **Modern CSS** — `@layer` for cascade control, `@container` for card adaptation inside narrow columns, `clamp()` for fluid spacing.

---

## Implementation

### State and Persistence

Task state lives in the root `App` component. On mount, `localStorage` is read and validated; if the value is absent or invalid, `tasks.json` is loaded. Writes happen after every change via `useEffect`. The storage key is `react-kanban.tasks`. A dedicated validator checks field types, allowed statuses, and timestamp sanity.

### Drag & Drop

Native implementation via `dragstart`, `dragover`, `drop`, `dragend`. Dragging is allowed only between columns: the status change is performed by a pure function `moveTask()` that returns a new array without mutations. Reordering within the target column happens automatically at render time — by `startDay` — so the card lands at the position matching its start date rather than at the end of the list.

### Search

A single search field is normalized: the query is lowercased, matched as a substring against `text`, and also against the formatted `startDay` / `endDay` strings. Date search is incremental: a partial query `19` returns every card where any date contains `19`, while `19.12.2024` narrows the result to an exact match.

### Responsive Layout

The board uses CSS Grid with `grid-template-columns: repeat(4, minmax(0, 1fr))` and a minimum width of 768px. Below that threshold, horizontal scrolling is enabled on the wrapper. Above 1920px, the container is constrained via `max-width` and centered. Column gaps and padding use `clamp()`, smoothing the 768–1024px range. Cards declare `container-type: inline-size`: below a certain container width, labels stack above values, the date font shrinks, and descriptions are clamped.

### Render Optimization

Cards are wrapped in `React.memo`, event handlers in `useCallback`, and filtered/sorted lists in `useMemo`. Task updates are immutable, keeping references intact so that `memo` truly prevents neighbouring cards from re-rendering when a single card changes.

---

## Installation and Usage

### Requirements

- **Node.js** version 18.18.0 or higher
- **npm** (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run start
```
The application will be available at `http://localhost:3000/`.

### Build for production

```bash
npm run build
```
The production bundle will be in the `dist/` directory.

### Available Scripts

| Command             | Description                                    |
|---------------------|------------------------------------------------|
| `npm run start`     | Starts the Webpack dev server                  |
| `npm run build`     | Builds the production bundle into `dist/`      |
| `npm run test`      | Runs unit and component tests (Vitest)         |
| `npm run typecheck` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## Testing

Framework — **Vitest** with JSDOM and React Testing Library. Tests live in `tests/` with a structure mirroring `src/`:
- `tests/utils/` — unit tests for `overdue`, `taskFilters`, `taskSort`, `taskValidation`, `localStorageTasks`, `moveTask`, `dateFormat`.
- `tests/components/` — component tests for `KanbanBoard` and `TaskCard`.

**Overdue function test:** `tests/utils/overdue.test.ts`.

---

## Project Structure

```text
react-kanban/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── icons/            # SVG action and status icons
│   │   └── background.jpg
│   ├── components/
│   │   ├── KanbanBoard/      # column grid and scroll wrapper
│   │   ├── Column/           # single column with card list
│   │   ├── SearchBar/        # search field
│   │   └── TaskCard/         # task card, hover and edit mode
│   ├── data/
│   │   └── tasks.json        # initial task set
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
│   └── styles.scss           # global tokens, reset, @font-face
├── tests/                    # tests mirroring src/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── webpack.config.js
└── README.md
```

---

## License

[MIT](LICENSE)
