"use client";

import Image from "next/image";
import usFlag from "@/public/us-flag.png";
import saFlag from "@/public/sa-flag.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter, usePathname } from "next/navigation";

const LanguageLevelSelector = () => {
    const { lang } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = () => {
        const newLang = lang === "en" ? "ar" : "en";
        // Replace the language in the current path
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        router.push(newPath);
    };

    return (
        <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-md border">
            {/* Language Toggle */}
            <button
                onClick={switchLanguage}
                className="cursor-pointer flex items-center gap-2 p-2 bg-gray-100 rounded-full border relative w-[30px] h-[30px] hover:bg-gray-200 transition-colors"
                title={`Switch to ${lang === "en" ? "Arabic" : "English"}`}
            >
                {lang === "en" ? (
                    <Image
                        src={usFlag}
                        fill
                        quality={100}
                        alt={"English"}
                        className="w-6 h-6 rounded-full"
                    />
                ) : (
                    <Image
                        src={saFlag}
                        fill
                        quality={100}
                        alt={"Arabic"}
                        className="w-6 h-6 rounded-full"
                    />
                )}
            </button>

            {/* Divider */}
            <span className="h-6 w-px bg-gray-300"></span>

            {/* Admin Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => router.push(`/${lang}/admin/login`)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                    {lang === "en" ? "Admin Login" : "دخول المشرف"}
                </button>
            </div>
        </div>
    );
};

export default LanguageLevelSelector;
