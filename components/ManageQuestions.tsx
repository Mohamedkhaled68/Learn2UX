"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { Category } from "@/types/Category";
import { Question } from "@/types/Question";
import { QuestionFormData } from "@/types/FormData";
import { QuestionFormErrors } from "@/types/FormErrors";
import { useGetCategories } from "@/hooks/useGetCategories";
import { useGetQuestions } from "@/hooks/useGetQuestions";
import ReactMarkdown from "react-markdown";

const ManageQuestions: React.FC = () => {
    const { categories: hookCategories, loading: loadingCategories } =
        useGetCategories();
    const { questions: hookQuestions, loading: loadingQuestions } =
        useGetQuestions();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
        null,
    );

    console.log(hookCategories);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterCategory, setFilterCategory] = useState<string>("");

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
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Sync hook questions to state
    useEffect(() => {
        if (!loadingQuestions && hookQuestions.length > 0) {
            setQuestions(hookQuestions);
        }
    }, [hookQuestions, loadingQuestions]);

    // Sync hook categories to state
    useEffect(() => {
        if (!loadingCategories && hookCategories.length > 0) {
            setCategories(hookCategories);
        }
    }, [hookCategories, loadingCategories]);

    const filteredQuestions = questions.filter((question) => {
        const matchesSearch =
            searchQuery.trim() === "" ||
            question.question_en
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            question.question_ar.includes(searchQuery) ||
            question.answer_en
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            question.answer_ar.includes(searchQuery);

        const matchesCategory =
            filterCategory === "" || question.category_id === filterCategory;

        return matchesSearch && matchesCategory;
    });

    // Handle edit button click
    const handleEditClick = (question: Question) => {
        setSelectedQuestion(question);
        console.log(question);

        setFormData({
            categoryId: question.category_id,
            questionEn: question.question_en,
            questionAr: question.question_ar,
            answerEn: question.answer_en,
            answerAr: question.answer_ar,
            links:
                question.links && question.links.length > 0
                    ? question.links.map((link: any) => link.url || link)
                    : [""],
        });
        setIsEditing(true);
        setSuccessMessage("");
        setErrorMessage("");
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedQuestion(null);
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
    };

    // Handle input changes
    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof QuestionFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

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

    // Handle update question
    const handleUpdate = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!validateForm() || !selectedQuestion) {
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();

            // Filter out empty links
            const validLinks = formData.links.filter(
                (link) => link.trim() !== "",
            );

            // Update question
            const { error: updateError } = await supabase
                .from("questions")
                .update({
                    question_en: formData.questionEn,
                    question_ar: formData.questionAr,
                    answer_en: formData.answerEn,
                    answer_ar: formData.answerAr,
                    links: validLinks.length > 0 ? validLinks : null,
                })
                .eq("id", selectedQuestion.id);

            if (updateError) {
                setErrorMessage(
                    `Failed to update question: ${updateError.message}`,
                );
                setIsLoading(false);
                return;
            }

            setSuccessMessage("Question updated successfully!");

            // Refresh questions list
            const { data: updatedQuestions } = await supabase
                .from("questions")
                .select("*")
                .order("created_at", { ascending: false });

            setQuestions(updatedQuestions || []);

            // Close edit form after a delay
            setTimeout(() => {
                handleCancelEdit();
            }, 1500);
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

    // Handle delete question
    const handleDelete = async (questionId: string): Promise<void> => {
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const supabase = createClient();

            const { error: deleteError } = await supabase
                .from("questions")
                .delete()
                .eq("id", questionId);

            if (deleteError) {
                setErrorMessage(
                    `Failed to delete question: ${deleteError.message}`,
                );
                return;
            }

            setSuccessMessage("Question deleted successfully!");
            setDeleteConfirm(null);

            // Refresh questions list
            const { data: updatedQuestions } = await supabase
                .from("questions")
                .select("*")
                .order("created_at", { ascending: false });

            setQuestions(updatedQuestions || []);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred. Please try again.",
            );
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Manage Questions
            </h2>

            {/* Search and Filter */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Bar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Questions
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by question or answer..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors"
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Category
                    </label>
                    {loadingCategories ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500">
                            Loading categories...
                        </div>
                    ) : (
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.title_en} / {category.title_ar}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Results Count */}
            {!loadingQuestions && (
                <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredQuestions.length} of {questions.length}{" "}
                    questions
                    {(searchQuery || filterCategory) && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setFilterCategory("");
                            }}
                            className="ml-3 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Success Message */}
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

            {/* Error Message */}
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

            {/* Edit Modal */}
            {isEditing && selectedQuestion && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Edit Question
                            </h3>
                            <button
                                onClick={handleCancelEdit}
                                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                {loadingCategories ? (
                                    <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500">
                                        Loading categories...
                                    </div>
                                ) : (
                                    <select
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
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.title_en} /{" "}
                                                {category.title_ar}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question (English) *
                                </label>
                                <textarea
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question (Arabic) *
                                </label>
                                <textarea
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Answer (English) *
                                </label>
                                <textarea
                                    name="answerEn"
                                    value={formData.answerEn}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.answerEn
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                                    placeholder="Enter answer in English"
                                />
                                {errors.answerEn && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.answerEn}
                                    </p>
                                )}
                            </div>

                            {/* Arabic Answer */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Answer (Arabic) *
                                </label>
                                <textarea
                                    name="answerAr"
                                    value={formData.answerAr}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    dir="rtl"
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.answerAr
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    } focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                                    placeholder="أدخل الإجابة بالعربية"
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
                                                    handleLinkChange(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={isLoading}
                                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                placeholder="https://example.com"
                                            />
                                            {formData.links.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLinkField(index)
                                                    }
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

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 -mx-6 -mb-6 mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                                        isLoading
                                            ? "bg-indigo-400 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md`}
                                >
                                    {isLoading
                                        ? "Updating..."
                                        : "Update Question"}
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
                </div>
            )}

            {/* Questions List */}
            {loadingQuestions ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading questions...</p>
                </div>
            ) : questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No questions found. Add a question first.
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No questions match your search or filter criteria.
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map((question) => (
                        <div
                            key={question.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    {/* Category Badge */}
                                    <div className="inline-block mb-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                                        {categories.find(
                                            (c) =>
                                                c.id === question.category_id,
                                        )?.title_en || "N/A"}{" "}
                                        /
                                        {categories.find(
                                            (c) =>
                                                c.id === question.category_id,
                                        )?.title_ar || "N/A"}
                                    </div>

                                    {/* Question */}
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                        {question.question_en}
                                    </h3>
                                    <p
                                        className="text-sm text-gray-600 mb-2"
                                        dir="rtl"
                                    >
                                        {question.question_ar}
                                    </p>

                                    {/* Answer Preview */}
                                    <div className="bg-gray-50 rounded p-3 mb-2">
                                        <div className="text-sm text-gray-700 line-clamp-2">
                                            <ReactMarkdown>
                                                {question.answer_en}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Links Count */}
                                    {question.links &&
                                        question.links.length > 0 && (
                                            <p className="text-xs text-gray-500">
                                                📎 {question.links.length}{" "}
                                                external{" "}
                                                {question.links.length === 1
                                                    ? "link"
                                                    : "links"}
                                            </p>
                                        )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() =>
                                            handleEditClick(question)
                                        }
                                        disabled={isEditing}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Edit question"
                                    >
                                        <FiEdit2 size={20} />
                                    </button>
                                    {deleteConfirm === question.id ? (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() =>
                                                    handleDelete(question.id)
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
                                                setDeleteConfirm(question.id)
                                            }
                                            disabled={isEditing}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete question"
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

export default ManageQuestions;
