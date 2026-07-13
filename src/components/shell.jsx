import React from 'react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';

/* ── 页面外壳：高科技渐变底 + 光斑；variant 切换网点光晕背景 ── */
const shellVariants = {
  default: 'app-bg',
  desktop: 'app-bg-desktop', // 底部橙色光弧 + 半调网点
  feed: 'app-bg-feed',       // 右上蓝光 + 左侧暖黄 + 半调网点
};

export function PageShell({ className, variant = 'default', children }) {
  return <div className={cn(shellVariants[variant] || shellVariants.default, 'min-h-screen text-foreground', className)}>{children}</div>;
}

/* ── 顶栏（磨玻璃、吸顶） ── */
export function GlassHeader({ title, user = 'Zhang Wei', plan = '企业版' }) {
  return <header className="glass-strong sticky top-0 z-30 flex h-14 items-center justify-between border-x-0 border-t-0 px-6">
    <div className="flex items-center gap-2.5">
      <span className="text-xl font-bold tracking-tight">zleap</span>
      <span className="rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border/60">Beta</span>
      {title && <span className="ml-1 text-sm font-semibold text-muted-foreground">{title}</span>}
    </div>
    <div className="flex items-center gap-4 text-[20px] text-muted-foreground">
      <button className="transition hover:text-foreground" title="搜索" aria-label="搜索"><i className="ri-search-line" /></button>
      <button className="relative transition hover:text-foreground" title="通知" aria-label="通知"><i className="ri-notification-3-line" /><span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-rose-500" /></button>
      <button className="transition hover:text-foreground" title="帮助" aria-label="帮助"><i className="ri-question-line" /></button>
      <div className="ml-1 flex items-center gap-2.5">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium leading-tight text-foreground">{user}</div>
          <div className="text-[11px] leading-tight text-muted-foreground">{plan}</div>
        </div>
        <Avatar className="h-8 w-8"><AvatarFallback>{user.slice(0, 1)}</AvatarFallback></Avatar>
      </div>
    </div>
  </header>;
}

/* ── 底部 Dock（磨玻璃） ── */
const dockItems = [
  ['desktop', '桌面', 'ri-home-5-line', 'bg-orange-100', 'text-orange-500'],
  ['sources', '信息源', 'ri-database-2-line', 'bg-violet-100', 'text-violet-600'],
  ['assistant', '助手', 'ri-chat-smile-2-line', 'bg-emerald-100', 'text-emerald-600'],
  ['tasks', '任务', 'ri-task-line', 'bg-blue-100', 'text-blue-600'],
  ['feed', '动态', 'ri-rss-line', 'bg-rose-100', 'text-rose-500'],
];

export function GlassDock({ active, onNavigate }) {
  return <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center">
    <nav className="glass pointer-events-auto flex items-end gap-1 rounded-3xl px-3 py-2.5 shadow-xl shadow-slate-900/10">
      {dockItems.map(([id, label, icon, bg, color]) => <button key={id} onClick={() => onNavigate?.(id)} title={label}
        className={cn('group flex w-16 flex-col items-center gap-1 rounded-2xl px-1.5 py-1.5 transition', id === active ? 'bg-white/80' : 'hover:bg-white/50')}>
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-[14px] text-[23px] transition-transform group-hover:scale-[1.06] group-active:scale-95', bg, color)}><i className={icon} /></span>
        <span className={cn('text-[11px] leading-none', id === active ? 'font-medium text-foreground' : 'text-muted-foreground')}>{label}</span>
      </button>)}
    </nav>
  </div>;
}
