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
const CategoryHomeBtn = ({
    title,
    description,
    answers,
    icon,
    theme,
    path,
    lang
}: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            style={{
                border: `1px solid ${theme.bg}`,
                boxShadow: `0 0px 10px 1px ${theme.bg}`,
            }}
            className={`w-full p-4 rounded-md flex flex-col gap-4 bg-white select-none`}
        >
            <div className="flex items-center justify-between w-full">
                {icon}
                <Link
                    className="rounded-full hover:bg-slate-300 p-2 duration-300 cursor-pointer"
                    href={path}
                >
                    {
                        lang === "en" ? <FaArrowRightLong style={{ color: theme.text }} size={25} /> : <FaArrowLeftLong style={{ color: theme.text }} size={25} />
                    }
                </Link>
            </div>
            <div className="flex flex-col gap-1">
                <h1
                    style={{ color: theme.text }}
                    className="text-2xl font-ramillas italic font-bold"
                >
                    {title}
                </h1>
                <p style={{ color: theme.text }}>{description}</p>
            </div>
            <div className="w-fit p-1 border-t-[1px] border-black">
                {answers} {
                        lang === "en" ? "answers" : "إجابة"
                    }
            </div>
        </motion.div>
    );
};

export default CategoryHomeBtn;
