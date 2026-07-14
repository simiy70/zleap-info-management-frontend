import React, { useEffect, useRef, useState } from 'react';
import { PageShell, GlassHeader, GlassDock } from '../components/shell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';

/* ─────────────────────────  数据  ───────────────────────── */

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
  { name: 'Claude Code', icon: 'CC', tone: 'bg-emerald-500', posts: 128, today: 12, fans: '12.6万', isPublic: true },
  { name: '调研分析助手', icon: '研', tone: 'bg-violet-500', posts: 86, today: 10, fans: '8.4万', isPublic: true },
  { name: '内容生成助手', icon: '文', tone: 'bg-blue-500', posts: 152, today: 18, fans: '15.3万', isPublic: true },
  { name: '客服助手', icon: '客', tone: 'bg-orange-400', posts: 94, today: 14, fans: '6.7万', isPublic: false },
];

// 关注的 Agent 动态（桌面「Agent 动态」卡片；图片 5:3）
const followedMoments = [
  { agent: 'Claude Code', icon: 'CC', tone: 'bg-emerald-500', time: '10 分钟前', title: 'GPT-5.5 Coding 能力深度测试报告', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80', likes: 32, comments: 18 },
  { agent: '调研分析助手', icon: '研', tone: 'bg-violet-500', time: '30 分钟前', title: '华东地区客户流失风险分析', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80', likes: 26, comments: 9 },
  { agent: '内容生成助手', icon: '文', tone: 'bg-blue-500', time: '1 小时前', title: '小米 YU7 上市首周销量分析报告', img: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=640&q=80', likes: 42, comments: 21 },
];

// 卡片列表只展示异常的信息源；正常源汇总在分布条里
const abnormalSources = [
  { name: '客户数据库', status: '同步失败', variant: 'destructive', time: '30 分钟前', desc: '客户主数据同步失败，最近一次重试未完成。' },
  { name: 'GitHub Issues 同步', status: '同步失败', variant: 'destructive', time: '42 分钟前', desc: 'Issue 增量接口返回权限错误，需要重新授权。' },
  { name: '会议录音转写', status: '未同步', variant: 'secondary', time: '1 小时前', desc: '等待首次同步，尚未发现可解析的录音文件。' },
  { name: '竞品价格爬虫', status: '同步失败', variant: 'destructive', time: '2 小时前', desc: '目标页面响应超时，系统将在下一轮自动重试。' },
  { name: 'CRM Webhook', status: '未同步', variant: 'secondary', time: '3 小时前', desc: 'Webhook 尚未收到首条事件，请检查来源配置。' },
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

/* 挂载后置 true，用于让图表宽度/弧长从 0 过渡到目标值 */
function useMounted(delay = 120) {
  const [m, setM] = useState(false);
  useEffect(() => { const t = setTimeout(() => setM(true), delay); return () => clearTimeout(t); }, []);
  return m;
}

/* ─────────────────────────  卡片外壳  ───────────────────────── */

function CardShell({ icon, title, action, onAction, children }) {
  return <Card className="group/card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
    <header className="flex h-14 shrink-0 cursor-grab items-center justify-between px-5 active:cursor-grabbing">
      <div className="flex items-center gap-2.5 text-base font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-white/70 text-[15px] text-secondary-foreground"><i className={icon} /></span>
        {title}
        <i className="ri-draggable text-base text-muted-foreground/0 transition group-hover/card:text-muted-foreground/50" title="拖拽调整位置" />
      </div>
      {action && <Button variant="ghost" size="sm" onClick={onAction}>{action} <i className="ri-arrow-right-s-line" /></Button>}
    </header>
    <div className="min-h-0 flex-1">{children}</div>
  </Card>;
}

/* ─────────────────────────  四张卡片  ───────────────────────── */

function TaskCard({ onNavigate }) {
  const mounted = useMounted();
  const running = 8, paused = 4, total = 12;
  const R = 46, C = 2 * Math.PI * R;
  return <CardShell icon="ri-checkbox-line" title="Agent工作台" action="全部任务" onAction={() => onNavigate('tasks')}>
    <div className="flex items-center gap-6 px-5 pb-1">
      <div className="relative h-[112px] w-[112px] shrink-0">
        <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
          <circle cx="56" cy="56" r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth="11" />
          <circle cx="56" cy="56" r={R} fill="none" stroke="hsl(var(--primary))" strokeWidth="11" strokeLinecap="round"
            strokeDasharray={`${(mounted ? running / total : 0) * C} ${C}`} style={{ transition: 'stroke-dasharray .9s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold leading-none">{total}</span>
          <span className="mt-1 text-[11px] text-muted-foreground">总任务</span>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        {[['运行中', running, 'bg-primary'], ['已暂停', paused, 'bg-muted-foreground/30']].map(([label, val, dot]) =>
          <div key={label} className="flex items-center gap-2.5 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="text-muted-foreground">{label}</span>
            <strong className="ml-auto">{val}</strong>
          </div>)}
        <div className="flex items-center gap-2.5 border-t border-border/40 pt-3 text-sm">
          <span className="text-muted-foreground">运行占比</span>
          <strong className="ml-auto text-primary">{Math.round(running / total * 100)}%</strong>
        </div>
      </div>
    </div>
    <div className="px-5 pb-2 pt-4 text-sm font-semibold">最近运行任务</div>
    <div className="space-y-2.5 px-5 pb-5">
      {recentTasks.map(task => <button key={task.name} onClick={() => onNavigate('tasks')} className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-white/60 px-4 py-2.5 text-left transition hover:border-primary/30 hover:bg-white/90">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${task.tone}`}><i className={task.icon} /></span>
        <strong className="min-w-0 flex-1 truncate text-sm">{task.name}</strong>
        <Badge variant={task.variant} className="shrink-0 px-2 text-[10px] font-normal">{task.status}</Badge>
        <span className="shrink-0 text-xs text-muted-foreground">{task.time}</span>
        <i className="ri-arrow-right-s-line text-muted-foreground/50" />
      </button>)}
    </div>
  </CardShell>;
}

function InsightCard({ onNavigate }) {
  return <CardShell icon="ri-lightbulb-line" title="今日洞察" action="查看全部事件" onAction={() => onNavigate('sources', { navPage: 'search' })}>
    <div className="scrollbar relative max-h-[360px] overflow-y-auto px-5 pb-5 before:absolute before:bottom-8 before:left-[72px] before:top-2 before:w-px before:bg-border/60">
      {insightEvents.map(item => <div key={item.title} className="relative flex gap-4 py-2.5">
        <div className="w-10 shrink-0 pt-0.5 text-right text-xs font-medium text-muted-foreground">{item.time}</div>
        <span className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary ring-4 ring-white/80" />
        <div className="min-w-0 flex-1 rounded-xl p-1 transition hover:bg-white/60">
          <strong className="line-clamp-1 block text-sm leading-snug">{item.title}</strong>
          <p className="line-clamp-1 mt-1 text-xs leading-5 text-muted-foreground">{item.desc}</p>
          <div className="mt-2"><Badge variant="secondary" className="px-2 text-[10px] font-normal">{item.source}</Badge></div>
        </div>
      </div>)}
    </div>
  </CardShell>;
}

function AgentListCard({ onNavigate, agents, onCreateAgent }) {
  const mounted = useMounted();
  const ranked = [...agents].sort((a, b) => b.posts - a.posts);
  const max = Math.max(ranked[0]?.posts || 0, 1);
  const openChat = name => onNavigate('assistant', { chat: name });
  return <CardShell icon="ri-robot-2-line" title="我的 Agent" action="管理 Agent" onAction={() => onNavigate('assistant')}>
    <div className="flex justify-end px-5 pb-3 text-xs text-muted-foreground">
      <span>动态数 · 今日新增</span>
    </div>
    <div className="space-y-0.5 px-5 pb-3">
      {ranked.map(a => <div key={a.name} onClick={() => openChat(a.name)} role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') openChat(a.name); }}
        className="group/row grid w-full cursor-pointer grid-cols-[124px_1fr_auto_auto] items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/60">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="relative shrink-0">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${a.tone}`}>{a.icon}</span>
            {a.isPublic === false && <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-white ring-2 ring-white" title="私密 Agent"><i className="ri-lock-fill text-[8px]" /></span>}
          </span>
          <strong className="min-w-0 truncate text-sm">{a.name}</strong>
        </span>
        <span className="h-2.5 overflow-hidden rounded-full bg-muted">
          <span className={`block h-full rounded-full ${a.tone}`} style={{ width: mounted ? `${a.posts / max * 100}%` : '0%', transition: 'width .9s ease' }} />
        </span>
        <span className="w-11 text-right"><strong className="text-sm">{a.posts}</strong><span className="block text-[11px] text-emerald-600">+{a.today}</span></span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base text-muted-foreground/40 transition group-hover/row:bg-accent group-hover/row:text-primary" title={`和 ${a.name} 对话`}>
          <i className="ri-chat-3-line" />
        </span>
      </div>)}
    </div>
    <div className="px-5 pb-4">
      <button onClick={onCreateAgent} className="flex w-full items-center gap-2.5 rounded-xl border border-dashed border-border px-3 py-2.5 text-left transition hover:border-primary/40 hover:bg-white/60">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"><i className="ri-add-line" /></span>
        <strong className="text-sm">创建新 Agent</strong>
        <i className="ri-arrow-right-s-line ml-auto text-muted-foreground/50" />
      </button>
    </div>
  </CardShell>;
}

function SourceStatusCard({ onNavigate, onOpenSourceDetail }) {
  const mounted = useMounted();
  const dist = [
    { label: '未同步', value: 2, color: 'bg-slate-300' },
    { label: '同步中', value: 4, color: 'bg-blue-500' },
    { label: '同步成功', value: 4, color: 'bg-emerald-500' },
    { label: '同步失败', value: 1, color: 'bg-rose-500' },
  ];
  const total = dist.reduce((s, d) => s + d.value, 0);
  return <CardShell icon="ri-database-2-line" title="信息源状态" action="管理信息源" onAction={() => onNavigate('sources')}>
    <div className="px-5 pb-3">
      <div className="flex items-baseline gap-2"><strong className="text-[26px] font-bold leading-none">{total}</strong><span className="text-sm text-muted-foreground">个信息源</span></div>
      <div className="mt-3.5 flex h-3 gap-0.5 overflow-hidden rounded-full">
        {dist.map(d => <span key={d.label} className={`${d.color}`} style={{ width: mounted ? `${d.value / total * 100}%` : '0%', transition: 'width .8s ease' }} />)}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {dist.map(d => <span key={d.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${d.color}`} />{d.label} <strong className="text-foreground">{d.value}</strong>
        </span>)}
      </div>
    </div>
    <div className="px-5 pb-2 pt-3 text-sm font-semibold">异常信息源</div>
    <div className="scrollbar max-h-48 space-y-2 overflow-y-auto px-5 pb-5 pr-4">
      {abnormalSources.length
        ? abnormalSources.map(s => <div key={s.name} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5 transition hover:bg-rose-50">
            <span className="flex min-w-0 items-center gap-2.5"><i className={`${s.status === '未同步' ? 'ri-time-line text-slate-400' : 'ri-error-warning-fill text-rose-500'}`} /><span className="min-w-0"><strong className="block truncate text-sm">{s.name}</strong><span className="block text-[11px] text-muted-foreground">{s.time}</span></span></span>
            <Badge variant={s.variant} className="px-2 text-[10px] font-normal">{s.status}</Badge>
            <span className="flex items-center gap-1"><Button variant="ghost" size="sm" className="h-7 rounded-lg px-2 text-xs" onClick={() => onOpenSourceDetail(s)}>查看详情</Button><Button variant="outline" size="sm" className="h-7 rounded-lg px-2.5 text-xs" onClick={() => onNavigate('sources')}>重试</Button></span>
          </div>)
        : <div className="flex items-center gap-2 rounded-xl bg-emerald-50/70 px-3 py-3 text-sm text-emerald-700"><i className="ri-checkbox-circle-fill" />全部信息源运行正常</div>}
    </div>
  </CardShell>;
}

function MomentsCard({ onNavigate, onOpenMoment }) {
  return <CardShell icon="ri-rss-line" title={<>Agent 动态<Badge variant="accent" className="px-2 text-[10px] font-normal">今日推送 12 条</Badge></>} action="查看全部" onAction={() => onNavigate('feed', { view: 'following' })}>
    <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-3">
      {followedMoments.map(m => <button key={m.title} onClick={() => onOpenMoment(m)} className="flex flex-col overflow-hidden rounded-xl border border-border/40 bg-white/60 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/90 hover:shadow-md">
        <img src={m.img} alt="" className="aspect-[5/3] w-full bg-muted object-cover" />
        <span className="flex min-w-0 flex-1 flex-col p-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white ${m.tone}`}>{m.icon}</span>
            <span className="truncate">{m.agent}</span>
            <span className="ml-auto shrink-0">{m.time}</span>
          </span>
          <strong className="line-clamp-2 mt-1.5 text-sm leading-snug">{m.title}</strong>
          <span className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><i className="ri-heart-line" />{m.likes}</span>
            <span className="flex items-center gap-1"><i className="ri-chat-3-line" />{m.comments}</span>
            <span className="flex items-center gap-1"><i className="ri-share-box-line" />分享</span>
          </span>
        </span>
      </button>)}
    </div>
  </CardShell>;
}

function MomentDetailDialog({ moment, onClose }) {
  return <Dialog open={Boolean(moment)} onOpenChange={open => { if (!open) onClose(); }}>
    {moment && <DialogContent className="w-[1080px] max-w-[calc(100vw-32px)] overflow-hidden p-0">
      <div className="grid max-h-[min(760px,calc(100vh-48px))] overflow-hidden md:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-y-auto bg-gradient-to-br from-white via-white to-slate-50 p-7">
          <DialogHeader><DialogTitle className="text-2xl leading-tight">{moment.title}</DialogTitle><p className="mt-2 text-sm leading-6 text-muted-foreground">{moment.agent} · {moment.time}</p></DialogHeader>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">这份动态围绕近期业务变化整理了背景、关键趋势与后续建议，帮助团队快速判断影响范围与行动优先级。</p>
          <div className="mt-8 rounded-2xl border-l-4 border-orange-400 bg-white p-5 shadow-sm ring-1 ring-border/40"><h3 className="text-sm font-semibold">核心洞察</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">建议结合当前项目节奏明确负责人，并将关键结论沉淀为后续执行规则，避免信息只停留在浏览层面。</p></div>
          <div className="mt-7 grid grid-cols-3 gap-3 text-sm"><div className="rounded-xl bg-white p-3 ring-1 ring-border/40"><span className="block text-xs text-muted-foreground">阅读</span><strong className="mt-1 block">128</strong></div><div className="rounded-xl bg-white p-3 ring-1 ring-border/40"><span className="block text-xs text-muted-foreground">点赞</span><strong className="mt-1 block">{moment.likes}</strong></div><div className="rounded-xl bg-white p-3 ring-1 ring-border/40"><span className="block text-xs text-muted-foreground">评论</span><strong className="mt-1 block">{moment.comments}</strong></div></div>
        </div>
        <div className="grid min-h-0 grid-rows-[auto_1fr_auto] border-t border-border/50 bg-white md:border-l md:border-t-0">
          <div className="border-b border-border/50 p-6"><div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${moment.tone}`}>{moment.icon}</span><div><strong className="block text-sm">{moment.agent}</strong><span className="text-xs text-muted-foreground">{moment.time}</span></div></div><h3 className="mt-5 text-base font-semibold">{moment.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">来自 Agent 的动态摘要与跟进建议。</p></div>
          <div className="overflow-y-auto p-6"><h4 className="text-sm font-semibold">共 16 条评论</h4><div className="mt-5 flex gap-3 border-b border-border/50 pb-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white">追</span><div><strong className="block text-sm">追剧人</strong><p className="mt-1 text-sm text-muted-foreground">这个角度很好，可以再补一个 follow-up 方案。</p></div></div></div>
          <div className="border-t border-border/50 p-4"><div className="flex items-center gap-3 rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground"><span className="flex-1">评论</span><span className="flex items-center gap-3"><span><i className="ri-heart-line mr-1" />{moment.likes}</span><span><i className="ri-chat-3-line mr-1" />{moment.comments}</span><i className="ri-share-box-line" /></span></div></div>
        </div>
      </div>
    </DialogContent>}
  </Dialog>;
}

function SourceDetailDialog({ source, onClose }) {
  return <Dialog open={Boolean(source)} onOpenChange={open => { if (!open) onClose(); }}>
    {source && <DialogContent>
      <DialogHeader><DialogTitle>{source.name}</DialogTitle><p className="text-xs text-muted-foreground">信息源详情 · 最近更新 {source.time}</p></DialogHeader>
      <div className="rounded-2xl bg-rose-50/70 p-4"><div className="flex items-center gap-2"><Badge variant={source.variant}>{source.status}</Badge><span className="text-sm font-medium">当前需要处理</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{source.desc}</p></div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-white/65 p-3"><span className="block text-xs text-muted-foreground">最近尝试</span><strong className="mt-1 block">{source.time}</strong></div><div className="rounded-xl bg-white/65 p-3"><span className="block text-xs text-muted-foreground">建议操作</span><strong className="mt-1 block">检查连接配置</strong></div></div>
      <DialogFooter><Button variant="outline" onClick={onClose}>关闭</Button><Button onClick={onClose}>去处理</Button></DialogFooter>
    </DialogContent>}
  </Dialog>;
}

/* ─────────────────────────  创建 Agent 弹窗  ───────────────────────── */

const agentTones = ['bg-orange-400', 'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-400', 'bg-slate-800'];

function CreateAgentDialog({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState({ name: '', desc: '', isPublic: true });
  const set = (key, value) => setForm(v => ({ ...v, [key]: value }));
  const submit = () => {
    const name = form.name.trim();
    if (!name) return;
    onCreate({
      name, icon: name.slice(0, 1).toUpperCase(),
      tone: agentTones[Math.floor(Math.random() * agentTones.length)],
      posts: 0, today: 0, fans: '0',
      desc: form.desc.trim(),
      isPublic: form.isPublic,
    });
    setForm({ name: '', desc: '', isPublic: true });
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>创建 Agent</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-[12px] text-muted-foreground">Agent 名称 <b className="text-rose-500">*</b></span>
          <Input autoFocus value={form.name} onChange={e => set('name', e.target.value)} placeholder="给你的 Agent 起个名字" onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) submit(); }} /></label>
        <label className="block"><span className="mb-1.5 block text-[12px] text-muted-foreground">简介</span>
          <Textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows="3" placeholder="它负责关注什么、产出什么样的动态" className="resize-none" /></label>
        <div className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-border/50">
          <div><div className="text-sm font-medium">公开该 Agent</div><div className="mt-0.5 text-[11px] text-muted-foreground">私密 Agent 的头像会带锁标识，仅自己可见</div></div>
          <Switch checked={form.isPublic} onCheckedChange={v => set('isPublic', v)} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
        <Button disabled={!form.name.trim()} onClick={submit}>创建</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
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
    return <button onClick={onToggle} title={`展开${desktopAssistantName}`} aria-label={`展开${desktopAssistantName}`}
      className="group fixed right-5 top-1/2 z-30 -translate-y-1/2">
      <span className="glass-strong flex h-14 w-14 items-center justify-center rounded-2xl p-1.5 shadow-xl shadow-orange-500/10 transition group-hover:scale-105 group-active:scale-95">
        <span className="relative flex h-full w-full items-center justify-center rounded-xl bg-primary text-xl text-primary-foreground ring-1 ring-white/60">
          <i className="ri-sparkling-2-line" />
          <span className="breathe absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </span>
      </span>
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

const cardComponents = { tasks: TaskCard, insights: InsightCard, agents: AgentListCard, sources: SourceStatusCard, moments: MomentsCard };

export default function DesktopPage({ onNavigate }) {
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `${greeting()}，我是你的专属助手。直接布置任务，我会调度合适的 Agent 完成，进度同步到「任务中心」。` },
  ]);
  const [pending, setPending] = useState(false);
  const replyTimer = useRef(null);
  const [agents, setAgents] = useState(agentRows);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [momentDetail, setMomentDetail] = useState(null);
  const [sourceDetail, setSourceDetail] = useState(null);

  // 卡片顺序：可拖拽交换
  const [cardOrder, setCardOrder] = useState(['tasks', 'agents', 'sources', 'insights', 'moments']);
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);
  const dropCard = index => {
    const from = dragIndex.current;
    setOverIndex(null);
    if (from == null || from === index) return;
    setCardOrder(prev => {
      const next = [...prev];
      [next[from], next[index]] = [next[index], next[from]];
      return next;
    });
    dragIndex.current = null;
  };

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
        <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-5 lg:grid-cols-2">
          {cardOrder.map((id, index) => {
            const CardComp = cardComponents[id];
            return <div key={id} draggable
              onDragStart={() => { dragIndex.current = index; }}
              onDragOver={e => { e.preventDefault(); setOverIndex(index); }}
              onDragLeave={() => setOverIndex(v => (v === index ? null : v))}
              onDrop={() => dropCard(index)}
              onDragEnd={() => { dragIndex.current = null; setOverIndex(null); }}
              className={`fade-in-up rounded-2xl transition ${id === 'moments' ? 'lg:col-span-2' : ''} ${overIndex === index ? 'scale-[0.99] ring-2 ring-primary/50' : ''}`}
              style={{ animationDelay: `${0.08 * (index + 1)}s` }}>
              <CardComp onNavigate={onNavigate} {...(id === 'agents' ? { agents, onCreateAgent: () => setShowCreateAgent(true) } : {})} {...(id === 'moments' ? { onOpenMoment: setMomentDetail } : {})} {...(id === 'sources' ? { onOpenSourceDetail: setSourceDetail } : {})} />
            </div>;
          })}
        </div>
      </div>
    </main>
    <ChatDock open={chatOpen} onToggle={() => setChatOpen(v => !v)} messages={messages} onSend={sendMessage} pending={pending} />
    <GlassDock active="desktop" onNavigate={onNavigate} />
    <CreateAgentDialog open={showCreateAgent} onOpenChange={setShowCreateAgent} onCreate={agent => setAgents(prev => [agent, ...prev])} />
    <MomentDetailDialog moment={momentDetail} onClose={() => setMomentDetail(null)} />
    <SourceDetailDialog source={sourceDetail} onClose={() => setSourceDetail(null)} />
  </PageShell>;
}
