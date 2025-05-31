import { LinkProps } from '@tanstack/react-router'

interface User {
    name: string
    email: string
    avatar: string
}

interface Team {
    name: string
    logo: React.ElementType
    plan: string
}

interface BaseNavItem {
    title: string
    badge?: string
    icon?: React.ElementType
}

type NavLink = BaseNavItem & {
    url: LinkProps['to']
    items?: never
}

type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { url: LinkProps['to'] })[]
    url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
    title: string
    items: NavItem[]
}

interface SidebarData {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    teams: {
        name: string;
        logo: any;
        plan: string;
    }[];
    navGroups: {
        title: string;
        items: {
            title: string;
            url?: string;
            icon?: any;
            badge?: string;
            items?: {
                title: string;
                url?: string;
                icon?: any;
            }[];
        }[];
    }[];
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }