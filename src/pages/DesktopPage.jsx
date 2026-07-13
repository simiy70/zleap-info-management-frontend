import React, { useEffect, useRef, useState } from 'react';

const dockItems = [
  { id: 'desktop', label: '桌面', icon: 'ri-home-5-line', bg: 'bg-orange-100', color: 'text-orange-500' },
  { id: 'sources', label: '信息源', icon: 'ri-database-2-line', bg: 'bg-violet-100', color: 'text-violet-600' },
  { id: 'assistant', label: '助手', icon: 'ri-chat-smile-2-line', bg: 'bg-emerald-100', color: 'text-emerald-600' },
  { id: 'tasks', label: '任务', icon: 'ri-task-line', bg: 'bg-blue-100', color: 'text-blue-600' },
  { id: 'feed', label: '动态', icon: 'ri-rss-line', bg: 'bg-rose-100', color: 'text-rose-500' },
];

const runningTasks = [
  { name: '竞品周报生成', sources: '竞品信息源 · 行业动态 · GitHub', agent: 'Claude Code', icon: '竞', iconClass: 'bg-orange-500', progress: 72, time: '18 分钟', bar: 'bg-orange-400' },
  { name: '市场调研分析', sources: '市场信息源 · 用户反馈 · 新闻RSS', agent: '调研分析助手', icon: '市', iconClass: 'bg-indigo-400', progress: 45, time: '32 分钟', bar: 'bg-violet-500' },
];

const insights = [
  { time: '09:30', title: 'OpenAI 发布 GPT-4.1 模型', desc: '新模型在长上下文和代码能力上有显著提升，可能影响我们的产品路线。', tag: 'AI 行业动态', tone: 'orange', icon: 'ri-code-s-slash-line' },
  { time: '08:15', title: '竞品 A 上线新功能', desc: '新增 AI 数据分析模块、定价策略调整，建议关注用户反馈。', tag: '竞品动态', tone: 'green', icon: 'ri-line-chart-line' },
  { time: '昨天\n18:45', title: '用户反馈：希望增加导出功能', desc: '来自 23 位用户的相似反馈，建议优先级提升。', tag: '用户反馈', tone: 'blue', icon: 'ri-inbox-archive-line' },
  { time: '昨天\n16:20', title: '市场调研报告生成完成', desc: '《2024 AI 工具市场调研报告》已生成，请查看结果。', tag: '任务完成', tone: 'violet', icon: 'ri-file-chart-line' },
];

const agents = [
  { name: 'Claude Code', meta: '今日完成 3 个任务', tag: '代码开发', icon: 'CC', tone: 'bg-emerald-500', state: '运行中', stateClass: 'text-emerald-600', dot: 'bg-emerald-500' },
  { name: '调研分析助手', meta: '今日完成 2 个任务', tag: '数据分析', icon: '研', tone: 'bg-violet-500', state: '运行中', stateClass: 'text-emerald-600', dot: 'bg-emerald-500' },
  { name: '内容生成助手', meta: '今日完成 5 个任务', tag: '内容创作', icon: '文', tone: 'bg-blue-500', state: '空闲', stateClass: 'text-neutral-500', dot: 'bg-orange-400' },
  { name: '客服助手', meta: '今日完成 12 个任务', tag: '客户服务', icon: '客', tone: 'bg-orange-400', state: '离线', stateClass: 'text-neutral-400', dot: 'bg-neutral-300' },
];

const sourceIssues = [
  { name: 'GitHub 仓库', status: '同步失败', note: '2 小时前停止更新', icon: 'ri-github-fill', tone: 'bg-neutral-900', statusClass: 'bg-red-50 text-red-500', action: '查看详情' },
  { name: '行业 RSS 源', status: '部分失败', note: '30 分钟前部分内容同步失败', icon: 'ri-rss-fill', tone: 'bg-orange-500', statusClass: 'bg-orange-50 text-orange-500', action: '查看详情' },
  { name: '客户数据库', status: '待配置', note: '需要重新配置连接信息', icon: 'ri-database-2-fill', tone: 'bg-emerald-500', statusClass: 'bg-blue-50 text-blue-500', action: '去配置' },
];

