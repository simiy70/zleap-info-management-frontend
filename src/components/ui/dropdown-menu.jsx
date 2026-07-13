import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

const MenuContext = createContext({ open: false, setOpen: () => {} });

function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  return <MenuContext.Provider value={{ open, setOpen }}><div className="relative inline-block">{children}</div></MenuContext.Provider>;
}

function DropdownMenuTrigger({ children }) {
  const { open, setOpen } = useContext(MenuContext);
  return React.cloneElement(React.Children.only(children), {
    onClick: e => { e.stopPropagation(); children.props.onClick?.(e); setOpen(!open); },
    'aria-expanded': open,
  });
}

function DropdownMenuContent({ className, align = 'end', children }) {
  const { open, setOpen } = useContext(MenuContext);
  if (!open) return null;
  return <>
    <button className="fixed inset-0 z-30 cursor-default" onClick={e => { e.stopPropagation(); setOpen(false); }} aria-label="关闭菜单" tabIndex={-1} />
    <div className={cn(
      'glass-strong absolute z-40 mt-1.5 min-w-[9rem] overflow-hidden rounded-xl p-1 shadow-xl',
      align === 'end' ? 'right-0' : 'left-0',
      className,
    )}>{children}</div>
  </>;
}

function DropdownMenuItem({ className, onClick, children, ...props }) {
  const { setOpen } = useContext(MenuContext);
  return <button
    onClick={e => { e.stopPropagation(); onClick?.(e); setOpen(false); }}
    className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-muted/80', className)}
    {...props}
  >{children}</button>;
}

const DropdownMenuSeparator = ({ className }) => <div className={cn('mx-1 my-1 h-px bg-border', className)} />;

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator };
