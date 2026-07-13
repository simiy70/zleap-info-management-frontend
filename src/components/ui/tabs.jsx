import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/utils';

const TabsContext = createContext({ value: '', onValueChange: () => {} });

function Tabs({ value, onValueChange, className, children }) {
  return <TabsContext.Provider value={{ value, onValueChange }}><div className={className}>{children}</div></TabsContext.Provider>;
}

const TabsList = ({ className, ...props }) => (
  <div className={cn('glass-soft inline-flex items-center justify-center gap-1 rounded-full p-1 text-muted-foreground', className)} {...props} />
);

function TabsTrigger({ value: v, className, badge, children, ...props }) {
  const { value, onValueChange } = useContext(TabsContext);
  const active = value === v;
  return <button
    onClick={() => onValueChange?.(v)}
    className={cn(
      'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all',
      active ? 'bg-white font-semibold text-foreground shadow-sm' : 'hover:text-foreground',
      className,
    )}
    {...props}
  >
    {children}
    {badge > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{badge}</span>}
  </button>;
}

function TabsContent({ value: v, className, children }) {
  const { value } = useContext(TabsContext);
  if (value !== v) return null;
  return <div className={className}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
