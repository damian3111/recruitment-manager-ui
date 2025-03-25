"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

    const router = useRouter();

    const mutation = useMutation<FormData, Error, FormData>({
        mutationFn: async (data) => {
            return axios.post("http://localhost:8080/users", data);
        },
        onSuccess: () => {
            toast.success("Registration successful!");
            router.push("/login");
        },
        onError: (error) => {
            toast.error(error?.message || "Registration failed");
        }
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">

                    <div>
                        <label className="block mb-1 font-medium">First Name</label>
                        <input
                            type="text"
                            {...register("firstName", { required: "First name is required" })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Last Name</label>
                        <input
                            type="text"
                            {...register("lastName", { required: "Last name is required" })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Role</label>
                        <select
                            {...register("userRole", { required: "Role is required" })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="recruited">Recruited</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                        {errors.userRole && <p className="text-red-500 text-sm">{errors.userRole.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}
