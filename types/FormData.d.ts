// Category Form Data
interface CategoryFormData {
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    textColor: string;
    borderColor: string;
}

// Question Form Data
interface QuestionFormData {
    categoryId: string;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
    links: string[];
}

// Admin Login Form Data
interface AdminLoginFormData {
    email: string;
    password: string;
}

// Admin Register Form Data
interface AdminRegisterFormData {
    username: string;
    password: string;
}

export {
    CategoryFormData,
    QuestionFormData,
    AdminLoginFormData,
    AdminRegisterFormData,
};
