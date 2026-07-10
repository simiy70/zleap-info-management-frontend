import React, { useMemo, useState } from 'react';

const initialTasks = [
  { id: 1, name: "汇报信息源", enabled: true, time: "暂无", owner: "709助手啊大大", avatar: "https://i.pravatar.cc/64?img=47", description: "每日汇总关注信息源并推送重点变化。" },
  { id: 2, name: "AI日报", enabled: true, time: "7月9日周四 16:31", owner: "709助手啊大大", avatar: "https://i.pravatar.cc/64?img=47", description: "收集并整理当天 AI 行业动态。" },
  { id: 3, name: "笔记内容总结", enabled: true, time: "7月9日周四 15:41", owner: "709助手啊大大", avatar: "https://i.pravatar.cc/64?img=47", description: "自动归纳新增笔记并提取关键结论。" },
  { id: 4, name: "飞书CLI", enabled: true, time: "7月9日周四 09:05", owner: "飞书-chenyuxi", avatar: "https://i.pravatar.cc/64?img=12", description: "定时执行飞书 CLI 工作流。" },
  { id: 5, name: "飞书群聊-报告", enabled: false, time: "6月15日周一 18:43", owner: "飞书CLI", avatar: "https://i.pravatar.cc/64?img=5", description: "生成群聊周报并发送至指定会话。" },
  { id: 6, name: "界面新闻-报告", enabled: true, time: "7月7日周二 13:52", owner: "rss-chenyuxi", avatar: "https://i.pravatar.cc/64?img=32", description: "抓取界面新闻并生成重点摘要。" }
];

function Header() {
  return <header className="flex h-14 items-center justify-between border-b border-neutral-200/70 bg-[#efede9] px-6">
    <div className="flex items-center gap-2"><span className="text-xl font-bold tracking-tight">zleap</span><span className="rounded-md bg-white/75 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">Beta</span></div>
    <div className="flex items-center gap-4 text-[20px] text-neutral-500">
      <button className="transition hover:text-neutral-900" title="语言"><i className="ri-translate-2" /></button>
      <button className="transition hover:text-neutral-900" title="帮助"><i className="ri-question-line" /></button>
      <button className="relative transition hover:text-neutral-900" title="通知"><i className="ri-notification-3-line" /><span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#efede9]" /></button>
      <div className="ml-1 flex items-center gap-2.5"><div className="text-right"><div className="text-sm font-medium leading-tight text-neutral-700">这里最…</div><div className="text-[11px] leading-tight text-neutral-400">企业版</div></div><div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">Z</div></div>
    </div>
  </header>;
}

const dockItems = [
  ["desktop", "桌面", "ri-home-5-line", "bg-orange-100", "text-orange-500"],
  ["sources", "信息源", "ri-database-2-line", "bg-violet-100", "text-violet-600"],
  ["assistant", "助手", "ri-chat-smile-2-line", "bg-emerald-100", "text-emerald-600"],
  ["tasks", "任务", "ri-task-line", "bg-blue-100", "text-blue-600"],
  ["feed", "动态", "ri-rss-line", "bg-rose-100", "text-rose-500"]
];

