"use client"
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Main } from '@/components/main'
import { Overview } from './components/overview'
import { RecentSales } from './components/recents-sales'
import React from "react";
import {LineChart, PieChart} from "lucide-react";
import { BarChart, Users, Eye } from 'lucide-react';
import {
    Activity,
    CheckCircle,
    DollarSign,
} from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            {/* ===== Top Heading ===== */}
            {/*<Header>*/}
            {/*    <TopNav links={topNav} />*/}
            {/*    <div className='ml-auto flex items-center space-x-4'>*/}
            {/*        <Search />*/}
            {/*        <ThemeSwitch />*/}
            {/*        <ProfileDropdown />*/}
            {/*    </div>*/}
            {/*</Header>*/}

            {/* ===== Main ===== */}
            <Main className="w-full min-h-screen px-4 sm:px-6 lg:px-8 max-w-none">
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
                    <div className='flex items-center space-x-2'>
                        <Button>Download</Button>
                    </div>
                </div>
                <Tabs
                    orientation='vertical'
                    defaultValue='overview'
                    className='space-y-4'
                >
                    <div className='w-full overflow-x-auto pb-2'>
                        <TabsList>
                            <TabsTrigger value='overview'>Overview</TabsTrigger>
                        </TabsList>
                        <TabsList>
                            <TabsTrigger value='all2'>All</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value='overview' className='space-y-4'>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Total Revenue
                                    </CardTitle>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        className='text-muted-foreground h-4 w-4'
                                    >
                                        <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>$45,231.89</div>
                                    <p className='text-muted-foreground text-xs'>
                                        +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Subscriptions
                                    </CardTitle>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        className='text-muted-foreground h-4 w-4'
                                    >
                                        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                                        <circle cx='9' cy='7' r='4' />
                                        <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>+2350</div>
                                    <p className='text-muted-foreground text-xs'>
                                        +180.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        className='text-muted-foreground h-4 w-4'
                                    >
                                        <rect width='20' height='14' x='2' y='5' rx='2' />
                                        <path d='M2 10h20' />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>+12,234</div>
                                    <p className='text-muted-foreground text-xs'>
                                        +19% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Active Now
                                    </CardTitle>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        className='text-muted-foreground h-4 w-4'
                                    >
                                        <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>+573</div>
                                    <p className='text-muted-foreground text-xs'>
                                        +201 since last hour
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                            <Card className='col-span-1 lg:col-span-4'>
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className='pl-2'>
                                    <Overview />
                                </CardContent>
                            </Card>
                            <Card className='col-span-1 lg:col-span-3'>
                                <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                                    <CardDescription>
                                        You made 265 sales this month.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentSales />
                                </CardContent>
                            </Card>
                        </div>

                    </TabsContent>
                    <TabsContent value='all2' className='space-y-4'>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="min-h-screen p-8 bg-gray-50"
                        >
                            <h1 className="text-3xl font-bold text-gray-800 mb-10">Advanced Analytics</h1>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                                {[
                                    { icon: <Users className="text-blue-500" />, title: 'New Users', value: '1,280' },
                                    { icon: <Eye className="text-green-500" />, title: 'Page Views', value: '23,456' },
                                    { icon: <DollarSign className="text-yellow-500" />, title: 'Revenue', value: '$4,720' },
                                    { icon: <CheckCircle className="text-purple-500" />, title: 'Conversions', value: '389' },
                                ].map((metric, i) => (
                                    <Card key={i} className="rounded-2xl shadow-sm">
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="bg-gray-100 p-3 rounded-full">{metric.icon}</div>
                                            <div>
                                                <p className="text-sm text-gray-500">{metric.title}</p>
                                                <h3 className="text-lg font-semibold text-gray-800">{metric.value}</h3>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <Tabs defaultValue="traffic" className="w-full">
                                <TabsList className="mb-6">
                                    <TabsTrigger value="traffic">Traffic</TabsTrigger>
                                    <TabsTrigger value="sales">Sales</TabsTrigger>
                                    <TabsTrigger value="sources">Sources</TabsTrigger>
                                </TabsList>

                                <TabsContent value="traffic">
                                    <Card className="p-6 rounded-2xl shadow-sm mb-8">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                    <BarChart className="h-5 w-5 text-gray-500" /> Traffic Overview
                                                </h2>
                                                <span className="text-sm text-gray-400">Last 7 days</span>
                                            </div>

                                            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                                                <span>Chart coming soon...</span>
                                            </div>
                                        </div>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="sales">
                                    <Card className="p-6 rounded-2xl shadow-sm mb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                <DollarSign className="h-5 w-5 text-gray-500" /> Revenue Breakdown
                                            </h2>
                                            <span className="text-sm text-gray-400">Monthly Revenue</span>
                                        </div>
                                        <LineChart type="revenue" />
                                    </Card>
                                </TabsContent>

                                <TabsContent value="sources">
                                    <Card className="p-6 rounded-2xl shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-gray-500" /> Traffic Sources
                                            </h2>
                                            <span className="text-sm text-gray-400">Current Distribution</span>
                                        </div>
                                        <PieChart />
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </Main>
        </>
    )
}
