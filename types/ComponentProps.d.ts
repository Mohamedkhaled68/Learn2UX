import { ReactNode } from "react";

// Search Bar Props
interface SearchBarProps {
    categoryName?: string;
    categoryIcon?: string | ReactNode;
    categoryColor?: string;
    lang?: "en" | "ar";
}

// Question Accordion Props
interface QuestionAccordionProps {
    question: string;
    answer: string;
    links: string[];
    index: number;
    borderColor: string;
    textColor: string;
    lang: "en" | "ar";
    isOpen: boolean;
    onToggle: () => void;
}

// Category Home Button Props
interface CategoryHomeBtnProps {
    title: string;
    description: string;
    answers: number;
    icon: ReactNode;
    theme: {
        bg: string;
        text: string;
    };
    lang: "en" | "ar";
    href: string;
}

// Page Transition Props
interface PageTransitionProps {
    children: ReactNode;
}

export {
    SearchBarProps,
    QuestionAccordionProps,
    CategoryHomeBtnProps,
    PageTransitionProps,
};
