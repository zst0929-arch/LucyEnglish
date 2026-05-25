import nodemailer from "nodemailer";
import type { Booking } from "./types";

const bookingRecipient = process.env.BOOKING_NOTIFY_TO || "1521018128@qq.com";

function isMailerConfigured() {
  return Boolean(process.env.QQ_SMTP_USER && process.env.QQ_SMTP_AUTH_CODE);
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
    return {
      sent: false,
      reason: "QQ_SMTP_USER or QQ_SMTP_AUTH_CODE is not configured."
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.QQ_SMTP_HOST || "smtp.qq.com",
    port: Number(process.env.QQ_SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.QQ_SMTP_USER,
      pass: process.env.QQ_SMTP_AUTH_CODE
    }
  });

  const rows = [
    ["Name / 姓名", booking.name],
    ["Email / 邮箱", booking.email],
    ["Nationality / 国籍", booking.nationality || "-"],
    ["Learning Stage / 学习阶段", stageLabel(booking.stage)],
    ["Chinese Level / 中文基础", levelLabel(booking.chineseLevel)],
    ["Preferred Date / 期望试听日期", booking.date],
    ["Message / 咨询内容", booking.message || "-"],
    ["Submitted At / 提交时间", new Date(booking.createdAt).toLocaleString("zh-CN", { hour12: false })],
    ["Booking ID", booking.id]
  ];

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:700;background:#f8fafc;">${label}</td>
          <td style="padding:10px 12px;border:1px solid #e5e7eb;">${value}</td>
        </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"Lucy Chinese Studio" <${process.env.QQ_SMTP_USER}>`,
    to: bookingRecipient,
    replyTo: booking.email,
    subject: `New Trial Lesson Booking / 新试听预约 - ${booking.name}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `
      <div style="font-family:Arial,'Microsoft YaHei',sans-serif;color:#1f2937;">
        <h2 style="margin:0 0 14px;">New Trial Lesson Booking / 新试听预约</h2>
        <p style="margin:0 0 18px;color:#4b5563;">A learner submitted a booking request on Lucy Chinese Studio.</p>
        <table style="border-collapse:collapse;width:100%;max-width:720px;font-size:14px;">${htmlRows}</table>
      </div>`
  });

  return { sent: true, to: bookingRecipient };
}

export async function sendBookingConfirmation(booking: Booking) {
  if (!isMailerConfigured()) {
    return {
      sent: false,
      reason: "QQ_SMTP_USER or QQ_SMTP_AUTH_CODE is not configured."
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.QQ_SMTP_HOST || "smtp.qq.com",
    port: Number(process.env.QQ_SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.QQ_SMTP_USER,
      pass: process.env.QQ_SMTP_AUTH_CODE
    }
  });

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
    return {
      sent: false,
      reason: "QQ_SMTP_USER or QQ_SMTP_AUTH_CODE is not configured."
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.QQ_SMTP_HOST || "smtp.qq.com",
    port: Number(process.env.QQ_SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.QQ_SMTP_USER,
      pass: process.env.QQ_SMTP_AUTH_CODE
    }
  });

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
