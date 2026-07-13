import React, { useEffect, useMemo, useRef, useState } from 'react';

/* ─────────────────────────  数据  ───────────────────────── */

const initialCards = [
  { id:'customer-risk', source:'Sales Agent', creator:'@苏铭妍', department:'销售', category:'商业', topic:'客户 A', time:'14 分钟前', date:'2026-05-11', title:'客户 A 风险上升：Onboarding 阻力正在影响续约判断', subtitle:'Sales Agent 与 Research Agent 同时捕捉到客户情绪变化，建议 48 小时内明确 owner。', agentReview:'Sales Agent 判断这条动态需要优先处理，客户阻力已经从体验问题转向续约风险。', summary:'Onboarding 路径过长正在影响客户 A 的续约判断，销售与研究信号同时指向首次配置阻力。叠加销售跟进超期，续约面临资金与体验的双重压力，建议 48 小时内明确 owner 并安排客户回访。', img:'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=900&q=80', comments:24, likes:132, followed:true, topics:['客户 A','Onboarding','Pricing'], insights:['客户风险的根因不是单点功能缺失，而是首次配置路径过长导致的采用阻力。','销售跟进已超过 5 天，建议 48 小时内明确 owner 并发起客户回访。'] },
  { id:'ios-release', source:'PM Agent', creator:'@苏铭妍', department:'产品', category:'科技', topic:'iOS 发布', time:'58 分钟前', date:'2026-05-11', title:'iOS 发布存在延期风险：设计验收与 QA 收敛不同步', subtitle:'QA Agent 标记 5 个阻塞问题，其中 2 个影响主流程，当前预计发布窗口延迟 2~3 天。', agentReview:'PM Agent 认为延期风险来自验收节奏失配，优先级高于新增需求讨论。', summary:'QA 阻塞问题集中在主流程，设计验收和测试收敛没有同步推进。当前发布窗口可能延迟 2 到 3 天，需要统一验收口径。', img:'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', comments:16, likes:89, followed:true, topics:['iOS 发布','Onboarding'], insights:['延期风险主要来自设计验收和 QA 收敛不同步，不是研发产能不足。'] },
  { id:'text-pricing', source:'Research Agent', creator:'@研究员A', department:'销售', category:'财经', topic:'Pricing', time:'34 分钟前', date:'2026-05-11', title:'企业版定价反馈：客户更关心价值解释，而不是单纯价格高低', subtitle:'Research Agent 汇总最近 12 条销售记录，客户主要困惑集中在套餐差异、权限边界和 ROI 说明。', agentReview:'Research Agent 认为价格异议本质是价值表达不足，不应只靠销售临场解释。', summary:'最近 12 条销售记录显示，客户困惑集中在套餐差异、权限边界和 ROI 说明。企业版需要更清晰的一页式价值说明来降低解释成本。', img:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80', comments:11, likes:73, followed:true, topics:['Pricing','客户 A'], insights:['定价问题本质上是价值表达问题。'] },
  { id:'tech-risk', source:'Monitor Agent', creator:'@技术负责人', department:'技术', category:'科技', topic:'稳定性', time:'1 小时前', date:'2026-05-11', title:'核心接口错误率升高，技术团队正在定位稳定性问题', subtitle:'监控 Agent 发现过去 3 小时错误率明显上升，影响范围集中在登录与权限模块。', agentReview:'Monitor Agent 提醒该异常已影响核心链路，应先确认权限策略变更的回滚方案。', summary:'过去 3 小时核心接口错误率明显升高，影响范围集中在登录和权限模块。技术团队需要尽快定位与最新权限策略变更的关联。', img:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', comments:31, likes:156, followed:false, topics:['稳定性','Onboarding'], insights:['错误率上升集中在登录和权限模块，疑似与最新权限策略变更相关。'] },
  { id:'growth-topic', source:'Marketing Agent', creator:'@增长团队', department:'市场', category:'文娱', topic:'TikTok', time:'1 小时前', date:'2026-05-11', title:'TikTok 相关讨论升温，短视频模板可能成为新的增长入口', subtitle:'Marketing Agent 发现过去 7 天短视频相关 mention 增长 5 倍。', agentReview:'Marketing Agent 判断短视频模板不是短期噪音，值得进入增长实验池。', summary:'过去 7 天 TikTok 相关讨论增长明显，短视频模板的使用场景开始变清晰。建议保留自动分发入口并继续观察互动质量。', img:'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=900&q=80', comments:19, likes:204, followed:true, topics:['TikTok','Pricing'], insights:['TikTok 讨论升温可能不是短期热点，而是内容生产场景变化的早期信号。'] },
  { id:'ops-note', source:'Ops Agent', creator:'@运营负责人', department:'运营', category:'职场', topic:'Onboarding', time:'2 小时前', date:'2026-05-11', title:'运营建议：先补模板引导，不急着重构完整配置流程', subtitle:'Ops Agent 汇总客服反馈后认为，新用户卡点集中但路径清晰。', agentReview:'Ops Agent 认为先补模板引导更务实，完整配置重构可以后置评估。', summary:'客服反馈显示新用户卡点集中但路径清晰，短期改进空间主要在模板引导。先补低成本入口，能更快验证配置流程的真实阻力。', img:'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', comments:8, likes:61, followed:false, topics:['Onboarding'], insights:['模板引导是短期收益最高的改进。'] },
  { id:'pricing-week', source:'Research Agent', creator:'@研究员A', department:'销售', category:'财经', topic:'Pricing', time:'昨天', date:'2026-05-10', title:'Pricing 反馈增加：销售与市场同时提到价格解释成本上升', subtitle:'最近 7 天 Pricing 相关讨论持续增加，主要集中在套餐差异和企业版价值解释。', agentReview:'Research Agent 认为 Pricing 热度持续上升，需要把价值叙事沉淀成标准材料。', summary:'销售与市场都在反馈价格解释成本上升，客户关注点仍围绕套餐差异和企业版价值。该问题已经从个案变成连续信号。', img:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80', comments:12, likes:98, followed:true, topics:['Pricing','客户 A'], insights:['Pricing 讨论增加说明企业版价值表达不够清晰。'] },
  { id:'hr-month', source:'HR Agent', creator:'@HR负责人', department:'人力', category:'职场', topic:'招聘', time:'上周', date:'2026-05-04', title:'招聘漏斗中候选人反馈速度下降，需要 HR 跟进', subtitle:'HR Agent 发现候选人等待时间变长，但尚未影响关键岗位 offer 转化。', agentReview:'HR Agent 提醒候选人反馈速度下降会累积体验损耗，需要提前跟进。', summary:'候选人在招聘漏斗中的等待时间变长，目前尚未影响关键岗位 offer 转化。建议 HR 优先处理反馈节奏，避免后续转化率下滑。', img:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80', comments:7, likes:53, followed:true, topics:['招聘'], insights:['候选人反馈速度下降暂未影响 offer 转化，但会影响候选人体验。'] },
];

const simulatedNewCards = [
  { id:'new-discover-1', source:'Research Agent', creator:'@研究员A', department:'销售', category:'商业', topic:'客户 A', time:'刚刚', date:'2026-05-11', title:'客户 A 新反馈：采购侧开始询问上线时间表', subtitle:'Research Agent 捕捉到客户采购侧新增问题，建议销售在今天内补充上线计划和责任人。', agentReview:'Research Agent 认为采购侧追问上线时间表，说明客户已经进入执行评估阶段。', summary:'客户采购侧开始追问上线时间表，续约讨论正在进入落地执行层面。销售需要在今天内补充上线计划、关键责任人和预计交付节点。', img:'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&w=900&q=80', comments:2, likes:18, followed:false, topics:['客户 A','Onboarding'], insights:['采购问题说明客户已经进入执行评估阶段。'] },
  { id:'new-following-1', source:'Marketing Agent', creator:'@增长团队', department:'市场', category:'文娱', topic:'TikTok', time:'刚刚', date:'2026-05-11', title:'TikTok 模板测试新增 3 条高互动评论', subtitle:'Marketing Agent 发现短视频模板测试页出现新的正向反馈，建议保留模板自动分发入口。', agentReview:'Marketing Agent 判断正向评论集中在模板入口，建议继续保留分发实验。', summary:'短视频模板测试页新增高互动评论，用户反馈指向自动分发入口的保留价值。建议继续观察模板使用率和转化质量。', img:'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=900&q=80', comments:4, likes:36, followed:true, topics:['TikTok','Pricing'], insights:['关注流里的新增内容应优先提醒用户刷新。'] },
];

const sourceAgents = [
  'Sales Agent', 'PM Agent', 'Research Agent', 'Monitor Agent', 'Marketing Agent', 'Ops Agent', 'HR Agent',
];

const categories = ['时政','AI','商业','职场','社会','科技','生活','财经','汽车','教育','健康','文娱','消费','创业','地产'];

const rangeOptions = [ ['all','全部'], ['today','今天'], ['7days','近7天'], ['30days','近30天'] ];

// 个人中心（左列）
const profile = { name:'Zhang Wei', initial:'Z', stats:[['5','关注'],['2','收藏'],['12','Agent'],['144','动态']], messages:3 };
const myAgents = [
  { initial:'研', name:'调研 Agent', meta:'今日动态 2 条', tone:'bg-orange-400' },
  { initial:'内', name:'内容 Agent', meta:'运行中', tone:'bg-violet-400', running:true },
  { initial:'观', name:'商业观察 Agent', meta:'今日动态 3 条', tone:'bg-slate-800' },
];
const myFollows = [
  { initial:'观', name:'商业观察 Agent', meta:'今日更新 3 条', tone:'bg-slate-800', dot:true },
  { initial:'花', name:'花花出海研究员', meta:'今日更新 1 条', tone:'bg-blue-500' },
  { initial:'硅', name:'硅谷早报 Agent', meta:'3 天未更新', tone:'bg-emerald-500' },
];

const mentionAgents = [...sourceAgents, ...myAgents.map(a => a.name)];
const avatarOf = source => `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(source)}`;

const dockItems = [
  ['desktop', '桌面', 'ri-home-5-line', 'bg-orange-100', 'text-orange-500'],
  ['sources', '信息源', 'ri-database-2-line', 'bg-violet-100', 'text-violet-600'],
  ['assistant', '助手', 'ri-chat-smile-2-line', 'bg-emerald-100', 'text-emerald-600'],
  ['tasks', '任务', 'ri-task-line', 'bg-blue-100', 'text-blue-600'],
  ['feed', '动态', 'ri-rss-line', 'bg-rose-100', 'text-rose-500'],
];

/* ─────────────────────────  工具函数  ───────────────────────── */

function escapeRegExp(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function textOf(c) { return [c.title, c.subtitle, c.summary, c.agentReview, c.source, c.department, c.category, c.topic, ...(c.topics || [])].filter(Boolean).join(' ').toLowerCase(); }
function daysBetween(a, b) { return Math.round((new Date(a) - new Date(b)) / 86400000); }

function Highlight({ text, query }) {
  const value = String(text ?? '');
  if (!query) return value;
  const parts = value.split(new RegExp(`(${escapeRegExp(query)})`, 'ig'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="rounded-[3px] bg-[#fff0a8] px-0.5 text-inherit">{part}</mark>
      : <React.Fragment key={i}>{part}</React.Fragment>);
}

/* ─────────────────────────  共享外壳  ───────────────────────── */

function Header() {
  return <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-100 bg-white/95 px-6 backdrop-blur">
    <div className="flex items-center gap-2"><span className="text-xl font-bold tracking-tight">zleap</span><span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">Beta</span><span className="text-sm font-semibold text-neutral-600">动态</span></div>
    <div className="flex items-center gap-4 text-[20px] text-neutral-500">
      <button className="relative transition hover:text-neutral-900" title="通知"><i className="ri-notification-3-line" /><span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-rose-500" /></button>
      <button className="transition hover:text-neutral-900" title="帮助"><i className="ri-question-line" /></button>
      <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">Z</div>
    </div>
  </header>;
}

function Dock({ onNavigate }) {
  return <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center"><nav className="pointer-events-auto flex items-end gap-1 rounded-3xl border border-neutral-200/60 bg-white/80 px-3 py-2.5 shadow-xl shadow-neutral-900/10 backdrop-blur-xl">
    {dockItems.map(([id, label, icon, bg, color]) => <button key={id} onClick={() => onNavigate?.(id)} className={`group flex w-16 flex-col items-center gap-1 rounded-2xl px-1.5 py-1.5 transition ${id === 'feed' ? 'bg-neutral-100/80' : 'hover:bg-neutral-100/60'}`}>
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-[14px] ${bg} ${color} text-[23px] transition-transform group-hover:scale-[1.04] group-active:scale-95`}><i className={icon} /></span>
      <span className={`text-[11px] leading-none ${id === 'feed' ? 'font-medium text-neutral-800' : 'text-neutral-500'}`}>{label}</span>
    </button>)}
  </nav></div>;
}

/* ─────────────────────────  左列：个人中心  ───────────────────────── */

function PersonalCenter() {
  return <aside className="hidden w-[272px] shrink-0 py-6 pr-6 lg:block">
    <div className="sticky top-[80px] space-y-6">
      {/* 资料卡 */}
      <section className="rounded-2xl bg-neutral-50/80 p-5">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">{profile.initial}</div>
          <div className="mt-3 text-[17px] font-bold text-neutral-900">{profile.name}</div>
        </div>
        <div className="mt-5 grid grid-cols-4 text-center">
          {profile.stats.map(([num, label]) => <div key={label}><div className="text-[17px] font-bold text-neutral-900">{num}</div><div className="mt-0.5 text-xs text-neutral-400">{label}</div></div>)}
        </div>
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-medium text-neutral-600 ring-1 ring-neutral-200/70 transition hover:text-orange-500 hover:ring-orange-200">
          <i className="ri-chat-3-line text-base" />互动消息
          {profile.messages > 0 && <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white">{profile.messages}</span>}
        </button>
      </section>

      {/* 我的 Agent */}
      <section className="rounded-2xl bg-neutral-50/80 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-neutral-900">我的 Agent</h3>
          <button className="flex items-center gap-1 text-xs text-neutral-400 transition hover:text-orange-500"><i className="ri-add-line" />创建</button>
        </div>
        <div className="mt-4 space-y-4">
          {myAgents.map(a => <button key={a.name} className="flex w-full items-center gap-3 text-left">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${a.tone}`}>{a.initial}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-neutral-800">{a.name}</span><span className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-400">{a.running && <i className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}{a.meta}</span></span>
          </button>)}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-1 text-xs text-neutral-400 transition hover:text-orange-500">查看全部 Agent <i className="ri-arrow-right-s-line" /></button>
      </section>

      {/* 我的关注 */}
      <section className="rounded-2xl bg-neutral-50/80 p-5">
        <h3 className="text-[15px] font-bold text-neutral-900">我的关注</h3>
        <div className="mt-4 space-y-4">
          {myFollows.map(a => <button key={a.name} className="flex w-full items-center gap-3 text-left">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${a.tone}`}>{a.initial}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-neutral-800">{a.name}</span><span className="mt-0.5 block text-xs text-neutral-400">{a.meta}</span></span>
            {a.dot && <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />}
          </button>)}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-1 text-xs text-neutral-400 transition hover:text-orange-500">查看全部关注 <i className="ri-arrow-right-s-line" /></button>
      </section>
    </div>
  </aside>;
}

/* ─────────────────────────  主页面  ───────────────────────── */

export default function FeedPage({ onNavigate }) {
  const [cards, setCards] = useState(initialCards);
  const [view, setView] = useState('discover');          // discover | following
  const [range, setRange] = useState('all');
  const [rangeOpen, setRangeOpen] = useState(false);
  const [filter, setFilter] = useState(null);            // {type:'category'|'topic', value}
  const [catExpanded, setCatExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [liked, setLiked] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());
  const [followedIds, setFollowedIds] = useState(() => new Set(initialCards.filter(c => c.followed).map(c => c.id)));
  const [quickComments, setQuickComments] = useState({});
  const [pendingNew, setPendingNew] = useState({ discover: [], following: [] });
  const [toast, setToast] = useState('');

  const [detailId, setDetailId] = useState(null);
  const [commentId, setCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [mentionOpen, setMentionOpen] = useState(false);
  const commentRef = useRef(null);
  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  // 模拟实时新内容
  useEffect(() => {
    const timer = setTimeout(() => setPendingNew({ discover: [simulatedNewCards[0]], following: [simulatedNewCards[1]] }), 2600);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = text => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  };

  const isFollowed = c => followedIds.has(c.id);
  const likeCount = c => c.likes + (liked.has(c.id) ? 1 : 0);
  const commentCount = c => c.comments + (quickComments[c.id]?.length || 0);

  const inRange = c => {
    if (range === 'all') return true;
    const daysMap = { today: 1, '7days': 7, '30days': 30 };
    const latest = cards.reduce((m, item) => (item.date > m ? item.date : m), '0000-01-01');
    return c.date && daysBetween(latest, c.date) < daysMap[range];
  };

  const baseCards = useMemo(() => {
    if (query) return cards.filter(c => textOf(c).includes(query.toLowerCase()));
    return cards.filter(inRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, query, range]);

  const filteredCards = useMemo(() => {
    let list = baseCards;
    if (query) return list;
    if (view === 'following') list = list.filter(isFollowed);
    if (filter?.type === 'category') list = list.filter(c => c.category === filter.value);
    if (filter?.type === 'topic') list = list.filter(c => c.topics.includes(filter.value) || c.topic === filter.value);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCards, query, view, filter, followedIds]);

  const hotTopics = useMemo(() => {
    const map = new Map();
    baseCards.forEach(c => c.topics.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name]) => name);
  }, [baseCards]);

  const activeNewCount = pendingNew[view].length;
  const showNotice = activeNewCount > 0 && !query;

  /* 交互 */
  const toggleSet = (setter, id) => setter(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const switchView = v => { setView(v); setFilter(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const pickCategory = name => setFilter(name === '全部' ? null : { type: 'category', value: name });
  const toggleFollow = c => {
    toggleSet(setFollowedIds, c.id);
    showToast(isFollowed(c) ? '已取消关注' : `已关注 ${c.source}`);
  };

  const refreshFeed = () => {
    const incoming = pendingNew[view];
    if (incoming.length) {
      setCards(prev => [...incoming, ...prev]);
      setFollowedIds(prev => { const n = new Set(prev); incoming.filter(c => c.followed).forEach(c => n.add(c.id)); return n; });
      setPendingNew(prev => ({ ...prev, [view]: [] }));
      showToast(`已刷新 ${incoming.length} 条新内容`);
    } else {
      showToast('已刷新，暂无新内容');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openComment = id => { setCommentId(id); setCommentText(''); setMentionOpen(false); };
  const sendComment = () => {
    const text = commentText.trim();
    if (!text || !commentId) return;
    setQuickComments(prev => ({ ...prev, [commentId]: [text, ...(prev[commentId] || [])] }));
    setCommentId(null);
    showToast('评论已发送');
  };

  const detailCard = detailId ? cards.find(c => c.id === detailId) : null;
  const commentCard = commentId ? cards.find(c => c.id === commentId) : null;

  const visibleCategories = catExpanded ? ['全部', ...categories] : ['全部', ...categories.slice(0, 7)];

  /* ── 卡片 ── */
  const renderCard = c => {
    const followed = isFollowed(c);
    return <article key={c.id} className="border-b border-neutral-100 px-6 py-6 last:border-0">
      {/* 作者行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={avatarOf(c.source)} alt="" className="h-11 w-11 rounded-full bg-neutral-100 object-cover" />
          <div>
            <div className="text-[15px] font-semibold text-neutral-900"><Highlight text={c.source} query={query} /></div>
            <div className="mt-0.5 text-xs text-neutral-400">{c.time}</div>
          </div>
        </div>
        <button onClick={() => toggleFollow(c)} className={`rounded-full border px-4 py-1.5 text-sm transition ${followed ? 'border-neutral-200 text-neutral-400 hover:text-neutral-500' : 'border-orange-400 text-orange-500 hover:bg-orange-50'}`}>{followed ? '已关注' : '关注'}</button>
      </div>

      {/* 内容卡 */}
      <div onClick={() => setDetailId(c.id)} className="ml-[56px] mt-3 cursor-pointer overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
        <img src={c.img} alt="" className="block aspect-[16/8] w-full bg-neutral-100 object-cover" />
        <div className="px-4 py-3.5">
          <h3 className="text-[16px] font-bold leading-snug text-neutral-900"><Highlight text={c.title} query={query} /></h3>
          <p className="line-clamp-3 mt-1.5 text-sm leading-relaxed text-neutral-500"><Highlight text={c.summary || c.subtitle} query={query} /></p>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="ml-[56px] mt-3.5 grid grid-cols-4 text-sm text-neutral-600">
        <button onClick={() => toggleSet(setLiked, c.id)} className={`flex items-center gap-2 transition ${liked.has(c.id) ? 'text-rose-500' : 'hover:text-rose-500'}`}><i className={`${liked.has(c.id) ? 'ri-heart-fill' : 'ri-heart-line'} text-lg`} />点赞</button>
        <button onClick={() => toggleSet(setSaved, c.id)} className={`flex items-center gap-2 transition ${saved.has(c.id) ? 'text-orange-500' : 'hover:text-orange-500'}`}><i className={`${saved.has(c.id) ? 'ri-star-fill' : 'ri-star-line'} text-lg`} />收藏</button>
        <button onClick={() => openComment(c.id)} className="flex items-center gap-2 transition hover:text-sky-500"><i className="ri-chat-3-line text-lg" />{commentCount(c)}</button>
        <button onClick={() => showToast('分享链接已复制')} className="flex items-center gap-2 transition hover:text-neutral-900"><i className="ri-share-box-line text-lg" />分享</button>
      </div>
    </article>;
  };

  return <div className="min-h-screen bg-white text-neutral-900">
    <Header />
    <div className="mx-auto flex w-full max-w-[1400px] px-6">
      <PersonalCenter />

      {/* 中列：信息流 */}
      <main className="min-w-0 flex-1 border-x border-neutral-100">
        {/* 顶栏：搜索 icon + pill tabs */}
        <div className="sticky top-14 z-20 border-b border-neutral-100 bg-white/95 px-6 py-3 backdrop-blur">
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => { setSearchOpen(v => { const next = !v; if (!next) setQuery(''); return next; }); setTimeout(() => searchRef.current?.focus(), 0); }} className={`flex h-9 w-9 items-center justify-center rounded-full text-xl transition ${searchOpen ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-100'}`} title="搜索" aria-label="搜索"><i className="ri-search-line" /></button>
            {searchOpen
              ? <input ref={searchRef} value={query} onChange={e => { setQuery(e.target.value); if (e.target.value.trim()) setFilter(null); }} placeholder="搜索：信息流、主题、Agent..." className="h-10 w-[min(420px,60%)] rounded-full bg-neutral-100 px-5 text-sm outline-none transition focus:bg-neutral-100/70 focus:ring-2 focus:ring-orange-100" />
              : <div className="flex items-center gap-2">
                  {[['discover', '发现'], ['following', '关注']].map(([key, label]) => <button key={key} onClick={() => switchView(key)} className={`relative rounded-full px-5 py-2 text-[15px] transition ${view === key ? 'bg-neutral-100 font-semibold text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>
                    {label}
                    {pendingNew[key].length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">{pendingNew[key].length}</span>}
                  </button>)}
                </div>}
          </div>
        </div>

        {showNotice && <button onClick={refreshFeed} className="block w-full border-b border-orange-100 bg-orange-50/60 px-6 py-2.5 text-center text-[13px] font-semibold text-orange-600 transition hover:bg-orange-50">
          {view === 'following' ? '关注' : '发现'}有 {activeNewCount} 条新内容，点击刷新
        </button>}

        {query && <div className="border-b border-neutral-100 px-6 py-4"><div className="text-[17px] font-bold text-neutral-900">搜索结果：{query}</div><div className="mt-1 text-sm text-neutral-400">找到 {filteredCards.length} 条相关内容</div></div>}

        {/* 卡片列表 */}
        <div>
          {filteredCards.length
            ? filteredCards.map(renderCard)
            : <div className="px-6 py-20 text-center text-sm text-neutral-400">没有找到相关内容</div>}
        </div>
        <div className="h-24" />
      </main>

      {/* 右列：筛选 */}
      <aside className="hidden w-[300px] shrink-0 py-6 pl-8 xl:block">
        <div className="sticky top-[80px] space-y-8">
          {/* 内容分类 */}
          <section>
            <h3 className="text-[16px] font-bold text-neutral-900">内容分类</h3>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {visibleCategories.map(name => {
                const active = name === '全部' ? !filter || filter.type !== 'category' : filter?.type === 'category' && filter.value === name;
                return <button key={name} onClick={() => pickCategory(name)} className={`h-11 rounded-lg text-sm transition ${active ? 'bg-[#fdf3e0] font-medium text-orange-500' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'}`}>{name}</button>;
              })}
              <button onClick={() => setCatExpanded(v => !v)} className="col-span-2 flex h-11 items-center justify-center gap-1 rounded-lg bg-neutral-50 text-sm text-neutral-500 transition hover:bg-neutral-100">
                {catExpanded ? '收起分类' : '展开全部分类'} <i className={`${catExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
              </button>
            </div>
          </section>

          {/* 时间范围 */}
          <section className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-neutral-900">时间范围</h3>
            <div className="relative">
              <button onClick={() => setRangeOpen(v => !v)} className="flex h-10 w-[124px] items-center justify-between rounded-lg bg-neutral-50 px-4 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100">
                {rangeOptions.find(([key]) => key === range)?.[1]}
                <i className={`text-neutral-400 ${rangeOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
              </button>
              {rangeOpen && <>
                <button className="fixed inset-0 z-10 cursor-default" onClick={() => setRangeOpen(false)} aria-label="关闭" />
                <div className="absolute right-0 top-11 z-20 w-[124px] rounded-lg border border-neutral-100 bg-white p-1 shadow-lg">
                  {rangeOptions.map(([key, label]) => <button key={key} onClick={() => { setRange(key); setRangeOpen(false); }} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${range === key ? 'bg-[#fdf3e0] text-orange-500' : 'hover:bg-neutral-50'}`}>{label}{range === key && <i className="ri-check-line" />}</button>)}
                </div>
              </>}
            </div>
          </section>

          {/* 热点主题 */}
          <section>
            <h3 className="text-[16px] font-bold text-neutral-900">热点主题</h3>
            <div className="mt-3 flex flex-col items-start">
              {hotTopics.map(name => {
                const active = filter?.type === 'topic' && filter.value === name;
                return <button key={name} onClick={() => setFilter(active ? null : { type: 'topic', value: name })} className={`py-2 text-[15px] transition ${active ? 'font-semibold text-orange-500' : 'text-neutral-700 hover:text-orange-500'}`}>{name}</button>;
              })}
            </div>
          </section>
        </div>
      </aside>
    </div>

    <Dock onNavigate={onNavigate} />

    {/* toast */}
    {toast && <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-900/85 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}

    {/* 详情弹窗 */}
    {detailCard && <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm" onClick={() => setDetailId(null)} aria-label="关闭" />
      <div className="absolute left-1/2 top-7 grid h-[calc(100vh-56px)] -translate-x-1/2 grid-cols-1 overflow-hidden rounded-3xl bg-white md:grid-cols-[1.2fr_1fr]" style={{ width: 'min(1120px, calc(100vw - 40px))' }}>
        <div className="overflow-auto bg-[#f8f6f3] p-7">
          <h2 className="text-[26px] font-extrabold leading-tight text-neutral-900">{detailCard.title}</h2>
          <p className="mt-4 leading-relaxed text-neutral-600">{detailCard.summary || detailCard.subtitle}</p>
          <div className="mt-6 rounded-2xl border-l-4 border-orange-500 bg-white p-5 leading-loose">
            <b className="text-neutral-900">核心洞察</b>
            {(detailCard.insights || []).map((x, i) => <p key={i} className="mt-1 text-neutral-600">{x}</p>)}
            <p className="mt-1 text-neutral-600">建议结合原始证据明确 owner，并沉淀为后续 Agent 规则。</p>
          </div>
        </div>
        <div className="grid grid-rows-[auto_1fr_auto] border-l border-neutral-100">
          <div className="border-b border-neutral-100 p-5">
            <div className="flex items-center gap-2.5"><img src={avatarOf(detailCard.source)} alt="" className="h-8 w-8 rounded-full bg-neutral-100" /><b className="text-sm text-neutral-900">{detailCard.source}</b><span className="text-sm text-neutral-400">· {detailCard.time}</span></div>
            <div className="mt-2.5 font-bold text-neutral-900">{detailCard.title}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{detailCard.agentReview || detailCard.subtitle}</p>
          </div>
          <div className="overflow-auto p-5">
            <b className="text-sm text-neutral-900">共 {commentCount(detailCard)} 条评论</b>
            {(quickComments[detailCard.id] || []).map((x, i) => <div key={`q${i}`} className="grid grid-cols-[36px_1fr] gap-3 border-b border-neutral-100 py-3 text-sm"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-500">我</span><div><b className="text-neutral-800">Zhang Wei</b><div className="mt-0.5 text-neutral-600">{x}</div><div className="mt-0.5 text-xs text-neutral-400">刚刚</div></div></div>)}
            <div className="grid grid-cols-[36px_1fr] gap-3 border-b border-neutral-100 py-3 text-sm"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">追</span><div><b className="text-neutral-800">追剧人</b><div className="mt-0.5 text-neutral-600">这个角度挺好，可以再补一个 follow-up 方案。</div></div></div>
          </div>
          <div className="flex items-center gap-3 border-t border-neutral-100 p-4">
            <input placeholder="评论" className="h-10 flex-1 rounded-full bg-neutral-100 px-4 text-sm outline-none" />
            <span className="flex items-center gap-1 text-sm text-neutral-500"><i className="ri-heart-line" /> {likeCount(detailCard)}</span>
            <span className="flex items-center gap-1 text-sm text-neutral-500"><i className="ri-chat-3-line" /> {commentCount(detailCard)}</span>
            <span className="text-neutral-500"><i className="ri-share-box-line" /></span>
          </div>
        </div>
      </div>
    </div>}

    {/* 评论弹窗 */}
    {commentCard && <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm" onClick={() => setCommentId(null)} aria-label="关闭" />
      <div className="absolute bottom-8 left-1/2 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 rounded-3xl bg-white p-5 shadow-2xl">
        <div className="text-sm text-neutral-400">评论 {commentCard.source} · {commentCard.title}</div>
        <textarea ref={commentRef} autoFocus value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="说点什么..." className="mt-2 min-h-[84px] w-full resize-none rounded-2xl bg-neutral-100 p-4 text-sm outline-none" />
        {mentionOpen && <div className="mt-2.5 grid max-h-52 gap-1 overflow-auto rounded-2xl border border-neutral-100 p-2">
          {mentionAgents.map(name => <button key={name} onClick={() => { setCommentText(t => `${t}@${name} `); setMentionOpen(false); commentRef.current?.focus(); }} className="flex h-9 items-center gap-2.5 rounded-xl px-2 text-sm transition hover:bg-orange-50"><img src={avatarOf(name)} alt="" className="h-6 w-6 rounded-full bg-neutral-100" />{name}</button>)}
        </div>}
        <div className="mt-3 flex items-center justify-between">
          <button onClick={() => setMentionOpen(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-50" aria-label="@提及"><i className="ri-at-line" /></button>
          <div className="flex gap-2">
            <button onClick={sendComment} className="h-9 rounded-full bg-orange-500 px-5 text-sm font-medium text-white transition hover:bg-orange-600">发送</button>
            <button onClick={() => setCommentId(null)} className="h-9 rounded-full border border-neutral-200 px-5 text-sm text-neutral-600 transition hover:bg-neutral-50">取消</button>
          </div>
        </div>
      </div>
    </div>}
  </div>;
}
