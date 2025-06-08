import { createRouter, createRoute, RootRoute } from '@tanstack/react-router'
import Settings from '@/app/settings/page'
import DashboardLayout from "@/app/(dashboard)/layout";

const rootRoute = new RootRoute({
    component: DashboardLayout,
})

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: Settings,
})

export const router = createRouter({
    routeTree: rootRoute.addChildren([
        settingsRoute,
    ]),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}