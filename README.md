# Tharagai Admin

Admin portal for **Tharagai** boutique e-commerce. Manage products, orders, and view dashboard statistics.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [End-to-End Features](#end-to-end-features)
- [API Integration](#api-integration)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Scripts](#scripts)

---

## Overview

Tharagai Admin is a React-based admin dashboard for managing a boutique e-commerce store. It provides product CRUD operations, order management, and real-time order statistics.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI library |
| **Vite** | 7.1.7 | Build tool and dev server |
| **React Router DOM** | 7.9.6 | Routing |
| **Ant Design** | 5.28.1 | UI components (tables, forms, modals) |
| **Tailwind CSS** | 4.1.14 | Styling |
| **PostCSS** | 8.5.6 | CSS processing |
| **@ant-design/icons** | 6.1.0 | Icons |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ or 20+
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tharagai-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) (or the port shown in the terminal).

4. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

---

## End-to-End Features

### 1. Authentication

| Feature | Description |
|---------|-------------|
| **Login** | Username/password form; mock auth stores user and redirects to dashboard |
| **Logout** | Clears user session and redirects to `/login` |
| **Protected Routes** | `/dashboard`, `/products`, `/orders` wrapped in `ProtectedRoute` (auth check can be enabled) |

**Flow:** `/login` → submit credentials → redirect to `/dashboard`

---

### 2. Dashboard

| Feature | Description |
|---------|-------------|
| **Order Statistics** | Counts by status: Total, Pending, Confirmed, Shipped, Delivered, Cancelled |
| **Data Source** | Fetches orders from `https://tharagai-api.onrender.com/orders` |
| **Layout** | Collapsible sidebar + header with `DashboardLayout` |

**Flow:** Load orders → aggregate by status → display stat cards

---

### 3. Products (Full CRUD)

| Feature | Description |
|---------|-------------|
| **Create** | Form: title, category, subcategory, sizes, colors, fabric, price, stock, description, images |
| **Read** | Table with search, category filter, pagination, product detail modal |
| **Update** | Edit product and submit via PUT |
| **Delete** | Single delete and bulk delete |
| **Image Upload** | Upload to `/file-upload`; images stored as URLs |
| **Attributes** | Exclusive, Best Seller, New Arrival flags |
| **Product ID** | Auto-generated (e.g. `TBP10001`) |

**Flow:**  
- **Create:** Fill form → upload images → POST → refresh list  
- **Edit:** Click edit → modify form → PUT → refresh  
- **Delete:** Select rows → bulk delete or single delete → confirm → DELETE

---

### 4. Orders

| Feature | Description |
|---------|-------------|
| **List** | Table: Order ID, user, email, phone, status, total, payment status |
| **Status Update** | Dropdown to change status (Pending, Confirmed, Shipped, Delivered, Cancelled) |
| **Details Modal** | Customer info, shipping address, line items with images, totals, statuses |

**Flow:**  
- **View:** Load orders → display in table  
- **Update Status:** Select new status → PUT `/orders/:id/status` → refresh  
- **Details:** Click row → open modal with full order info

---

### 5. Notifications

| Feature | Description |
|---------|-------------|
| **Toast Notifications** | Global `window.notify()` for success/error feedback |
| **Component** | `CustomNotification` for consistent UI |

---

## API Integration

**Base URL:** `https://tharagai-api.onrender.com`

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete single product |
| DELETE | `/products/bulk` | Bulk delete products |
| POST | `/file-upload` | Upload product images |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List all orders |
| PUT | `/orders/:id/status` | Update order status |

---

## Routes

| Route | Protected | Description |
|-------|-----------|-------------|
| `/login` | No | Admin login |
| `/dashboard` | Yes | Order statistics |
| `/products` | Yes | Product management (CRUD) |
| `/orders` | Yes | Order list and status updates |

---

## Project Structure

```
tharagai-admin/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── src/
    ├── main.jsx              # Entry point (BrowserRouter, AuthProvider)
    ├── App.jsx               # Routes and layout
    ├── App.css
    ├── index.css
    ├── api/
    │   ├── productApi.js     # Product CRUD + image upload
    │   └── ordersApi.js      # Orders API
    ├── context/
    │   └── AuthContext.jsx   # Auth state (login/logout)
    ├── layouts/
    │   └── DashboardLayout.jsx  # Sidebar + header + outlet
    ├── pages/
    │   ├── Login.jsx
    │   ├── Dashboard.jsx
    │   ├── Products.jsx
    │   ├── Orders.jsx
    │   └── Orders.css
    ├── components/
    │   ├── ProtectedRoute.jsx
    │   ├── CustomNotification.jsx
    │   ├── CustomNotification.css
    │   ├── HeaderBar.jsx
    │   ├── Sidebar.jsx
    │   └── Navbar.jsx
    └── utils/
        └── helpers.js       # csvToArray, getProductId
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Notes

- **Mock Auth:** Login does not validate against a backend; it stores user in context and redirects.
- **Route Protection:** `ProtectedRoute` exists; enable the user check for production.
- **API:** Ensure the backend at `tharagai-api.onrender.com` is running and CORS is configured.

---

## License

Private — Tharagai. All rights reserved.
