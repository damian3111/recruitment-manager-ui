"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import api from "@/utils/api"; // ✅ Use the custom API client

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const GOOGLE_AUTH_URL = `http://localhost:8080/oauth2/authorization/google`;
    const [serverError, setServerError] = useState("");
    const mutation = useMutation({
        mutationFn: async (data) => {
            try {
                // const response = await axios.post("http://localhost:8080/api/login", data);
                const response = await api.post("/login", data);

                // Extract token
                const token = response.data;
                console.log("token: " + token);
                // if (token) {
                //     localStorage.setItem("authToken", token);
                // }
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Login successful!");
        },
        onError: (error) => {
            toast.error(error?.message || "Registration failed");
        }
    });

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>

                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-red-500">{(mutation.error as Error).message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        {mutation.isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                    <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                    Login with Google
                </button>
            </div>
        </div>
    );
}