function Dock({ onNavigate }) {
  return <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center"><nav className="pointer-events-auto flex items-end gap-1 rounded-3xl border border-white/70 bg-white/60 px-3 py-2.5 shadow-xl shadow-neutral-900/10 backdrop-blur-xl">
    {dockItems.map(([id, label, icon, bg, color]) => <button key={id} onClick={() => onNavigate?.(id)} className={`group flex w-16 flex-col items-center gap-1 rounded-2xl px-1.5 py-1.5 transition ${id === "tasks" ? "bg-white/70" : "hover:bg-white/50"}`}>
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-[14px] ${bg} ${color} text-[23px] transition-transform group-hover:scale-[1.04] group-active:scale-95`}><i className={icon} />{id === "sources" && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">3</span>}</span>
      <span className={`text-[11px] leading-none ${id === "tasks" ? "font-medium text-neutral-800" : "text-neutral-500"}`}>{label}</span>
    </button>)}
  </nav></div>;
}

function Toggle({ checked, onChange }) {
  return <button onClick={onChange} role="switch" aria-checked={checked} className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-[#ffb000]" : "bg-neutral-200"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${checked ? "left-[22px]" : "left-0.5"}`} /></button>;
}

function TaskCard({ task, onToggle, onDelete, onDetails }) {
  const [menu, setMenu] = useState(false);
  return <article className="relative flex h-[166px] min-w-0 flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_5px_18px_rgba(0,0,0,0.025)] transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md">
    <div className="flex items-start justify-between gap-3"><h2 className="truncate text-[16px] font-semibold text-neutral-900">{task.name}</h2><Toggle checked={task.enabled} onChange={() => onToggle(task.id)} /></div>
    <div className="mt-auto flex items-center justify-between text-[12px]"><div className="flex min-w-0 items-center gap-2 text-neutral-400"><i className="ri-time-line text-[16px]" /><span>最近推送时间</span><span className="truncate text-neutral-500">{task.time}</span></div><button onClick={() => onDetails(task)} className="shrink-0 font-medium text-orange-500 hover:text-orange-600">详情</button></div>
    <div className="mt-3 flex items-center justify-between"><div className="flex min-w-0 items-center gap-2 rounded-full bg-neutral-50 py-1 pl-1 pr-2.5 text-[12px] text-neutral-500 ring-1 ring-neutral-100"><img className="h-5 w-5 rounded-full object-cover" src={task.avatar} alt="" /><span className="truncate">{task.owner}</span></div><button onClick={() => setMenu(!menu)} className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100" aria-label="更多操作"><i className="ri-more-fill" /></button></div>
    {menu && <div className="absolute bottom-10 right-3 z-20 w-28 rounded-lg border border-neutral-200 bg-white p-1 text-[13px] shadow-lg"><button onClick={() => { onDetails(task); setMenu(false); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-neutral-50"><i className="ri-edit-line" />编辑任务</button><button onClick={() => onDelete(task.id)} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-rose-500 hover:bg-rose-50"><i className="ri-delete-bin-line" />删除任务</button></div>}
  </article>;
}

function Modal({ title, onClose, children, footer }) {
  return <><button className="fixed inset-0 z-40 cursor-default bg-neutral-900/30 backdrop-blur-[2px]" onClick={onClose} aria-label="关闭弹窗" /><section className="fixed left-1/2 top-1/2 z-50 w-[520px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4"><h2 className="text-[16px] font-semibold">{title}</h2><button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"><i className="ri-close-line text-xl" /></button></header><div className="px-6 py-5">{children}</div>{footer && <footer className="flex justify-end gap-2 border-t border-neutral-100 bg-neutral-50/60 px-6 py-3">{footer}</footer>}</section></>;
}

function CreateTaskModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", owner: "709助手啊大大", description: "", enabled: true });
  const set = (key, value) => setForm(v => ({ ...v, [key]: value }));
  const footer = <><button onClick={onClose} className="h-9 rounded-xl px-4 text-sm text-neutral-600 hover:bg-neutral-100">取消</button><button disabled={!form.name.trim()} onClick={() => { onCreate(form); onClose(); }} className={`h-9 rounded-xl px-4 text-sm font-medium ${form.name.trim() ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-neutral-100 text-neutral-400"}`}>创建</button></>;
  return <Modal title="创建任务" onClose={onClose} footer={footer}><div className="space-y-4">
    <label className="block"><span className="mb-1.5 block text-[12px] text-neutral-500">任务名称 <b className="text-rose-500">*</b></span><input autoFocus value={form.name} onChange={e => set("name", e.target.value)} placeholder="请输入任务名称" className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" /></label>
    <label className="block"><span className="mb-1.5 block text-[12px] text-neutral-500">执行助手</span><select value={form.owner} onChange={e => set("owner", e.target.value)} className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-orange-300"><option>709助手啊大大</option><option>飞书CLI</option><option>rss-chenyuxi</option></select></label>
    <label className="block"><span className="mb-1.5 block text-[12px] text-neutral-500">任务说明</span><textarea value={form.description} onChange={e => set("description", e.target.value)} rows="3" placeholder="描述任务要完成的工作" className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" /></label>
    <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5"><div><div className="text-sm font-medium">创建后立即执行</div><div className="mt-0.5 text-[11px] text-neutral-400">可随时在任务卡片中暂停</div></div><Toggle checked={form.enabled} onChange={() => set("enabled", !form.enabled)} /></div>
  </div></Modal>;
}

export default function TaskPage({ onNavigate }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [statusOpen, setStatusOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState(null);
  const filtered = useMemo(() => tasks.filter(t => (status === "all" || (status === "running") === t.enabled) && (t.name + t.owner).toLowerCase().includes(search.trim().toLowerCase())), [tasks, search, status]);
  const clear = () => { setSearch(""); setStatus("all"); };
  const create = form => setTasks(v => [{ id: Date.now(), ...form, time: "暂无", avatar: "https://i.pravatar.cc/64?img=47" }, ...v]);
  return <div className="min-h-screen bg-[#f5f5f4] text-neutral-900"><Header /><main className="px-6 pb-32 pt-4">
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-[362px] max-w-full"><i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索任务或助手" className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-12 pr-10 text-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />{search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600"><i className="ri-close-circle-fill" /></button>}</div>
      <div className="relative"><button onClick={() => setStatusOpen(v => !v)} aria-label="筛选任务状态" title="筛选任务状态" className={`relative flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-xl transition ${statusOpen || status !== "all" ? "border-orange-300 bg-orange-50 text-orange-500" : "border-neutral-200 text-neutral-500 hover:border-orange-300 hover:text-orange-500"}`}><i className="ri-filter-3-line" />{status !== "all" && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-white" />}</button>{statusOpen && <div className="absolute right-0 top-12 z-20 w-[130px] rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">{[["all","全部状态"],["running","正常执行"],["paused","任务暂停"]].map(([value,label]) => <button key={value} onClick={() => { setStatus(value); setStatusOpen(false); }} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${status === value ? "bg-orange-50 text-orange-500" : "hover:bg-neutral-50"}`}>{label}{status === value && <i className="ri-check-line" />}</button>)}</div>}</div>
      <div className="flex-1" /><button onClick={() => setShowCreate(true)} className="flex h-10 items-center gap-1.5 rounded-xl bg-orange-500 px-4 text-sm font-medium text-white shadow-sm shadow-orange-500/25 hover:bg-orange-600"><i className="ri-add-line text-lg" />创建任务</button>
    </div>
    {filtered.length ? <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{filtered.map(task => <TaskCard key={task.id} task={task} onToggle={id => setTasks(v => v.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t))} onDelete={id => setTasks(v => v.filter(t => t.id !== id))} onDetails={setDetail} />)}</section> : <section className="mt-24 flex flex-col items-center text-neutral-400"><i className="ri-inbox-2-line text-5xl" /><div className="mt-3 text-sm">没有找到符合条件的任务</div><button onClick={clear} className="mt-3 text-sm text-orange-500 hover:text-orange-600">重置筛选</button></section>}
  </main><Dock onNavigate={onNavigate} />{showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} onCreate={create} />}{detail && <Modal title="任务详情" onClose={() => setDetail(null)}><div className="space-y-4 text-sm"><div><div className="text-xs text-neutral-400">任务名称</div><div className="mt-1 font-medium">{detail.name}</div></div><div><div className="text-xs text-neutral-400">执行助手</div><div className="mt-1 flex items-center gap-2"><img src={detail.avatar} className="h-6 w-6 rounded-full" alt="" />{detail.owner}</div></div><div><div className="text-xs text-neutral-400">任务说明</div><div className="mt-1 leading-6 text-neutral-600">{detail.description || "暂无说明"}</div></div><div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2"><span>当前状态</span><span className={detail.enabled ? "text-emerald-600" : "text-neutral-400"}>{detail.enabled ? "正常执行" : "任务暂停"}</span></div></div></Modal>}</div>;
}

