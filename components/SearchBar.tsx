"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";

const SearchBar = () => {
    const router = useRouter();

    return (
        <div className="grid grid-cols-5 items-center w-full">
            {/* Left: Back Arrow */}
            <Link href={"/"} className="text-green-600">
                <FaArrowLeft size={20} />
            </Link>

            {/* Search Input */}
            <div className="col-span-3 flex items-center flex-grow mx-4 bg-white rounded-full px-4 py-2 border border-black/20 shadow">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for what you need"
                    className="w-full border-none outline-none px-2 text-gray-700 bg-transparent"
                />
            </div>

            {/* Right: Label with Icon */}
            <div className="flex items-center text-green-600 font-semibold justify-self-end">
                <MdAttachMoney size={22} />
                <span className="ml-1">Taxes</span>
            </div>
        </div>
    );
};

export default SearchBar;
