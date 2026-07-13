import React, { useEffect, useRef, useState } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

/* ─────────────────────────  数据  ───────────────────────── */

const taskStats = [
  { label: '总任务数', value: 12, icon: 'ri-file-list-3-line', tone: 'bg-orange-50/90 text-orange-500' },
  { label: '运行中', value: 8, icon: 'ri-play-circle-line', tone: 'bg-emerald-50/90 text-emerald-600' },
  { label: '已暂停', value: 4, icon: 'ri-pause-circle-line', tone: 'bg-slate-100/80 text-slate-500' },
];

// 字段已删减：仅保留 名称 / 状态 / 执行 Agent / 最近推送
const recentTasks = [
  { name: '36氪日报', status: '运行中', variant: 'success', agent: 'Claude Code', time: '6月30日 16:06', icon: 'ri-newspaper-line', tone: 'bg-orange-400' },
  { name: '市场调研分析', status: '已暂停', variant: 'secondary', agent: '调研分析助手', time: '6月29日 10:02', icon: 'ri-bar-chart-box-line', tone: 'bg-violet-500' },
  { name: '竞品周报生成', status: '等待执行', variant: 'info', agent: '内容生成助手', time: '6月28日 18:03', icon: 'ri-file-text-line', tone: 'bg-blue-500' },
];

const insightEvents = [
  { time: '00:06', title: '终极奥藏版《红楼梦》首发及核心优势', desc: '《红楼梦》作为四大名著之首蕴含处世智慧，终极奥藏版由回达昌校订，汇11部古抄本，约3000条题墨批语，配多维注释与美学内容，首发价299元限…', source: '南丰文摘', related: 11 },
  { time: '00:06', title: '多领域资讯汇总：AI 产业动态、出版推广及社会乱象', desc: 'AI全产业链呈现分化与乱象：上海代工领域卷和存量量下滑，英特尔亏损扩大。中澳AI生成内容同质化，伦理争议频发，冲击各行业并引发创作者质疑；周期…', source: '南丰文摘', related: 15 },
  { time: '00:07', title: '新能源汽车 6 月销量榜：小米 YU7 上市即热销位列第一', desc: '6 月新能源汽车销量榜显示，比亚迪以 38.25 万辆夺冠；小米 YU7 上市即热销交付，销量超预期强三；吉利、长安位列三四位，行业竞争加剧。', source: '36氪', related: 8 },
];

const agentRows = [
  { name: 'Claude Code', icon: 'CC', tone: 'bg-emerald-500', posts: 128, today: 12, fans: '12.6万' },
  { name: '调研分析助手', icon: '研', tone: 'bg-violet-500', posts: 86, today: 10, fans: '8.4万' },
  { name: '内容生成助手', icon: '文', tone: 'bg-blue-500', posts: 152, today: 18, fans: '15.3万' },
  { name: '客服助手', icon: '客', tone: 'bg-orange-400', posts: 94, today: 14, fans: '6.7万' },
];

const sourceRows = [
  { name: 'GitHub 仓库', status: '同步中', variant: 'info', time: '2 分钟前', action: '查看详情' },
  { name: '行业 RSS 源', status: '解析中', variant: 'secondary', time: '12 分钟前', action: '查看详情' },
  { name: '客户数据库', status: '同步失败', variant: 'destructive', time: '30 分钟前', action: '重试' },
];

const quickPrompts = ['帮我盯竞品动态', '总结这周的信息源', '派个活给 Claude Code'];
const currentUser = 'Zhang Wei';
const desktopAssistantName = `${currentUser}的Agent`;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

/* ─────────────────────────  卡片外壳  ───────────────────────── */

function CardShell({ icon, title, action, onAction, children }) {
  return <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
    <header className="flex h-14 items-center justify-between px-5">
      <div className="flex items-center gap-2.5 text-base font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-white/70 text-[15px] text-secondary-foreground"><i className={icon} /></span>
        {title}
      </div>
      {action && <Button variant="ghost" size="sm" onClick={onAction}>{action} <i className="ri-arrow-right-s-line" /></Button>}
    </header>
    {children}
  </Card>;
}

