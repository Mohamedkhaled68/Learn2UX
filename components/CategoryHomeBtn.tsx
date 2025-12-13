"use client";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import { CategoryHomeBtnProps } from "@/types/ComponentProps";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

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
    href,
    lang,
}: CategoryHomeBtnProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isMobile) {
            e.preventDefault(); // Prevent navigation on mobile
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        router.push(href);
    };

    const handleArrowClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) {
            e.stopPropagation();
            setIsLoading(true);
            router.push(href);
        }
    };

    return (
        <Link href={href} prefetch={true} onClick={handleClick}>
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
                className={`w-full p-4 2xl:p-[30px] rounded-[16px] flex flex-col gap-2 2xl:gap-[15px] bg-white select-none ${
                    lang === "ar" ? "font-noto" : ""
                }`}
            >
                <div className="flex items-center justify-between w-full">
                    {icon}

                    <div
                        className="rounded-full hover:bg-slate-200 p-2 duration-300 cursor-pointer"
                        onClick={handleArrowClick}
                    >
                        {isLoading ? (
                            <Spinner
                                color={theme.text}
                                width={25}
                                height={25}
                            />
                        ) : lang === "en" ? (
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
                    </div>
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
        </Link>
    );
};

export default CategoryHomeBtn;
