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
        <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-purple-300 via-blue-500 to-purple-500 relative overflow-hidden font-inter">
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
                        width: `${80 + i * 30}px`,
                        height: `${80 + i * 30}px`,
                        backgroundColor: i % 2 === 0 ? "rgba(148, 163, 184, 0.15)" : "rgba(59, 130, 246, 0.15)",
                        top: `${10 + i * 15}%`,
                        left: `${10 + i * 15}%`,
                        transform: `translate(-${i * 50}%, -${i * 50}%)`,
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
                className="relative z-10 bg-gradient-to-br from-blue-800 via-blue-900 to-purple-800 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-white/20 transform hover:scale-[1.01] transition-transform duration-300 ease-out"
            >
                <h2 className="text-5xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
                    Welcome Back
                </h2>

                <form
                    onSubmit={handleSubmit((data) => mutation.mutate(data))}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white mb-1 text-lg">First Name</label>
                            <input
                                type="text"
                                {...register("firstName")}
                                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400"
                                placeholder="John"
                            />
                            {errors.firstName && (
                                <p className="text-red-300 text-sm mt-1">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white mb-1 text-lg">Last Name</label>
                            <input
                                type="text"
                                {...register("lastName")}
                                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400"
                                placeholder="Doe"
                            />
                            {errors.lastName && (
                                <p className="text-red-300 text-sm mt-1">{errors.lastName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white mb-1 text-lg">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400"
                                placeholder="email@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white mb-1 text-lg">Password</label>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-white mb-1 text-lg">Role</label>
                            <select
                                {...register("userRole")}
                                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400"
                            >
                                <option className="text-black" value="recruited">Recruited</option>
                                <option className="text-black" value="recruiter">Recruiter</option>
                            </select>
                            {errors.userRole && (
                                <p className="text-red-300 text-sm mt-1">{errors.userRole.message}</p>
                            )}
                        </div>
                    </div>

                    {/*{mutation.isError && (*/}
                    {/*    <p className="text-sm text-red-300 text-center">*/}
                    {/*        {(mutation.error as Error).message}*/}
                    {/*    </p>*/}
                    {/*)}*/}

                    <motion.button
                        type="submit"
                        disabled={mutation.isPending}
                        whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-800 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:from-blue-500 hover:to-purple-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? "Signing up..." : "Sign up"}
                    </motion.button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white/10 backdrop-blur-sm px-4 text-white/80 rounded-full py-1">or continue with</span>
                    </div>
                </div>

                <motion.button
                    onClick={handleGoogleLogin}
                    whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 py-3 rounded-xl hover:bg-white/20 transition duration-300 ease-in-out font-medium text-white text-lg shadow-md"
                >
                    <img
                        src="https://placehold.co/24x24/ffffff/000000?text=G"
                        alt="Google logo placeholder"
                        className="rounded-full"
                        width={24}
                        height={24}
                    />
                    Sign Up with Google
                </motion.button>
            </motion.div>

            <div id="toast-container" className="absolute top-4 right-4 z-50">
            </div>
        </div>
    );
}
