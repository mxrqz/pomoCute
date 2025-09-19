"use client"

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export function MotionWrapper({ children, className = "", animate = true, delay = 0 }: MotionWrapperProps) {
  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export function SlideIn({ children, className = "", direction = 'up', delay = 0 }: SlideInProps) {
  const variants = {
    left: { x: -50 },
    right: { x: 50 },
    up: { y: 50 },
    down: { y: -50 }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...variants[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {children}
    </motion.div>
  );
}

interface PulseProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export function Pulse({ children, className = "", isActive = false }: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={isActive ? {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      } : {}}
      transition={{
        duration: 2,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleProps {
  children: React.ReactNode;
  className?: string;
  isPressed?: boolean;
}

export function Scale({ children, className = "", isPressed = false }: ScaleProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

interface CountdownAnimationProps {
  children: React.ReactNode;
  className?: string;
  timeLeft: number;
  totalTime: number;
  role?: string;
  'aria-live'?: "off" | "assertive" | "polite";
  'aria-label'?: string;
}

export function CountdownAnimation({ children, className = "", timeLeft, totalTime, ...props }: CountdownAnimationProps) {
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <motion.div
      className={className}
      animate={{
        borderColor: timeLeft <= 60 ? ["#ef4444", "#f97316", "#ef4444"] : "#6b7280",
      }}
      transition={{
        duration: timeLeft <= 60 ? 1 : 0,
        repeat: timeLeft <= 60 ? Infinity : 0,
        ease: "easeInOut"
      }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {children}
    </motion.div>
  );
}

interface FloatingNotificationProps {
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}

export function FloatingNotification({ children, isVisible, className = "" }: FloatingNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-4 right-4 z-50 ${className}`}
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}