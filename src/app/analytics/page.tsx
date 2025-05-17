"use client"
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { Main } from '@/components/main'
import { TopNav } from '@/components/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recents-sales'
import Link from "next/link";
import {ConfirmModal} from "@/components/ConfirmModal";
import React, {useState} from "react";
import {useJobs, useJobsByUser} from "@/lib/jobService";
import {useCurrentUser} from "@/lib/userService";
import {useCandidateByEmail, useCandidates} from "@/lib/candidatesService";
import {
    useDeleteInvite,
    useInvitesByCandidateAndRecruiter,
    useInvitesByJobUser,
    useInvitesByRecruiter
} from "@/lib/invitationService";
import {Badge} from "@/components/ui/badge";

export default function Dashboard() {
    const { data: user } = useCurrentUser()
    const { data: invites } = useInvitesByRecruiter(user?.id)
    const { data: jobs } = useJobsByUser(user?.id)
    const { data: candidates } = useCandidates()
    const { data: invitesByRecruiter, isLoading: invitesLoading } = useInvitesByRecruiter(user?.id);
    const { data: invitesByJobUser } = useInvitesByJobUser(user?.id);

    if (!invites || !jobs || !candidates || !user || !invitesByRecruiter || !invitesByJobUser) return null

    const recruiterInvites = invites.filter((i) => i.recruiter_id === user.id)

    const getJob = (jobId: number) => jobs.find((j) => j.id === jobId)
    const getCandidate = (candidateId: number) => candidates.find((c) => c.id === candidateId)

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
                            <TabsTrigger value='analytics'>
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value='reports'>
                                Reports
                            </TabsTrigger>
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
                    <TabsContent value='analytics' className='space-y-4'>
                        <div className="space-y-4">
                            <Card className="p-6 rounded-2xl shadow-md border border-gray-200 bg-white">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Invitations</h2>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto border-collapse text-sm text-left">
                                        <thead>
                                        <tr className="bg-gray-100 text-gray-700 font-medium">
                                            <th className="px-4 py-2 border-b">Job</th>
                                            <th className="px-4 py-2 border-b">Candidate</th>
                                            <th className="px-4 py-2 border-b">Status</th>
                                            <th className="px-4 py-2 border-b">Sent At</th>
                                            <th className="px-4 py-2 border-b">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {invitesByRecruiter.map((invite) => {
                                            const job = getJob(invite.job_id)
                                            const candidate = getCandidate(invite.candidate_id)

                                            return (
                                                <tr key={invite.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 border-b">
                                                        {job ? (
                                                            <>
                                                                <div className="font-medium">{job.title}</div>
                                                                <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">Unknown Job</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        {candidate ? (
                                                            <>
                                                                <div className="font-medium">{candidate.first_name} {candidate.last_name}</div>
                                                                <div className="text-xs text-gray-500">{candidate.email}</div>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">Unknown Candidate</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        <Badge
                                                            variant={
                                                                invite.status === "sent"
                                                                    ? "secondary"
                                                                    : invite.status === "accepted"
                                                                        ? "success"
                                                                        : "destructive"
                                                            }
                                                        >
                                                            {invite.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 border-b text-gray-600">
                                                        {new Date(invite.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 border-b text-blue-600 space-x-2">
                                                        {job && (
                                                            <Link href={`/jobs/${job.id}`} className="hover:underline">
                                                                View Job
                                                            </Link>
                                                        )}
                                                        {candidate && (
                                                            <Link href={`/candidates/${candidate.id}`} className="hover:underline">
                                                                View Candidate
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>                    </TabsContent>
                    <TabsContent value='reports' className='space-y-4'>
                        <div className="space-y-4">
                            <Card className="p-6 rounded-2xl shadow-md border border-gray-200 bg-white">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Invitations (Reports)</h2>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto border-collapse text-sm text-left">
                                        <thead>
                                        <tr className="bg-gray-100 text-gray-700 font-medium">
                                            <th className="px-4 py-2 border-b">Job</th>
                                            <th className="px-4 py-2 border-b">Candidate</th>
                                            <th className="px-4 py-2 border-b">Status</th>
                                            <th className="px-4 py-2 border-b">Sent At</th>
                                            <th className="px-4 py-2 border-b">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {invitesByJobUser.map((invite) => {
                                            const job = getJob(invite.job_id)
                                            const candidate = getCandidate(invite.candidate_id)

                                            return (
                                                <tr key={invite.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 border-b">
                                                        {job ? (
                                                            <>
                                                                <div className="font-medium">{job.title}</div>
                                                                <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">Unknown Job</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        {candidate ? (
                                                            <>
                                                                <div className="font-medium">{candidate.first_name} {candidate.last_name}</div>
                                                                <div className="text-xs text-gray-500">{candidate.email}</div>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">Unknown Candidate</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 border-b">
                                                        <Badge
                                                            variant={
                                                                invite.status === "sent"
                                                                    ? "secondary"
                                                                    : invite.status === "accepted"
                                                                        ? "success"
                                                                        : "destructive"
                                                            }
                                                        >
                                                            {invite.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 border-b text-gray-600">
                                                        {new Date(invite.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 border-b text-blue-600 space-x-2">
                                                        {job && (
                                                            <Link href={`/jobs/${job.id}`} className="hover:underline">
                                                                View Job
                                                            </Link>
                                                        )}
                                                        {candidate && (
                                                            <Link href={`/candidates/${candidate.id}`} className="hover:underline">
                                                                View Candidate
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </>
    )
}

const topNav = [
    {
        title: 'Overview',
        href: 'dashboard/overview',
        isActive: true,
        disabled: false,
    },
    {
        title: 'Customers',
        href: 'dashboard/customers',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Products',
        href: 'dashboard/products',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Settings',
        href: 'dashboard/settings',
        isActive: false,
        disabled: true,
    },
]