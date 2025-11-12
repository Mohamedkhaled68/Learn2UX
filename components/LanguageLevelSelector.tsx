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
        <div className="flex items-center gap-[16px] bg-white py-[12px] px-[16px] rounded-full shadow-md border border-[#8B8B8B80]/50">
            {/* Language Toggle */}
            <button
                onClick={switchLanguage}
                className="cursor-pointer flex items-center gap-2 p-2 bg-gray-100 rounded-full border border-[#363636] relative w-[24px] h-[24px] hover:bg-gray-200 transition-colors"
                title={`Switch to Arabic`}
            >
                {lang === "en" ? (
                    <Image
                        src={saFlag}
                        fill
                        quality={100}
                        alt={"Arabic"}
                        className="w-6 h-6 rounded-full  grayscale-100"
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

            <span className="border border-l-[1.5px] border-[#8B8B8B80]/50 h-4 rounded-[14px]" />

            <button
                onClick={switchLanguage}
                className="cursor-pointer flex items-center gap-2 p-2 bg-gray-100 rounded-full border border-[#363636] relative w-[24px] h-[24px] hover:bg-gray-200 transition-colors"
                title={`Switch to English`}
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
                        src={usFlag}
                        fill
                        quality={100}
                        alt={"English"}
                        className="w-6 h-6 rounded-full grayscale-100"
                    />
                )}
            </button>
        </div>
    );
};

export default LanguageLevelSelector;