const toneClasses = {
  orange: ['bg-orange-100 text-orange-500', 'bg-orange-50 text-orange-500', 'bg-orange-400'],
  green: ['bg-emerald-100 text-emerald-600', 'bg-emerald-50 text-emerald-600', 'bg-emerald-400'],
  blue: ['bg-blue-100 text-blue-500', 'bg-blue-50 text-blue-500', 'bg-blue-400'],
  violet: ['bg-violet-100 text-violet-500', 'bg-violet-50 text-violet-500', 'bg-violet-400'],
};

const quickPrompts = ['帮我盯竞品动态', '总结这周的信息源', '派个活给 Claude Code', '上传资料建信息源'];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

function Header() {
  return <header className="flex h-14 items-center justify-between border-b border-neutral-200/70 bg-white px-6">
    <div className="flex items-center gap-3"><span className="text-xl font-bold italic tracking-tight">zleap</span><span className="rounded-md border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-500">Beta</span><span className="text-sm font-semibold text-slate-600">桌面</span></div>
    <div className="flex items-center gap-4 text-lg text-slate-500"><button className="transition hover:text-slate-900" title="搜索" aria-label="搜索"><i className="ri-search-line" /></button><button className="relative transition hover:text-slate-900" title="通知" aria-label="通知"><i className="ri-notification-3-line" /><span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-red-500" /></button><button className="transition hover:text-slate-900" title="帮助" aria-label="帮助"><i className="ri-question-line" /></button><button className="transition hover:text-slate-900" title="设置" aria-label="设置"><i className="ri-sun-line" /></button><div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white">Z</div></div>
  </header>;
}

