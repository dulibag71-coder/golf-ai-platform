'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedButton({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: AnimatedButtonProps) {
    const variants = {
        primary: "bg-accent text-black hover:bg-white shadow-[0_0_15px_var(--accent-glow)]",
        outline: "border border-accent text-accent hover:bg-accent/10 focus:ring-1 focus:ring-accent",
        ghost: "text-muted hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-[10px]",
        md: "px-6 py-2.5 text-xs",
        lg: "px-8 py-3.5 text-sm"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "font-mono uppercase tracking-widest rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...(props as any)}
        >
            {children}
        </motion.button>
    );
}
