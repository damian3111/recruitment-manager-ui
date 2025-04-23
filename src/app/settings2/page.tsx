"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {useJobs} from "@/lib/jobService";
// import { getProducts } from '@/lib/db';
import TreeSelect from "../../components/treeSelect"

export default function ProductsPage(
    props: {
        searchParams: Promise<{ q: string; offset: string }>;
    }
) {

    return (
        <div className="w-2/6">
            <TreeSelect/>
        </div>
    );
}