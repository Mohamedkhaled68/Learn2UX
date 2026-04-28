import Navbar from "@/components/Navbar";
import CategoryHomeBtn from "@/components/CategoryHomeBtn";
import { getDictionary } from "./dictionaries";
import Image from "next/image";
import { Category } from "@/types/Category";
import { createClient } from "@/lib/supabase/server";
import { withAlpha } from "@/utils/helpers";

export default async function page({
    params,
}: {
    params: Promise<{ lang: "en" | "ar" }>;
}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const supabase = await createClient();
    const { data: categories } = await supabase
        .from("categories_with_count")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <>
            <div className="min-h-screen xl:max-h-screen flex flex-col justify-around py-2 pt-5 px-4 lg:pt-0 lg:px-0 gap-7 lg:gap-0">
                <Navbar />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-8 justify-items-stretch">
                    {categories && categories.length > 0 ? (
                        categories.reverse().map((category: Category) => (
                            <CategoryHomeBtn
                                lang={lang}
                                key={category.id}
                                icon={
                                    <Image
                                        src={
                                            category.icon_url ||
                                            "/default-icon.svg"
                                        }
                                        alt={
                                            lang === "en"
                                                ? category.title_en
                                                : category.title_ar
                                        }
                                        width={35}
                                        height={35}
                                        className="object-contain w-6.25 h-6.25 2xl:w-8.75 2xl:h-8.75"
                                        unoptimized
                                    />
                                }
                                title={
                                    lang === "en"
                                        ? category.title_en
                                        : category.title_ar
                                }
                                description={
                                    lang === "en"
                                        ? category.description_en
                                        : category.description_ar
                                }
                                answers={category.question_number}
                                theme={{
                                    bg: category.border_color,
                                    text: category.text_color,
                                }}
                                href={`/${lang}/${category.id}`}
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
                    style={{
                        border: `1px solid rgba(54, 54, 54, 0.40)`,
                        boxShadow: `0 0px 8px 1px ${withAlpha(
                            "#363636",
                            0.15,
                        )}`,
                    }}
                    className={`rounded-[20px] p-6 flex flex-col gap-2 mb-5 lg:mb-0 ${
                        lang === "ar" ? "font-noto" : ""
                    }`}
                >
                    <h1 className="text-2xl font-bold 2xl:text-[28px] text-[#363636] ">
                        {lang === "en" ? "Side Note" : "ملاحظة جانبية"} :
                    </h1>
                    <p className="text-[#363636] opacity-70 text-[14px]">
                        {dictionary.sideNote}
                    </p>
                </div>
            </div>
        </>
    );
}
