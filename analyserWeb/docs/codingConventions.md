# analyser-web — Coding Conventions

This document defines the coding conventions for the analyser-web project to ensure code consistency, readability, and maintainability across all modules.

Applies to: /core, /renderer, /ui, /styles, /tests

---

## 📦 General

- Language: TypeScript (strict mode enabled)
- Framework: React (Functional Components only)
- Build tool: Vite
- Style: Prettier + ESLint enforced
- Use clear variables that are easy to understand
- Keep comments limited, rather no comments
- Keep the code compact with very limited whitelines
- The old legacy code is a bad example of coding conventions for this project

---

## 🧱 File & Folder Structure

- Use `camelCase` for all non-component files: `gridCalculator.ts`
- Use `PascalCase` for React component files: `CanvasViewport.tsx`
- Use lowercase folder names: `core/grid/`
- Group logic by domain, not by type (e.g. `core/evaluator/`, not `services/`)

---

## 🧠 Naming Conventions

- **Variables & functions**: `camelCase`
- **Constants**: `SNAKE_CASE`
- **Types & interfaces**: `PascalCase`
- **React components**: `PascalCase`

---

## 💡 TypeScript Guidelines

- Always type function parameters and return values
- Use `interface` for data structures, `type` for unions/aliases
- Avoid `any`; use `unknown` with type guards if necessary
- Use `readonly` for immutable structures where applicable
- Prefer type-safe utility functions over inline logic

---

## 🔁 React Best Practices

- Use function components and React hooks only
- Avoid class components entirely
- Split logic-heavy components into subfunctions or hooks
- Avoid prop drilling; prefer Context API or local reducers
- Use `useMemo`, `useCallback` and other optimizations as needed
- Co-locate component and style files if styling is component-specific

---

## 🎨 Styling (CSS / Tailwind)

- Prefer Tailwind CSS for layout and design
- Use utility-first classes in JSX where appropriate
- Fallback to `app.css` for global styles
- Avoid inline styles unless necessary for dynamic values

---

## 🔧 Imports & Project Structure

- Sort imports in the following order:
  1. External dependencies
  2. Internal aliases (e.g. `@core/`, `@ui/`)
  3. Relative paths
- Define path aliases in `tsconfig.json` for `@core`, `@renderer`, `@ui`, etc.
- Use absolute imports via aliases where possible

---

## ⚠️ Error Handling & Robustness

- Wrap expression evaluation in `try/catch`
- Provide user feedback for formula errors or invalid input
- Use fallback rendering if evaluation fails

---

## 🚦 State Management

- Use `useState`, `useReducer` for local state
- Use React Context only for shared app-wide state
- For complex state scenarios, consider Zustand or similar (if needed)

---

## 🧪 Testing

- Use **Vitest** for unit and integration testing
- Write isolated unit tests for `core/` modules
- Use React Testing Library for UI tests
- Write at least one test per major function or component

---

## 📎 Comments & Documentation

- Avoid inline comments unless essential
- Use meaningful, descriptive identifiers
- Document non-trivial logic in markdown (e.g. `docs/analysis.md`)

---

## 🧹 Code Quality

- Lint code on pre-commit
- Format using Prettier
- Run type validation (`tsc --noEmit`)
- Prefer composition over inheritance

---

## ✅ Commit Conventions (Optional)

- Use semantic commits:
  - `feat:` new feature
  - `fix:` bug fix
  - `refactor:` internal refactor
  - `docs:` documentation changes
  - `test:` testing code
  - `chore:` tooling, CI, config

---

This document may evolve as the project grows.