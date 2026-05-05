"use client";
import { motion, Variants } from 'framer-motion';
import React from 'react';
import { cn } from '../../lib/utils';

type TextEffectPreset = 'slide' | 'fade' | 'blur' | 'scale';

interface TextEffectProps {
  children: string;
  per?: 'word' | 'char';
  as?: keyof React.JSX.IntrinsicElements;
  preset?: TextEffectPreset;
  className?: string;
  containerClassName?: string;
  variant?: {
    container?: Variants;
    item?: Variants;
  };
  speedReveal?: number;
  speedSegment?: number;
  delay?: number;
}

const defaultPresets: Record<TextEffectPreset, { container: Variants; item: Variants }> = {
  fade: {
    container: { visible: { transition: { staggerChildren: 0.05 } } },
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  },
  slide: {
    container: { 
      visible: { transition: { staggerChildren: 0.08 } } 
    },
    item: { 
      // CAMBIO AQUÍ: Usamos x para movimiento horizontal
      hidden: { opacity: 0, x: -25 }, 
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { type: "spring", damping: 15, stiffness: 100 } // Movimiento más fluido
      },
    },
  },
  blur: {
    container: { visible: { transition: { staggerChildren: 0.05 } } },
    item: { hidden: { opacity: 0, filter: 'blur(10px)' }, visible: { opacity: 1, filter: 'blur(0px)' } },
  },
  scale: {
    container: { visible: { transition: { staggerChildren: 0.05 } } },
    item: { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } },
  },
};

type VariantTransition = {
  staggerChildren?: number;
  delayChildren?: number;
  [key: string]: unknown;
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  preset = 'fade',
  className,
  containerClassName,
  variant,
  speedReveal,
  speedSegment,
  delay = 0,
}: TextEffectProps) {
  const segments = per === 'word' ? children.split(/(\s+)/) : children.split('');
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.p;
  const selectedVariant = variant || defaultPresets[preset];

  // 2. Corregimos el error de ESLint eliminando los 'any'
  const containerVariants: Variants = {
    hidden: selectedVariant.container?.hidden || {},
    visible: {
      ...selectedVariant.container?.visible,
      transition: {
        // Accedemos de forma segura a la transición tratándola como nuestro tipo definido
        ...(selectedVariant.container?.visible as { transition?: VariantTransition })?.transition,
        staggerChildren: speedReveal ?? (selectedVariant.container?.visible as { transition?: VariantTransition })?.transition?.staggerChildren,
        delayChildren: delay,
      },
    },
  };

  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      aria-label={children}
      variants={containerVariants}
      className={cn('inline-block', containerClassName)}
    >
      {segments.map((segment, i) => (
        <motion.span
          key={`${segment}-${i}`}
          variants={selectedVariant.item}
          className={cn('inline-block whitespace-pre', className)}
          transition={{
            duration: speedSegment ?? 0.3,
          }}
        >
          {segment}
        </motion.span>
      ))}
    </MotionTag>
  );
}