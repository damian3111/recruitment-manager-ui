'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
        icon: React.ReactNode
    }[]
}

export default function SidebarNav({
                                       className,
                                       items,
                                       dir = "ltr",
                                       ...props
                                   }: SidebarNavProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [val, setVal] = useState('/settings')

    const handleSelect = (value: string) => {
        setVal(value)
        router.push(value)
    }

    return (
        <>
            <div className="p-2 md:hidden">
                <Select value={val} onValueChange={handleSelect}>
                    <SelectTrigger className="h-12 sm:w-60 text-base">
                        <SelectValue placeholder="Choose page" />
                    </SelectTrigger>
                    <SelectContent>
                        {items.map((item) => (
                            <SelectItem key={item.href} value={item.href}>
                                <div className="flex items-center gap-x-4 px-2 py-2">
                                    <span className="scale-125">{item.icon}</span>
                                    <span className="text-md">{item.title}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea
                type="always"
                className={cn(
                    "bg-background hidden w-full min-w-48 px-2 py-4 md:block",
                    className
                )}
                {...props}
            >
                <nav
                    className={cn(
                        "flex space-x-2 py-2 lg:flex-col lg:space-y-3 lg:space-x-0",
                        className
                    )}
                >
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "justify-start text-xl py-3 px-4",
                                pathname === item.href && "bg-muted hover:bg-muted"
                            )}
                        >
                            <span className="mr-3 text-2xl">{item.icon}</span>
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </ScrollArea>
        </>
    )
}
