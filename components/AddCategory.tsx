"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { PiMapTrifoldLight } from "react-icons/pi";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Image from "next/image";

interface CategoryFormData {
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    textColor: string;
    borderColor: string;
}

interface FormErrors {
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    textColor: string;
    borderColor: string;
    icon: string;
}

interface ApiErrorResponse {
    message?: string;
    error?: string;
}

const AddCategory: React.FC = () => {
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

    const [errors, setErrors] = useState<FormErrors>({
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

    // Handle input changes
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        // Clear success/error messages when user starts typing
        if (successMessage) setSuccessMessage("");
        if (errorMessage) setErrorMessage("");
    };

    // Handle icon file upload
    const handleIconChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ["image/svg+xml", "image/png"];
            if (!validTypes.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    icon: "Please upload only SVG or PNG files",
                }));
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    icon: "File size must be less than 2MB",
                }));
                return;
            }

            setIconFile(file);

            // Set icon type based on file MIME type
            if (file.type === "image/svg+xml") {
                setIconType("svg");
            } else if (file.type === "image/png") {
                setIconType("png");
            }

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Clear icon error
            setErrors((prev) => ({
                ...prev,
                icon: "",
            }));
        }
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
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

        if (!iconFile) {
            newErrors.icon = "Icon image is required";
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
            const token = Cookies.get("adminToken");

            if (!token) {
                setErrorMessage("Authentication required. Please login again.");
                return;
            }

            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append("titleEn", formData.titleEn);
            formDataToSend.append("titleAr", formData.titleAr);
            formDataToSend.append("descriptionEn", formData.descriptionEn);
            formDataToSend.append("descriptionAr", formData.descriptionAr);
            formDataToSend.append("textColor", formData.textColor);
            formDataToSend.append("borderColor", formData.borderColor);

            if (iconFile && iconType) {
                formDataToSend.append("icon", iconFile);
                formDataToSend.append("iconType", iconType);
            }
            const response = await axios.post(
                "https://learn2ux-backend.vercel.app/api/categories",
                {
                    titleEn: formData.titleEn,
                    titleAr: formData.titleAr,
                    descriptionEn: formData.descriptionEn,
                    descriptionAr: formData.descriptionAr,
                    textColor: formData.textColor,
                    borderColor: formData.borderColor,
                    icon: iconPreview, // base64 encoded icon
                    iconType: iconType,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Success
            setSuccessMessage(
                response.data.message || "Category added successfully!"
            );

            // Clear form fields
            setFormData({
                titleEn: "",
                titleAr: "",
                descriptionEn: "",
                descriptionAr: "",
                textColor: "#000000",
                borderColor: "#000000",
            });

            // Clear icon
            setIconFile(null);
            setIconPreview("");
            setIconType("");

            // Clear errors
            setErrors({
                titleEn: "",
                titleAr: "",
                descriptionEn: "",
                descriptionAr: "",
                textColor: "",
                borderColor: "",
                icon: "",
            });
        } catch (error) {
            // Handle errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const errorMsg =
                    axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    "Failed to add category. Please try again.";
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
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add New Category
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

            <div className="flex gap-6 flex-col lg:flex-row">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                    {/* English Title */}
                    <div>
                        <label
                            htmlFor="titleEn"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Title (English) *
                        </label>
                        <input
                            type="text"
                            id="titleEn"
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
                        <label
                            htmlFor="titleAr"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Title (Arabic) *
                        </label>
                        <input
                            type="text"
                            id="titleAr"
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
                        <label
                            htmlFor="descriptionEn"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description (English) *
                        </label>
                        <textarea
                            id="descriptionEn"
                            name="descriptionEn"
                            value={formData.descriptionEn}
                            onChange={handleChange}
                            disabled={isLoading}
                            rows={4}
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
                        <label
                            htmlFor="descriptionAr"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description (Arabic) *
                        </label>
                        <textarea
                            id="descriptionAr"
                            name="descriptionAr"
                            value={formData.descriptionAr}
                            onChange={handleChange}
                            disabled={isLoading}
                            dir="rtl"
                            rows={4}
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

                    {/* Text Color */}
                    <div>
                        <label
                            htmlFor="textColor"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Text Color *
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                id="textColor"
                                name="textColor"
                                value={formData.textColor}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <input
                                type="text"
                                value={formData.textColor}
                                onChange={(e) =>
                                    handleChange({
                                        ...e,
                                        target: {
                                            ...e.target,
                                            name: "textColor",
                                        },
                                    })
                                }
                                disabled={isLoading}
                                className={`flex-1 px-4 py-3 rounded-lg border ${
                                    errors.textColor
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-mono`}
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
                        <label
                            htmlFor="borderColor"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Border Color *
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                id="borderColor"
                                name="borderColor"
                                value={formData.borderColor}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <input
                                type="text"
                                value={formData.borderColor}
                                onChange={(e) =>
                                    handleChange({
                                        ...e,
                                        target: {
                                            ...e.target,
                                            name: "borderColor",
                                        },
                                    })
                                }
                                disabled={isLoading}
                                className={`flex-1 px-4 py-3 rounded-lg border ${
                                    errors.borderColor
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-mono`}
                                placeholder="#000000"
                            />
                        </div>
                        {errors.borderColor && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.borderColor}
                            </p>
                        )}
                    </div>

                    {/* Icon Upload */}
                    <div>
                        <label
                            htmlFor="icon"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Icon (SVG or PNG) *
                        </label>
                        <div className="flex gap-3 items-start">
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="icon"
                                    name="icon"
                                    accept=".svg,.png,image/svg+xml,image/png"
                                    onChange={handleIconChange}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.icon
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100`}
                                />
                                {errors.icon && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.icon}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Upload SVG or PNG icon (max 2MB). SVG
                                    recommended for best quality.
                                </p>
                            </div>
                            {iconPreview && (
                                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg p-2 flex items-center justify-center bg-gray-50">
                                    <Image
                                        src={iconPreview}
                                        alt="Icon preview"
                                        width={48}
                                        height={48}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>
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
                                Adding Category...
                            </span>
                        ) : (
                            "Add Category"
                        )}
                    </button>
                </form>
                {/* Category Preview */}

                <div className="flex flex-col gap-6 pt-2 lg:w-[400px]">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Preview
                    </h3>

                    {/* English Preview */}
                    <div
                        style={{
                            border: `1px solid ${formData.borderColor}`,
                            boxShadow: `0 0px 10px 1px ${formData.borderColor}`,
                        }}
                        className="p-4 rounded-md flex flex-col gap-4 bg-white"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div
                                className="w-8 h-8 flex items-center justify-center"
                                style={{ color: formData.textColor }}
                            >
                                {iconPreview ? (
                                    <Image
                                        src={iconPreview}
                                        alt="Category icon"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                ) : (
                                    <PiMapTrifoldLight size={30} />
                                )}
                            </div>
                            <span className="rounded-full hover:bg-slate-200 p-2 duration-300 cursor-pointer">
                                <FaArrowRightLong
                                    style={{ color: formData.textColor }}
                                    size={20}
                                />
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1
                                style={{ color: formData.textColor }}
                                className="text-2xl font-ramillas italic font-bold"
                            >
                                {formData.titleEn || "Category Title"}
                            </h1>
                            <p
                                style={{ color: formData.textColor }}
                                className="opacity-80"
                            >
                                {formData.descriptionEn ||
                                    "Category description"}
                            </p>
                        </div>
                        <div className="w-fit p-1 border-t-[1px] border-black">
                            20 answers
                        </div>
                    </div>

                    {/* Arabic Preview */}
                    <div
                        style={{
                            border: `1px solid ${formData.borderColor}`,
                            boxShadow: `0 0px 10px 1px ${formData.borderColor}`,
                        }}
                        className="p-4 rounded-md flex flex-col gap-4 bg-white"
                    >
                        <div className="flex flex-row-reverse items-center justify-between w-full">
                            <div
                                className="w-8 h-8 flex items-center justify-center"
                                style={{ color: formData.textColor }}
                            >
                                {iconPreview ? (
                                    <Image
                                        src={iconPreview}
                                        alt="Category icon"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                ) : (
                                    <PiMapTrifoldLight size={30} />
                                )}
                            </div>
                            <span className="rounded-full hover:bg-slate-200 p-2 duration-300 cursor-pointer">
                                <FaArrowLeftLong
                                    style={{ color: formData.textColor }}
                                    size={20}
                                />
                            </span>
                        </div>
                        <div className="flex items-end flex-col gap-1">
                            <h1
                                style={{ color: formData.textColor }}
                                className="text-2xl font-ramillas italic font-bold"
                                dir="rtl"
                            >
                                {formData.titleAr || "عنوان الفئة"}
                            </h1>
                            <p
                                style={{ color: formData.textColor }}
                                className="opacity-80"
                                dir="rtl"
                            >
                                {formData.descriptionAr || "وصف الفئة"}
                            </p>
                            <div className="w-fit mt-3 p-1 border-t-[1px] border-black">
                                20 إجابة
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;
