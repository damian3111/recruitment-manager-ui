"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import {useLogout} from "@/lib/candidatesService";

export function User() {
    const { mutate: logout } = useLogout();
    const router = useRouter();

    const handleLogout = () => {
        logout();
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Image
                        src={"/user-image.png"}
                        width={36}
                        height={36}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/support')}>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <button onClick={handleLogout}>
                            Log out
                        </button>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}