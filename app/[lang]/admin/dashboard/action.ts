"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
    const supabase = await createClient();

    const titleEn = formData.get("titleEn") as string;
    const titleAr = formData.get("titleAr") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const descriptionAr = formData.get("descriptionAr") as string;
    const textColor = formData.get("textColor") as string;
    const borderColor = formData.get("borderColor") as string;
    const icon = formData.get("icon") as File | null;
    const iconType = formData.get("iconType") as string;

    // Validate required fields
    if (!titleEn || !titleAr || !descriptionEn || !descriptionAr) {
        return { error: "All fields are required" };
    }

    try {
        let iconData = null;

        // Handle icon upload if provided
        if (icon) {
            const buffer = await icon.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);
            iconData = uint8Array;
        }

        const { data, error } = await supabase
            .from("categories_with_count")
            .insert({
                title_en: titleEn,
                title_ar: titleAr,
                description_en: descriptionEn,
                description_ar: descriptionAr,
                text_color: textColor,
                border_color: borderColor,
                icon: icon
                    ? Array.from(new Uint8Array(await icon.arrayBuffer()))
                          .map((b) => String.fromCharCode(b))
                          .join("")
                    : null,
                icon_type: iconType,
            })
            .select();

        if (error) {
            return { error: error.message };
        }

        revalidatePath("/admin/dashboard");
        return { success: true, data };
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
        };
    }
}