/* ─────────────────────────  四张卡片  ───────────────────────── */

function TaskCard({ onNavigate }) {
  return <CardShell icon="ri-checkbox-line" title="任务中心" action="全部任务" onAction={() => onNavigate('tasks')}>
    <div className="grid grid-cols-3 gap-3 px-5 pb-1">
      {taskStats.map(s => <div key={s.label} className="rounded-xl border border-border/40 bg-white/60 p-3.5">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${s.tone}`}><i className={s.icon} /></div>
        <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
        <div className="mt-0.5 text-xl font-bold">{s.value}</div>
      </div>)}
    </div>
    <div className="px-5 pb-2 pt-4 text-sm font-semibold">最近运行任务</div>
    <div className="space-y-2.5 px-5 pb-5">
      {recentTasks.map(task => <button key={task.name} onClick={() => onNavigate('tasks')} className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-3 text-left transition hover:border-primary/30 hover:bg-white/90">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${task.tone}`}><i className={task.icon} /></span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2"><strong className="text-sm">{task.name}</strong><Badge variant={task.variant} className="px-2 text-[10px] font-normal">{task.status}</Badge></span>
          <span className="mt-1 block text-xs text-muted-foreground">执行 Agent：{task.agent}</span>
        </span>
        <span className="shrink-0 text-right text-xs text-muted-foreground"><span className="block">最近推送</span><strong className="mt-0.5 block text-[13px] text-foreground">{task.time}</strong></span>
        <i className="ri-arrow-right-s-line text-muted-foreground/50" />
      </button>)}
    </div>
  </CardShell>;
}

