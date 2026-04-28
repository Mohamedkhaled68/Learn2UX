"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/Category";

export const useGetCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const supabase = createClient();
                const { data, error: fetchError } = await supabase
                    .from("categories_with_count")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (fetchError) {
                    setError(fetchError.message);
                    setCategories([]);
                } else {
                    setCategories(data || []);
                    setError(null);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load categories",
                );
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};
