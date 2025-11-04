"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddCategory from "@/components/AddCategory";
import AddQuestion from "@/components/AddQuestion";
import ManageCategories from "@/components/ManageCategories";
import ManageQuestions from "@/components/ManageQuestions";
import Cookies from "js-cookie";

type TabType =
    | "addCategory"
    | "manageCategories"
    | "addQuestion"
    | "manageQuestions";

const AdminDashboard: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("addCategory");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Check if user is authenticated
        const token = Cookies.get("adminToken");
        if (!token) {
            router.push("/en/admin/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        Cookies.remove("adminToken");
        router.push("/en");
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">
                                Manage categories and questions
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab("addCategory")}
                                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "addCategory"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Add Category
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("manageCategories")}
                                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "manageCategories"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                        />
                                    </svg>
                                    Manage Categories
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("addQuestion")}
                                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "addQuestion"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Add Question
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("manageQuestions")}
                                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "manageQuestions"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Manage Questions
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="transition-all duration-300">
                    {activeTab === "addCategory" && <AddCategory />}
                    {activeTab === "manageCategories" && <ManageCategories />}
                    {activeTab === "addQuestion" && <AddQuestion />}
                    {activeTab === "manageQuestions" && <ManageQuestions />}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-sm text-gray-600">
                <p>© 2025 Learn2UX Admin Panel. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
