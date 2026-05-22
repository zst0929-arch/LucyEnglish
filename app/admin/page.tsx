"use client";

import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Database,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AdminBooking = {
  id: string;
  userId: string;
  name: string;
  email: string;
  nationality: string;
  stage: string;
  chineseLevel: string;
  date: string;
  message: string;
  status: "pending" | "confirmed";
  createdAt: string;
  user: AdminUser | null;
};

type AdminOrder = {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: "USD";
  status: "paid" | "pending";
  createdAt: string;
  user: AdminUser | null;
};

type AdminCourse = {
  id: string;
  age: string;
  price: number;
  image: string;
  title: { en: string; zh: string };
  subtitle: { en: string; zh: string };
  points: { en: string[]; zh: string[] };
};

type AdminResource = {
  id: string;
  title: { en: string; zh: string };
  intro: { en: string; zh: string };
  image: string;
  groupCount: number;
  itemCount: number;
};

type Summary = {
  users: number;
  bookings: number;
  pendingBookings: number;
  orders: number;
  paidOrders: number;
};

type TabId = "dashboard" | "bookings" | "orders" | "users" | "courses" | "resources";

const tabs: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "仪表盘", icon: LayoutDashboard },
  { id: "bookings", label: "预约管理", icon: CalendarCheck },
  { id: "orders", label: "订单管理", icon: CreditCard },
  { id: "users", label: "用户列表", icon: UsersRound },
  { id: "courses", label: "课程只读", icon: BookOpen },
  { id: "resources", label: "资源只读", icon: Database }
];

const stageLabels: Record<string, string> = {
  "young-children": "幼儿启蒙 / Young Children 3-6",
  "children-teens": "少儿进阶 / Children & Teens 7-16",
  adults: "成人实用 / Adults 17+",
  "china-study-camp": "中国研学营 / China Study Camp"
};

const levelLabels: Record<string, string> = {
  beginner: "零基础 / Beginner",
  elementary: "初级 / Elementary",
  intermediate: "中级 / Intermediate",
  advanced: "高级 / Advanced"
};

const emptySummary: Summary = {
  users: 0,
  bookings: 0,
  pendingBookings: 0,
  orders: 0,
  paidOrders: 0
};

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", { hour12: false });
}

function bookingStatusLabel(status: AdminBooking["status"]) {
  return status === "confirmed" ? "已确认" : "待处理";
}

