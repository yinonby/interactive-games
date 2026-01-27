
## Games & More

**Games & More** is a **monorepo** designed to host multiple applications and shared packages in a single repository.

---

### Monorepo Structure

The repository is organized as follows:

- **`apps/`**: Contains minimal applications, each using packages provided in the `packages/` folder.
- **`packages/`**: Contains shared code and utilities.

---

### Technologies Used

#### Frontend

- UI
  - **React Native**: For building cross-platform mobile interfaces.
  - **Expo**: A framework that simplifies building, running, and deploying React Native apps on mobile and web.
  - **Next.js**: A framework for building static SSR (server-side rendering) web applications with built-in routing and performance optimizations.
  - **React Native Paper**: Material Design components for React Native. Components are wrapped inside a local package, `@ig/rnui`,
  providing consistent styling and additional custom behavior.

- State Management
  - **Redux**: Centralized state management for predictable app state.
  - **RTK Query**: API fetching and caching with automatic invalidation.
    - Handles dynamic tags for selective refetching.
    - Integrates seamlessly with Redux.

- Real-Time Updates
  - **WebSockets**: Notify clients in real-time when relevant data updates occur, enabling live updates in apps and web clients.

- Localization / Internationalization
  - **i18next**: A framework that adapts the UI to different languages, regions, and cultural conventions.

- Testing
  - **Vitest**: A modern test environment with advanced TypeScript features, also supporting coverage (via **istanbul**).
  - **Jest** and **React Testing Library**: Widely used pair for React Native testing and coverage (via **istanbul**).
  - **Eslint**: With presets for react-native/expo.
  - **Madge**: A tool used to ascertain no circular dependencies exist.

#### CI/CD
  - **NYC**: A tool used to create an HTML coverage report for the entire project.
  - **Husky**: A tool to control git hooks in teams.
  - **GitHub Actions**: A CI/CD platform that automates workflows like building, testing, and deploying code directly from a GitHub repository.

---

#### Backend

- DB
  - **Mongo DB**: A no-sql database.
    - **mongoose**: A Node.js client to access the DB.
    - **mongodb-memory-server**: An in-memory Node.js Mongo DB instance for rapid development and testing.

---

### Architecture

This repository was created with a few design paradigms in mind:

#### Frontend Design: Feature/Domain

The client code uses a primary **feature/domain** design, where code responsible for UI features is separated from code responsible for accessing API.
- The **features** strictly contain UI components with no logic whatsoever.
- The **domains** use RTK queries to access the API and provide an abstraction layer to the **features** layer. The **domains** also provide **websocket handlers** to handle messages sent from the server.