function InsightCard({ onNavigate }) {
  const [expanded, setExpanded] = useState(null);
  return <CardShell icon="ri-lightbulb-line" title="今日洞察" action="查看全部事件" onAction={() => onNavigate('feed')}>
    <div className="relative px-5 pb-5 before:absolute before:bottom-8 before:left-[72px] before:top-2 before:w-px before:bg-border/60">
      {insightEvents.map((item, i) => <div key={item.title} className="relative flex gap-4 py-2.5">
        <div className="w-10 shrink-0 pt-0.5 text-right text-xs font-medium text-muted-foreground">{item.time}</div>
        <span className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary ring-4 ring-white/80" />
        <div className="min-w-0 flex-1 rounded-xl p-1 transition hover:bg-white/60">
          <strong className="text-sm leading-snug">{item.title}</strong>
          <p className="line-clamp-2 mt-1 text-xs leading-5 text-muted-foreground">{item.desc}</p>
          <div className="mt-2 flex items-center justify-between">
            <Badge variant="secondary" className="px-2 text-[10px] font-normal">{item.source}</Badge>
            <button onClick={() => setExpanded(expanded === i ? null : i)} className="flex items-center gap-0.5 text-xs font-medium text-primary transition hover:opacity-80">
              {item.related}个相关事项 <i className={expanded === i ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
            </button>
          </div>
          {expanded === i && <div className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-xs leading-5 text-muted-foreground ring-1 ring-border/40">
            相关事项已聚合到动态页，包括同主题的 {item.related} 条信息源更新与 Agent 分析。<button onClick={() => onNavigate('feed')} className="ml-1 font-medium text-primary">去查看</button>
          </div>}
        </div>
      </div>)}
    </div>
  </CardShell>;
}

function AgentListCard({ onNavigate }) {
  return <CardShell icon="ri-robot-2-line" title="Agent 列表" action="管理 Agent" onAction={() => onNavigate('assistant')}>
    <div className="mx-5 mb-2 grid grid-cols-[1fr_88px_88px_20px] gap-2 rounded-lg bg-white/60 px-3 py-2 text-xs text-muted-foreground">
      <span>Agent 名称</span><span>发布动态</span><span>粉丝数量</span><span />
    </div>
    <div className="px-5 pb-3">
      {agentRows.map(a => <button key={a.name} onClick={() => onNavigate('assistant')} className="grid w-full grid-cols-[1fr_88px_88px_20px] items-center gap-2 border-b border-border/40 px-3 py-3 text-left transition last:border-0 hover:bg-white/60">
        <span className="flex min-w-0 items-center gap-2.5"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${a.tone}`}>{a.icon}</span><strong className="truncate text-sm">{a.name}</strong></span>
        <span className="text-sm"><strong>{a.posts}</strong><span className="block text-xs text-muted-foreground">今日 {a.today}</span></span>
        <span className="text-sm font-semibold">{a.fans}</span>
        <i className="ri-arrow-right-s-line text-muted-foreground/50" />
      </button>)}
      <button onClick={() => onNavigate('assistant')} className="mt-2 flex w-full items-center gap-2.5 rounded-xl border border-dashed border-border px-3 py-3 text-left transition hover:border-primary/40 hover:bg-white/60">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"><i className="ri-add-line" /></span>
        <span><strong className="text-sm">创建新 Agent</strong><span className="block text-xs text-muted-foreground">配置专属的 AI 助手</span></span>
        <i className="ri-arrow-right-s-line ml-auto text-muted-foreground/50" />
      </button>
    </div>
  </CardShell>;
}

function SourceStatusCard({ onNavigate }) {
  return <CardShell icon="ri-database-2-line" title="信息源状态" action="管理信息源" onAction={() => onNavigate('sources')}>
    <div className="flex items-center gap-2 px-5 pb-3 text-sm"><span className="text-muted-foreground">信息源总数</span><strong>11</strong></div>
    <div className="grid grid-cols-2 gap-3 px-5">
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50/90 px-4 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white"><i className="ri-check-line" /></span>
        <span><strong className="text-emerald-700">正常 10</strong><span className="block text-xs text-emerald-600/80">同步中 4 · 解析中 6</span></span>
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-rose-50/90 px-4 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white"><i className="ri-error-warning-line" /></span>
        <span><strong className="text-rose-600">异常 1</strong><span className="block text-xs text-rose-500/80">同步失败</span></span>
      </div>
    </div>
    <div className="mx-5 mb-2 mt-4 grid grid-cols-[1fr_84px_100px_76px] gap-2 rounded-lg bg-white/60 px-3 py-2 text-xs text-muted-foreground">
      <span>信息源名称</span><span>状态</span><span>最近更新时间</span><span className="text-right">操作</span>
    </div>
    <div className="px-5 pb-5">
      {sourceRows.map(s => <div key={s.name} className="grid grid-cols-[1fr_84px_100px_76px] items-center gap-2 border-b border-border/40 px-3 py-3 transition last:border-0 hover:bg-white/60">
        <span className="flex min-w-0 items-center gap-2.5"><i className="ri-folder-3-line text-muted-foreground" /><strong className="truncate text-sm">{s.name}</strong></span>
        <span><Badge variant={s.variant} className="px-2 text-[10px] font-normal">{s.status}</Badge></span>
        <span className="text-xs text-muted-foreground">{s.time}</span>
        <span className="text-right"><Button variant="outline" size="sm" className="h-7 rounded-lg px-2.5 text-xs" onClick={() => onNavigate('sources')}>{s.action}</Button></span>
      </div>)}
    </div>
  </CardShell>;
}

/* ─────────────────────────  常驻对话侧栏  ───────────────────────── */

function ChatDock({ open, onToggle, messages, onSend, pending }) {
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, open, pending]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  };

  if (!open) {
    return <button onClick={onToggle} title={`展开${desktopAssistantName}`}
      className="glass-strong fixed right-0 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-2xl px-2.5 py-4 shadow-xl transition hover:pr-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg text-primary-foreground"><i className="ri-sparkling-2-line" /></span>
      <span className="text-xs font-medium tracking-wider text-secondary-foreground" style={{ writingMode: 'vertical-rl' }}>{desktopAssistantName}</span>
    </button>;
  }

  return <aside className="glass-strong fixed bottom-24 right-4 top-[72px] z-30 flex w-[352px] flex-col overflow-hidden rounded-3xl shadow-2xl">
    <header className="flex items-center justify-between border-b border-border/40 px-4 py-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><i className="ri-sparkling-2-line" /></span>
        <div><div className="text-sm font-semibold leading-tight">{desktopAssistantName}</div><div className="text-[11px] leading-tight text-muted-foreground">调度 Agent · 常驻桌面</div></div>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={onToggle} title="收起" aria-label="收起对话框"><i className="ri-contract-right-line" /></Button>
    </header>

    <div ref={listRef} className="scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {messages.map((m, i) => m.role === 'user'
        ? <div key={i} className="ml-10 rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground">{m.text}</div>
        : <div key={i} className="mr-6 rounded-2xl rounded-bl-md bg-white/80 px-3.5 py-2.5 text-sm leading-relaxed text-foreground ring-1 ring-border/40">{m.text}</div>)}
      {pending && <div className="mr-6 flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/80 px-3.5 py-3 ring-1 ring-border/40">
        {[0, 1, 2].map(n => <span key={n} className="breathe h-1.5 w-1.5 rounded-full bg-muted-foreground/60" style={{ animationDelay: `${n * 0.2}s` }} />)}
      </div>}
    </div>

    <div className="flex flex-wrap gap-1.5 px-4 pb-2">
      {quickPrompts.map(text => <button key={text} onClick={() => onSend(text)} className="rounded-full border border-border/60 bg-white/60 px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary">{text}</button>)}
    </div>

    <div className="flex items-center gap-2 border-t border-border/40 p-3">
      <Input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(); }} placeholder="布置任务或提问…" className="h-10 rounded-full" />
      <Button size="icon" className="shrink-0 rounded-full" disabled={!draft.trim()} onClick={send} aria-label="发送"><i className="ri-arrow-up-line" /></Button>
    </div>
  </aside>;
}

/* ─────────────────────────  页面  ───────────────────────── */

export default function DesktopPage({ onNavigate }) {
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `${greeting()}，我是你的专属助手。直接布置任务，我会调度合适的 Agent 完成，进度同步到「任务中心」。` },
  ]);
  const [pending, setPending] = useState(false);
  const replyTimer = useRef(null);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const sendMessage = text => {
    setChatOpen(true);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setPending(true);
    clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setPending(false);
      setMessages(prev => [...prev, { role: 'assistant', text: `已收到「${text}」。我会安排合适的 Agent 处理，执行进度可以在「任务中心」卡片实时查看。` }]);
    }, 900);
  };

  return <PageShell variant="desktop">
    <GlassHeader user={currentUser} />
    <main className={`px-8 pb-32 pt-8 transition-all duration-300 ${chatOpen ? 'xl:mr-[384px]' : ''}`}>
      <div className="mx-auto max-w-[1280px]">
        <h1 className="fade-in-up text-center text-2xl font-bold tracking-tight">{greeting()}，今天想做点什么？</h1>
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[TaskCard, InsightCard, AgentListCard, SourceStatusCard].map((CardComp, index) => <div key={index} className="fade-in-up" style={{ animationDelay: `${0.08 * (index + 1)}s` }}><CardComp onNavigate={onNavigate} /></div>)}
        </div>
      </div>
    </main>
    <ChatDock open={chatOpen} onToggle={() => setChatOpen(v => !v)} messages={messages} onSend={sendMessage} pending={pending} />
    <GlassDock active="desktop" onNavigate={onNavigate} />
  </PageShell>;
}
