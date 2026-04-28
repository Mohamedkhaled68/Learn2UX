"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { QuestionFormData } from "@/types/FormData";
import { QuestionFormErrors } from "@/types/FormErrors";
import { Category } from "@/types/Category";

const AddQuestion: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

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

    // Fetch categories from Supabase
    useEffect(() => {
        const fetchCategories = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("categories_with_count")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) setCategories(data);
            setLoadingCategories(false);
        };

        fetchCategories();
    }, []);

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof QuestionFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        if (successMessage) setSuccessMessage("");
        if (errorMessage) setErrorMessage("");
    };

    const handleLinkChange = (index: number, value: string): void => {
        const newLinks = [...formData.links];
        newLinks[index] = value;
        setFormData((prev) => ({ ...prev, links: newLinks }));
    };

    const addLinkField = (): void => {
        setFormData((prev) => ({ ...prev, links: [...prev.links, ""] }));
    };

    const removeLinkField = (index: number): void => {
        if (formData.links.length > 1) {
            setFormData((prev) => ({
                ...prev,
                links: prev.links.filter((_, i) => i !== index),
            }));
        }
    };

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

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const supabase = createClient();
            const validLinks = formData.links.filter(
                (link) => link.trim() !== "",
            );

            // Insert question
            const { data: question, error: questionError } = await supabase
                .from("questions")
                .insert({
                    category_id: formData.categoryId,
                    question_en: formData.questionEn,
                    question_ar: formData.questionAr,
                    answer_en: formData.answerEn,
                    answer_ar: formData.answerAr,
                    links: validLinks,
                })
                .select("id")
                .single();

            if (questionError) throw new Error(questionError.message);

            // Insert links if any
            // if (validLinks.length > 0) {
            //     const linksPayload = validLinks.map((url) => ({
            //         question_id: question.id,
            //         url,
            //         title_en: "",
            //         title_ar: "",
            //     }));

            //     const { error: linksError } = await supabase
            //         .from("links")
            //         .insert(linksPayload);

            //     if (linksError) throw new Error(linksError.message);
            // }

            setSuccessMessage("Question added successfully!");
            setFormData({
                categoryId: "",
                questionEn: "",
                questionAr: "",
                answerEn: "",
                answerAr: "",
                links: [""],
            });
            setErrors({
                categoryId: "",
                questionEn: "",
                questionAr: "",
                answerEn: "",
                answerAr: "",
            });
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Add New Question
            </h2>

            {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                    <svg
                        className="w-5 h-5 mr-2 mt-0.5 shrink-0"
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

            {errorMessage && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <svg
                        className="w-5 h-5 mr-2 mt-0.5 shrink-0"
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
                                <option key={category.id} value={category.id}>
                                    {category.title_en} / {category.title_ar}
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
                        className={`w-full px-4 py-3 rounded-lg border ${errors.questionEn ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"} focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
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
                        className={`w-full px-4 py-3 rounded-lg border ${errors.questionAr ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"} focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
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
                    <textarea
                        id="answerEn"
                        name="answerEn"
                        value={formData.answerEn}
                        onChange={handleChange}
                        placeholder="Enter answer in English"
                        rows={5}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.answerEn ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"} focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        disabled={isLoading}
                    />
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
                    <textarea
                        id="answerAr"
                        name="answerAr"
                        value={formData.answerAr}
                        onChange={handleChange}
                        placeholder="أدخل الإجابة بالعربية"
                        rows={5}
                        dir="rtl"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.answerAr ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"} focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        disabled={isLoading}
                    />
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
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md`}
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
