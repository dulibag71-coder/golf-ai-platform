'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export default function BentoCard({ children, className, title, subtitle, icon, onClick }: BentoCardProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClick}
            className={cn(
                "bento-card group flex flex-col gap-2",
                onClick && "cursor-pointer",
                className
            )}

        >
            {(title || icon) && (
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {icon && <span className="text-accent text-xl">{icon}</span>}
                        {title && <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted group-hover:text-accent transition-colors">{title}</h3>}
                    </div>
                </div>
            )}
            {subtitle && <p className="font-display text-2xl font-black tech-glow tracking-tighter italic">{subtitle}</p>}
            <div className="flex-1 mt-2">
                {children}
            </div>
            {/* Cyber Corner Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 right-2 w-[1px] h-3 bg-accent" />
                <div className="absolute top-2 right-2 h-[1px] w-3 bg-accent" />
            </div>
        </motion.div>
    );
}
