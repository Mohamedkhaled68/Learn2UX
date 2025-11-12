"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

const variants = {
    hidden: {
        opacity: 0,
        x: -200,
        y: 0,
    },
    enter: {
        opacity: 1,
        x: 0,
        y: 0,
    },
    exit: {
        opacity: 0,
        x: 200,
        y: 0,
    },
};

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.5,
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
