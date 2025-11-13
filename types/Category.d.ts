interface Category {
    _id: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    questionNumber: number;
    textColor: string;
    borderColor: string;
    icon: string;
    iconType: "svg" | "png";
    createdAt: string;
    updatedAt: string;
}
export { Category };