function Hero({ onNavigate }) {
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = event => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) { event.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const send = () => {
    const text = prompt.trim();
    if (!text) return;
    onNavigate('assistant', { prompt: text });
  };

  const pickPrompt = text => { setPrompt(text); inputRef.current?.focus(); };
  const canSend = Boolean(prompt.trim());

  return <section className="fade-in-up mx-auto max-w-[760px] text-center">
    <h1 className="text-2xl font-bold tracking-tight text-slate-800">{greeting()}，今天想让 Agent 做点什么？</h1>
    <div className="mt-5 flex h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] transition focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-400 text-xs font-bold text-white">Z</span>
      <input ref={inputRef} value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) send(); }} className="min-w-0 flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="问任何问题，或直接布置任务 —— 超级助手会调度合适的 Agent 完成" />
      <button onClick={send} disabled={!canSend} aria-label="发送" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition ${canSend ? 'bg-orange-500 hover:bg-orange-600 active:scale-95' : 'cursor-not-allowed bg-slate-200'}`}><i className="ri-arrow-right-line" /></button>
    </div>
    <div className="mt-3 flex flex-wrap justify-center gap-2">{quickPrompts.map(text => <button key={text} onClick={() => pickPrompt(text)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-orange-200 hover:text-orange-500">{text}</button>)}</div>
  </section>;
}

function CardShell({ title, count, action, onAction, live, children, footer }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.09)]">
    <header className="flex h-14 items-center justify-between border-b border-slate-100 px-5"><div className="flex items-center gap-2 text-base font-semibold text-slate-800">{title}{live && <span className="breathe h-2 w-2 rounded-full bg-emerald-500" />}{count && <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-500">{count}</span>}</div>{action && <button onClick={onAction} className="text-sm text-slate-500 transition hover:text-orange-500">{action} <i className="ri-arrow-right-s-line" /></button>}</header>
    {children}
    {footer && <footer className="flex h-12 items-center justify-between border-t border-slate-100 px-5 text-xs text-slate-400">{footer}</footer>}
  </section>;
}

function RunningCard({ onNavigate }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setReady(true), 150); return () => clearTimeout(timer); }, []);
  return <CardShell title="正在运行" count="2" live action="全部任务" onAction={() => onNavigate('tasks')} footer={<><span><i className="ri-loader-4-line mr-2" />共 2 个任务运行中</span><span>最近更新：2 分钟前 <i className="ri-refresh-line ml-1" /></span></>}>
    <div>{runningTasks.map((task, index) => <button key={task.name} onClick={() => onNavigate('tasks')} className={`w-full px-5 py-4 text-left transition hover:bg-slate-50 ${index ? 'border-t border-slate-100' : ''}`}>
      <div className="flex gap-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${task.iconClass}`}>{task.icon}</div><div className="min-w-0 flex-1"><div className="font-semibold text-slate-800">{task.name}</div><div className="mt-1 truncate text-xs text-slate-400">{task.sources}</div><div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[9px] font-bold text-white">{task.agent === 'Claude Code' ? 'CC' : '研'}</span>{task.agent}</div><div className="mt-3 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-[width] duration-700 ease-out ${task.bar}`} style={{ width: ready ? `${task.progress}%` : '0%' }} /></div><strong className="w-9 text-xs text-slate-700">{task.progress}%</strong></div></div><div className="shrink-0 text-right text-xs text-slate-400"><div>预计剩余</div><strong className="mt-1 block text-sm text-slate-700">{task.time}</strong></div></div>
    </button>)}</div>
  </CardShell>;
}

function InsightCard({ onNavigate }) {
  return <CardShell title="今日洞察" count="8" action="全部事项" onAction={() => onNavigate('sources')} footer={<><span /><button onClick={() => onNavigate('sources')} className="mx-auto text-sm text-slate-500 transition hover:text-orange-500">查看全部洞察 <i className="ri-arrow-right-s-line" /></button><span /></>}>
    <div className="relative px-5 py-3 before:absolute before:bottom-3 before:left-[74px] before:top-3 before:w-px before:bg-slate-100">{insights.map(item => { const [iconClass, tagClass, dotClass] = toneClasses[item.tone]; return <div key={item.title} className="relative flex min-h-[66px] gap-4 rounded-xl py-2 pr-2 transition hover:bg-slate-50"><div className="w-12 whitespace-pre-line text-right text-xs leading-4 text-slate-400">{item.time}</div><span className={`relative z-10 mt-3 h-2 w-2 shrink-0 rounded-full ring-4 ring-white ${dotClass}`} /><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}><i className={item.icon} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-slate-800">{item.title}</strong><span className={`rounded-md px-2 py-0.5 text-[10px] ${tagClass}`}>{item.tag}</span></div><p className="line-clamp-2 mt-1 text-xs leading-5 text-slate-400">{item.desc}</p></div></div> })}</div>
  </CardShell>;
}

function AgentCard({ onNavigate }) {
  return <CardShell title="我的 Agent" count="5" action="管理 Agent" onAction={() => onNavigate('assistant')}>
    <div>{agents.map(agent => <button key={agent.name} onClick={() => onNavigate('assistant')} className="flex h-[58px] w-full items-center gap-3 border-b border-slate-100 px-5 text-left transition last:border-0 hover:bg-slate-50"><span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white ${agent.tone}`}>{agent.icon}</span><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><strong className="text-sm text-slate-800">{agent.name}</strong><span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">{agent.tag}</span></span><span className="mt-0.5 block text-xs text-slate-400">{agent.meta}</span></span><span className={`flex items-center gap-2 text-xs ${agent.stateClass}`}><i className={`h-2 w-2 rounded-full ${agent.dot}`} />{agent.state}</span><i className="ri-arrow-right-s-line text-slate-300" /></button>)}</div>
  </CardShell>;
}

