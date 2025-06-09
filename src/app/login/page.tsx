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
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-blue-500 to-purple-500 relative overflow-hidden font-inter">
            <Suspense>
                <OAuthHandler/>
            </Suspense>
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        "linear-gradient(45deg, rgba(23, 37, 84, 0.3), rgba(13, 148, 136, 0.3), rgba(23, 37, 84, 0.3))",
                        "linear-gradient(60deg, rgba(13, 148, 136, 0.3), rgba(23, 37, 84, 0.3), rgba(13, 148, 136, 0.3))",
                        "linear-gradient(45deg, rgba(23, 37, 84, 0.3), rgba(13, 148, 136, 0.3), rgba(23, 37, 84, 0.3))",
                    ],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                }}
            />

            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full blur-3xl`}
                    style={{
                        width: `${80 + i * 30}px`, // Vary size
                        height: `${80 + i * 30}px`,
                        backgroundColor: i % 2 === 0 ? "rgba(148, 163, 184, 0.15)" : "rgba(59, 130, 246, 0.15)", // Toned colors
                        top: `${10 + i * 15}%`,
                        left: `${10 + i * 15}%`,
                        transform: `translate(-${i * 50}%, -${i * 50}%)`, // Initial spread
                    }}
                    variants={orbVariants}
                    animate="animate"
                    custom={i}
                />
            ))}

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 bg-gradient-to-br from-blue-800 via-blue-900 to-purple-800 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 transform hover:scale-[1.01] transition-transform duration-300 ease-out"
            >
                <h2 className="text-5xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
                    Welcome Back
                </h2>

                <form
                    onSubmit={handleSubmit((data) => {
                        mutation.mutate(data)
                    })}
                    className="space-y-6"
                >
                    <div>
                        <label htmlFor="email" className="block text-white font-medium mb-2 text-lg">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="w-full p-4 border border-slate-300/30 bg-white/5 rounded-xl text-white placeholder-slate-300/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out text-lg"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-300 mt-2">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-white font-medium mb-2 text-lg">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="w-full p-4 border border-slate-300/30 bg-white/5 rounded-xl text-white placeholder-slate-300/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out text-lg"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-300 mt-2">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/*{mutation.isError && (*/}
                    {/*    <p className="text-sm text-red-300">*/}
                    {/*        {(mutation.error as Error).message}*/}
                    {/*    </p>*/}
                    {/*)}*/}

                    <motion.button
                        type="submit"
                        disabled={mutation.isPending}
                        whileHover={{scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)"}}
                        whileTap={{scale: 0.98}}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-800 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:from-blue-500 hover:to-purple-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? "Logging in..." : "Login"}
                    </motion.button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white/10 backdrop-blur-sm px-4 text-white/80 rounded-full py-1">or continue with</span>
                    </div>
                </div>

                <motion.button
                    onClick={handleGoogleLogin}
                    whileHover={{scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"}}
                    whileTap={{scale: 0.98}}
                    className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 py-3 rounded-xl hover:bg-white/20 transition duration-300 ease-in-out font-medium text-white text-lg shadow-md"
                >
                    <img
                        src="https://placehold.co/24x24/ffffff/000000?text=G"
                        alt="Google logo placeholder"
                        className="rounded-full"
                        width={24}
                        height={24}
                    />
                    Login with Google
                </motion.button>
            </motion.div>
            <div id="toast-container" className="absolute top-4 right-4 z-50">
            </div>
        </div>
    );
}
