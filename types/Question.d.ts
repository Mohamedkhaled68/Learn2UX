interface Question {
    id: string;
    category_id: string;
    question_en: string;
    question_ar: string;
    answer_en: string;
    answer_ar: string;
    links: string[];
    created_at: string;
    updated_at: string;
}

export { Question };
