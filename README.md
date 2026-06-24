# MoneyHaven Frontend

This is the React frontend for MoneyHaven.

## Project Architecture
- **React 19**
- **Vite**
- **Redux Toolkit** (with `redux-persist`)
- **React Router DOM**
- **Ant Design** & **Tailwind CSS**

## Folder Structure
```text
src/
├── app/          # Redux store and persistor initialization
├── components/   # Reusable UI components
├── constants/    # Route names and storage keys
├── hooks/        # Custom React hooks (e.g., useAuth, useTheme)
├── layouts/      # Application layouts (AuthLayout, MainLayout)
├── pages/        # Page components (Dashboard, Login, Register)
├── routes/       # React Router setup and Protected/Public routes
├── services/     # Axios API configurations and service files
├── store/        # Redux slices (authSlice, themeSlice)
└── utils/        # Helper functions (e.g., localStorage)
```

## Authentication System
- **JWT Based:** Tokens are saved in `Redux` and persisted to `localStorage` using `redux-persist`.
- **Interceptors:** Axios interceptors attach the token automatically to outgoing requests.
- **Protected Routes:** Unauthorized users are redirected to the Login page.
- **Redux State Management:**
  - `registerUser`
  - `loginUser`
  - `getCurrentUser`
  - `logoutUser`
- **Dynamic Loading:** The `App.jsx` handles fetching the user object on mount using the persisted token.

## Environment Variables
Create a `.env` file from `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Setup Instructions
```bash
npm install
npm run dev
```
