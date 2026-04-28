"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Question } from "@/types/Question";

export const useGetQuestions = (categoryId?: string) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const supabase = createClient();

                let query = supabase
                    .from("questions")
                    .select("*")
                    .order("created_at", { ascending: false });

                // Filter by category if provided
                if (categoryId) {
                    query = query.eq("category_id", categoryId);
                }

                const { data, error: fetchError } = await query;

                if (fetchError) {
                    setError(fetchError.message);
                    setQuestions([]);
                } else {
                    setQuestions(data || []);
                    setError(null);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load questions",
                );
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [categoryId]); // re-fetches when categoryId changes

    return { questions, loading, error };
};
