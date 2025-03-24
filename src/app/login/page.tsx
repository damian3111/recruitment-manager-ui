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

    const [serverError, setServerError] = useState("");
    const mutation = useMutation({
        mutationFn: async (data) => {
            try {
                // const response = await axios.post("http://localhost:8080/api/login", data);
                const response = await api.post("/login", data); // ✅ Use `api.post` instead of `axios.post`

                // Extract token
                const token = response.data;
                console.log("token: " + token);
                if (token) {
                    localStorage.setItem("authToken", token); // ✅ Store token safely
                }
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            {...register("password")}
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Logging in..." : "Login"}
                    </button>
                    <h1>{mutation.isPending}</h1>
                </form>
            </div>
        </div>
    );
}
