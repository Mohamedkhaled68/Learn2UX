"use client";

import Image from "next/image";
import usFlag from "@/public/us-flag.png";
import saFlag from "@/public/sa-flag.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const LanguageLevelSelector = () => {
    const { lang } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const switchLanguage = () => {
        setIsLoading(true);
        const newLang = lang === "en" ? "ar" : "en";
        // Replace the language in the current path
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        router.push(newPath);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex items-center gap-[16px] bg-white py-[12px] px-[16px] rounded-full shadow-md border border-[#8B8B8B80]/50"
        >
            {/* Language Toggle */}
            <motion.button
                onClick={switchLanguage}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="cursor-pointer flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-full border border-[#363636] relative w-[24px] h-[24px] hover:bg-gray-200 transition-colors"
                title={`Switch to Arabic`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full" />
                ) : (
                    <motion.div
                        key={`ar-${lang}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
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
                    </motion.div>
                )}
            </motion.button>

            <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="border border-l-[1.5px] border-[#8B8B8B80]/50 h-4 rounded-[14px]"
            />

            <motion.button
                onClick={switchLanguage}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="cursor-pointer flex items-center justify-center gap-2 p-2 bg-gray-100 rounded-full border border-[#363636] relative w-[24px] h-[24px] hover:bg-gray-200 transition-colors"
                title={`Switch to English`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full" />
                ) : (
                    <motion.div
                        key={`en-${lang}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
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
                    </motion.div>
                )}
            </motion.button>
        </motion.div>
    );
};

export default LanguageLevelSelector;
