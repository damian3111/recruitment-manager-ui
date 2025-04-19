"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {JobsTable} from './jobs-table';
import {useJobs} from "@/lib/jobService";
// import { getProducts } from '@/lib/db';

export default function ProductsPage(
    props: {
        searchParams: Promise<{ q: string; offset: string }>;
    }
) {
    // const searchParams = await props.searchParams;
    // const search = searchParams.q ?? '';
    // const offset = searchParams.offset ?? 0;
    const { data: jobs, isLoading, isError, error } = useJobs();

    if (isLoading) return <p className="text-gray-500">⏳ Loading jobs...</p>;
    if (isError) return <p className="text-red-600">❌ Error: {(error as Error).message}</p>;

    // const { products, newOffset, totalProducts } = await getProducts(
    //     search,
    //     Number(offset)
    // );

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="archived" className="hidden sm:flex">
                        Archived
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
                    </Button>
                </div>
            </div>
       {     <TabsContent value="all">
                <JobsTable
                    jobs={jobs}
                    offset={0}
                    totalJobs={10}
                />
            </TabsContent>}
        </Tabs>
    );
}