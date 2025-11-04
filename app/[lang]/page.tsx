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
            <Navbar />
            <div className="flex flex-col gap-4 ">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
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
                                answers={0}
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

                <div className="rounded-md p-4 border-[1px] border-black flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">
                        {lang === "en" ? "Side Note" : "ملاحظة جانبية"} :
                    </h1>
                    <p>{dictionary.sideNote}</p>
                </div>
            </div>
        </>
    );
}
