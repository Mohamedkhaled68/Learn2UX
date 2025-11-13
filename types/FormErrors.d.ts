// Category Form Errors
interface CategoryFormErrors {
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    textColor: string;
    borderColor: string;
    icon: string;
}

// Question Form Errors
interface QuestionFormErrors {
    categoryId: string;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
}

// Admin Login Form Errors
interface AdminLoginFormErrors {
    email: string;
    password: string;
}

// Admin Register Form Errors
interface AdminRegisterFormErrors {
    username: string;
    password: string;
}

export {
    CategoryFormErrors,
    QuestionFormErrors,
    AdminLoginFormErrors,
    AdminRegisterFormErrors,
};
