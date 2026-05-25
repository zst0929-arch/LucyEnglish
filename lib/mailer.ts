import nodemailer from "nodemailer";
import type { Booking, Order, User } from "./types";

const bookingRecipient = process.env.BOOKING_NOTIFY_TO || "1521018128@qq.com";

function isMailerConfigured() {
  return Boolean(process.env.QQ_SMTP_USER && process.env.QQ_SMTP_AUTH_CODE);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.QQ_SMTP_HOST || "smtp.qq.com",
    port: Number(process.env.QQ_SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.QQ_SMTP_USER,
      pass: process.env.QQ_SMTP_AUTH_CODE
    }
  });
}

function renderRows(rows: Array<[string, string | number | undefined]>) {
  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:700;background:#f8fafc;">${label}</td>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;">${value || "-"}</td>
        </tr>`
    )
    .join("");
}

function plainRows(rows: Array<[string, string | number | undefined]>) {
  return rows.map(([label, value]) => `${label}: ${value || "-"}`).join("\n");
}

function notConfigured() {
  return {
    sent: false,
    reason: "QQ_SMTP_USER or QQ_SMTP_AUTH_CODE is not configured."
  };
}

function stageLabel(stage: string) {
  const stages: Record<string, string> = {
    "young-children": "Young Children 3-6 / 幼儿启蒙",
    "children-teens": "Children & Teens 7-16 / 少儿进阶",
    adults: "Adults 17+ / 成人实用",
    "china-study-camp": "China Study Camp / 中国研学营"
  };
  return stages[stage] || stage;
}

function levelLabel(level: string) {
  const levels: Record<string, string> = {
    beginner: "Beginner / 零基础",
    elementary: "Elementary / 初级",
    intermediate: "Intermediate / 中级",
    advanced: "Advanced / 高级"
  };
  return levels[level] || level;
}

export async function sendBookingNotification(booking: Booking) {
  if (!isMailerConfigured()) {
    return notConfigured();
  }

  const transporter = createTransporter();

  const rows = [
    ["Name / 姓名", booking.name],
    ["Email / 邮箱", booking.email],
    ["Contact / 联系方式", booking.contact || "-"],
    ["Nationality / 国籍", booking.nationality || "-"],
    ["Booking Project / 预订项目", booking.project || stageLabel(booking.stage)],
    ["Learning Stage / 学习阶段", stageLabel(booking.stage)],
    ["Chinese Level / 中文基础", levelLabel(booking.chineseLevel)],
    ["Service Date / 出行或服务日期", booking.serviceDate || booking.date],
    ["People / 人数", booking.people || 1],
    ["Amount / 金额", `USD $${booking.amount || 49}`],
    ["Payment Status / 支付状态", booking.paymentStatus || "unpaid"],
    ["Message / 咨询内容", booking.remarks || booking.message || "-"],
    ["Submitted At / 提交时间", new Date(booking.createdAt).toLocaleString("zh-CN", { hour12: false })],
    ["Booking ID", booking.id]
  ] satisfies Array<[string, string | number | undefined]>;

  await transporter.sendMail({
    from: `"Lucy Chinese Studio" <${process.env.QQ_SMTP_USER}>`,
    to: bookingRecipient,
    replyTo: booking.email,
    subject: `New Booking Submitted / 新预订提交 - ${booking.name}`,
    text: plainRows(rows),
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#1f2937;">
        <h2 style="margin:0 0 14px;">New Booking Submitted / 新预订提交</h2>
        <p style="margin:0 0 18px;color:#4b5563;">A learner submitted a booking request on Lucy Chinese Studio. 以下为完整预订信息。</p>
        <table style="border-collapse:collapse;width:100%;max-width:760px;font-size:14px;">${renderRows(rows)}</table>
      </div>`
  });

  return { sent: true, to: bookingRecipient };
}

