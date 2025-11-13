"use client";

import Link from "next/link";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import Image from "next/image";
import { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { SearchBarProps } from "@/types/ComponentProps";

const SearchBar: React.FC<SearchBarProps> = ({
    categoryName,
    categoryIcon,
    lang = "en",
}) => {
    return (
        <div
            className={`flex items-center flex-row-reverse justify-between w-full container`}
        >
            {/* Left: Back Arrow */}
            {lang === "en" ? (
                <Link href={`/${lang}`} prefetch={true}>
                    <FaArrowRight size={20} />
                </Link>
            ) : (
                <Link href={`/${lang}`} prefetch={true}>
                    <FaArrowLeft size={20} />
                </Link>
            )}

            {/* Search Input */}
            {/* <div className="col-span-3 flex items-center flex-grow mx-4 bg-white rounded-full px-4 py-2 border border-black/20 shadow">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder={
                        lang === "en"
                            ? "Search"
                            : "إبحث"
                    }
                    className="w-full border-none outline-none px-2 text-gray-700 bg-transparent"
                />
            </div> */}

            {/* Right: Category Name with Icon */}
            <div className="flex items-center font-semibold">
                {categoryIcon ? (
                    typeof categoryIcon === "string" ? (
                        <Image
                            src={categoryIcon}
                            alt={categoryName || "Category"}
                            width={22}
                            height={22}
                            className="object-contain"
                            unoptimized
                        />
                    ) : (
                        categoryIcon
                    )
                ) : (
                    <MdAttachMoney size={22} />
                )}
                <span className="ml-1 capitalize">
                    {categoryName || "Taxes"}
                </span>
            </div>
        </div>
    );
};

export default SearchBar;
