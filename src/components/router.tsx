// src/router.tsx
import { createRouter, createRoute, RootRoute } from '@tanstack/react-router'
import Settings from '@/app/settings2/page' // <- adjust to your Settings component path
import DashboardLayout from '@/app/dashboard-layout' // <- adjust to your DashboardLayout path

// 1. Create root route (with a layout)
const rootRoute = new RootRoute({
    component: DashboardLayout,
})

// 2. Create child routes
const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: Settings,
})

// 3. Create router with all routes
export const router = createRouter({
    routeTree: rootRoute.addChildren([
        settingsRoute,
        // you can add more routes here
    ]),
})

// 4. Create type for router
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}