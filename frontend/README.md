# International Commerce Frontend

Production-ready ecommerce frontend built with:

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Axios
- TanStack Query
- Zustand
- React Hook Form + Zod
- Framer Motion
- Shadcn-style UI components
- Dark/Light theme toggle

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

Default client base URL is `/api`, proxied by Next.js to `API_PROXY_TARGET` (default `http://api-gateway:9000` in Docker).

## Structure

- `app/` routes and layouts
- `components/` reusable UI and feature blocks
- `hooks/` query and mutation hooks
- `lib/api-routes.ts` centralized API endpoint map
- `lib/query-keys.ts` normalized TanStack Query keys
- `lib/normalizers/` defensive DTO normalization layer
- `lib/` infrastructure helpers (axios, errors, utils)
- `services/` API service modules
- `store/` Zustand stores
- `types/` domain and API types
