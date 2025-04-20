// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { File, PlusCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ProductsTable } from './products-table';
// // import { getProducts } from '@/lib/db';
//
// export default async function ProductsPage(
//     props: {
//         searchParams: Promise<{ q: string; offset: string }>;
//     }
// ) {
//     const searchParams = await props.searchParams;
//     const search = searchParams.q ?? '';
//     const offset = searchParams.offset ?? 0;
//     // const { products, newOffset, totalProducts } = await getProducts(
//     //     search,
//     //     Number(offset)
//     // );
//
//     return (
//         <Tabs defaultValue="all">
//             <div className="flex items-center">
//                 <TabsList>
//                     <TabsTrigger value="all">All</TabsTrigger>
//                     <TabsTrigger value="active">Active</TabsTrigger>
//                     <TabsTrigger value="draft">Draft</TabsTrigger>
//                     <TabsTrigger value="archived" className="hidden sm:flex">
//                         Archived
//                     </TabsTrigger>
//                 </TabsList>
//                 <div className="ml-auto flex items-center gap-2">
//                     <Button size="sm" variant="outline" className="h-8 gap-1">
//                         <File className="h-3.5 w-3.5" />
//                         <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//               Export
//             </span>
//                     </Button>
//                     <Button size="sm" className="h-8 gap-1">
//                         <PlusCircle className="h-3.5 w-3.5" />
//                         <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//               Add Product
//             </span>
//                     </Button>
//                 </div>
//             </div>
//        {/*     <TabsContent value="all">
//                 <ProductsTable
//                     products={products}
//                     offset={newOffset ?? 0}
//                     totalProducts={totalProducts}
//                 />
//             </TabsContent>*/}
//         </Tabs>
//     );
// }



'use client';

import { useCandidates } from '@/lib/candidatesService';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/icons';

export default function CandidatesPage() {
    const { data: candidates, isLoading, isError, error } = useCandidates();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Spinner key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-red-500 text-center mt-10">
                ❌ Error loading candidates: {(error as Error).message}
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {candidates?.map((candidate) => (
                <Card
                    key={candidate.id}
                    className="w-full p-4 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300"
                >
                    <CardContent className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-800">
                            {candidate.firstName} {candidate.lastName}
                        </h2>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        <p className="text-sm text-gray-600">{candidate.phoneNumber}</p>
                        <p className="text-sm font-medium text-gray-700">
                            Status: <span className="text-blue-600">{candidate.status}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                            Applied at: {new Date(candidate.appliedAt).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
