'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
    CandidateType,
    useCandidate,
    useCandidateByEmail,
    useCreateCandidate,
    useUpdateCandidate
} from '@/lib/candidatesService';
import * as z from 'zod';
import {useCurrentUser} from "@/lib/userService";
import {useEffect, useState} from "react";
import ConfirmModal from "@/components/confirmationModal"
import TextField from "@/components/TextField";
import TextAreaField from "@/components/TextAreaField";
import {JobType, useJobs, useJobsByUser} from "@/lib/jobService";
import Link from "next/link";
import CareerCompassPage from "@/app/(dashboard)/career-compas/CareerCompassPage";

export default function RecruiterProfile() {

    return (
        <div className="w-full min-h-screen bg-gray-50 p-10">
            <CareerCompassPage/>
        </div>
    );
}
