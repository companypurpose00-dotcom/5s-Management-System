'use client';

import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border shadow-card backdrop-blur-xl',
              toast.variant === 'destructive'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-card border-border text-foreground'
            )}
          >
            <div className="flex-1">
              {toast.title && <div className="font-semibold text-sm">{toast.title}</div>}
              {toast.description && <div className="text-xs text-muted-foreground mt-0.5">{toast.description}</div>}
            </div>
            <button onClick={() => dismiss(toast.id)} className="p-0.5 hover:opacity-70 transition-opacity flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
