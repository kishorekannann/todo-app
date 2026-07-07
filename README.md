Todo Application

This document outlines the architecture, tech stack, codebase structure, and deployment guidelines for the Todo application.

Tech Stack
- Frontend: React (Vite), CSS (Vanilla)
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas)
- Object Modeling: Mongoose
- Authentication: JSON Web Token (JWT)

Database Choice Rationale
The reason I chose MongoDB is due to time constraints; I wanted a quick setup and to save time writing database queries by using Mongoose instead of writing raw SQL.

Backend Structure
The backend follows a standard controller-route pattern:
- config/: Database connection configuration.
- controllers/: Route handler logic (Authentication, Lists management, and Todo items lifecycle).
- middleware/: Request processing filters (Authentication protection via JWT verification).
- models/: Mongoose schemas and models (User, TodoList, Todo).
- routes/: Router definitions mapping paths to controller methods.
- utils/: Helper functions (JWT generation/verification).
- app.js: Global middleware registry and routes mounting.
- server.js: Entry point which initializes the database connection and starts the listener.

Frontend Structure
The frontend is built with React and uses a components/pages split structure:
- src/components/: Reusable presentational elements.
  - Sidebar: Handles user profiles, list creation form, and list selections.
  - StatsGrid: Renders completed/pending/total task metrics cards.
  - TagsBreakdown: Displays dynamically calculated counts of tasks grouped by tag.
  - TodoCard: Renders individual tasks, checkbox toggle, and inline editing inputs.
  - TodoForm: Form to submit new todo tasks with optional tags.
- src/pages/: Layout wrappers that orchestrate views.
  - AuthPage: Sign In / Sign Up tabbed form layout.
  - DashboardPage: Interactive workplace containing the sidebar, stats, list detail actions, and tasks list.
  - SharedPage: Public read-only list view that loads unauthenticated data based on a share token.
- src/App.css: Custom styling and layout styles.
- src/index.css: Core global resets, theme variables (Light Theme), and typography.
- src/App.jsx: Orchestrates root states, API requests, and view routing.

Deployment Setup
- Frontend: Deployed on Vercel
- Backend: Deployed on Render 
