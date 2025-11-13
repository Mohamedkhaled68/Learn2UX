"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { Category } from "@/types/Category";
import { CategoryFormData } from "@/types/FormData";
import { CategoryFormErrors } from "@/types/FormErrors";
import { ApiErrorResponse } from "@/types/ApiResponse";

const ManageCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [formData, setFormData] = useState<CategoryFormData>({
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
        textColor: "#000000",
        borderColor: "#000000",
    });

    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string>("");
    const [iconType, setIconType] = useState<"svg" | "png" | "">("");

    const [errors, setErrors] = useState<CategoryFormErrors>({
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
        textColor: "",
        borderColor: "",
        icon: "",
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const token = Cookies.get("adminToken");
            const response = await axios.get<{ data: Category[] }>(
                "https://learn2ux-backend.vercel.app/api/categories",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories(response.data.data || []);
        } catch (error) {
            toast.error("Failed to load categories. Please refresh the page.");
            setErrorMessage(
                "Failed to load categories. Please refresh the page."
            );
        } finally {
            setLoadingCategories(false);
        }
    };

    // Handle edit button click
    const handleEditClick = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            titleEn: category.titleEn,
            titleAr: category.titleAr,
            descriptionEn: category.descriptionEn,
            descriptionAr: category.descriptionAr,
            textColor: category.textColor,
            borderColor: category.borderColor,
        });
        setIconPreview(category.icon);
        setIconType(category.iconType);
        setIsEditing(true);
        setSuccessMessage("");
        setErrorMessage("");
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedCategory(null);
        setFormData({
            titleEn: "",
            titleAr: "",
            descriptionEn: "",
            descriptionAr: "",
            textColor: "#000000",
            borderColor: "#000000",
        });
        setIconFile(null);
        setIconPreview("");
        setIconType("");
        setErrors({
            titleEn: "",
            titleAr: "",
            descriptionEn: "",
            descriptionAr: "",
            textColor: "",
            borderColor: "",
            icon: "",
        });
    };

    // Handle input changes
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof CategoryFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        if (successMessage) setSuccessMessage("");
        if (errorMessage) setErrorMessage("");
    };

    // Handle icon file upload
    const handleIconChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ["image/svg+xml", "image/png"];
            if (!validTypes.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    icon: "Please upload only SVG or PNG files",
                }));
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    icon: "File size must be less than 2MB",
                }));
                return;
            }

            setIconFile(file);

            if (file.type === "image/svg+xml") {
                setIconType("svg");
            } else if (file.type === "image/png") {
                setIconType("png");
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setErrors((prev) => ({
                ...prev,
                icon: "",
            }));
        }
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: CategoryFormErrors = {
            titleEn: "",
            titleAr: "",
            descriptionEn: "",
            descriptionAr: "",
            textColor: "",
            borderColor: "",
            icon: "",
        };

        let isValid = true;

        if (!formData.titleEn.trim()) {
            newErrors.titleEn = "English title is required";
            isValid = false;
        }

        if (!formData.titleAr.trim()) {
            newErrors.titleAr = "Arabic title is required";
            isValid = false;
        }

        if (!formData.descriptionEn.trim()) {
            newErrors.descriptionEn = "English description is required";
            isValid = false;
        }

        if (!formData.descriptionAr.trim()) {
            newErrors.descriptionAr = "Arabic description is required";
            isValid = false;
        }

        if (!formData.textColor.trim()) {
            newErrors.textColor = "Text color is required";
            isValid = false;
        }

        if (!formData.borderColor.trim()) {
            newErrors.borderColor = "Border color is required";
            isValid = false;
        }

        if (!iconPreview) {
            newErrors.icon = "Icon image is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle update category
    const handleUpdate = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!validateForm() || !selectedCategory) {
            return;
        }

        setIsLoading(true);

        try {
            const token = Cookies.get("adminToken");

            if (!token) {
                setErrorMessage("Authentication required. Please login again.");
                return;
            }

            const response = await axios.put(
                `https://learn2ux-backend.vercel.app/api/categories/${selectedCategory._id}`,
                {
                    titleEn: formData.titleEn,
                    titleAr: formData.titleAr,
                    descriptionEn: formData.descriptionEn,
                    descriptionAr: formData.descriptionAr,
                    textColor: formData.textColor,
                    borderColor: formData.borderColor,
                    icon: iconPreview,
                    iconType: iconType,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccessMessage(
                response.data.message || "Category updated successfully!"
            );

            // Refresh categories list
            await fetchCategories();

            // Close edit form after a delay
            setTimeout(() => {
                handleCancelEdit();
            }, 1500);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const errorMsg =
                    axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    "Failed to update category. Please try again.";
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

    // Handle delete category
    const handleDelete = async (categoryId: string): Promise<void> => {
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const token = Cookies.get("adminToken");

            if (!token) {
                setErrorMessage("Authentication required. Please login again.");
                return;
            }

            await axios.delete(
                `https://learn2ux-backend.vercel.app/api/categories/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccessMessage("Category deleted successfully!");
            setDeleteConfirm(null);

            // Refresh categories list
            await fetchCategories();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const errorMsg =
                    axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    "Failed to delete category. Please try again.";
                setErrorMessage(errorMsg);
            } else {
                setErrorMessage(
                    "An unexpected error occurred. Please try again."
                );
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Manage Categories
            </h2>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
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
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
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

            {/* Edit Form */}
            {isEditing && selectedCategory && (
                <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Edit Category
                        </h3>
                        <button
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        {/* English Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title (English) *
                            </label>
                            <input
                                type="text"
                                name="titleEn"
                                value={formData.titleEn}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.titleEn
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                placeholder="Enter category title in English"
                            />
                            {errors.titleEn && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.titleEn}
                                </p>
                            )}
                        </div>

                        {/* Arabic Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title (Arabic) *
                            </label>
                            <input
                                type="text"
                                name="titleAr"
                                value={formData.titleAr}
                                onChange={handleChange}
                                disabled={isLoading}
                                dir="rtl"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.titleAr
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                placeholder="أدخل عنوان الفئة بالعربية"
                            />
                            {errors.titleAr && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.titleAr}
                                </p>
                            )}
                        </div>

                        {/* English Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (English) *
                            </label>
                            <textarea
                                name="descriptionEn"
                                value={formData.descriptionEn}
                                onChange={handleChange}
                                disabled={isLoading}
                                rows={3}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.descriptionEn
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                                placeholder="Enter category description in English"
                            />
                            {errors.descriptionEn && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.descriptionEn}
                                </p>
                            )}
                        </div>

                        {/* Arabic Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Arabic) *
                            </label>
                            <textarea
                                name="descriptionAr"
                                value={formData.descriptionAr}
                                onChange={handleChange}
                                disabled={isLoading}
                                dir="rtl"
                                rows={3}
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.descriptionAr
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                                placeholder="أدخل وصف الفئة بالعربية"
                            />
                            {errors.descriptionAr && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.descriptionAr}
                                </p>
                            )}
                        </div>

                        {/* Colors Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Text Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Text Color *
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="textColor"
                                        value={formData.textColor}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="w-16 h-12 rounded border border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <input
                                        type="text"
                                        value={formData.textColor}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                textColor: e.target.value,
                                            }))
                                        }
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="#000000"
                                    />
                                </div>
                                {errors.textColor && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.textColor}
                                    </p>
                                )}
                            </div>

                            {/* Border Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Border Color *
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="borderColor"
                                        value={formData.borderColor}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="w-16 h-12 rounded border border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <input
                                        type="text"
                                        value={formData.borderColor}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                borderColor: e.target.value,
                                            }))
                                        }
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="#000000"
                                    />
                                </div>
                                {errors.borderColor && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.borderColor}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Icon Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Icon (Optional - Upload to change)
                            </label>
                            <input
                                type="file"
                                accept=".svg,.png,image/svg+xml,image/png"
                                onChange={handleIconChange}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {iconPreview && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-600 mb-2">
                                        Current Icon:
                                    </p>
                                    <Image
                                        src={iconPreview}
                                        alt="Icon preview"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                            )}
                            {errors.icon && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.icon}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                                    isLoading
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md`}
                            >
                                {isLoading ? "Updating..." : "Update Category"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories List */}
            {loadingCategories ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading categories...</p>
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No categories found. Add a category first.
                </div>
            ) : (
                <div className="space-y-4">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            style={{ borderColor: category.borderColor }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={category.icon}
                                            alt={category.titleEn}
                                            width={50}
                                            height={50}
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3
                                            className="text-lg font-semibold mb-1"
                                            style={{
                                                color: category.textColor,
                                            }}
                                        >
                                            {category.titleEn} /{" "}
                                            {category.titleAr}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {category.descriptionEn}
                                        </p>
                                        <p
                                            className="text-sm text-gray-600 mb-2"
                                            dir="rtl"
                                        >
                                            {category.descriptionAr}
                                        </p>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <span>
                                                Text:{" "}
                                                <span
                                                    style={{
                                                        color: category.textColor,
                                                    }}
                                                >
                                                    {category.textColor}
                                                </span>
                                            </span>
                                            <span>
                                                Border:{" "}
                                                <span
                                                    style={{
                                                        color: category.borderColor,
                                                    }}
                                                >
                                                    {category.borderColor}
                                                </span>
                                            </span>
                                            <span>
                                                Type:{" "}
                                                {category.iconType.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() =>
                                            handleEditClick(category)
                                        }
                                        disabled={isEditing}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Edit category"
                                    >
                                        <FiEdit2 size={20} />
                                    </button>
                                    {deleteConfirm === category._id ? (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() =>
                                                    handleDelete(category._id)
                                                }
                                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDeleteConfirm(null)
                                                }
                                                className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setDeleteConfirm(category._id)
                                            }
                                            disabled={isEditing}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete category"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
