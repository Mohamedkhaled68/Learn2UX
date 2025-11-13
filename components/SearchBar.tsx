"use client";

import Link from "next/link";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { SearchBarProps } from "@/types/ComponentProps";
import { useRouter } from "next/navigation";

const SearchBar: React.FC<SearchBarProps> = ({
    categoryName,
    categoryIcon,
    lang = "en",
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsLoading(true);
        router.push(`/${lang}`);
    };

    return (
        <div
            className={`flex items-center flex-row-reverse justify-between w-full container`}
        >
            {/* Left: Back Arrow */}
            {lang === "en" ? (
                <Link
                    href={`/${lang}`}
                    prefetch={true}
                    onClick={handleBackClick}
                    className="flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-gray-800 border-t-transparent rounded-full" />
                    ) : (
                        <FaArrowRight size={20} />
                    )}
                </Link>
            ) : (
                <Link
                    href={`/${lang}`}
                    prefetch={true}
                    onClick={handleBackClick}
                    className="flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-gray-800 border-t-transparent rounded-full" />
                    ) : (
                        <FaArrowLeft size={20} />
                    )}
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
                            className="object-contain w-[25px] h-[25px] 2xl:w-[35px] 2xl:h-[35px]"
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
