# Project Blueprint

## Overview
This project is a Next.js static site, built with the App Router. The AI assistant is tasked with developing and maintaining the project, including fixing issues, adding new features, and ensuring best practices.

## Detailed Outline of Current Features & Design
Currently, the project has a basic Next.js setup with a homepage (`src/app/page.tsx`), and some components like `Hero.tsx`, `Footer.tsx`, `Header.tsx`, `ThemeProvider.tsx`, and `ThemeToggle.tsx`.

## Plan for Current Request: Fix Missing UI Button Component

### Problem
The `src/components/ui/button.tsx` component is missing, leading to import errors in various parts of the codebase.

### Solution
1. Create the file `src/components/ui/button.tsx`.
2. Add a basic React button component (using shadcn/ui styles) to the file.
3. Conduct a scan of the codebase to identify and resolve any other similar issues, such as missing components or structural inconsistencies.

## Plan for Current Request: Resolve Remaining Import Issues in `src/app/page.tsx`

### Problem
`src/app/page.tsx` has unresolved imports for `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`, `Separator` from `@/components/ui/separator`, and a potential issue with the `Hero` component import.

### Solution
1. Create the file `src/components/ui/card.tsx` and add the necessary Card components.
2. Create the file `src/components/ui/separator.tsx` and add the Separator component.
3. Verify the existence and correct export of the `src/components/Hero.tsx` component. If it's missing or malformed, fix it.
4. Run `npm install` and `npm run lint -- --fix` to ensure all dependencies are resolved and linting issues are fixed after modifications.

## Plan for Current Request: Refactor Component Naming to PascalCase

### Problem
Several React components (`footer`, `header`, `theme-provider`, `theme-toggle`, and `HomePage` in `src/app/page.tsx`) are not named using PascalCase, which is the industry standard for React components.

### Solution
1. **Rename Files and Components**:
    *   Rename `src/components/footer.tsx` to `src/components/Footer.tsx` and update the component name inside.
    *   Rename `src/components/header.tsx` to `src/components/Header.tsx` and update the component name inside.
    *   Rename `src/components/theme-provider.tsx` to `src/components/ThemeProvider.tsx` and update the component name inside.
    *   Rename `src/components/theme-toggle.tsx` to `src/components/ThemeToggle.tsx` and update the component name inside.
    *   Rename `HomePage` component in `src/app/page.tsx` to `Home`.
2.  **Update Imports and Usage**: Go through all files that import or use these components and update their import paths and component tags. This includes `src/app/page.tsx`, `src/app/layout.tsx` (if it uses any of these), and any other components that might be using them.
3.  **Run Linting and Installation**: After all changes, run `npm install` and `npm run lint -- --fix` to ensure no new errors are introduced.

## Plan for Current Request: Create Missing `src/app/layout.tsx`

### Problem
The `src/app/layout.tsx` file is missing, which is essential for a Next.js App Router project to define the root layout and provide necessary HTML structure and providers.

### Solution
1.  **Create `src/app/layout.tsx`**:
    *   Include the basic HTML structure (`<html>`, `<body>`).
    *   Import and use `ThemeProvider`, `Header`, and `Footer` components.
    *   Ensure the imports for `Header`, `Footer`, and `ThemeProvider` use the correct PascalCase paths.
    *   Add global CSS import.
2.  **Run Linting and Installation**: After all changes, run `npm install` and `npm run lint -- --fix` to ensure no new errors are introduced.

## Plan for Current Request: Create Missing `src/app/globals.css`

### Problem
The `src/app/globals.css` file is missing, leading to import errors in `src/app/layout.tsx` and preventing global styles from being applied.

### Solution
1.  **Create `src/app/globals.css`**:
    *   Add the necessary Tailwind CSS directives (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`).
2.  **Run Linting and Installation**: After creating the file, run `npm install` and `npm run lint -- --fix` to ensure no new errors are introduced.
