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
import { AnimatePresence } from 'framer-motion';
import {Wrench} from "lucide-react";
import UnderConstructionPage from "@/components/UnderConstructionPage";

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
        <div className="flex gap-8 p-6 max-w-full mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full space-y-6"
            >
                <h1 className="text-2xl text-center font-bold tracking-tight text-gray-900">Invitations</h1>
                <Tabs defaultValue="sent" className="space-y-4">
                    <TabsList className="flex gap-2 bg-transparent">
                        {['sent', 'received', 'accepted', 'favourite'].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-teal-500 hover:text-white"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Sent Invitations */}
                    <TabsContent value="sent" className="space-y-4">
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="p-8 rounded-2xl shadow-lg border border-gray-200 bg-white">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Your Invitations</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto border-collapse text-sm text-left">
                                            <thead>
                                            <tr className="bg-gray-100 text-gray-700 font-medium">
                                                <th className="px-6 py-3 border-b">Job</th>
                                                <th className="px-6 py-3 border-b">Candidate</th>
                                                <th className="px-6 py-3 border-b">Status</th>
                                                <th className="px-6 py-3 border-b">Sent At</th>
                                                <th className="px-6 py-3 border-b">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {invitesByRecruiter?.filter((invite) => invite.status !== 'accepted').map((invite) => {
                                                const job = getJob(invite.job_id);
                                                const candidate = getCandidate(invite.candidate_id);
                                                return (
                                                    <motion.tr
                                                        key={invite.id}
                                                        className="hover:bg-gray-50 transition"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <td className="px-6 py-4 border-b">
                                                            {job ? (
                                                                <>
                                                                    <div className="font-medium text-gray-900">{job.title}</div>
                                                                    <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400">Unknown Job</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 border-b">
                                                            {candidate ? (
                                                                <>
                                                                    <div className="font-medium text-gray-900">
                                                                        {candidate.first_name} {candidate.last_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">{candidate.email}</div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400">Unknown Candidate</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 border-b">
                                                            <Badge
                                                                variant={
                                                                    invite.status === 'sent'
                                                                        ? 'secondary'
                                                                        : invite.status === 'accepted'
                                                                            ? 'default' // Changed from 'success' to 'default'
                                                                            : 'destructive'
                                                                }
                                                                className="px-3 py-1 text-sm"
                                                            >
                                                                {invite.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 border-b text-gray-600">
                                                            {new Date(invite.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 border-b flex gap-2">
                                                            {job && (
                                                                <Link
                                                                    href={`/jobs/${job.id}`}
                                                                    className="text-teal-600 hover:underline text-sm"
                                                                >
                                                                    View Job
                                                                </Link>
                                                            )}
                                                            {candidate && (
                                                                <Link
                                                                    href={`/candidates/${candidate.id}`}
                                                                    className="text-teal-600 hover:underline text-sm"
                                                                >
                                                                    View Candidate
                                                                </Link>
                                                            )}
                                                            {candidate && job && (
                                                                <Button
                                                                    onClick={() => handleCancel(job.id, candidate.id)}
                                                                    className="text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                                >
                                                                    Cancel Invitation
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </TabsContent>

                    {/* Received Invitations */}
                    <TabsContent value="received" className="space-y-4">
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="p-8 rounded-2xl shadow-lg border border-gray-200 bg-white">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Your Invitations (Received)</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto border-collapse text-sm text-left">
                                            <thead>
                                            <tr className="bg-gray-100 text-gray-700 font-medium">
                                                <th className="px-6 py-3 border-b">Job</th>
                                                <th className="px-6 py-3 border-b">Candidate</th>
                                                <th className="px-6 py-3 border-b">Status</th>
                                                <th className="px-6 py-3 border-b">Sent At</th>
                                                <th className="px-6 py-3 border-b">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {invitesReceivedByRecruited?.filter((invite) => invite.status !== 'accepted').map((invite) => {
                                                const job = getJob(invite.job_id);
                                                const candidate = getCandidate(invite.candidate_id);
                                                return (
                                                    <motion.tr
                                                        key={invite.id}
                                                        className="hover:bg-gray-50 transition"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <td className="px-6 py-4 border-b">
                                                            {job ? (
                                                                <>
                                                                    <div className="font-medium text-gray-900">{job.title}</div>
                                                                    <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400">Unknown Job</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 border-b">
                                                            {candidate ? (
                                                                <>
                                                                    <div className="font-medium text-gray-900">
                                                                        {candidate.first_name} {candidate.last_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">{candidate.email}</div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400">Unknown Candidate</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 border-b">
                                                            <Badge
                                                                variant={
                                                                    invite.status === 'sent'
                                                                        ? 'secondary'
                                                                        : invite.status === 'accepted'
                                                                            ? 'default' // Changed from 'success' to 'default'
                                                                            : 'destructive'
                                                                }
                                                                className="px-3 py-1 text-sm"
                                                            >
                                                                {invite.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 border-b text-gray-600">
                                                            {new Date(invite.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 border-b flex gap-2">
                                                            {job && (
                                                                <Link
                                                                    href={`/jobs/${job.id}`}
                                                                    className="text-teal-600 hover:underline text-sm"
                                                                >
                                                                    View Job
                                                                </Link>
                                                            )}
                                                            {candidate && (
                                                                <Link
                                                                    href={`/candidates/${candidate.id}`}
                                                                    className="text-teal-600 hover:underline text-sm"
                                                                >
                                                                    View Candidate
                                                                </Link>
                                                            )}
                                                            {candidate && job && (
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        onClick={() => handleAcceptInvitation(job.id, candidate.id)}
                                                                        className="text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                                                                    >
                                                                        Accept Invitation
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleCancelAnalytics(job.id, candidate.id)}
                                                                        className="text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                                    >
                                                                        Cancel Invitation
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </TabsContent>

                    {/* Accepted Invitations */}
                    <TabsContent value="accepted" className="space-y-4">
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="p-8 rounded-2xl shadow-lg border border-gray-200 bg-white">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Your Invitations (Accepted)</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto border-collapse text-sm text-left">
                                            <thead>
                                            <tr className="bg-gray-100 text-gray-700 font-medium">
                                                <th className="px-6 py-3 border-b">Job</th>
                                                <th className="px-6 py-3 border-b">Candidate</th>
                                                <th className="px-6 py-3 border-b">Status</th>
                                                <th className="px-6 py-3 border-b">Sent At</th>
                                                <th className="px-6 py-3 border-b">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {invitesByJobUser?.filter((invite) => invite.status === 'accepted').map((invite) => {
                                                const job = getJob(invite.job_id);
                                                const candidate = getCandidate(invite.candidate_id);
                                                return (
                                                    <motion.tr
                                                        key={invite.id}
                                                        className="hover:bg-gray-50 transition"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <td className="px-6 py-4 border-b">
                                                            {job ? (
                                                                <>
                                                                    <div className="font-medium text-gray-900">{job.title}</div>
                                                                    <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400">Unknown Job</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 border-b">
                                                            {candidate ? (
                                                                <>
                                                                    <div className="font-medium text-gray-900">
                                                                        {candidate.first_name} {candidate.last_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">{candidate.email}</div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400">Unknown Candidate</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 border-b">
                                                            <Badge
                                                                variant={
                                                                    invite.status === 'sent'
                                                                        ? 'secondary'
                                                                        : invite.status === 'accepted'
                                                                            ? 'default' // Changed from 'success' to 'default'
                                                                            : 'destructive'
                                                                }
                                                                className="px-3 py-1 text-sm"
                                                            >
                                                                {invite.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 border-b text-gray-600">
                                                            {new Date(invite.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 border-b flex gap-2">
                                                            {job && (
                                                                <Link
                                                                    href={`/jobs/${job.id}`}
                                                                    className="text-teal-600 hover:underline text-sm"
                                                                >
                                                                    View Job
                                                                </Link>
                                                            )}
                                                            {candidate && (
                                                                <Link
                                                                    href={`/candidates/${candidate.id}`}
                                                                    className="text-teal-600 hover:underline text-sm"
                                                                >
                                                                    View Candidate
                                                                </Link>
                                                            )}
                                                            {candidate && job && (
                                                                <Button
                                                                    onClick={() => handleRemoveRelation(invite.id)}
                                                                    className="text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                                >
                                                                    Remove Relation
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </TabsContent>

                    {/* Favourite Invitations */}
                    <TabsContent value="favourite" className="space-y-4">
                        {/*<AnimatePresence>*/}
                        {/*    <motion.div*/}
                        {/*        initial={{ opacity: 0, y: 20 }}*/}
                        {/*        animate={{ opacity: 1, y: 0 }}*/}
                        {/*        exit={{ opacity: 0, y: -20 }}*/}
                        {/*        transition={{ duration: 0.3 }}*/}
                        {/*    >*/}
                        {/*        <Card className="p-8 rounded-2xl shadow-lg border border-gray-200 bg-white">*/}
                        {/*            <h2 className="text-xl font-bold text-gray-900 mb-6">Favourite Invitations</h2>*/}
                        {/*            <p className="text-gray-600">This feature is under construction. Check back soon!</p>*/}
                        {/*        </Card>*/}
                        {/*    </motion.div>*/}
                        {/*</AnimatePresence>*/}
                        <div className="">
                            <UnderConstructionPage/>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
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