"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { QuestionFormData } from "@/types/FormData";
import { QuestionFormErrors } from "@/types/FormErrors";
import { Category } from "@/types/Category";
import { ApiErrorResponse } from "@/types/ApiResponse";

const AddQuestion: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

    const [formData, setFormData] = useState<QuestionFormData>({
        categoryId: "",
        questionEn: "",
        questionAr: "",
        answerEn: "",
        answerAr: "",
        links: [""],
    });

    const [errors, setErrors] = useState<QuestionFormErrors>({
        categoryId: "",
        questionEn: "",
        questionAr: "",
        answerEn: "",
        answerAr: "",
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [activeTextarea, setActiveTextarea] = useState<string | null>(null);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle text formatting
    const applyFormatting = (format: string) => {
        if (!activeTextarea) return;

        const editableDiv = document.querySelector(
            `div[data-name="${activeTextarea}"]`
        ) as HTMLDivElement;

        if (!editableDiv) return;

        // Make sure the div is focused
        editableDiv.focus();

        let command = "";
        let value: string | undefined = undefined;

        switch (format) {
            case "bold":
                command = "bold";
                break;
            case "italic":
                command = "italic";
                break;
            case "underline":
                command = "underline";
                break;
            case "code":
                // Wrap in code tag manually
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;
                const range = selection.getRangeAt(0);
                if (range.collapsed) return;

                const code = document.createElement("code");
                code.style.backgroundColor = "#f3f4f6";
                code.style.padding = "2px 4px";
                code.style.borderRadius = "3px";
                code.style.fontFamily = "monospace";

                try {
                    range.surroundContents(code);
                } catch (e) {
                    const fragment = range.extractContents();
                    code.appendChild(fragment);
                    range.insertNode(code);
                }
                updateFormData(activeTextarea, editableDiv.innerHTML);
                return;
            case "bullet":
                command = "insertUnorderedList";
                break;
            case "number":
                command = "insertOrderedList";
                break;
            case "heading":
                command = "formatBlock";
                value = "h3";
                break;
            case "link":
                const url = prompt("Enter URL:", "https://");
                if (!url) return;
                command = "createLink";
                value = url;
                break;
            default:
                return;
        }

        // Execute the command
        document.execCommand(command, false, value);

        // Update form data
        updateFormData(activeTextarea, editableDiv.innerHTML);

        // Keep focus on the editable div
        setTimeout(() => {
            editableDiv.focus();
        }, 0);
    };

    const updateFormData = (fieldName: string, htmlContent: string) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: htmlContent,
        }));
    };

    const fetchCategories = async () => {
        try {
            const token = Cookies.get("adminToken");
            const response = await axios.get(
                "https://learn2ux-backend.vercel.app/api/categories",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories(response.data.data);
        } catch (error) {
            toast.error("Failed to load categories. Please refresh the page.");
            setErrorMessage(
                "Failed to load categories. Please refresh the page."
            );
        } finally {
            setLoadingCategories(false);
        }
    };

    // Handle input changes
    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof QuestionFormErrors]) {
            setErrors((prev: QuestionFormErrors) => ({
                ...prev,
                [name]: "",
            }));
        }

        // Clear success/error messages when user starts typing
        if (successMessage) setSuccessMessage("");
        if (errorMessage) setErrorMessage("");
    };

    // Handle link changes
    const handleLinkChange = (index: number, value: string): void => {
        const newLinks = [...formData.links];
        newLinks[index] = value;
        setFormData((prev) => ({
            ...prev,
            links: newLinks,
        }));
    };

    // Add new link field
    const addLinkField = (): void => {
        setFormData((prev) => ({
            ...prev,
            links: [...prev.links, ""],
        }));
    };

    // Remove link field
    const removeLinkField = (index: number): void => {
        if (formData.links.length > 1) {
            const newLinks = formData.links.filter((_, i) => i !== index);
            setFormData((prev) => ({
                ...prev,
                links: newLinks,
            }));
        }
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: QuestionFormErrors = {
            categoryId: "",
            questionEn: "",
            questionAr: "",
            answerEn: "",
            answerAr: "",
        };

        let isValid = true;

        if (!formData.categoryId) {
            newErrors.categoryId = "Please select a category";
            isValid = false;
        }

        if (!formData.questionEn.trim()) {
            newErrors.questionEn = "English question is required";
            isValid = false;
        }

        if (!formData.questionAr.trim()) {
            newErrors.questionAr = "Arabic question is required";
            isValid = false;
        }

        if (!formData.answerEn.trim()) {
            newErrors.answerEn = "English answer is required";
            isValid = false;
        }

        if (!formData.answerAr.trim()) {
            newErrors.answerAr = "Arabic answer is required";
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

            // Filter out empty links
            const validLinks = formData.links.filter(
                (link) => link.trim() !== ""
            );

            const response = await axios.post(
                "https://learn2ux-backend.vercel.app/api/questions",
                {
                    categoryId: formData.categoryId,
                    questionEn: formData.questionEn,
                    questionAr: formData.questionAr,
                    answerEn: formData.answerEn,
                    answerAr: formData.answerAr,
                    links: validLinks.length > 0 ? validLinks : undefined,
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
                response.data.message || "Question added successfully!"
            );

            // Clear form fields
            setFormData({
                categoryId: "",
                questionEn: "",
                questionAr: "",
                answerEn: "",
                answerAr: "",
                links: [""],
            });

            // Clear errors
            setErrors({
                categoryId: "",
                questionEn: "",
                questionAr: "",
                answerEn: "",
                answerAr: "",
            });
        } catch (error) {
            // Handle errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                const errorMsg =
                    axiosError.response?.data?.message ||
                    axiosError.response?.data?.error ||
                    "Failed to add question. Please try again.";
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
                Add New Question
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category Selection */}
                <div>
                    <label
                        htmlFor="categoryId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Category *
                    </label>
                    {loadingCategories ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500">
                            Loading categories...
                        </div>
                    ) : (
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full px-4 py-3 rounded-lg border ${
                                errors.categoryId
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.titleEn} / {category.titleAr}
                                </option>
                            ))}
                        </select>
                    )}
                    {errors.categoryId && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.categoryId}
                        </p>
                    )}
                </div>

                {/* English Question */}
                <div>
                    <label
                        htmlFor="questionEn"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Question (English) *
                    </label>
                    <textarea
                        id="questionEn"
                        name="questionEn"
                        value={formData.questionEn}
                        onChange={handleChange}
                        disabled={isLoading}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border ${
                            errors.questionEn
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                        placeholder="Enter question in English"
                    />
                    {errors.questionEn && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.questionEn}
                        </p>
                    )}
                </div>

                {/* Arabic Question */}
                <div>
                    <label
                        htmlFor="questionAr"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Question (Arabic) *
                    </label>
                    <textarea
                        id="questionAr"
                        name="questionAr"
                        value={formData.questionAr}
                        onChange={handleChange}
                        disabled={isLoading}
                        dir="rtl"
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border ${
                            errors.questionAr
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                        placeholder="أدخل السؤال بالعربية"
                    />
                    {errors.questionAr && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.questionAr}
                        </p>
                    )}
                </div>

                {/* English Answer */}
                <div>
                    <label
                        htmlFor="answerEn"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Answer (English) *
                    </label>
                    {/* Formatting Toolbar */}
                    {activeTextarea === "answerEn" && (
                        <div className="mb-2 flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 rounded-lg">
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("bold");
                                }}
                                className="px-3 py-1 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Bold"
                            >
                                B
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("italic");
                                }}
                                className="px-3 py-1 text-sm italic bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Italic"
                            >
                                I
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("underline");
                                }}
                                className="px-3 py-1 text-sm underline bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Underline"
                            >
                                U
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("code");
                                }}
                                className="px-3 py-1 text-sm font-mono bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Code"
                            >
                                {"</>"}
                            </button>
                            <div className="w-px bg-gray-300 mx-1"></div>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("bullet");
                                }}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Bullet List"
                            >
                                • List
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("number");
                                }}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Numbered List"
                            >
                                1. List
                            </button>
                            <div className="w-px bg-gray-300 mx-1"></div>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("heading");
                                }}
                                className="px-3 py-1 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Heading"
                            >
                                H
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("link");
                                }}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="Link"
                            >
                                🔗 Link
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <div
                            data-name="answerEn"
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => {
                                const target = e.currentTarget;
                                setFormData((prev) => ({
                                    ...prev,
                                    answerEn: target.innerHTML,
                                }));
                                if (errors.answerEn) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        answerEn: "",
                                    }));
                                }
                            }}
                            onFocus={() => setActiveTextarea("answerEn")}
                            onBlur={() => setActiveTextarea(null)}
                            className={`w-full px-4 py-3 rounded-lg border min-h-[120px] ${
                                errors.answerEn
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed overflow-y-auto`}
                            style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                            }}
                            ref={(el) => {
                                if (el && el.innerHTML !== formData.answerEn) {
                                    el.innerHTML = formData.answerEn;
                                }
                            }}
                        />
                        {formData.answerEn === "" && (
                            <div
                                className="absolute top-[52px] left-4 text-gray-400 pointer-events-none"
                                style={{ userSelect: "none" }}
                            >
                                Enter answer in English
                            </div>
                        )}
                    </div>
                    {errors.answerEn && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.answerEn}
                        </p>
                    )}
                </div>

                {/* Arabic Answer */}
                <div>
                    <label
                        htmlFor="answerAr"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Answer (Arabic) *
                    </label>
                    {/* Formatting Toolbar */}
                    {activeTextarea === "answerAr" && (
                        <div className="mb-2 flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 rounded-lg">
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("bold");
                                }}
                                className="px-3 py-1 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="عريض"
                            >
                                B
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("italic");
                                }}
                                className="px-3 py-1 text-sm italic bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="مائل"
                            >
                                I
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("underline");
                                }}
                                className="px-3 py-1 text-sm underline bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="تحته خط"
                            >
                                U
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("code");
                                }}
                                className="px-3 py-1 text-sm font-mono bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="كود"
                            >
                                {"</>"}
                            </button>
                            <div className="w-px bg-gray-300 mx-1"></div>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("bullet");
                                }}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="قائمة نقطية"
                            >
                                • قائمة
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("number");
                                }}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="قائمة مرقمة"
                            >
                                1. قائمة
                            </button>
                            <div className="w-px bg-gray-300 mx-1"></div>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("heading");
                                }}
                                className="px-3 py-1 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="عنوان"
                            >
                                H
                            </button>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    applyFormatting("link");
                                }}
                                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                title="رابط"
                            >
                                🔗 رابط
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <div
                            data-name="answerAr"
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => {
                                const target = e.currentTarget;
                                setFormData((prev) => ({
                                    ...prev,
                                    answerAr: target.innerHTML,
                                }));
                                if (errors.answerAr) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        answerAr: "",
                                    }));
                                }
                            }}
                            onFocus={() => setActiveTextarea("answerAr")}
                            onBlur={() => setActiveTextarea(null)}
                            dir="rtl"
                            className={`w-full px-4 py-3 rounded-lg border min-h-[120px] ${
                                errors.answerAr
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed overflow-y-auto`}
                            style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                            }}
                            ref={(el) => {
                                if (el && el.innerHTML !== formData.answerAr) {
                                    el.innerHTML = formData.answerAr;
                                }
                            }}
                        />
                        {formData.answerAr === "" && (
                            <div
                                className="absolute top-[52px] right-4 text-gray-400 pointer-events-none"
                                style={{ userSelect: "none" }}
                                dir="rtl"
                            >
                                أدخل الإجابة بالعربية
                            </div>
                        )}
                    </div>
                    {errors.answerAr && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.answerAr}
                        </p>
                    )}
                </div>

                {/* External Links */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        External Links (Optional)
                    </label>
                    <div className="space-y-3">
                        {formData.links.map((link, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) =>
                                        handleLinkChange(index, e.target.value)
                                    }
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="https://example.com"
                                />
                                {formData.links.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLinkField(index)}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLinkField}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            + Add Another Link
                        </button>
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
                            Adding Question...
                        </span>
                    ) : (
                        "Add Question"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddQuestion;
