import Link from 'next/link';
import {
    BriefcaseBusiness,
    Home,
    LineChart,
    Package,
    Package2,
    PanelLeft,
    Settings,
    ShoppingCart,
    Users2
} from 'lucide-react';
import { RouterProvider } from '@tanstack/react-router'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip';
// import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
// import { VercelLogo } from '@/components/icons';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { ActiveThemeProvider } from "@/components/active-theme";
import SidebarNav from "@/components/sidebar-nav";
import {IconBrowserCheck, IconNotification, IconPalette, IconTool, IconUser} from "@tabler/icons-react";
import {Separator} from "@/components/ui/separator";
import {Main} from "@/components/main"; // Import your Provider!
// import { router } from './router' // <- you should have a router object created somewhere!

export default function DashboardLayout({
                                            children
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <main className="flex min-h-screen w-full flex-col bg-white/40">
                <DesktopNav />
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <MobileNav />
                        {/*<DashboardBreadcrumb />*/}
                        <SearchInput />
                        <User />
                    </header>
                    <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-white/40">
                        {/*<RouterProvider router={router}>*/}

                        <Main fixed>
                            <div className='space-y-1'>
                                <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
                                    Settings
                                </h1>
                                <p className='text-lg text-muted-foreground'>
                                    Manage your account settings and set email preferences.
                                </p>
                            </div>

                            <Separator className='my-6' />

                            <div className='flex flex-1 flex-col space-y-4 overflow-hidden md:space-y-6 lg:flex-row lg:space-y-0 lg:space-x-16'>
                                <aside className='top-0 lg:sticky lg:w-1/4'>
                                    <SidebarNav items={sidebarNavItems} />
                                </aside>
                                <div className='flex w-full overflow-y-hidden p-4'>
                                    {children} {/* <- all nested routes appear here */}
                                </div>
                            </div>
                        </Main>
                        {/*</RouterProvider>*/}
                    </main>
                </div>
                {/*<Analytics />*/}
            </main>
        </Providers>
    );
}
const sidebarNavItems = [
    {
        title: 'Profile',
        icon: <IconUser size={24} />, // bigger icon
        href: '/settings',
    },
    {
        title: 'Account',
        icon: <IconTool size={24} />,
        href: '/settings/account',
    },
    {
        title: 'Appearance',
        icon: <IconPalette size={24} />,
        href: '/settings/appearance',
    },
    {
        title: 'Notifications',
        icon: <IconNotification size={24} />,
        href: '/settings/notifications',
    },
    {
        title: 'Display',
        icon: <IconBrowserCheck size={24} />,
        href: '/settings/display',
    },
]
function DesktopNav() {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    {/*<VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />*/}
                    <span className="sr-only">Acme Inc</span>
                </Link>

                <NavItem href="/home" label="Home">
                    <Home className="h-5 w-5" />
                </NavItem>

                <NavItem href="/jobs" label="Jobs">
                    <BriefcaseBusiness className="h-5 w-5" />
                </NavItem>

                <NavItem href="/" label="Products">
                    <Package className="h-5 w-5" />
                </NavItem>

                <NavItem href="/customers" label="Customers">
                    <Users2 className="h-5 w-5" />
                </NavItem>

                <NavItem href="#" label="Analytics">
                    <LineChart className="h-5 w-5" />
                </NavItem>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    );
}

function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link
                        href="#"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">Vercel</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Home className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Orders
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-foreground"
                    >
                        <Package className="h-5 w-5" />
                        Products
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Users2 className="h-5 w-5" />
                        Customers
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <LineChart className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}

function DashboardBreadcrumb() {
    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="#">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="#">Products</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>All Products</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}