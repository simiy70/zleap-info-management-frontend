import React, { createContext, useContext, useEffect } from 'react';
import { cn } from '../../lib/utils';

const DialogContext = createContext({ open: false, onOpenChange: () => {} });

function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onOpenChange?.(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);
  if (!open) return null;
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

function DialogContent({ className, children, ...props }) {
  const { onOpenChange } = useContext(DialogContext);
  return <div className="fixed inset-0 z-50">
    <button aria-label="关闭弹窗" onClick={() => onOpenChange?.(false)} className="overlay-in absolute inset-0 cursor-default bg-slate-900/30 backdrop-blur-sm" />
    <div className={cn('dialog-in glass-strong fixed left-1/2 top-1/2 z-50 w-[520px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 shadow-2xl', className)} {...props}>
      {children}
      <button onClick={() => onOpenChange?.(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="关闭">
        <i className="ri-close-line text-xl" />
      </button>
    </div>
  </div>;
}

const DialogHeader = ({ className, ...props }) => <div className={cn('mb-4 flex flex-col space-y-1.5 pr-8', className)} {...props} />;
const DialogTitle = ({ className, ...props }) => <h2 className={cn('text-base font-semibold leading-none tracking-tight', className)} {...props} />;
const DialogDescription = ({ className, ...props }) => <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
const DialogFooter = ({ className, ...props }) => <div className={cn('mt-5 flex justify-end gap-2', className)} {...props} />;

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
