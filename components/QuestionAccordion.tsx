"use client";

import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface QuestionAccordionProps {
    question: string;
    answer: string;
    links: string[];
    index: number;
    borderColor: string;
    textColor: string;
    lang: "en" | "ar";
}

const QuestionAccordion: React.FC<QuestionAccordionProps> = ({
    question,
    answer,
    links,
    index,
    borderColor,
    textColor,
    lang,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-4xl shadow-md hover:shadow-lg transition-all">
            {/* Question Header - Clickable */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors rounded-xl"
            >
                <div className="flex items-start gap-4 flex-1">
                    {/* Question Text */}
                    <h2
                        className={`text-[15px] xl:text-xl font-semibold flex-1 ${
                            lang === "ar" ? "text-right" : "text-left"
                        }`}
                        style={{ color: textColor }}
                        dir={lang === "ar" ? "rtl" : "ltr"}
                    >
                        {question}
                    </h2>
                </div>

                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0">
                    {isOpen ? (
                        <FiChevronUp
                            size={24}
                            className="text-gray-600 transition-transform"
                        />
                    ) : (
                        <FiChevronDown
                            size={24}
                            className="text-gray-600 transition-transform"
                        />
                    )}
                </div>
            </button>

            {/* Answer Content - Collapsible */}
            <div
                className={`overflow-hidden transition-all duration-300 ease ${
                    isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-6 pb-6 pt-2">
                    {/* Answer */}
                    <div
                        className="bg-gray-50 rounded-lg p-4 mb-4 ml-2 xl:ml-14"
                        dir={lang === "ar" ? "rtl" : "ltr"}
                    >
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {answer}
                        </p>
                    </div>

                    {/* Links */}
                    {links && links.length > 0 && (
                        <div className="ml-14">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                {lang === "en"
                                    ? "External Resources:"
                                    : "مصادر خارجية:"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {links.map((link, linkIndex) => (
                                    <a
                                        key={linkIndex}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionAccordion;
