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
import React, {useEffect, useState} from "react";
import {useJobs, useJobsByUser} from "@/lib/jobService";
import {useCurrentUser} from "@/lib/userService";
import {useCandidateByEmail, useCandidates} from "@/lib/candidatesService";
import {
    useDeleteInvite, useInvitationsReceivedByRecruited,
    useInvitesByCandidateAndRecruiter,
    useInvitesByJobUser,
    useInvitesByRecruiter, useUpdateInviteStatus
} from "@/lib/invitationService";
import {Badge} from "@/components/ui/badge";
import toast from "react-hot-toast";
import UnderConstructionPage from "@/components/UnderConstructionPage";
import {Wrench} from "lucide-react";

export default function Dashboard() {
    const { data: user } = useCurrentUser()
    const { data: invites } = useInvitesByRecruiter(user?.id)
    // const { data: jobs } = useJobsByUser(user?.id)
    const { data: jobs2 } = useJobs();
    const { data: candidates } = useCandidates()
    const { data: invitesByRecruiter, isLoading: invitesLoading } = useInvitesByRecruiter(user?.id);
    const { data: invitesByJobUser } = useInvitesByJobUser(user?.id, user?.email);
    const { data: invitesReceivedByRecruited } = useInvitationsReceivedByRecruited(user?.id, user?.email);
    const deleteInvite = useDeleteInvite();
    const updateInviteStatus = useUpdateInviteStatus();

    // if (!invitesByJobUser) return null

    const getJob = (jobId: number) => jobs2?.find((j) => j.id === jobId)
    const getCandidate = (candidateId: number) => candidates?.find((c) => c.id === candidateId);
    // let roleBasedInvites = (user?.userRole == "recruiter" ? invitesByJobUser : invitesReceivedByRecruited);
    let roleBasedInvites = invitesReceivedByRecruited;
    let allInvites = [...(invitesByJobUser ?? []), ...(invitesReceivedByRecruited ?? [])];
    console.log("user");
    console.log(roleBasedInvites);

    const { mutate } = useUpdateInviteStatus();

    const handleCancel = (jobId: number, candidateId: number) => {
        const invite = invites?.find(inv =>
            inv.status === 'sent' &&
            inv.recruiter_id === user.id &&
            inv.job_id === jobId &&
            inv.candidate_id === candidateId
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                // invitesByRecruiter(prev => prev.filter(id => id !== jobId));
                toast.success('✅ Invitation deleted!');
                // refetch(); // jeśli potrzebne
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
    };

    const handleCancelAnalytics = (jobId: number, candidateId: number) => {
        const invite = roleBasedInvites?.find(inv =>
            inv.job_id === jobId &&
            inv.candidate_id === candidateId
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                // invitesByRecruiter(prev => prev.filter(id => id !== jobId));
                toast.success('✅ Invitation deleted!');
                // refetch(); // jeśli potrzebne
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
    };


    const handleAcceptInvitation = (jobId: number, candidateId: number) => {
        // Find the invite matching the given jobId and candidateId
        const invite = roleBasedInvites?.find(inv =>
            inv.status === 'sent' &&
            inv.job_id === jobId &&
            inv.candidate_id === candidateId
        );

        // Check if invite exists
        if (!invite) return;

        // Call the mutate function to accept the invitation
        mutate({
            id: invite.id,
            status: 'accepted', // Or InvitationStatus.ACCEPTED if it's an enum
        }, {
            onSuccess: () => {
                toast.success('✅ Invitation accepted!');
            },
            onError: () => {
                toast.error('❌ Failed to accept the invitation.');
            },
        });
    };

    const handleRemoveRelation = (inviteId: number) => {
        deleteInvite.mutate(inviteId, {
            onSuccess: () => {
                toast.success('✅ Invitation deleted!');
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
    };

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
                            <TabsTrigger value='analytics'>
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value='reports'>
                                Reports
                            </TabsTrigger>
                            <TabsTrigger value='accepted'>
                                Accepted
                            </TabsTrigger>
                            <TabsTrigger value='favourite'>
                                Favourite
                            </TabsTrigger>
                        </TabsList>
                    </div>
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
                                        {invitesByRecruiter?.filter(invite => invite.status != "accepted").map((invite) => {
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
                                                        {candidate && job &&(
                                                        <button
                                                            onClick={() => handleCancel(job.id, candidate.id)}
                                                            className={`px-3 py-1 rounded text-sm transition bg-red-500 text-white hover:bg-red-600`}
                                                        >
                                                            Cancel Invitation
                                                        </button>
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
                                        {
                                            invitesReceivedByRecruited?.filter(invite => invite.status != "accepted").map((invite) => {
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
                                                        {candidate && job && (
                                                            <div>
                                                                <button
                                                                    onClick={() => handleAcceptInvitation(job.id, candidate.id)}
                                                                    className={`px-3 py-1 rounded text-sm transition bg-red-500 text-white hover:bg-red-600`}
                                                                >
                                                                    Accept Invitation
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelAnalytics(job.id, candidate.id)}
                                                                    className={`px-3 py-1 rounded text-sm transition bg-red-500 text-white hover:bg-red-600`}
                                                                >
                                                                    Cancel Invitation
                                                                </button>
                                                            </div>
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
                    <TabsContent value='accepted' className='space-y-4'>
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
                                        {
                                            invitesByJobUser?.filter(invite => invite.status == "accepted").map((invite) => {
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
                                                            {candidate && job && (
                                                                <div>
                                                                    <button
                                                                        onClick={() => handleRemoveRelation(invite.id)}
                                                                        className={`px-3 py-1 rounded text-sm transition bg-red-500 text-white hover:bg-red-600`}
                                                                    >
                                                                        Remove Relation
                                                                    </button>
                                                                </div>
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
                    <TabsContent value='favourite' className='space-y-4'>
                        <div className="space-y-4">
                            <UnderConstructionPage/>
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