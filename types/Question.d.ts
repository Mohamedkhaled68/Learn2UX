import { Category } from "./Category";

interface Question {
    _id: string;
    categoryId: Category;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
    links: string[];
    createdAt: string;
    updatedAt: string;
}

export { Question };
