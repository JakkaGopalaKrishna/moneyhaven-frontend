# MoneyHaven

MoneyHaven - Smart Personal Finance Platform

## Project Overview
MoneyHaven is a comprehensive personal finance dashboard application. This repository contains the frontend architecture, focusing on a clean, scalable, and responsive user interface built using modern web technologies.

## Tech Stack
* React 19
* Vite
* Redux Toolkit & React Redux (with Redux Persist)
* React Router DOM
* Ant Design
* Tailwind CSS
* Axios
* Framer Motion

## Installation Steps
1. Clone the repository.
2. Ensure you have Node.js installed (v18+ recommended).
3. Run `npm install` to install dependencies.
4. Copy `.env.example` to `.env` and configure your variables.
5. Run `npm run dev` to start the development server.

## Environment Variables
The application uses the following environment variables:
* `VITE_API_URL`: The base URL for API requests (e.g., `http://localhost:5000/api`).

## Folder Structure
```text
src/
├── app/          # App-wide configuration (e.g., Redux store)
├── assets/       # Static assets like images and global CSS
├── components/   # Reusable UI components (common, layout)
├── constants/    # Application constants (routes, storageKeys)
├── hooks/        # Custom React hooks (useAuth, useTheme)
├── layouts/      # Layout components (MainLayout, AuthLayout)
├── pages/        # Application pages (Dashboard, Auth, Profile, Error)
├── routes/       # React Router configurations (AppRoutes, ProtectedRoute)
├── services/     # API services and configurations (axios instance)
├── store/        # Redux slices and root reducer
├── styles/       # Global styling files
└── utils/        # Utility functions (localStorage wrappers)
```

## Development Workflow
* Ensure your code follows the established ESLint and Prettier configurations.
* Components should be organized functionally.
* Reusable logic should be abstracted into hooks or utility functions.
* Commit messages should follow conventional commits pattern.

## Git Commit History
This project follows a structured Git workflow. The initial setup commits are as follows:
1. `chore: initialize vite react project`
2. `chore: configure tailwind css`
3. `chore: setup ant design`
4. `chore: setup project folder structure`
5. `feat: configure redux toolkit store`
6. `feat: configure react router`
7. `feat: setup axios api service`
8. `feat: create responsive main layout`
9. `feat: implement sidebar navigation`
10. `feat: implement navbar component`
11. `feat: implement mobile drawer navigation`
12. `feat: add dark mode support`
13. `feat: add protected route component`
14. `feat: create reusable ui components`
15. `feat: create placeholder pages`
16. `feat: add framer motion animations`
17. `docs: create frontend readme`
18. `test: verify responsive layout`
