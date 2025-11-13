"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { PageTransitionProps } from "@/types/ComponentProps";

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
        // <AnimatePresence initial={false}>
        <motion.div
            key={pathname}
            variants={variants}
            initial="hidden"
            animate="enter"
            // exit="exit"
            transition={{
                type: "spring",
                stiffness: 50,
                damping: 10,
                duration: 0.5,
            }}
            // className="absolute w-full h-full"
        >
            {children}
        </motion.div>
        // </AnimatePresence>
    );
}
