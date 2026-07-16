import React, { useMemo, useState } from 'react';
import { PageShell, GlassHeader, GlassDock, NewItemCard, CardPagination } from '../components/shell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';

const initialTasks = [
  { id: 1, name: "汇报信息源", enabled: true, time: "暂无", owner: "709助手啊大大", avatar: "https://i.pravatar.cc/64?img=47", description: "每日汇总关注信息源并推送重点变化。" },
  { id: 2, name: "AI日报", enabled: true, time: "7月9日周四 16:31", owner: "709助手啊大大", avatar: "https://i.pravatar.cc/64?img=47", description: "收集并整理当天 AI 行业动态。" },
  { id: 3, name: "笔记内容总结", enabled: true, time: "7月9日周四 15:41", owner: "709助手啊大大", avatar: "https://i.pravatar.cc/64?img=47", description: "自动归纳新增笔记并提取关键结论。" },
  { id: 4, name: "飞书CLI", enabled: true, time: "7月9日周四 09:05", owner: "飞书-chenyuxi", avatar: "https://i.pravatar.cc/64?img=12", description: "定时执行飞书 CLI 工作流。" },
  { id: 5, name: "飞书群聊-报告", enabled: false, time: "6月15日周一 18:43", owner: "飞书CLI", avatar: "https://i.pravatar.cc/64?img=5", description: "生成群聊周报并发送至指定会话。" },
  { id: 6, name: "界面新闻-报告", enabled: true, time: "7月7日周二 13:52", owner: "rss-chenyuxi", avatar: "https://i.pravatar.cc/64?img=32", description: "抓取界面新闻并生成重点摘要。" }
];

function TaskCard({ task, onToggle, onDelete, onDetails }) {
  return <Card className="flex h-[168px] min-w-0 flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
    <div className="flex items-start justify-between gap-3"><h2 className="truncate text-[16px] font-semibold">{task.name}</h2><Switch checked={task.enabled} onCheckedChange={() => onToggle(task.id)} /></div>
    <div className="mt-auto flex items-center justify-between text-[12px]">
      <div className="flex min-w-0 items-center gap-2 text-muted-foreground"><i className="ri-time-line text-[15px]" /><span>最近推送</span><span className="truncate">{task.time}</span></div>
      <Button variant="link" size="sm" className="h-auto p-0" onClick={() => onDetails(task)}>详情</Button>
    </div>
    <div className="mt-3 flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-2 rounded-full bg-white/60 py-1 pl-1 pr-2.5 text-[12px] text-muted-foreground ring-1 ring-border/50">
        <Avatar className="h-5 w-5"><AvatarImage src={task.avatar} /><AvatarFallback>{task.owner.slice(0, 1)}</AvatarFallback></Avatar>
        <span className="truncate">{task.owner}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger><Button variant="ghost" size="icon-sm" aria-label="更多操作"><i className="ri-more-fill" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuItem onClick={() => onDetails(task)}><i className="ri-edit-line" />编辑任务</DropdownMenuItem>
          <DropdownMenuItem className="text-rose-500 hover:bg-rose-50" onClick={() => onDelete(task.id)}><i className="ri-delete-bin-line" />删除任务</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </Card>;
}

