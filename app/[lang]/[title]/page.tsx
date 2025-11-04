import SearchBar from "@/components/SearchBar";
import QuestionAccordion from "@/components/QuestionAccordion";
import { getDictionary } from "../dictionaries";
import Link from "next/link";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Category {
    _id: string;
    titleEn: string;
    titleAr: string;
}

interface Question {
    _id: string;
    categoryId: Category;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
    links: string[];
    createdAt: string;
    updatedAt: string;
}

async function getQuestions(): Promise<Question[]> {
    try {
        const response = await fetch(
            "https://learn2ux-backend.vercel.app/api/questions",
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}

async function getCategoryById(categoryId: string) {
    try {
        const response = await fetch(
            `https://learn2ux-backend.vercel.app/api/categories/${categoryId}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error("Error fetching category:", error);
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
    const allQuestions = await getQuestions();
    const category = await getCategoryById(categoryId);

    // Filter questions by category ID
    const categoryQuestions = allQuestions.filter(
        (question) => question.categoryId._id === categoryId
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
                        lang === "en" ? category.titleEn : category.titleAr
                    }
                    categoryIcon={category.icon}
                    categoryColor={category.textColor}
                    lang={lang}
                />
            </div>
            <div className="max-w-8xl mx-auto px-4 py-8">
                {/* Questions List */}
                {categoryQuestions.length > 0 ? (
                    <div className="space-y-4">
                        {categoryQuestions.map((question, index) => (
                            <QuestionAccordion
                                key={question._id}
                                question={
                                    lang === "en"
                                        ? question.questionEn
                                        : question.questionAr
                                }
                                answer={
                                    lang === "en"
                                        ? question.answerEn
                                        : question.answerAr
                                }
                                links={question.links}
                                index={index}
                                borderColor={category.borderColor}
                                textColor={category.textColor}
                                lang={lang}
                            />
                        ))}
                    </div>
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
