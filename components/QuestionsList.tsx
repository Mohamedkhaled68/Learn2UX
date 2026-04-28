"use client";

import React, { useState } from "react";
import QuestionAccordion from "./QuestionAccordion";
import { Question } from "@/types/Question";

interface QuestionsListProps {
    questions: Question[];
    lang: "en" | "ar";
    borderColor: string;
    textColor: string;
}

const QuestionsList: React.FC<QuestionsListProps> = ({
    questions,
    lang,
    borderColor,
    textColor,
}) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {questions.map((question, index) => (
                <QuestionAccordion
                    key={question.id}
                    question={
                        lang === "en"
                            ? question.question_en
                            : question.question_ar
                    }
                    answer={
                        lang === "en" ? question.answer_en : question.answer_ar
                    }
                    links={question.links}
                    index={index}
                    borderColor={borderColor}
                    textColor={textColor}
                    lang={lang}
                    isOpen={openIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    );
};

export default QuestionsList;