function orderStatusLabel(status: AdminOrder["status"]) {
  return status === "paid" ? "已支付" : "待支付";
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [token, setToken] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [query, setQuery] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"all" | AdminBooking["status"]>("all");
  const [orderStatus, setOrderStatus] = useState<"all" | AdminOrder["status"]>("all");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("lucy-admin-token") || "";
    const savedEmail = localStorage.getItem("lucy-admin-email") || "";
    if (!savedToken) return;
    setToken(savedToken);
    setAdminEmail(savedEmail);
    void loadAdminData(savedToken);
  }, []);

  async function adminFetch<T>(path: string, options: RequestInit = {}, activeToken = token) {
    const response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeToken}`,
        ...(options.headers || {})
      }
    });
    const result = (await response.json()) as T & { error?: string };
    if (response.status === 401) {
      handleLogout();
      throw new Error("管理员登录已过期，请重新登录。");
    }
    if (!response.ok) throw new Error(result.error || "后台请求失败。");
    return result;
  }

  async function loadAdminData(activeToken = token) {
    if (!activeToken) return;
    setLoading(true);
    setNotice("");
    try {
      const [summaryResult, bookingsResult, ordersResult, usersResult, contentResult] = await Promise.all([
        adminFetch<{ summary: Summary }>("/api/admin/summary", {}, activeToken),
        adminFetch<{ bookings: AdminBooking[] }>("/api/admin/bookings", {}, activeToken),
        adminFetch<{ orders: AdminOrder[] }>("/api/admin/orders", {}, activeToken),
        adminFetch<{ users: AdminUser[] }>("/api/admin/users", {}, activeToken),
        adminFetch<{ courses: AdminCourse[]; resources: AdminResource[] }>("/api/admin/content", {}, activeToken)
      ]);
      setSummary(summaryResult.summary);
      setBookings(bookingsResult.bookings);
      setOrders(ordersResult.orders);
      setUsers(usersResult.users);
      setCourses(contentResult.courses);
      setResources(contentResult.resources);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "后台数据加载失败。");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = (await response.json()) as { token?: string; admin?: { email: string }; error?: string };
      if (!response.ok || !result.token) throw new Error(result.error || "管理员登录失败。");
      localStorage.setItem("lucy-admin-token", result.token);
      localStorage.setItem("lucy-admin-email", result.admin?.email || email);
      setToken(result.token);
      setAdminEmail(result.admin?.email || email);
      await loadAdminData(result.token);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "管理员登录失败。");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("lucy-admin-token");
    localStorage.removeItem("lucy-admin-email");
    setToken("");
    setAdminEmail("");
    setBookings([]);
    setOrders([]);
    setUsers([]);
    setCourses([]);
    setResources([]);
    setSummary(emptySummary);
  }

  async function updateBookingStatus(booking: AdminBooking, status: AdminBooking["status"]) {
    try {
      const result = await adminFetch<{
        booking: AdminBooking;
        emailStatus: null | { sent: boolean; reason?: string; to?: string };
      }>(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setBookings((current) => current.map((item) => (item.id === booking.id ? { ...item, status: result.booking.status } : item)));
      await loadAdminData();
      if (result.emailStatus?.sent) {
        setNotice(`预约已确认，确认邮件已发送至 ${result.emailStatus.to || booking.email}。`);
      } else if (result.emailStatus) {
        setNotice(`预约状态已更新，但确认邮件未发送：${result.emailStatus.reason || "未知原因"}`);
      } else {
        setNotice("预约状态已更新。");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "预约状态更新失败。");
    }
  }

  async function updateOrderStatus(order: AdminOrder, status: AdminOrder["status"]) {
    try {
      const result = await adminFetch<{ order: AdminOrder }>(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status: result.order.status } : item)));
      await loadAdminData();
      setNotice("订单状态已更新。");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "订单状态更新失败。");
    }
  }

  const filteredBookings = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus = bookingStatus === "all" || booking.status === bookingStatus;
      const haystack = [booking.name, booking.email, booking.nationality, booking.stage, booking.chineseLevel, booking.message]
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!keyword || haystack.includes(keyword));
    });
  }, [bookings, bookingStatus, query]);

  const filteredOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = orderStatus === "all" || order.status === orderStatus;
      const haystack = [order.courseName, order.courseId, order.user?.name, order.user?.email].join(" ").toLowerCase();
      return matchesStatus && (!keyword || haystack.includes(keyword));
    });
  }, [orders, orderStatus, query]);

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center bg-ivory px-5 py-10 text-ink">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tea text-white">
              <Settings size={22} />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-tea">Admin</p>
              <h1 className="font-display text-3xl font-bold">后台管理登录</h1>
            </div>
          </div>
          <label className="mt-7 block text-sm font-bold text-ink/68">
            管理员邮箱
            <input name="email" type="text" inputMode="email" className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 outline-none focus:border-tea" required />
          </label>
          <label className="mt-4 block text-sm font-bold text-ink/68">
            管理员密码
            <input name="password" type="password" className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 outline-none focus:border-tea" required />
          </label>
          {notice && <p className="mt-5 rounded-2xl bg-mint p-4 text-sm font-bold text-ink">{notice}</p>}
          <button disabled={loading} className="mt-6 w-full rounded-full bg-ink px-5 py-3 font-bold text-white transition hover:bg-tea disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "登录中..." : "进入后台"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f4ec] text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#f6f4ec]/92 backdrop-blur">
        <div className="mx-auto flex min-h-20 w-[min(1240px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-tea">Lucy Chinese Studio</p>
            <h1 className="font-display text-3xl font-bold">后台管理台</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">{adminEmail}</span>
            <button onClick={() => loadAdminData()} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm transition hover:bg-mint">
              <RefreshCw size={16} />
              刷新
            </button>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-tea">
              <LogOut size={16} />
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-[min(1240px,calc(100%-32px))] gap-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-[1.5rem] bg-white p-3 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeTab === tab.id ? "bg-ink text-white" : "text-ink/70 hover:bg-ivory hover:text-ink"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        <section className="min-w-0">
          {notice && <p className="mb-5 rounded-2xl bg-mint p-4 text-sm font-bold text-ink">{notice}</p>}

          {activeTab === "dashboard" && (
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  ["用户数", summary.users],
                  ["预约数", summary.bookings],
                  ["待处理预约", summary.pendingBookings],
                  ["订单数", summary.orders],
                  ["已支付订单", summary.paidOrders]
                ].map(([label, value]) => (
                  <article key={label} className="rounded-[1.4rem] bg-white p-5 shadow-sm">
                    <p className="text-sm font-bold text-ink/54">{label}</p>
                    <p className="mt-3 font-display text-4xl font-bold">{value}</p>
                  </article>
                ))}
              </div>
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold">最新预约</h2>
                  {loading && <span className="text-sm font-bold text-tea">加载中...</span>}
                </div>
                <div className="mt-4 overflow-x-auto">
                  <BookingTable bookings={bookings.slice(0, 5)} onUpdate={updateBookingStatus} compact />
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <Panel title="预约管理">
              <Toolbar query={query} setQuery={setQuery}>
                <select value={bookingStatus} onChange={(event) => setBookingStatus(event.target.value as typeof bookingStatus)} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold outline-none">
                  <option value="all">全部状态</option>
                  <option value="pending">待处理</option>
                  <option value="confirmed">已确认</option>
                </select>
              </Toolbar>
              <BookingTable bookings={filteredBookings} onUpdate={updateBookingStatus} />
            </Panel>
          )}

          {activeTab === "orders" && (
            <Panel title="订单管理">
              <Toolbar query={query} setQuery={setQuery}>
                <select value={orderStatus} onChange={(event) => setOrderStatus(event.target.value as typeof orderStatus)} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold outline-none">
                  <option value="all">全部状态</option>
                  <option value="pending">待支付</option>
                  <option value="paid">已支付</option>
                </select>
              </Toolbar>
              <OrderTable orders={filteredOrders} onUpdate={updateOrderStatus} />
            </Panel>
          )}

          {activeTab === "users" && (
            <Panel title="用户列表">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.14em] text-ink/45">
                    <tr>
                      <th className="px-4 py-2">姓名</th>
                      <th className="px-4 py-2">邮箱</th>
                      <th className="px-4 py-2">注册时间</th>
                      <th className="px-4 py-2">用户 ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="bg-ivory">
                        <td className="rounded-l-2xl px-4 py-3 font-bold">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                        <td className="rounded-r-2xl px-4 py-3 text-xs text-ink/50">{user.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <EmptyState text="暂无用户。" />}
              </div>
            </Panel>
          )}

          {activeTab === "courses" && (
            <Panel title="课程只读">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <article key={course.id} className="overflow-hidden rounded-[1.4rem] bg-ivory">
                    <img src={course.image} alt={course.title.zh} className="h-40 w-full object-cover" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold">{course.title.zh}</h3>
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-tea">${course.price}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-ink/55">{course.title.en}</p>
                      <p className="mt-3 text-sm leading-6 text-ink/64">{course.subtitle.zh}</p>
                      <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-ink/40">Ages {course.age}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          )}

          {activeTab === "resources" && (
            <Panel title="资源只读">
              <div className="grid gap-4 md:grid-cols-2">
                {resources.map((resource) => (
                  <article key={resource.id} className="grid gap-4 rounded-[1.4rem] bg-ivory p-4 sm:grid-cols-[150px_1fr]">
                    <img src={resource.image} alt={resource.title.zh} className="h-32 w-full rounded-2xl object-cover" />
                    <div>
                      <h3 className="text-xl font-bold">{resource.title.zh}</h3>
                      <p className="mt-1 text-sm font-semibold text-tea">{resource.title.en}</p>
                      <p className="mt-3 text-sm leading-6 text-ink/64">{resource.intro.zh}</p>
                      <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-ink/40">
                        {resource.groupCount} 组 · {resource.itemCount} 条
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          )}
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Toolbar({
  query,
  setQuery,
  children
}: {
  query: string;
  setQuery: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <label className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold">
        <Search size={16} className="text-ink/42" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、邮箱、课程..." className="min-w-0 flex-1 bg-transparent outline-none" />
      </label>
      {children}
    </div>
  );
}

function BookingTable({
  bookings,
  onUpdate,
  compact = false
}: {
  bookings: AdminBooking[];
  onUpdate: (booking: AdminBooking, status: AdminBooking["status"]) => void;
  compact?: boolean;
}) {
  if (bookings.length === 0) return <EmptyState text="暂无预约。" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.14em] text-ink/45">
          <tr>
            <th className="px-4 py-2">学员</th>
            <th className="px-4 py-2">课程</th>
            <th className="px-4 py-2">日期</th>
            <th className="px-4 py-2">状态</th>
            {!compact && <th className="px-4 py-2">留言</th>}
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="bg-ivory align-top">
              <td className="rounded-l-2xl px-4 py-3">
                <p className="font-bold">{booking.name}</p>
                <p className="mt-1 text-xs text-ink/55">{booking.email}</p>
                {!compact && <p className="mt-1 text-xs text-ink/45">{booking.nationality || "未填写国籍"}</p>}
              </td>
              <td className="px-4 py-3">
                <p className="font-bold">{stageLabels[booking.stage] || booking.stage}</p>
                <p className="mt-1 text-xs text-ink/55">{levelLabels[booking.chineseLevel] || booking.chineseLevel}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-bold">{booking.date}</p>
                {!compact && <p className="mt-1 text-xs text-ink/45">{formatDate(booking.createdAt)}</p>}
              </td>
              <td className="px-4 py-3">
                <StatusPill tone={booking.status === "confirmed" ? "green" : "orange"}>{bookingStatusLabel(booking.status)}</StatusPill>
              </td>
              {!compact && <td className="max-w-[260px] px-4 py-3 text-ink/62">{booking.message || "-"}</td>}
              <td className="rounded-r-2xl px-4 py-3">
                <select
                  value={booking.status}
                  onChange={(event) => onUpdate(booking, event.target.value as AdminBooking["status"])}
                  className="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-bold outline-none"
                >
                  <option value="pending">待处理</option>
                  <option value="confirmed">已确认</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderTable({ orders, onUpdate }: { orders: AdminOrder[]; onUpdate: (order: AdminOrder, status: AdminOrder["status"]) => void }) {
  if (orders.length === 0) return <EmptyState text="暂无订单。" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[840px] border-separate border-spacing-y-2 text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.14em] text-ink/45">
          <tr>
            <th className="px-4 py-2">课程</th>
            <th className="px-4 py-2">用户</th>
            <th className="px-4 py-2">金额</th>
            <th className="px-4 py-2">状态</th>
            <th className="px-4 py-2">创建时间</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="bg-ivory align-top">
              <td className="rounded-l-2xl px-4 py-3">
                <p className="font-bold">{order.courseName}</p>
                <p className="mt-1 text-xs text-ink/50">{order.courseId}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-bold">{order.user?.name || "未知用户"}</p>
                <p className="mt-1 text-xs text-ink/55">{order.user?.email || order.userId}</p>
              </td>
              <td className="px-4 py-3 font-bold">
                {order.currency} ${order.amount}
              </td>
              <td className="px-4 py-3">
                <StatusPill tone={order.status === "paid" ? "green" : "orange"}>{orderStatusLabel(order.status)}</StatusPill>
              </td>
              <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
              <td className="rounded-r-2xl px-4 py-3">
                <select
                  value={order.status}
                  onChange={(event) => onUpdate(order, event.target.value as AdminOrder["status"])}
                  className="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-bold outline-none"
                >
                  <option value="pending">待支付</option>
                  <option value="paid">已支付</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPill({ tone, children }: { tone: "green" | "orange"; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${tone === "green" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
      {tone === "green" && <CheckCircle2 size={13} />}
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-2xl bg-ivory p-5 text-sm font-bold text-ink/48">{text}</p>;
}
