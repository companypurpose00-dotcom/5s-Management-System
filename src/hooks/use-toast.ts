import { useState, useCallback, useEffect } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

function setToasts(toasts: Toast[]) {
  currentToasts = toasts;
  toastListeners.forEach(listener => listener(toasts));
}

export function toast({ title, description, variant = 'default' }: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = { id, title, description, variant };
  setToasts([...currentToasts, newToast]);
  setTimeout(() => {
    setToasts(currentToasts.filter(t => t.id !== id));
  }, 4000);
  return { id, dismiss: () => setToasts(currentToasts.filter(t => t.id !== id)) };
}

export function useToast() {
  const [toasts, setLocalToasts] = useState<Toast[]>(currentToasts);

  useEffect(() => {
    const listener = (t: Toast[]) => setLocalToasts([...t]);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(currentToasts.filter(t => t.id !== id));
  }, []);

  return { toasts, dismiss, toast };
}
