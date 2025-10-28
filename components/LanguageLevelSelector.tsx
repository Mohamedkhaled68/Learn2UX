"use client";

import { useState } from "react";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { GiLadybug } from "react-icons/gi";
import Image from "next/image";
import usFlag from "@/public/us-flag.png";
import saFlag from "@/public/sa-flag.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter, usePathname } from "next/navigation";

const LanguageLevelSelector = () => {
    const [selectedLevel, setSelectedLevel] = useState("Beginner");
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
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-full border relative w-[30px] h-[30px] hover:bg-gray-200 transition-colors"
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

            {/* Level Selector */}
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full border">
                <button
                    className={`flex items-center gap-1 text-gray-500 ${
                        selectedLevel === "Pro" ? "font-bold text-black" : ""
                    }`}
                    onClick={() => setSelectedLevel("Pro")}
                >
                    <HiOutlinePaintBrush size={16} />
                    {lang === "en" ? "Pro" : "محترف"}
                </button>

                <span className="text-gray-400">|</span>

                <button
                    className={`flex items-center gap-1 ${
                        selectedLevel === "Beginner"
                            ? "font-bold text-black"
                            : "text-gray-500"
                    }`}
                    onClick={() => setSelectedLevel("Beginner")}
                >
                    <GiLadybug size={16} />
                    {lang === "en" ? "Beginner" : "مبتدئ"}
                </button>
            </div>
        </div>
    );
};

export default LanguageLevelSelector;
