"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { AdminRegisterFormData } from "@/types/FormData";
import { AdminRegisterFormErrors } from "@/types/FormErrors";
import { ApiErrorResponse } from "@/types/ApiResponse";

const AdminRegister: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<AdminRegisterFormData>({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState<AdminRegisterFormErrors>({
        username: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof AdminRegisterFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        // Clear success/error messages when user starts typing
        if (successMessage) setSuccessMessage("");
        if (errorMessage) setErrorMessage("");
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: AdminRegisterFormErrors = {
            username: "",
            password: "",
        };

        let isValid = true;

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        // Clear previous messages
        setSuccessMessage("");
        setErrorMessage("");

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                "https://learn2ux-backend.vercel.app/api/admin/register",
                {
                    username: formData.username,
                    password: formData.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Success
            setSuccessMessage(
                response.data.message || "Admin registered successfully!"
            );

            // Clear form fields
            setFormData({
                username: "",
                password: "",
            });

            // Clear errors
            setErrors({
                username: "",
                password: "",
            });
        } catch (error) {
            // Handle errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const errorMsg =
                    axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    "Registration failed. Please try again.";
                setErrorMessage(errorMsg);
            } else {
                setErrorMessage(
                    "An unexpected error occurred. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Admin Registration
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Create a new admin account
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                            <svg
                                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm">{successMessage}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                            <svg
                                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm">{errorMessage}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.username
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                placeholder="Enter admin username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.password
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                placeholder="Enter admin password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                                isLoading
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <a
                        href="/admin/login"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Sign in here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AdminRegister;
