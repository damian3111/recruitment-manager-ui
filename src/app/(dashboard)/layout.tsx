import { AppSidebar } from "@/components/app-sidebar"

import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"


import Link from 'next/link';
import {
    Bell,
    BriefcaseBusiness, ChevronRight, Compass,
    Home,
    LineChart, Mail, MessageCircle,
    Package,
    Package2,
    PanelLeft,
    Settings,
    ShoppingCart, Target, TrendingUp, UserPlus, UserRound, UserRoundPen,
    Users2
} from 'lucide-react';

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
import { User } from './candidates/user';
// import { VercelLogo } from '@/components/icons';
import Providers from './candidates/providers';
import { NavItem } from './candidates/nav-item';
import { SearchInput } from './candidates/search';
import { BellNav } from './candidates/bell-nav';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem, SidebarProvider,
    useSidebar,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {Badge} from "@/components/ui/badge";
import {NavCollapsible} from "@/components/layout/types";
export default function DashboardLayout({
                                            children
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <SidebarProvider>

            <main className="flex min-h-screen w-full flex-col bg-muted/40">
                <DesktopNav />
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <MobileNav />
                        {/*<DashboardBreadcrumb />*/}
                        <SearchInput />
                        <BellNav/>
                        <User />
                    </header>
                    <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                            {children}
                    </main>
                </div>
                {/*<Analytics />*/}
            </main>
            </SidebarProvider>

        </Providers>
    );
}

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
                <NavItem href="/candidates" label="Candidates">
                    <Users2 className="h-5 w-5" />
                </NavItem>
                <NavItem href="/invitations" label="Invitations">
                    <Mail className="h-5 w-5" />
                </NavItem>
                <NavItem href="/recruiter-profile" label="Recruiter Profile">
                    <UserPlus className="h-5 w-5" />
                </NavItem>
                <NavItem href="/profile" label="Candidate Profile">
                    <UserRoundPen className="h-5 w-5" />
                </NavItem>
                <NavItem href="/analytics" label="Analytics">
                    <LineChart className="h-5 w-5" />
                </NavItem>
                <NavItem href="/chats" label="Chats">
                    <MessageCircle className="h-5 w-5" />
                </NavItem>
                <NavItem href="/career-compas" label="Career Compas">
                    <Compass className="h-5 w-5" />
                </NavItem>
                <NavItem href="/skill-matcher" label="Skill Matcher">
                    <Target className="h-5 w-5" />
                </NavItem>
                <NavItem href="/growth-tracker" label="Growth Tracker">
                    <TrendingUp className="h-5 w-5" />
                </NavItem>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2  sm:py-5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex h-6 w-6 items-center justify-center  rounded-md text-muted-foreground hover:text-foreground">
                            <Settings className="h-8 w-8" />
                            <span className="sr-only">Jobs</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" className={"mb-3"} align="start">
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/src/app/settings/account">Account</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/src/app/settings/appearance">Appearance</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/src/app/settings/notifications">Notifications</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/src/app/settings/display">Display</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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