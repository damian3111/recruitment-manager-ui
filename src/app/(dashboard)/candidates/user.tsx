"use client"

import { Button } from '@/components/ui/button';
// import { auth, signOut } from '@/lib/auth';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";
import toast from "react-hot-toast";
import {motion} from "framer-motion";
import {useLogout} from "@/lib/candidatesService";

export function User() {
    // let session = await auth();
    // let user = session?.user;
    const { mutate: logout } = useLogout();
    const router = useRouter();

    const handleLogout = () => {
        logout();
    };
    let user;
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
                        </button>           {/*<Link href="/logout">Sign Out</Link>*/}
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}