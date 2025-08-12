"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/utils/api";
import { motion } from 'framer-motion';
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect} from "react";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
}

function clearCookie(name: string) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
function OAuthHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const success = searchParams.get("success");
        const error = searchParams.get("error");
        const token = searchParams.get("token");

        if (token) {
            // Make API call to validate OAuth token
            api
                .post("/api/auth/oauth-login", null, { params: { token: decodeURIComponent(token) } })
                .then((response) => {
                    const jwtToken = response.data;
                    clearCookie('authToken'); // Clear existing cookie
                    const expires = new Date(Date.now() + 3600000); // 1h
                    const isProduction = process.env.NODE_ENV === "production";
                    const cookieString = `authToken=${encodeURIComponent(jwtToken)}; Path=/; Expires=${expires.toUTCString()}; ${
                        isProduction ? "SameSite=None; Secure" : "SameSite=Lax"
                    }`;
                    console.log('Setting OAuth cookie:', cookieString); // Debug
                    document.cookie = cookieString;

                    toast.success("Google login successful");
                    router.push("/home");
                })
                .catch((err) => {
                    console.error('OAuth login error:', err);
                    toast.error("Authentication failed: Invalid token");
                    router.push("/login?error=invalid_token");
                });
        } else if (success === "true") {
            toast.error("Authentication failed: No token received");
            router.push("/login?error=no_token");
        } else if (error) {
            toast.error(`Authentication failed: ${error}`);
            router.push("/login?error=auth_failed");
        }
    }, [searchParams, router]);

    return null;
}
export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await api.post("/api/auth/login", data);
            return response.data;
        },
        onSuccess: (token) => {
            const expires = new Date(Date.now() + 3600000);
            const cookieString = `authToken=${encodeURIComponent(token)}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`;
            document.cookie = cookieString;
            router.push('/home');
            toast.success("Login successful!");
        },
        onError: (error: any) => {
            console.error('Login error:', error);
            toast.error('Login failed' + error?.message);
        },
    });

    const handleGoogleLogin = () => {
        window.location.href = "https://java-application-uo30.onrender.com/oauth2/authorization/google";
        // window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }

    const cardVariants = {
        hidden: {opacity: 0, y: 50, scale: 0.95},
        visible: {opacity: 1, y: 0, scale: 1, transition: {duration: 0.7, ease: "easeOut"}},
    };

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden px-4">
            <Suspense>
                <OAuthHandler />
            </Suspense>

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

            {/* Login Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
            >
                <h2 className="text-4xl font-bold text-center text-white mb-8 tracking-tight">
                    Sign In
                </h2>

                <form
                    onSubmit={handleSubmit((data) => mutation.mutate(data))}
                    className="space-y-5"
                >
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

                    <motion.button
                        type="submit"
                        disabled={mutation.isPending}
                        whileHover={{ scale: 1.03, backgroundColor: "#6366f1" }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-indigo-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? "Signing In..." : "Sign In"}
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
                    Sign in with Google
                </motion.button>

                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-indigo-400 hover:text-indigo-300 transition duration-200">
                            Sign up
                        </a>
                    </p>
                </div>
            </motion.div>

            <div id="toast-container" className="absolute top-4 right-4 z-50" />
        </div>
    );
}
