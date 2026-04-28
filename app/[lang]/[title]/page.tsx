import SearchBar from "@/components/SearchBar";
import QuestionsList from "@/components/QuestionsList";
import { getDictionary } from "../dictionaries";
import Link from "next/link";
import { Question } from "@/types/Question";
import { Category } from "@/types/Category";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getCategoryById(categoryId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("categories_with_count")
            .select("*")
            .eq("id", categoryId)
            .single();

        if (error) return null;

        return data;
    } catch (error) {
        toast.error("Failed to fetch category");
        return null;
    }
}

export default async function page({
    params,
}: {
    params: Promise<{ lang: "en" | "ar"; title: string }>;
}) {
    const { lang, title: categoryId } = await params;
    const dictionary = await getDictionary(lang);
    const category = await getCategoryById(categoryId);

    console.log(categoryId);

    const supabase = await createClient();
    const { data: questions } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

    console.log(questions);

    // Filter questions by category ID
    const categoryQuestions = questions?.filter(
        (question) => question.category_id === categoryId,
    );

    if (!category) {
        return (
            <>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            {lang === "en"
                                ? "Category not found"
                                : "الفئة غير موجودة"}
                        </h1>
                        <Link
                            href={`/${lang}`}
                            prefetch={true}
                            className="text-indigo-600 hover:text-indigo-700 underline"
                        >
                            {lang === "en"
                                ? "Back to home"
                                : "العودة إلى الصفحة الرئيسية"}
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="px-4 py-4">
                <SearchBar
                    categoryName={
                        lang === "en" ? category.title_en : category.title_ar
                    }
                    categoryIcon={category.icon_url}
                    categoryColor={category.text_color}
                    lang={lang}
                />
            </div>
            <div className="w-full mx-auto xl:px-4 py-8">
                {/* Questions List */}
                {categoryQuestions && categoryQuestions.length > 0 ? (
                    <QuestionsList
                        questions={categoryQuestions}
                        lang={lang}
                        borderColor={category.border_color}
                        textColor={category.text_color}
                    />
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {lang === "en"
                                ? "No questions yet"
                                : "لا توجد أسئلة بعد"}
                        </h3>
                        <p className="text-gray-500">
                            {lang === "en"
                                ? "Questions for this category will appear here."
                                : "ستظهر الأسئلة الخاصة بهذه الفئة هنا."}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
