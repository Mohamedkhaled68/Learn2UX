"use client";

import { useState } from "react";
import { HiOutlinePaintBrush } from "react-icons/hi2";
import { GiLadybug } from "react-icons/gi";
import Image from "next/image";
import usFlag from "@/public/us-flag.png";
// import {saFlag} from "/sa-flag.png";
const LanguageLevelSelector = () => {
    const [selectedLevel, setSelectedLevel] = useState("Beginner");

    return (
        <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-md border">
            {/* Language Toggle */}
            <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-full border relative w-[30px] h-[30px]">
                <Image
                    src={usFlag}
                    fill
                    quality={100}
                    alt="English"
                    className="w-6 h-6 rounded-full"
                />
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
                    Pro
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
                    Beginner
                </button>
            </div>
        </div>
    );
};

export default LanguageLevelSelector;