function CreateTaskDialog({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState({ name: "", owner: "709助手啊大大", description: "", enabled: true });
  const set = (key, value) => setForm(v => ({ ...v, [key]: value }));
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>创建任务</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-[12px] text-muted-foreground">任务名称 <b className="text-rose-500">*</b></span><Input autoFocus value={form.name} onChange={e => set("name", e.target.value)} placeholder="请输入任务名称" /></label>
        <label className="block"><span className="mb-1.5 block text-[12px] text-muted-foreground">执行助手</span>
          <select value={form.owner} onChange={e => set("owner", e.target.value)} className="h-10 w-full rounded-xl border border-input bg-white/70 px-3 text-sm outline-none backdrop-blur focus:border-primary/50">
            <option>709助手啊大大</option><option>飞书CLI</option><option>rss-chenyuxi</option>
          </select></label>
        <label className="block"><span className="mb-1.5 block text-[12px] text-muted-foreground">任务说明</span><Textarea value={form.description} onChange={e => set("description", e.target.value)} rows="3" placeholder="描述任务要完成的工作" className="resize-none" /></label>
        <div className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-border/50"><div><div className="text-sm font-medium">创建后立即执行</div><div className="mt-0.5 text-[11px] text-muted-foreground">可随时在任务卡片中暂停</div></div><Switch checked={form.enabled} onCheckedChange={v => set("enabled", v)} /></div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
        <Button disabled={!form.name.trim()} onClick={() => { onCreate(form); onOpenChange(false); }}>创建</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

export default function TaskPage({ onNavigate }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState(null);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => tasks.filter(t => (status === "all" || (status === "running") === t.enabled) && (t.name + t.owner).toLowerCase().includes(search.trim().toLowerCase())), [tasks, search, status]);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedTasks = filtered.slice((page - 1) * pageSize, page * pageSize);
  const clear = () => { setSearch(""); setStatus("all"); };
  const create = form => setTasks(v => [{ id: Date.now(), ...form, time: "暂无", avatar: "https://i.pravatar.cc/64?img=47" }, ...v]);
  const statusLabels = { all: "全部状态", running: "正常执行", paused: "任务暂停" };

  React.useEffect(() => setPage(1), [search, status]);
  React.useEffect(() => setPage(current => Math.min(current, totalPages)), [totalPages]);

  return <PageShell>
    <GlassHeader />
    <main className="w-full px-8 pb-32 pt-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-[362px] max-w-full">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索任务或助手" className="pl-11 pr-10" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"><i className="ri-close-circle-fill" /></button>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon" aria-label="筛选任务状态" title="筛选任务状态"
              className={`relative text-lg ${status !== "all" ? "border-orange-200 bg-accent text-primary" : ""}`}>
              <i className="ri-filter-3-line" />
              {status !== "all" && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">筛选</div>
            {Object.entries(statusLabels).map(([value, label]) => <DropdownMenuItem key={value} onClick={() => setStatus(value)} className={status === value ? "bg-accent text-accent-foreground" : ""}>
              <span className="flex-1">{label}</span>{status === value && <i className="ri-check-line" />}
            </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-1" />
        <Button onClick={() => setShowCreate(true)}><i className="ri-add-line text-lg" />创建任务</Button>
      </div>

      {filtered.length
        ? <section className="mt-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <NewItemCard label="新建任务" onClick={() => setShowCreate(true)} className="min-h-[168px]" />
              {pagedTasks.map(task => <TaskCard key={task.id} task={task} onToggle={id => setTasks(v => v.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t))} onDelete={id => setTasks(v => v.filter(t => t.id !== id))} onDetails={setDetail} />)}
            </div>
            <CardPagination page={page} totalPages={totalPages} totalItems={filtered.length} onPageChange={setPage} className="mt-6" />
          </section>
        : <section className="mt-24 flex flex-col items-center text-muted-foreground"><i className="ri-inbox-2-line text-5xl" /><div className="mt-3 text-sm">没有找到符合条件的任务</div><Button variant="link" size="sm" className="mt-2" onClick={clear}>重置筛选</Button></section>}
    </main>
    <GlassDock active="tasks" onNavigate={onNavigate} />

    <CreateTaskDialog open={showCreate} onOpenChange={setShowCreate} onCreate={create} />

    <Dialog open={Boolean(detail)} onOpenChange={() => setDetail(null)}>
      <DialogContent>
        <DialogHeader><DialogTitle>任务详情</DialogTitle></DialogHeader>
        {detail && <div className="space-y-4 text-sm">
          <div><div className="text-xs text-muted-foreground">任务名称</div><div className="mt-1 font-medium">{detail.name}</div></div>
          <div><div className="text-xs text-muted-foreground">执行助手</div><div className="mt-1 flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarImage src={detail.avatar} /></Avatar>{detail.owner}</div></div>
          <div><div className="text-xs text-muted-foreground">任务说明</div><div className="mt-1 leading-6 text-muted-foreground">{detail.description || "暂无说明"}</div></div>
          <div className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2 ring-1 ring-border/50"><span>当前状态</span><span className={detail.enabled ? "text-emerald-600" : "text-muted-foreground"}>{detail.enabled ? "正常执行" : "任务暂停"}</span></div>
        </div>}
      </DialogContent>
    </Dialog>
  </PageShell>;
}
