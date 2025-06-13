# SHOP_HUB: A Modern E-Commerce Application

This project is a comprehensive e-commerce web application built from the ground up to showcase the power and elegance of Svelte 5 and SvelteKit. It adheres to a strict set of modern development practices, including a "store-less" architecture using a custom reactive system.

The application demonstrates a full user flow, from browsing products to adding them to a cart and completing a rate-limited checkout process.

---

## Key Features

### Homepage (`/`)

- Clean UI with prominent "Products" and "Checkout" calls-to-action.
- Live counter for "Active Users" that updates asynchronously every 5 seconds.

### Products Page (`/products`)

- Fetches and displays products from a public API.
- **Real-time, debounced search (300ms)** to filter products as you type.
- **URL-driven pagination** (10 products per page), allowing for shareable links.
- **Streaming Data:** The page shell loads instantly while data streams in, with a loader shown in the content area for a great user experience.

### Single Product Page (`/products/[id]`)

- A dedicated, clean page for viewing the details of a single product.
- Reuses the same asynchronous "Add to Cart" logic as the main products page.

### Cart & State Management

- **Custom Reactive System:** Global state is managed by a custom-built reactive system (`createSignal`, `createDerived`), completely avoiding Svelte's built-in stores to meet the project's core constraint.
- **Asynchronous Cart Updates:** Simulates a real-world network delay with an async queue. The UI shows `"Adding..."` → `"Added!"` feedback on product cards.
- **Optimistic UI:** Items removed from the cart disappear instantly from the UI.

### Checkout Process (`/checkout`)

- Displays a summary of all items in the cart with a final total.
- **Global Rate-Limiting:** Allows only one checkout every 10 seconds across the entire application, with a visible countdown timer that persists between page navigations.
- Clear success message upon a successful checkout.

---

## Technical Architecture & Tech Stack

This project was built with a focus on modern, type-safe, and performant web technologies.

- **Framework:** **Svelte 5** & **SvelteKit** for a full-stack experience.
- **State Management:**
  - **Local State:** **Svelte 5 Runes** (`$state`, `$derived`, `$effect`) are used exclusively for component-level state.
  - **Global State:** A custom reactive primitive (`createSignal`) was built from scratch to manage shared application state, fulfilling the "no Svelte stores" requirement.
- **Data Fetching:**
  - **Server-Side Logic:** Data is loaded and processed in `+page.server.ts` files for security and performance.
  - **Streaming with `{#await}`:** The products page streams its data to provide an instant page load with a graceful loading state.
- **Styling:** **Tailwind CSS** for a utility-first, responsive design.
- **Icons:** **Lucide Svelte** for clean and modern SVG icons.
- **Language:** **TypeScript** for end-to-end type safety.

---

## Getting Started

To run this project locally, follow these steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) and `npm` installed on your machine.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/amanz55/SHOP_HUB.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd SHOP_HUB
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```
4.  Run the development server:
    ```sh
    npm run dev
    ```
5.  Open your browser and visit `http://localhost:5173`
