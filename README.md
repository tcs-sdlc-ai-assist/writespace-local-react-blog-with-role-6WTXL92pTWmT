# ✍️ WriteSpace

A clean, simple blogging platform where your words take center stage. Write, publish, and share — all from your browser. Built with React and powered entirely by localStorage, no backend required.

## Tech Stack

- **React 18** — UI library
- **React Router v6** — Client-side routing
- **Tailwind CSS 3** — Utility-first styling
- **Vite 6** — Build tool and dev server

## Folder Structure

```
writespace/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── src/
│   ├── main.jsx                  # App entry point
│   ├── App.jsx                   # Route definitions
│   ├── index.css                 # Tailwind directives
│   ├── components/
│   │   ├── Avatar.jsx            # Role-based avatar helper
│   │   ├── BlogCard.jsx          # Blog post card for grid views
│   │   ├── Navbar.jsx            # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx    # Auth & role guard wrapper
│   │   ├── PublicNavbar.jsx      # Public-facing navigation bar
│   │   ├── StatCard.jsx          # Dashboard statistic card
│   │   └── UserRow.jsx           # User table row / mobile card
│   ├── pages/
│   │   ├── AdminDashboard.jsx    # Admin overview with stats & recent posts
│   │   ├── Home.jsx              # All blogs listing
│   │   ├── LandingPage.jsx       # Public landing page with hero & features
│   │   ├── LoginPage.jsx         # User login form
│   │   ├── ReadBlog.jsx          # Single blog post view
│   │   ├── RegisterPage.jsx      # User registration form
│   │   ├── UserManagement.jsx    # Admin user CRUD
│   │   └── WriteBlog.jsx         # Create / edit blog post form
│   └── utils/
│       ├── auth.js               # Session management (get/set/clear)
│       └── storage.js            # localStorage helpers for posts & users
```

## Setup Instructions

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173) with hot module replacement.

### Production Build

```bash
npm run build
```

Outputs optimized static files to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the `dist/` folder locally to verify the production build.

## Route Map

| Path              | Component          | Access          | Description                     |
| ----------------- | ------------------ | --------------- | ------------------------------- |
| `/`               | `LandingPage`      | Public          | Landing page with hero section  |
| `/login`          | `LoginPage`        | Public          | User login                      |
| `/register`       | `RegisterPage`     | Public          | User registration               |
| `/blogs`          | `Home`             | Authenticated   | All blog posts listing          |
| `/blogs/read/:id` | `ReadBlog`         | Authenticated   | Read a single blog post         |
| `/blogs/new`      | `WriteBlog`        | Authenticated   | Create a new blog post          |
| `/blogs/edit/:id` | `WriteBlog`        | Authenticated   | Edit an existing blog post      |
| `/admin`          | `AdminDashboard`   | Admin only      | Admin dashboard with statistics |
| `/users`          | `UserManagement`   | Admin only      | User CRUD management            |

## Features

- **Authentication** — Login and registration with session persistence via localStorage
- **Role-Based Access Control** — Admin and user roles with route-level protection
- **Blog CRUD** — Create, read, update, and delete blog posts
- **User Management** — Admins can create and delete user accounts
- **Admin Dashboard** — Overview statistics, quick actions, and recent posts table
- **Responsive Design** — Fully responsive UI with mobile navigation and card layouts
- **Default Admin Account** — Hard-coded admin credentials for initial access
- **Client-Side Only** — No backend server; all data persists in the browser

## Default Admin Credentials

| Username | Password |
| -------- | -------- |
| `admin`  | `admin`  |

## localStorage Schema

### `writespace_session`

Stores the currently authenticated user session.

```json
{
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "role": "admin | user"
}
```

### `writespace_users`

Array of registered user objects.

```json
[
  {
    "id": "uuid",
    "displayName": "string",
    "username": "string",
    "password": "string",
    "role": "admin | user",
    "createdAt": "ISO 8601 timestamp"
  }
]
```

### `writespace_posts`

Array of blog post objects.

```json
[
  {
    "id": "uuid",
    "title": "string (max 150 chars)",
    "content": "string (max 5000 chars)",
    "authorId": "string",
    "authorName": "string",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
]
```

> **Note:** The hard-coded admin account (`admin` / `admin`) is not stored in localStorage. It is checked at login time and represented with `userId: "admin"` in the session.

## Deployment

### Vercel

The project includes a `vercel.json` with SPA rewrites configured. Deploy directly from your repository:

1. Push the repository to GitHub / GitLab / Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite — no additional configuration needed
4. Deploy

### Other Platforms

For any static hosting platform, build the project and serve the `dist/` directory. Ensure all routes are rewritten to `index.html` to support client-side routing.

## License

Private — All rights reserved.