export async function sendBookingConfirmation(booking: Booking) {
  if (!isMailerConfigured()) {
    return notConfigured();
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Lucy Chinese Studio" <${process.env.QQ_SMTP_USER}>`,
    to: booking.email,
    subject: "Your Lucy Chinese trial lesson is confirmed / 试听课预约已确认",
    text: [
      `Dear ${booking.name},`,
      "",
      "Your Lucy Chinese Studio trial lesson booking has been confirmed.",
      `Preferred date: ${booking.date}`,
      `Learning stage: ${stageLabel(booking.stage)}`,
      `Chinese level: ${levelLabel(booking.chineseLevel)}`,
      "",
      "Teacher Lucy will contact you with the next details.",
      "",
      "Lucy Chinese Studio"
    ].join("\n"),
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#1f2937;line-height:1.7;">
        <h2 style="margin:0 0 14px;">试听课预约已确认</h2>
        <p>Dear ${booking.name},</p>
        <p>Your Lucy Chinese Studio trial lesson booking has been confirmed. Lucy老师已确认你的试听课预约。</p>
        <div style="margin:18px 0;padding:16px;border-radius:16px;background:#f8fafc;">
          <p style="margin:0;"><strong>Preferred date / 期望日期：</strong>${booking.date}</p>
          <p style="margin:8px 0 0;"><strong>Learning stage / 学习阶段：</strong>${stageLabel(booking.stage)}</p>
          <p style="margin:8px 0 0;"><strong>Chinese level / 中文基础：</strong>${levelLabel(booking.chineseLevel)}</p>
        </div>
        <p>Teacher Lucy will contact you with the next details.</p>
      </div>`
  });

  return { sent: true, to: booking.email };
}

export async function sendLoginCode(email: string, code: string) {
  if (!isMailerConfigured()) {
    return notConfigured();
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Lucy Chinese Studio" <${process.env.QQ_SMTP_USER}>`,
    to: email,
    subject: "Lucy Chinese Studio login code / 登录验证码",
    text: `Your Lucy Chinese Studio login code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#1f2937;line-height:1.6;">
        <h2 style="margin:0 0 14px;">Lucy Chinese Studio 登录验证码</h2>
        <p>Your login code is:</p>
        <p style="font-size:30px;font-weight:800;letter-spacing:8px;margin:12px 0;">${code}</p>
        <p>This code expires in 10 minutes.</p>
      </div>`
  });

  return { sent: true };
}

export async function sendRegistrationNotification(user: Pick<User, "id" | "name" | "email" | "createdAt">, method: string) {
  if (!isMailerConfigured()) return notConfigured();

  const transporter = createTransporter();
  const rows = [
    ["Name / 姓名", user.name],
    ["Email / 邮箱", user.email],
    ["Register Method / 注册方式", method],
    ["Registered At / 注册时间", new Date(user.createdAt).toLocaleString("zh-CN", { hour12: false })],
    ["User ID", user.id]
  ] satisfies Array<[string, string | number | undefined]>;

  await transporter.sendMail({
    from: `"Lucy Chinese Studio" <${process.env.QQ_SMTP_USER}>`,
    to: bookingRecipient,
    subject: `New User Registration / 新用户注册 - ${user.name}`,
    text: plainRows(rows),
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#1f2937;">
        <h2 style="margin:0 0 14px;">New User Registration / 新用户注册</h2>
        <p style="margin:0 0 18px;color:#4b5563;">A learner created an account on Lucy Chinese Studio. 以下为注册信息。</p>
        <table style="border-collapse:collapse;width:100%;max-width:720px;font-size:14px;">${renderRows(rows)}</table>
      </div>`
  });

  return { sent: true, to: bookingRecipient };
}

export async function sendPaymentNotification(order: Order, user?: Pick<User, "name" | "email"> | null, booking?: Booking | null) {
  if (!isMailerConfigured()) return notConfigured();

  const transporter = createTransporter();
  const rows = [
    ["Learner / 学员", user?.name || booking?.name || "-"],
    ["Email / 邮箱", user?.email || booking?.email || "-"],
    ["Course / 项目", order.courseName],
    ["Amount / 金额", `${order.currency} $${order.amount}`],
    ["Payment Status / 支付状态", order.status],
    ["Paid At / 支付时间", order.paidAt ? new Date(order.paidAt).toLocaleString("zh-CN", { hour12: false }) : "-"],
    ["Booking ID / 预订ID", order.bookingId || "-"],
    ["Order ID / 订单ID", order.id],
    ["Stripe Session / Stripe会话", order.stripeSessionId || "-"],
    ["Service Date / 服务日期", booking?.serviceDate || booking?.date || "-"],
    ["People / 人数", booking?.people || "-"],
    ["Remarks / 备注", booking?.remarks || booking?.message || "-"]
  ] satisfies Array<[string, string | number | undefined]>;

  await transporter.sendMail({
    from: `"Lucy Chinese Studio" <${process.env.QQ_SMTP_USER}>`,
    to: bookingRecipient,
    subject: `Payment Received / 收到缴费 - ${order.courseName}`,
    text: plainRows(rows),
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#1f2937;">
        <h2 style="margin:0 0 14px;">Payment Received / 收到缴费</h2>
        <p style="margin:0 0 18px;color:#4b5563;">A paid order has been confirmed in Lucy Chinese Studio. 以下为缴费与关联预订信息。</p>
        <table style="border-collapse:collapse;width:100%;max-width:760px;font-size:14px;">${renderRows(rows)}</table>
      </div>`
  });

  return { sent: true, to: bookingRecipient };
}
