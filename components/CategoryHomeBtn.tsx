"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

type Props = {
    title: string;
    description: string;
    answers: number;
    icon: ReactNode;
    theme: {
        bg: string;
        text: string;
    };
    path: string;
    lang: "en" | "ar";
};

const withAlpha = (color: string, alpha: number) => {
    if (color.startsWith("#")) {
        return `${color}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
    }

    const nums = color.match(/\d+/g);
    if (!nums || nums.length < 3) {
        // fallback to black if the color string doesn't contain RGB values
        return `rgba(0, 0, 0, ${alpha})`;
    }

    return `rgba(${nums.slice(0, 3).join(", ")}, ${alpha})`;
};
const CategoryHomeBtn = ({
    title,
    description,
    answers,
    icon,
    theme,
    path,
    lang,
}: Props) => {
    // iconwidth = 75
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            style={{
                border: `1px solid ${withAlpha(theme.bg, 0.4)}`,
                boxShadow: `0 0px 8px 1px ${withAlpha(theme.bg, 0.15)}`,
            }}
            className={`max-w-full 2xl:w-[350px] p-4 2xl:p-[30px] rounded-[16px] flex flex-col gap-2 2xl:gap-[15px] bg-white select-none ${
                lang === "ar" ? "font-noto" : ""
            }`}
        >
            <div className="flex items-center justify-between w-full">
                {icon}

                <Link
                    className="rounded-full hover:bg-slate-300 p-2 duration-300 cursor-pointer"
                    href={path}
                >
                    {lang === "en" ? (
                        <FaArrowRightLong
                            style={{ color: theme.text }}
                            className="arrows"
                        />
                    ) : (
                        <FaArrowLeftLong
                            style={{ color: theme.text }}
                            className="arrows"
                        />
                    )}
                </Link>
            </div>
            <div className="flex flex-col gap-1 2xl:gap-[5px]">
                <h1
                    style={{ color: theme.text }}
                    className={`text-2xl 2xl:text-[35px] ${
                        lang === "ar" ? "font-noto" : "italic font-ramillas"
                    } font-extrabold`}
                >
                    {title}
                </h1>
                <p
                    className={`${
                        lang === "ar" ? "font-noto" : "font-raleway "
                    } text-[15px] 2xl:text-[18px]`}
                    style={{ color: theme.text }}
                >
                    {description}
                </p>
            </div>
            <span
                style={{
                    border: `1px solid ${withAlpha(theme.text, 0.5)}`,
                }}
                className={`w-[15%]`}
            />
            <div
                style={{
                    color: theme.text,
                }}
                className="2xl:text-[22px]"
            >
                <span className="font-ramillas font-bold">{answers}</span>{" "}
                {lang === "en" ? "answers" : "إجابة"}
            </div>
        </motion.div>
    );
};

export default CategoryHomeBtn;
