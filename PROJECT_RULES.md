# Project Rules & Analysis

## 1. PROJECT SUMMARY
This project is a **React 19 based Portfolio & User Management System**. It serves as a personal portfolio site that also includes user authentication (registration, login) and project management features.
- **Core Behavior**: It combines static portfolio content with dynamic user features backed by a .NET API.
- **Tech Stack**: React 19, React Router 7, Tailwind CSS (configured but vanilla CSS heavily used), Axios.

## 2. ARCHITECTURE RULES
- **Pattern**: View-Based Architecture. Logic is primarily centered around "Views" (Pages) which handle their own state and API interaction.
- **Data Layer**:
  - **API**: Centralized in `src/api/api.js`.
  - **State**: Local component state (`useState`) is the primary state management tool. No global store (Redux/Context) detected for application data.
- **Dependency Direction**:
  - Views import Components and API.
  - Components should be dumb/presentational where possible.
  - API layer must not import from UI layers.

## 3. FOLDER & FILE STRUCTURE RULES
- **`src/views/`**: Contains main page components.
  - **Naming**: Files are **lowercase/kebab-case** (e.g., `home.jsx`, `getusers.jsx`, `register.jsx`).
  - **Components**: Internal component names are **PascalCase** (e.g., `export default function Home()`).
- **`src/css/`**: Contains page-specific CSS files (e.g., `home.css`, `form.css`).
- **`src/api/`**: Contains the centralized API definition.
- **`src/views/page/`**: Contains sub-sections or nested views (e.g., `experience.jsx`).
- **`src/views/components/`**: Shared UI components.

## 4. CODING STANDARDS
- **Component Definition**: Use `export default function ComponentName() {}`.
- **Hooks**:
  - Use `const navigate = useNavigate()` for navigation.
  - Use `useState` for form fields and UI state.
- **Imports**: Group imports: React/Router -> Icons/Libraries -> Internal Components/API -> CSS.
- **Naming Conventions**:
  - Variables/Functions: `camelCase` (e.g., `handleRegister`, `formData`).
  - Components: `PascalCase`.
  - CSS Classes: Kebab-case, BEM-like (e.g., `hero-left`, `input-wrapper`).

## 5. DATA FLOW RULES
- **API Requests**:
  - Must use `src/api/api.js` functions.
  - **Authentication**: Tokens are manually passed to API functions where needed (anti-pattern found but current rule).
  - API returns `response.data`.
- **State Handling**:
  - Form state is managed locally via `useState` object (e.g., `formData`).
  - Loading and Error states are managed explicitly (`loading`, `status`, `message`).

## 6. ERROR HANDLING & LOGGING
- **Handling**:
  - Usage of `try-catch` blocks in async event handlers.
  - Set specific `status` state (HTTP codes) to condition UI feedback.
  - Distinguish between `error.response` (server error) and `error.request`/generic errors.
- **Logging**: Console usage (`console.error`) is permitted for API errors in catch blocks.

## 7. SECURITY RULES
- **Authentication**: JWT is stored in `localStorage` keys: `"token"` and `"refresh_token"`.
- **Authorization**: Simple client-side checks (e.g., `!localStorage.getItem("token")`) determine access.
- **Sensitive Data**: Passwords sent alongside other data in JSON bodies.
- **WARNING**: API Base URL is currently hardcoded. Prefer Environment Variables (`import.meta.env`).

## 8. PERFORMANCE & QUALITY RULES
- **Rendering**: Standard React rendering. No pervasive `useMemo` or `useCallback` observed; premature optimization is avoided.
- **CSS**: CSS files are imported directly into components, ensuring styles are loaded when the component uses them.

## 9. DO & DON'T
- **DO**:
  - Create new views in `src/views/` with lowercase filenames.
  - Create standard CSS files in `src/css/` and import them.
  - Use `react-icons` for iconography.
  - Centralize new API calls in `src/api/api.js`.
- **DON'T**:
  - Do not verify authentication tokens inside the API layer (current pattern requires passing token from View).
  - Do not use inline styles heavily; prefer the external CSS files.
  - Do not mix file naming conventions (stick to lowercase `.jsx` files).

## 10. FINAL GUIDELINES
- **Adding Features**: Create the View -> Create the CSS -> Add Routing in `App.jsx` -> Add API method.
- **Extensibility**: If the app grows, consider moving `localStorage` calls to a centralized auth hook or service to clean up Views.
