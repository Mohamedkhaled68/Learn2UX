import Navbar from "@/components/Navbar";
import CategoryHomeBtn from "@/components/CategoryHomeBtn";
import { getDictionary } from "./dictionaries";
import Image from "next/image";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Category {
    _id: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    questionNumber: number;
    textColor: string;
    borderColor: string;
    icon: string;
    iconType: "svg" | "png";
    createdAt: string;
    updatedAt: string;
}

async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(
            "https://learn2ux-backend.vercel.app/api/categories",
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export default async function page({
    params,
}: {
    params: Promise<{ lang: "en" | "ar" }>;
}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const categories = await getCategories();

    return (
        <>
            <div className="min-h-screen xl:max-h-screen flex flex-col justify-between py-4 lg:py-4 gap-7 xl:gap-4 px-4 lg:px-0 lg:gap-0">
                <Navbar />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-y-12 justify-items-stretch">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <CategoryHomeBtn
                                lang={lang}
                                key={category._id}
                                icon={
                                    <Image
                                        src={category.icon}
                                        alt={
                                            lang === "en"
                                                ? category.titleEn
                                                : category.titleAr
                                        }
                                        width={25}
                                        height={25}
                                        className="object-contain"
                                        unoptimized
                                    />
                                }
                                title={
                                    lang === "en"
                                        ? category.titleEn
                                        : category.titleAr
                                }
                                description={
                                    lang === "en"
                                        ? category.descriptionEn
                                        : category.descriptionAr
                                }
                                answers={category.questionNumber}
                                theme={{
                                    bg: category.borderColor,
                                    text: category.textColor,
                                }}
                                path={`/${lang}/${category._id}`}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            {lang === "en"
                                ? "No categories available yet."
                                : "لا توجد فئات متاحة بعد."}
                        </div>
                    )}
                </div>

                <div
                    style={{ border: `1px solid rgba(54, 54, 54, 0.40)` }}
                    className={`rounded-[20px] p-6 flex flex-col gap-2 mb-5 ${
                        lang === "ar" ? "font-noto" : ""
                    }`}
                >
                    <h1 className="text-2xl font-bold 2xl:text-[28px] text-[#363636]">
                        {lang === "en" ? "Side Note" : "ملاحظة جانبية"} :
                    </h1>
                    <p className="text-[#363636] text-[14px] 2xl:text-[18px]">
                        {dictionary.sideNote}
                    </p>
                </div>
            </div>
        </>
    );
}
