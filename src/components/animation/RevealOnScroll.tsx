'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export default function RevealOnScroll({
  children,
  delay = 0,
  y = 26,
  className,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: reduceMotion ? 0.35 : 0.65, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