function SourceCard({ onNavigate }) {
  return <CardShell title="信息源状态" count="12" action="管理信息源" onAction={() => onNavigate('sources')} footer={<><span /><span>最近更新：2 分钟前 <i className="ri-refresh-line ml-1" /></span></>}>
    <div className="grid grid-cols-4 gap-2 px-5 py-4"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition hover:bg-emerald-100/70"><strong className="text-lg">10</strong><div className="mt-1 text-xs"><i className="ri-checkbox-circle-fill mr-1" />正常</div></div><div className="rounded-xl bg-orange-50 p-3 text-orange-500 transition hover:bg-orange-100/70"><strong className="text-lg">1</strong><div className="mt-1 text-xs"><i className="ri-error-warning-fill mr-1" />异常</div></div><div className="rounded-xl bg-blue-50 p-3 text-blue-500 transition hover:bg-blue-100/70"><strong className="text-lg">1</strong><div className="mt-1 text-xs"><i className="ri-time-fill mr-1" />待配置</div></div><div className="rounded-xl bg-slate-50 p-3 text-slate-500 transition hover:bg-slate-100"><strong className="text-lg">0</strong><div className="mt-1 text-xs"><i className="ri-indeterminate-circle-fill mr-1" />已停用</div></div></div>
    <div className="flex items-center justify-between border-y border-slate-100 px-5 py-2 text-xs font-medium text-slate-600"><span>异常信息源</span><button onClick={() => onNavigate('sources')} className="text-slate-400 transition hover:text-orange-500">查看全部</button></div>
    <div>{sourceIssues.map(source => <div key={source.name} className="flex h-[54px] items-center gap-3 border-b border-slate-100 px-5 transition last:border-0 hover:bg-slate-50"><span className={`flex h-7 w-7 items-center justify-center rounded-lg text-white ${source.tone}`}><i className={source.icon} /></span><strong className="text-sm text-slate-700">{source.name}</strong><span className={`rounded-md px-2 py-0.5 text-[10px] ${source.statusClass}`}>{source.status}</span><span className="ml-auto text-xs text-slate-400">{source.note}</span><button onClick={() => onNavigate('sources')} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-500 transition hover:border-orange-200 hover:text-orange-500">{source.action}</button></div>)}</div>
  </CardShell>;
}

function Dock({ onNavigate }) {
  return <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center"><nav className="pointer-events-auto flex items-end gap-1 rounded-3xl border border-white/70 bg-white/70 px-3 py-2.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl">{dockItems.map(item => <button key={item.id} onClick={() => onNavigate(item.id)} title={item.label} className={`group flex w-16 flex-col items-center gap-1 rounded-2xl px-1.5 py-1.5 transition ${item.id === 'desktop' ? 'bg-white' : 'hover:bg-white/70'}`}><span className={`relative flex h-11 w-11 items-center justify-center rounded-[14px] text-[23px] transition-transform group-hover:scale-[1.06] group-active:scale-95 ${item.bg} ${item.color}`}><i className={item.icon} /></span><span className={`text-[11px] ${item.id === 'desktop' ? 'font-medium text-slate-800' : 'text-slate-500'}`}>{item.label}</span></button>)}</nav></div>;
}

export default function DesktopPage({ onNavigate }) {
  return <div className="min-h-screen bg-[#f8fafc] text-slate-900" style={{ backgroundImage: 'radial-gradient(#dce3eb 0.8px, transparent 0.8px)', backgroundSize: '22px 22px' }}><Header /><main className="mx-auto max-w-[1280px] px-8 pb-32 pt-8"><Hero onNavigate={onNavigate} /><div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">{[RunningCard, InsightCard, AgentCard, SourceCard].map((Card, index) => <div key={index} className="fade-in-up" style={{ animationDelay: `${0.08 * (index + 1)}s` }}><Card onNavigate={onNavigate} /></div>)}</div></main><Dock onNavigate={onNavigate} /></div>;
}
