"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userRole: "recruiter" | "recruited";
};

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    userRole: z.enum(["recruiter", "recruited"], { message: "Role is required" }),
});

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const router = useRouter();

    const mutation = useMutation<FormData, Error, FormData>({
        mutationFn: async (data) => {
            return axios.post(`${BACKEND_URL}/users`, data);
        },
        onSuccess: () => {
            toast.success("Registration successful!");
            toast.success('Check your email inbox and activate your account');
            router.push("/login");
        },
        onError: (error) => {
            toast.error("User already exists.");
        }
    });


    const orbVariants = {
        animate: (i: number) => ({
            x: [0, Math.random() * 150 - 75, Math.random() * 150 - 75, 0],
            y: [0, Math.random() * 150 - 75, Math.random() * 150 - 75, 0],
            scale: [1, 1.1 + Math.random() * 0.2, 0.9 - Math.random() * 0.1, 1],
            opacity: [0.2, 0.5, 0.3, 0.2],
            transition: {
                duration: 20 + i * 5,
                repeat: Infinity,
                repeatType: "mirror" as const,
                ease: "easeInOut",
            },
        }),
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
    };

    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden px-4">

            {/* Animated Background Orbs */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full blur-2xl"
                    style={{
                        width: `${60 + i * 20}px`,
                        height: `${60 + i * 20}px`,
                        background: i % 2 === 0 ? "rgba(79, 70, 229, 0.3)" : "rgba(147, 51, 234, 0.3)",
                        top: `${20 + i * 15}%`,
                        left: `${15 + i * 20}%`,
                    }}
                    variants={orbVariants}
                    animate="animate"
                    custom={i}
                />
            ))}

            {/* Register Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
            >
                <h2 className="text-4xl font-bold text-center text-white mb-8 tracking-tight">
                    Sign Up
                </h2>

                <form
                    onSubmit={handleSubmit((data) => mutation.mutate(data))}
                    className="space-y-5"
                >
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-1">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            {...register("firstName")}
                            className="w-full p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            placeholder="John"
                        />
                        {errors.firstName && (
                            <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-1">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            {...register("lastName")}
                            className="w-full p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            placeholder="Doe"
                        />
                        {errors.lastName && (
                            <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="w-full p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="w-full p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="userRole" className="block text-sm font-medium text-gray-200 mb-1">
                            Role
                        </label>
                        <select
                            id="userRole"
                            {...register("userRole")}
                            className="w-full mb-10 p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        >
                            <option value="recruited">Recruited</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                        {errors.userRole && (
                            <p className="text-sm text-red-400 mt-1">{errors.userRole.message}</p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={mutation.isPending}
                        whileHover={{ scale: 1.03, backgroundColor: "#6366f1" }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-indigo-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? "Signing Up..." : "Sign Up"}
                    </motion.button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600/50" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-gray-800/50 px-4 text-gray-400">Or continue with</span>
                    </div>
                </div>

                <motion.button
                    onClick={handleGoogleLogin}
                    whileHover={{ scale: 1.03, backgroundColor: "#374151" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-3 bg-gray-700/50 border border-gray-600/50 py-3 rounded-lg text-white font-medium text-lg hover:bg-gray-600/50 transition duration-300 shadow-sm"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign up with Google
                </motion.button>

                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition duration-200">
                            Sign in
                        </a>
                    </p>
                </div>
            </motion.div>

            <div id="toast-container" className="absolute top-4 right-4 z-50" />
        </div>
    );
}
