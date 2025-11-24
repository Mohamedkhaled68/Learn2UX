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
                    key={question._id}
                    question={
                        lang === "en"
                            ? question.questionEn
                            : question.questionAr
                    }
                    answer={
                        lang === "en" ? question.answerEn : question.answerAr
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
