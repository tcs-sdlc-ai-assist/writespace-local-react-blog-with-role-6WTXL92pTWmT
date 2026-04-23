# Changelog

All notable changes to **WriteSpace** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.0] — 2024-12-01

### Added

- **Public Landing Page** — Hero section with gradient banner, feature highlights, and latest posts preview for unauthenticated visitors.
- **Authentication** — Login and registration forms with session persistence via `localStorage`. Includes a hard-coded default admin account (`admin` / `admin`).
- **Role-Based Routing** — `ProtectedRoute` component enforcing authentication and admin-only access on guarded routes.
- **Blog CRUD** — Full create, read, update, and delete functionality for blog posts with title (max 150 chars) and content (max 5000 chars) validation.
- **Post Ownership** — Regular users can only edit and delete their own posts. Admins have full control over all posts.
- **Admin Dashboard** — Overview page with stat cards (total posts, total users, admins, users), quick action links, and a recent posts table with edit/delete actions.
- **User Management** — Admin-only page to create new user accounts (with role selection) and delete existing users. The default admin and the current session user cannot be deleted.
- **localStorage Persistence** — All data (session, users, posts) stored entirely in the browser using `localStorage` with dedicated keys (`writespace_session`, `writespace_users`, `writespace_posts`).
- **Responsive Tailwind UI** — Fully responsive design built with Tailwind CSS 3, including mobile navigation hamburger menu, card layouts for small screens, and desktop table views.
- **Component Library** — Reusable components: `Navbar`, `PublicNavbar`, `BlogCard`, `StatCard`, `UserRow`, `Avatar`, and `ProtectedRoute`.
- **Client-Side Routing** — React Router v6 with routes for landing, login, register, blog listing, blog reading, blog writing/editing, admin dashboard, and user management.
- **Vercel Deployment Support** — Included `vercel.json` with SPA rewrite rules for seamless deployment on Vercel.
- **Vite Build Tooling** — Project scaffolded with Vite 6 for fast development server with HMR and optimized production builds.