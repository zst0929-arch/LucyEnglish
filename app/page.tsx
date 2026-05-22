"use client";

import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Landmark,
  MapPinned,
  MoveLeft,
  MoveRight,
  Languages,
  Lock,
  Mail,
  Menu,
  Sparkles,
  UserRound,
  X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { courses } from "@/lib/courses";
import { resourceLinks } from "@/lib/resources";
import type { Language } from "@/lib/types";

type User = {
  id: string;
  name: string;
  email: string;
};

type BookingView = {
  id: string;
  name: string;
  email: string;
  nationality: string;
  stage: string;
  chineseLevel: string;
  date: string;
  message: string;
  status: "pending" | "confirmed";
  createdAt: string;
};

const copy = {
  en: {
    nav: ["Home", "About Lucy", "Courses", "Free Test", "Features", "Resources", "Contact"],
    heroTag: "Chinese for global learners",
    heroTitle: "Professional Chinese Lessons for Every Learning Stage",
    heroText:
      "Teacher Lucy offers age-specific Mandarin lessons for young children, children and teens, and adults, combining warm guidance, structured progress, and practical speaking confidence.",
    trial: "Book a Trial Lesson",
    explore: "Explore Courses",
    login: "Register / Log in",
    about: "About Teacher Lucy",
    video: "Teacher Lucy Introduction",
    aboutText:
      "Lucy Zou is a certified International Mandarin teacher with 12 years of professional Chinese teaching experience. She is a native Mandarin speaker, a certified family education instructor, and a senior psychological counselor in China. Her lessons are patient, lively, and customized for each learner's age, level, and goal.",
    philosophy: "Fun introduction, step-by-step progress, and practical application.",
    courses: "Courses",
    coursesText: "Choose the right path by age and learning goal.",
    hskTest: "Free Chinese Level Test",
    hskTestText:
      "Inspired by HSK's focus on real-life Chinese ability, this free placement check helps new learners estimate their current level before booking a lesson.",
    startTest: "Start Free Test",
    learnerAge: "Learner age",
    studyDuration: "Chinese learning time",
    previous: "Previous",
    next: "Next",
    viewResult: "View Result",
    submitTest: "Submit Test",
    resetTest: "Try Again",
    testProgress: "Answered",
    features: "Teaching Features",
    resources: "Free Resources",
    contact: "Book a Trial / Contact",
    contactText:
      "Register, choose a learning stage, and send your preferred time. Lucy will recommend the right course plan.",
    authTitle: "Create your learning account",
    name: "Name",
    email: "Email",
    password: "Password",
    register: "Register",
    signIn: "Log in",
    bookingDate: "Preferred trial date",
    nationality: "Nationality",
    level: "Chinese level",
    message: "Message",
    submitBooking: "Submit Booking",
    emailCode: "Email Code Login",
    sendCode: "Send Code",
    verifyCode: "Verify & Log in",
    code: "Verification code",
    myBookings: "My Bookings",
    addToGoogle: "Add to Google Calendar",
    noBookings: "No bookings yet.",
    buyCourse: "Pay & Book Course",
    paidNote: "Course price is $49 USD per hour. Secure card payment is available through Stripe when payment keys are configured.",
    successBooking: "Booking submitted. Lucy will contact you soon.",
    successAuth: "You are signed in.",
    footer: "Helping global learners discover Chinese with confidence and joy."
  },
  zh: {
    nav: ["首页", "关于Lucy老师", "课程体系", "免费测试", "教学特色", "学习资源", "联系咨询"],
    heroTag: "面向全球学习者的中文课堂",
    heroTitle: "专业中文教学，适合每一个学习阶段",
    heroText:
      "Lucy老师为外国幼儿、少儿青少年与成人提供分龄中文课程，结合温暖引导、系统进阶与实用表达训练，帮助学习者自然开口说中文。",
    trial: "预约试听课",
    explore: "查看课程体系",
    login: "注册 / 登录",
    about: "关于Lucy老师",
    video: "Lucy老师介绍视频",
    aboutText:
      "Lucy Zou 老师是持证国际中文教师，拥有12年专业中文教学经验。她普通话标准，同时具备家庭教育指导师和中国高级心理咨询师资质。课堂耐心细致、生动有趣，擅长根据学习者年龄、中文基础与学习目标定制课程。",
    philosophy: "趣味启蒙，循序渐进，实用落地。",
    courses: "课程体系",
    coursesText: "根据年龄阶段与学习目标，选择最合适的中文学习路径。",
    hskTest: "免费中文水平测试",
    hskTestText: "参考 HSK 对真实中文使用能力的评估方向，为新学习者提供免费的入门分级测试，方便预约前了解当前水平。",
    startTest: "开始免费测试",
    learnerAge: "学习者年龄",
    studyDuration: "学中文时长",
    previous: "上一题",
    next: "下一题",
    viewResult: "查看结果",
    submitTest: "提交测试",
    resetTest: "重新测试",
    testProgress: "已完成",
    features: "教学特色",
    resources: "免费学习资源",
    contact: "预约试听 / 联系咨询",
    contactText: "注册账号后填写学习阶段与试听时间，Lucy老师会为你推荐合适的课程方案。",
    authTitle: "创建学习账号",
    name: "姓名",
    email: "邮箱",
    password: "密码",
    register: "注册",
    signIn: "登录",
    bookingDate: "期望试听日期",
    nationality: "国籍",
    level: "中文基础",
    message: "咨询内容",
    submitBooking: "提交预约",
    emailCode: "邮箱验证码登录",
    sendCode: "发送验证码",
    verifyCode: "验证并登录",
    code: "验证码",
    myBookings: "我的预约",
    addToGoogle: "加入 Google Calendar",
    noBookings: "暂无预约信息。",
    buyCourse: "付款购买课程",
    paidNote: "课程价格为每小时 49 美元。配置付款密钥后，可通过 Stripe 安全信用卡付款。",
    successBooking: "预约已提交，Lucy老师会尽快联系你。",
    successAuth: "你已登录。",
    footer: "陪伴全球学习者自信、快乐地走进中文世界。"
  }
};

const stats = [
  ["12 Years", "12年教学经验"],
  ["Certified Mandarin Teacher", "持证国际中文教师"],
  ["Native Mandarin Speaker", "普通话标准"],
  ["Family Education Instructor", "家庭教育指导师"],
  ["Senior Psychological Counselor", "高级心理咨询师"]
];

const features = [
  {
    icon: Languages,
    en: "Bilingual Support",
    zh: "双语辅助教学",
    textEn: "English support lowers the barrier for beginners and gradually builds Chinese thinking.",
    textZh: "灵活使用英文辅助讲解，帮助初学者逐步建立中文思维。"
  },
  {
    icon: UserRound,
    en: "One-on-One Guidance",
    zh: "一对一专属辅导",
    textEn: "Personal plans are shaped around age, level, goals, and learning habits.",
    textZh: "根据年龄、基础、目标和学习习惯定制学习方案。"
  },
  {
    icon: BookOpen,
    en: "Systematic Curriculum",
    zh: "系统课程体系",
    textEn: "Listening, speaking, reading, and writing grow together through staged lessons.",
    textZh: "围绕听说读写能力，进行阶梯式系统训练。"
  }
];

const studyCampHighlights = [
  {
    en: "Visit iconic Chinese landmarks",
    zh: "探访中国名胜古迹",
    textEn: "Explore places such as the Great Wall, the Forbidden City, ancient streets, museums, and cultural heritage sites.",
    textZh: "走进长城、故宫、古街、博物馆与文化遗产地，在真实场景中理解中国。"
  },
  {
    en: "Understand Chinese history",
    zh: "了解中国历史脉络",
    textEn: "Learn historical stories, dynasties, traditional architecture, etiquette, festivals, and cultural symbols.",
    textZh: "学习历史故事、朝代脉络、传统建筑、礼仪节日与文化符号。"
  },
  {
    en: "Use Chinese in real situations",
    zh: "真实场景中文实践",
    textEn: "Practice speaking tasks for travel, ordering food, asking directions, buying tickets, and cultural interviews.",
    textZh: "完成旅行、点餐、问路、购票、文化采访等实用中文任务。"
  }
];

const placementQuestions = [
  {
    id: "q1",
    band: "HSK 1",
    question: { en: "What does “谢谢” mean?", zh: "“谢谢”的意思是？" },
    options: [
      { id: "a", en: "Thank you", zh: "谢谢" },
      { id: "b", en: "Goodbye", zh: "再见" },
      { id: "c", en: "Sorry", zh: "对不起" }
    ],
    answer: "a"
  },
  {
    id: "q2",
    band: "HSK 1",
    question: { en: "Choose the correct answer: 你叫什么名字？", zh: "请选择正确回答：你叫什么名字？" },
    options: [
      { id: "a", en: "我很好", zh: "我很好" },
      { id: "b", en: "我叫 Lucy", zh: "我叫 Lucy" },
      { id: "c", en: "我是老师", zh: "我是老师" }
    ],
    answer: "b"
  },
  {
    id: "q3",
    band: "HSK 1",
    question: { en: "Which phrase means “Where are you from?”", zh: "哪一句是“Where are you from?”" },
    options: [
      { id: "a", en: "你来自哪里？", zh: "你来自哪里？" },
      { id: "b", en: "你去哪里？", zh: "你去哪里？" },
      { id: "c", en: "你在哪里？", zh: "你在哪里？" }
    ],
    answer: "a"
  },
  {
    id: "q4",
    band: "HSK 1",
    question: { en: "Choose the correct sentence for “I want this one.”", zh: "“I want this one.” 对应哪一句？" },
    options: [
      { id: "a", en: "我不要这个", zh: "我不要这个" },
      { id: "b", en: "我要这个", zh: "我要这个" },
      { id: "c", en: "我看这个", zh: "我看这个" }
    ],
    answer: "b"
  },
  {
    id: "q5",
    band: "HSK 2",
    question: { en: "Choose the best word: 我 ___ 中文。", zh: "选择合适的词：我 ___ 中文。" },
    options: [
      { id: "a", en: "会说", zh: "会说" },
      { id: "b", en: "很", zh: "很" },
      { id: "c", en: "在", zh: "在" }
    ],
    answer: "a"
  },
  {
    id: "q6",
    band: "HSK 2",
    question: { en: "What does “请再说一遍” mean?", zh: "“请再说一遍”的意思是？" },
    options: [
      { id: "a", en: "Please write it down", zh: "请写下来" },
      { id: "b", en: "Please say it again", zh: "请再说一次" },
      { id: "c", en: "Please wait outside", zh: "请在外面等" }
    ],
    answer: "b"
  },
  {
    id: "q7",
    band: "HSK 2",
    question: { en: "Choose the correct order.", zh: "请选择正确语序。" },
    options: [
      { id: "a", en: "我今天很忙", zh: "我今天很忙" },
      { id: "b", en: "忙我很今天", zh: "忙我很今天" },
      { id: "c", en: "今天忙很我", zh: "今天忙很我" }
    ],
    answer: "a"
  },
  {
    id: "q8",
    band: "HSK 2",
    question: { en: "Which one asks for a price?", zh: "哪一句是在问价格？" },
    options: [
      { id: "a", en: "多少钱？", zh: "多少钱？" },
      { id: "b", en: "几点了？", zh: "几点了？" },
      { id: "c", en: "谁来了？", zh: "谁来了？" }
    ],
    answer: "a"
  },
  {
    id: "q9",
    band: "HSK 3",
    question: { en: "Choose the most natural sentence.", zh: "请选择最自然的句子。" },
    options: [
      { id: "a", en: "因为下雨，所以我没去。", zh: "因为下雨，所以我没去。" },
      { id: "b", en: "所以下雨，因为我没去。", zh: "所以下雨，因为我没去。" },
      { id: "c", en: "我没去因为所以下雨。", zh: "我没去因为所以下雨。" }
    ],
    answer: "a"
  },
  {
    id: "q10",
    band: "HSK 3",
    question: { en: "What does “我需要帮助” mean?", zh: "“我需要帮助”的意思是？" },
    options: [
      { id: "a", en: "I need help", zh: "我需要帮助" },
      { id: "b", en: "I like Chinese", zh: "我喜欢中文" },
      { id: "c", en: "I am late", zh: "我迟到了" }
    ],
    answer: "a"
  },
  {
    id: "q11",
    band: "HSK 3",
    question: { en: "Choose the correct completion: 如果你有问题，___。", zh: "选择正确补全：如果你有问题，___。" },
    options: [
      { id: "a", en: "可以问老师", zh: "可以问老师" },
      { id: "b", en: "昨天很漂亮", zh: "昨天很漂亮" },
      { id: "c", en: "桌子喝水", zh: "桌子喝水" }
    ],
    answer: "a"
  },
  {
    id: "q12",
    band: "HSK 3",
    question: { en: "Which sentence is suitable in a restaurant?", zh: "哪一句适合在餐厅使用？" },
    options: [
      { id: "a", en: "买单，谢谢。", zh: "买单，谢谢。" },
      { id: "b", en: "我要去机场。", zh: "我要去机场。" },
      { id: "c", en: "这个字怎么读？", zh: "这个字怎么读？" }
    ],
    answer: "a"
  }
];

function getPlacementGrade(score: number, lang: Language) {
  if (score === 12) {
    return {
      grade: "A++",
      color: "bg-red-600 text-white border-red-600",
      level: lang === "en" ? "Excellent foundation" : "优秀基础",
      next:
        lang === "en"
          ? "Move into longer speaking tasks, reading fluency, and structured writing."
          : "进入长句表达、阅读流利度和结构化写作训练。",
      report:
        lang === "en"
          ? "Excellent score. Keep expanding conversations and reading."
          : "表现优秀，建议提升长对话、阅读和写作。"
    };
  }

  if (score >= 10) {
    return {
      grade: "A",
      color: "bg-red-500 text-white border-red-500",
      level: lang === "en" ? "Strong beginner-intermediate" : "初中级扎实",
      next:
        lang === "en"
          ? "Build grammar accuracy, topic conversation, and short passage reading."
          : "加强语法准确度、主题对话和短文阅读。",
      report:
        lang === "en"
          ? "Very strong. Improve fluency with topic practice."
          : "基础扎实，建议加强主题表达和阅读。"
    };
  }

  if (score >= 6) {
    return {
      grade: "B",
      color: "bg-emerald-500 text-white border-emerald-500",
      level: lang === "en" ? "Elementary builder" : "初级进阶",
      next:
        lang === "en"
          ? "Review core vocabulary, pinyin, sentence order, and daily dialogue."
          : "巩固核心词汇、拼音、语序和日常对话。",
      report:
        lang === "en"
          ? "Good start. Strengthen pinyin, words, and daily speaking."
          : "入门良好，建议巩固拼音、词汇和口语。"
    };
  }

  if (score >= 3) {
    return {
      grade: "C",
      color: "bg-yellow-400 text-ink border-yellow-400",
      level: lang === "en" ? "Starter level" : "启蒙起步",
      next:
        lang === "en"
          ? "Start with listening, greetings, basic words, and simple answers."
          : "从听辨、问候语、基础词汇和简单回答开始。",
      report:
        lang === "en"
          ? "Starter level. Begin with listening and basic phrases."
          : "处于起步期，建议先练听辨和常用句。"
    };
  }

  return {
    grade: "D",
    color: "bg-gray-400 text-white border-gray-400",
    level: lang === "en" ? "New learner" : "零基础启蒙",
    next:
      lang === "en"
        ? "Begin with interest-building sounds, greetings, songs, and picture words."
        : "从兴趣启蒙、发音、问候语和图像词汇开始。",
    report:
      lang === "en"
        ? "New learner. Start gently with sounds and greetings."
        : "适合零基础启蒙，先建立兴趣和发音。"
  };
}

export default function Home() {
  const [lang, setLang] = useState<Language>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [authOpen, setAuthOpen] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "code">("code");
  const [codeEmail, setCodeEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [bookings, setBookings] = useState<BookingView[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [notice, setNotice] = useState("");
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [testProfile, setTestProfile] = useState({ age: "", duration: "" });
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [typedReport, setTypedReport] = useState("");
  const t = copy[lang];
  const testScore = placementQuestions.filter((question) => testAnswers[question.id] === question.answer).length;
  const answeredCount = Object.keys(testAnswers).length;
  const testResult = getPlacementGrade(testScore, lang);
  const currentQuestion = placementQuestions[currentQuestionIndex];
  const currentRevealed = Boolean(revealedAnswers[currentQuestion.id]);
  const allQuestionsAnswered = answeredCount === placementQuestions.length;
  const reportText =
    lang === "en"
      ? `${testResult.report} Next stage: ${testResult.next} Age ${testProfile.age || "-"}, learning time ${testProfile.duration || "-"}.`
      : `${testResult.report} 下一阶段：${testResult.next} 年龄${testProfile.age || "-"}，已学${testProfile.duration || "-"}。`;

  useEffect(() => {
    const savedToken = localStorage.getItem("lucy-token") || "";
    const savedUser = localStorage.getItem("lucy-user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser) as User);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setBookings([]);
      return;
    }
    void loadBookings(token);
  }, [token]);

  useEffect(() => {
    if (!testSubmitted) {
      setTypedReport("");
      return;
    }

    setTypedReport("");
    let cursor = 0;
    const interval = window.setInterval(() => {
      cursor += 1;
      setTypedReport(reportText.slice(0, cursor));
      if (cursor >= reportText.length) window.clearInterval(interval);
    }, 50);

    return () => window.clearInterval(interval);
  }, [reportText, testSubmitted]);

  const navItems = useMemo(
    () => [
      ["#home", t.nav[0]],
      ["#about", t.nav[1]],
      ["#courses", t.nav[2]],
      ["#level-test", t.nav[3]],
      ["#features", t.nav[4]],
      ["#resources", t.nav[5]],
      ["#contact", t.nav[6]]
    ],
    [t]
  );

  function moveQuestion(direction: 1 | -1) {
    setCurrentQuestionIndex((current) => Math.min(Math.max(current + direction, 0), placementQuestions.length - 1));
  }

  function handlePlacementStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setTestProfile({
      age: String(form.get("age") || ""),
      duration: String(form.get("duration") || "")
    });
    setTestStarted(true);
    setTestSubmitted(false);
    setCurrentQuestionIndex(0);
  }

  function handlePlacementAnswer(questionId: string, optionId: string) {
    if (testSubmitted) return;
    setTestAnswers((current) => ({ ...current, [questionId]: optionId }));
    setRevealedAnswers((current) => ({ ...current, [questionId]: true }));
  }

  function handleQuestionSwipe(endX: number) {
    if (touchStartX === null || testSubmitted) return;
    const distance = touchStartX - endX;
    if (Math.abs(distance) > 46) moveQuestion(distance > 0 ? 1 : -1);
    setTouchStartX(null);
  }

  function resetPlacementTest() {
    setTestAnswers({});
    setRevealedAnswers({});
    setTestStarted(false);
    setTestSubmitted(false);
    setCurrentQuestionIndex(0);
    setTypedReport("");
  }

  function openAuthModal() {
    setAuthMode("login");
    setLoginMethod("code");
    setAuthOpen(true);
  }

  async function loadBookings(activeToken = token) {
    if (!activeToken) return;
    const response = await fetch("/api/bookings", {
      headers: {
        Authorization: `Bearer ${activeToken}`
      }
    });
    const result = await response.json();
    if (response.ok) setBookings(result.bookings || []);
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

  function googleCalendarUrl(booking: BookingView) {
    const date = new Date(`${booking.date}T00:00:00`);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const format = (value: Date) => value.toISOString().slice(0, 10).replaceAll("-", "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Lucy Chinese Trial Lesson",
      dates: `${format(date)}/${format(nextDate)}`,
      details: `Learner: ${booking.name}\nStage: ${stageLabel(booking.stage)}\nLevel: ${booking.chineseLevel}\nMessage: ${booking.message || "-"}`
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || "")
    };
    const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error || "Something went wrong.");
    localStorage.setItem("lucy-token", result.token);
    localStorage.setItem("lucy-user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    setAuthOpen(false);
    setNotice(t.successAuth);
  }

  async function handleRequestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const response = await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error || "Code request failed.");
    setCodeEmail(email);
    setCodeSent(true);
    setNotice(
      result.emailStatus?.devCode
        ? `${lang === "en" ? "Development code" : "本地测试验证码"}: ${result.emailStatus.devCode}`
        : lang === "en"
          ? "Verification code sent."
          : "验证码已发送。"
    );
  }

  async function handleCodeLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || codeEmail),
      code: String(form.get("code") || "")
    };
    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error || "Code login failed.");
    localStorage.setItem("lucy-token", result.token);
    localStorage.setItem("lucy-user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
    setAuthOpen(false);
    setCodeSent(false);
    setNotice(t.successAuth);
  }

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      openAuthModal();
      return setNotice(lang === "en" ? "Please register or log in first." : "请先注册或登录。");
    }
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error || "Booking failed.");
    setNotice(t.successBooking);
    await loadBookings();
    event.currentTarget.reset();
  }

  async function handleCheckout(courseId: string) {
    if (!token) {
      openAuthModal();
      return setNotice(lang === "en" ? "Please register or log in first." : "请先注册或登录。");
    }
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ courseId })
    });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error || "Checkout failed.");
    window.location.href = result.checkoutUrl;
  }

  return (
    <main id="home" className="min-h-screen overflow-hidden">
      <header className="glass-nav fixed inset-x-0 top-0 z-50 border-b border-white/70">
        <div className="section-shell flex h-20 items-center justify-between">
          <a href="#home" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-tea text-white shadow-card">
              <Languages size={22} />
            </span>
            <span>
              <span className="block font-display text-lg font-bold tracking-tight">Lucy Chinese Studio</span>
              <span className="block text-xs font-semibold text-ink/60">Lucy老师中文课堂</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/70 lg:flex">
            {navItems.map(([href, label]) =>
              href === "#resources" ? (
                <div key={href} className="group relative">
                  <a href={href} className="inline-flex items-center gap-1 transition hover:text-tea">
                    {label}
                    <ChevronDown size={14} />
                  </a>
                  <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4 opacity-0 transition group-hover:visible group-hover:opacity-100">
                    <div className="rounded-3xl border border-ink/10 bg-white p-3 shadow-soft">
                      {resourceLinks.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.href}
                          className="block rounded-2xl px-4 py-3 transition hover:bg-ivory hover:text-tea"
                        >
                          <span className="block font-bold">{resource.title[lang]}</span>
                          <span className="mt-1 block text-xs font-semibold text-ink/48">
                            {lang === "en" ? resource.title.zh : resource.title.en}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a key={href} href={href} className="transition hover:text-tea">
                  {label}
                </a>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold shadow-sm transition hover:border-tea/40"
            >
              {lang === "en" ? "中文" : "EN"}
            </button>
            <button
              type="button"
              onClick={openAuthModal}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-tea"
            >
              {t.login}
            </button>
          </div>

          <button className="grid h-11 w-11 place-items-center rounded-full bg-white lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-ink/40 lg:hidden">
          <div className="ml-auto h-full w-80 max-w-[86vw] bg-ivory p-6 shadow-soft">
            <button className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white" onClick={() => setMenuOpen(false)}>
              <X />
            </button>
            <div className="mt-8 grid gap-4">
              {navItems.map(([href, label]) =>
                href === "#resources" ? (
                  <div key={href} className="rounded-2xl bg-white p-3">
                    <a href={href} onClick={() => setMenuOpen(false)} className="block px-1 py-1 font-bold">
                      {label}
                    </a>
                    <div className="mt-2 grid gap-2">
                      {resourceLinks.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.href}
                          onClick={() => setMenuOpen(false)}
                          className="rounded-xl bg-ivory px-3 py-2 text-sm font-bold text-ink/72"
                        >
                          {resource.title[lang]}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-2xl bg-white px-4 py-3 font-bold">
                    {label}
                  </a>
                )
              )}
              <button onClick={() => setLang(lang === "en" ? "zh" : "en")} className="rounded-2xl bg-mint px-4 py-3 font-bold">
                {lang === "en" ? "中文" : "EN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {authOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/45 p-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-tea">{lang === "en" ? "Account" : "学习账号"}</p>
                <h2 className="mt-2 text-3xl font-bold">{t.authTitle}</h2>
              </div>
              <button type="button" onClick={() => setAuthOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-ivory">
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 rounded-full bg-ivory p-1 text-sm font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setLoginMethod("code");
                }}
                className={`rounded-full px-3 py-2 ${authMode === "login" && loginMethod === "code" ? "bg-tea text-white" : ""}`}
              >
                {t.emailCode}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setLoginMethod("password");
                }}
                className={`rounded-full px-3 py-2 ${authMode === "login" && loginMethod === "password" ? "bg-tea text-white" : ""}`}
              >
                {t.signIn}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`rounded-full px-3 py-2 ${authMode === "register" ? "bg-tea text-white" : ""}`}
              >
                {t.register}
              </button>
            </div>

            {authMode === "login" && loginMethod === "code" ? (
              <div className="mt-5 grid gap-4">
                <form onSubmit={handleRequestCode} className="grid gap-4">
                  <Field name="email" label={t.email} icon={Mail} type="email" defaultValue={codeEmail} required compact />
                  <button className="rounded-full bg-ink px-5 py-3 font-bold text-white hover:bg-tea">{t.sendCode}</button>
                </form>
                {codeSent && (
                  <form onSubmit={handleCodeLogin} className="grid gap-4 rounded-[1.5rem] bg-ivory p-4">
                    <Field name="name" label={t.name} icon={UserRound} compact />
                    <Field name="email" label={t.email} icon={Mail} type="email" defaultValue={codeEmail} required compact />
                    <Field name="code" label={t.code} icon={Lock} inputMode="numeric" required compact />
                    <button className="rounded-full bg-tea px-5 py-3 font-bold text-white hover:bg-ink">{t.verifyCode}</button>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleAuth} className="mt-5">
                {authMode === "register" && <Field name="name" label={t.name} icon={UserRound} required />}
                <Field name="email" label={t.email} icon={Mail} type="email" required />
                <Field name="password" label={t.password} icon={Lock} type="password" required minLength={8} />
                <button className="mt-5 w-full rounded-full bg-ink px-5 py-3 font-bold text-white hover:bg-tea">
                  {authMode === "register" ? t.register : t.signIn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <section className="section-shell grid min-h-[840px] items-center gap-12 pb-20 pt-36 lg:grid-cols-[1.02fr_.98fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-tea shadow-sm">
            <Sparkles size={17} />
            {t.heroTag}
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.02] text-ink text-balance md:text-7xl">
            {t.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72">{t.heroText}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-tea px-7 py-4 font-bold text-white shadow-card transition hover:-translate-y-0.5">
              {t.trial} <ChevronRight size={18} />
            </a>
            <a href="#courses" className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-7 py-4 font-bold shadow-sm transition hover:-translate-y-0.5">
              {t.explore}
            </a>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {stats.slice(0, 4).map(([en, zh]) => (
              <div key={en} className="rounded-3xl border border-white bg-white/72 p-4 shadow-sm">
                <p className="font-bold">{lang === "en" ? en : zh}</p>
                <p className="text-sm text-ink/55">{lang === "en" ? zh : en}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-mint blur-3xl" />
          <div className="soft-grid relative overflow-hidden rounded-[2.3rem] bg-white p-4 shadow-soft">
            <div className="overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-skysoft/35 via-ivory to-mint/45">
              <img
                src="/assets/lucy-teacher-profile.png"
                alt="Teacher Lucy professional profile"
                className="h-[560px] w-full object-cover object-[36%_36%]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white/72 py-24">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
          <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[2rem] bg-ink p-3 shadow-soft">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem]">
              <video
                className="h-full w-full bg-ink object-cover"
                controls
                preload="metadata"
                poster="/assets/lucy-teacher-profile.png"
              >
                <source src="/assets/lucy-introduction.mp4" type="video/mp4" />
                {lang === "en"
                  ? "Your browser does not support the video tag."
                  : "你的浏览器不支持视频播放。"}
              </video>
              <p className="pointer-events-none absolute left-5 top-5 rounded-full bg-ink/70 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                {t.video}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-tea">{lang === "en" ? "Profile" : "个人简介"}</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">{t.about}</h2>
            <p className="mt-6 text-lg leading-9 text-ink/72">{t.aboutText}</p>
            <p className="mt-5 rounded-3xl bg-mint/65 p-5 text-lg font-semibold leading-8 text-ink">{t.philosophy}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {stats.map(([en, zh]) => (
                <span key={en} className="rounded-full bg-ivory px-4 py-2 text-sm font-bold text-ink/75">
                  {lang === "en" ? `${en} / ${zh}` : `${zh} / ${en}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="section-shell py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-tea">{lang === "en" ? "Learning paths" : "分龄学习路径"}</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">{t.courses}</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-ink/65">{t.coursesText}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="group overflow-hidden rounded-[2rem] bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-mint px-4 py-2 text-sm font-bold">Ages {course.age}</span>
                  <span className="text-right">
                    <span className="block font-display text-2xl font-bold text-tea">${course.price}</span>
                    <span className="block text-xs font-black uppercase tracking-[0.16em] text-ink/45">
                      {lang === "en" ? "per hour" : "每小时"}
                    </span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{course.title[lang]}</h3>
                <p className="mt-1 text-sm font-semibold text-ink/50">{lang === "en" ? course.title.zh : course.title.en}</p>
              </div>
              <img src={course.image} alt={course.title.en} className="h-56 w-full object-cover" />
              <div className="p-6">
                <p className="leading-7 text-ink/70">{course.subtitle[lang]}</p>
                <ul className="mt-5 grid gap-3">
                  {course.points[lang].map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm font-semibold">
                      <CheckCircle2 className="text-tea" size={18} />
                      {point}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(course.id)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-white transition hover:bg-tea"
                >
                  {t.buyCourse} <CreditCard size={16} />
                </button>
                <p className="mt-3 text-center text-xs font-semibold text-ink/48">
                  {lang === "en" ? "$49 USD / 1-hour lesson" : "49 美元 / 1小时课程"}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[2.2rem] bg-white shadow-soft">
          <div className="grid lg:grid-cols-[.95fr_1.05fr]">
            <div className="relative min-h-[360px]">
              <img
                src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1400&q=80"
                alt="Great Wall of China study camp"
                className="h-full min-h-[360px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-ink">
                  <MapPinned size={17} />
                  {lang === "en" ? "China Study Camp" : "中国研学营"}
                </span>
                <h3 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                  {lang === "en" ? "Walk Through China, Learn Chinese History" : "行走中国，读懂历史"}
                </h3>
              </div>
            </div>

            <div className="p-6 md:p-9">
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-tea">
                {lang === "en" ? "Immersive cultural learning" : "沉浸式文化研学"}
              </p>
              <h3 className="mt-3 text-3xl font-bold">
                {lang === "en" ? "Chinese Study Camp for Global Learners" : "面向外国学习者的中国研学营"}
              </h3>
              <p className="mt-4 leading-8 text-ink/68">
                {lang === "en"
                  ? "A guided study camp combining Mandarin learning, landmark visits, Chinese history, cultural stories, and real-life speaking tasks."
                  : "结合中文学习、名胜古迹探访、中国历史讲解、文化故事与真实场景表达任务，让学习者在行走中理解中国。"}
              </p>
              <div className="mt-6 grid gap-4">
                {studyCampHighlights.map((item) => (
                  <div key={item.en} className="rounded-2xl bg-ivory p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint text-ink">
                        <Landmark size={18} />
                      </span>
                      <div>
                        <p className="font-bold text-ink">{lang === "en" ? item.en : item.zh}</p>
                        <p className="mt-1 text-sm leading-6 text-ink/62">{lang === "en" ? item.textEn : item.textZh}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#contact" className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-tea px-6 py-3 font-bold text-white shadow-card transition hover:bg-ink">
                {lang === "en" ? "Ask About Study Camp" : "咨询研学营"} <ChevronRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="level-test" className="bg-white/75 py-24">
        <div className="section-shell">
          <div className="grid items-start gap-8 lg:grid-cols-[.82fr_1.18fr]">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-bold text-ink">
                <ClipboardCheck size={17} />
                {lang === "en" ? "Free for new learners" : "新用户免费"}
              </div>
              <h2 className="mt-5 font-display text-4xl font-bold md:text-5xl">{t.hskTest}</h2>
              <div className="mt-6 rounded-[1.5rem] bg-ivory p-5 text-base leading-8 text-ink/68">
                {lang === "en" ? (
                  <p>
                    Inspired by HSK's focus on real-life Chinese ability, this free original placement check helps new learners estimate their current level before booking a lesson. It is not an official HSK mock exam.
                    For official HSK test information, visit{" "}
                    <a className="font-bold text-tea underline" href="https://www.chinesetest.cn/hsk" target="_blank" rel="noreferrer">
                      chinesetest.cn/hsk
                    </a>
                    .
                  </p>
                ) : (
                  <p>
                    本测试参考 HSK 对真实中文应用能力的评估方向，是 Lucy Chinese Studio 原创免费入门分级测试，可帮助新学习者在预约前了解当前水平；本测试不是官方 HSK 模拟题，官方考试信息请访问{" "}
                    <a className="font-bold text-tea underline" href="https://www.chinesetest.cn/hsk" target="_blank" rel="noreferrer">
                      chinesetest.cn/hsk
                    </a>
                    。
                  </p>
                )}
              </div>
              <div className="mt-6 rounded-[1.5rem] bg-ink p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-wood">
                  {lang === "en" ? "Total score" : "总评分"}
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <p className="font-display text-5xl font-bold">
                    {testScore}/{placementQuestions.length}
                  </p>
                  {testSubmitted && (
                    <span className={`mb-1 rounded-full border px-4 py-2 text-lg font-black ${testResult.color}`}>{testResult.grade}</span>
                  )}
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-tea transition-all duration-500"
                    style={{ width: `${(answeredCount / placementQuestions.length) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-white/62">
                  {t.testProgress}: {answeredCount}/{placementQuestions.length}
                </p>
                {testSubmitted && (
                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {[
                      ["D", "bg-gray-400 text-white"],
                      ["C", "bg-yellow-400 text-ink"],
                      ["B", "bg-emerald-500 text-white"],
                      ["A", "bg-red-500 text-white"],
                      ["A++", "bg-red-600 text-white"]
                    ].map(([grade, color]) => (
                      <span
                        key={grade}
                        className={`rounded-full px-3 py-2 text-center text-xs font-black ${
                          testResult.grade === grade ? color : "bg-white/10 text-white/45"
                        }`}
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="min-h-[680px] min-w-0 overflow-hidden rounded-[2rem] bg-ivory p-5 shadow-card md:p-7">
              {!testStarted ? (
                <form onSubmit={handlePlacementStart} className="grid h-full content-center gap-5 rounded-[1.5rem] bg-white p-6 shadow-sm">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-tea">
                      {lang === "en" ? "Before you begin" : "开始前填写"}
                    </p>
                    <h3 className="mt-3 text-3xl font-bold">{lang === "en" ? "Tell Lucy a little about you" : "先了解学习者情况"}</h3>
                    <p className="mt-3 leading-7 text-ink/62">
                      {lang === "en"
                        ? "The result report will combine your test score with age and Chinese learning time."
                        : "测试报告会结合分数、年龄和学中文时长，给出更贴合的学习建议。"}
                    </p>
                  </div>
                  <label className="grid gap-2 text-sm font-bold text-ink/70">
                    {t.learnerAge}
                    <input
                      name="age"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      type="text"
                      placeholder={lang === "en" ? "e.g. 8" : "例如：8"}
                      className="rounded-2xl border border-ink/10 bg-ivory px-4 py-3 outline-none transition focus:border-tea"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-ink/70">
                    {t.studyDuration}
                    <select
                      name="duration"
                      required
                      className="rounded-2xl border border-ink/10 bg-ivory px-4 py-3 outline-none transition focus:border-tea"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {lang === "en" ? "Choose one" : "请选择"}
                      </option>
                      <option value={lang === "en" ? "0 months" : "0个月"}>{lang === "en" ? "0 months" : "0个月"}</option>
                      <option value={lang === "en" ? "1-6 months" : "1-6个月"}>{lang === "en" ? "1-6 months" : "1-6个月"}</option>
                      <option value={lang === "en" ? "6-12 months" : "6-12个月"}>{lang === "en" ? "6-12 months" : "6-12个月"}</option>
                      <option value={lang === "en" ? "1+ years" : "1年以上"}>{lang === "en" ? "1+ years" : "1年以上"}</option>
                      <option value={lang === "en" ? "3+ years" : "3年以上"}>{lang === "en" ? "3+ years" : "3年以上"}</option>
                    </select>
                  </label>
                  <button type="submit" className="mt-2 rounded-full bg-tea px-6 py-4 font-bold text-white shadow-card transition hover:-translate-y-0.5">
                    {t.startTest}
                  </button>
                </form>
              ) : testSubmitted ? (
                <div className="relative min-h-[626px] overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-sm">
                  <div className="max-w-xl">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-tea">{lang === "en" ? "Result report" : "结果报告"}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className={`rounded-full border px-5 py-3 text-2xl font-black ${testResult.color}`}>{testResult.grade}</span>
                      <span className="text-3xl font-bold text-ink">
                        {testScore}/{placementQuestions.length}
                      </span>
                    </div>
                    <h3 className="mt-6 text-3xl font-bold">{testResult.level}</h3>
                    <div className="mt-7 rounded-[1.5rem] bg-ivory p-5">
                      <p className="text-sm font-bold text-ink/54">{lang === "en" ? "Lucy report" : "Lucy老师报告"}</p>
                      <p className="mt-3 min-h-[4rem] text-xl font-bold leading-9 text-ink">
                        {typedReport}
                        {typedReport.length < reportText.length && <span className="animate-pulse text-tea">|</span>}
                      </p>
                    </div>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <a href="#contact" className="inline-flex rounded-full bg-tea px-6 py-3 font-bold text-white shadow-card">
                        {t.trial}
                      </a>
                      <button
                        type="button"
                        onClick={resetPlacementTest}
                        className="rounded-full border border-ink/10 bg-white px-6 py-3 font-bold text-ink transition hover:border-tea/40"
                      >
                        {t.resetTest}
                      </button>
                    </div>
                  </div>
                  {typedReport.length >= reportText.length && (
                    <div className="seal-reward absolute bottom-4 right-4 h-32 w-32 opacity-95 md:h-40 md:w-40">
                      <img src="/assets/level-test-seal.svg" alt={lang === "en" ? "Reward seal" : "奖励印章"} className="h-full w-full" />
                      <span className="absolute inset-0 grid place-items-center font-display text-3xl font-black text-[#c9291e] md:text-4xl">
                        {testResult.grade}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink/52">
                        {t.learnerAge}: {testProfile.age} · {t.studyDuration}: {testProfile.duration}
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        {currentQuestionIndex + 1}/{placementQuestions.length} · {currentQuestion.band}
                      </p>
                    </div>
                    <div className="flex max-w-full flex-wrap gap-2">
                      {placementQuestions.map((question, index) => (
                        <button
                          key={question.id}
                          type="button"
                          aria-label={`Question ${index + 1}`}
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            index === currentQuestionIndex ? "w-8 bg-tea" : testAnswers[question.id] ? "w-2.5 bg-mint" : "w-2.5 bg-ink/15"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div
                    className="min-w-0 overflow-hidden rounded-[1.5rem]"
                    onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
                    onTouchEnd={(event) => handleQuestionSwipe(event.changedTouches[0].clientX)}
                  >
                    <div
                      className="flex w-full transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${currentQuestionIndex * 100}%)` }}
                    >
                      {placementQuestions.map((question, index) => {
                        const revealed = Boolean(revealedAnswers[question.id]);
                        return (
                          <article key={question.id} className="min-w-0 shrink-0 basis-full rounded-[1.5rem] bg-white p-5 shadow-sm md:p-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <h3 className="text-2xl font-bold leading-snug text-ink">
                                {index + 1}. {question.question[lang]}
                              </h3>
                              <span className="w-fit rounded-full bg-mint px-3 py-1 text-xs font-bold text-ink/70">{question.band}</span>
                            </div>
                            <div className="mt-6 grid gap-3">
                              {question.options.map((option) => {
                                const selected = testAnswers[question.id] === option.id;
                                const isCorrectOption = option.id === question.answer;
                                const showCorrect = revealed && isCorrectOption;
                                const showWrong = revealed && selected && !isCorrectOption;
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    disabled={revealed}
                                    onClick={() => handlePlacementAnswer(question.id, option.id)}
                                    className={`rounded-2xl border px-4 py-4 text-left text-base font-bold transition ${
                                      selected ? "border-tea bg-tea/10 text-ink" : "border-ink/10 bg-ivory text-ink/70 hover:border-tea/40"
                                    } ${showCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800" : ""} ${
                                      showWrong ? "border-red-400 bg-red-50 text-red-700" : ""
                                    } disabled:cursor-default`}
                                  >
                                    {option[lang]}
                                  </button>
                                );
                              })}
                            </div>
                            {revealed && (
                              <div
                                className={`mt-5 rounded-2xl p-4 text-sm font-bold ${
                                  testAnswers[question.id] === question.answer
                                    ? "bg-emerald-50 text-emerald-800"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {testAnswers[question.id] === question.answer
                                  ? lang === "en"
                                    ? "Correct. Tap Next to continue."
                                    : "回答正确，请点击下一题。"
                                  : lang === "en"
                                    ? `Not quite. Correct answer: ${question.options.find((option) => option.id === question.answer)?.en}`
                                    : `回答错误。正确答案：${question.options.find((option) => option.id === question.answer)?.zh}`}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => moveQuestion(-1)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-6 py-3 font-bold text-ink transition hover:border-tea/40 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <MoveLeft size={18} />
                      {t.previous}
                    </button>
                    <button
                      type="button"
                      disabled={!currentRevealed || (currentQuestionIndex === placementQuestions.length - 1 && !allQuestionsAnswered)}
                      onClick={() => {
                        if (currentQuestionIndex === placementQuestions.length - 1 && allQuestionsAnswered) {
                          setTestSubmitted(true);
                          return;
                        }
                        moveQuestion(1);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-tea disabled:cursor-not-allowed disabled:bg-ink/30"
                    >
                      {currentQuestionIndex === placementQuestions.length - 1 ? t.viewResult : t.next}
                      <MoveRight size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-cloud py-24">
        <div className="section-shell">
          <h2 className="font-display text-4xl font-bold md:text-5xl">{t.features}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.en} className="rounded-[1.8rem] bg-white p-7 shadow-sm">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-skysoft/50 text-ink">
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold">{lang === "en" ? feature.en : feature.zh}</h3>
                  <p className="mt-3 leading-7 text-ink/65">{lang === "en" ? feature.textEn : feature.textZh}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="resources" className="section-shell py-24">
        <div className="rounded-[2.2rem] bg-ink p-8 text-white shadow-soft md:p-12">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-wood">{lang === "en" ? "Practice after class" : "课后轻松练习"}</p>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">{t.resources}</h2>
              <p className="mt-5 max-w-xl text-white/68">
                {lang === "en"
                  ? "A practical bilingual mini-library is now organized into clear pages. Choose one topic to study with images, pronunciation, pinyin, and translation."
                  : "学习资源已拆分为清晰的子页面。选择一个主题，即可查看图文、发音、拼音和中英释义。"}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {resourceLinks.map((resource) => (
                <a key={resource.id} href={resource.href} className="rounded-3xl bg-white/10 p-5 transition hover:-translate-y-0.5 hover:bg-white/15">
                  <p className="font-bold">{resource.title[lang]}</p>
                  <p className="mt-1 text-sm text-white/60">{lang === "en" ? resource.title.zh : resource.title.en}</p>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {resourceLinks.map((resource) => (
            <a key={resource.id} href={resource.href} className="group overflow-hidden rounded-[2rem] bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative h-48">
                <img src={resource.image} alt={resource.title.en} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-ink">
                  {lang === "en" ? "Open resource" : "进入资源"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-ink">{resource.title[lang]}</h3>
                <p className="mt-1 text-sm font-semibold text-tea">{lang === "en" ? resource.title.zh : resource.title.en}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/62">{resource.intro[lang]}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-bold text-tea">
                  {lang === "en" ? "Study now" : "开始学习"} <ChevronRight size={16} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-white/75 py-24">
        <div className="section-shell grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-tea">{lang === "en" ? "Start learning" : "开始学习"}</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">{t.contact}</h2>
            <p className="mt-5 text-lg leading-8 text-ink/68">{t.contactText}</p>
            <p className="mt-5 rounded-3xl bg-ivory p-5 text-sm font-semibold text-ink/70">{t.paidNote}</p>
            {notice && <p className="mt-5 rounded-3xl bg-mint p-5 font-bold text-ink">{notice}</p>}
            {user ? (
              <p className="mt-5 text-sm font-bold text-tea">{lang === "en" ? `Signed in as ${user.name}` : `已登录：${user.name}`}</p>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="mt-5 rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-tea"
              >
                {t.login}
              </button>
            )}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
            <form onSubmit={handleBooking} className="rounded-[2rem] bg-white p-6 shadow-card">
              <h3 className="text-2xl font-bold">{lang === "en" ? "Trial Lesson Booking" : "试听课预约"}</h3>
              <Field name="name" label={t.name} icon={UserRound} defaultValue={user?.name || ""} required />
              <Field name="email" label={t.email} icon={Mail} type="email" defaultValue={user?.email || ""} required />
              <Field name="nationality" label={t.nationality} icon={Languages} />
              <label className="mt-4 block text-sm font-bold text-ink/68">
                {lang === "en" ? "Learning stage" : "学习阶段"}
                <select name="stage" className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 outline-none focus:border-tea" required>
                  <option value="young-children">Young Children 3-6 / 幼儿启蒙</option>
                  <option value="children-teens">Children & Teens 7-16 / 少儿进阶</option>
                  <option value="adults">Adults 17+ / 成人实用</option>
                  <option value="china-study-camp">China Study Camp / 中国研学营</option>
                </select>
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-ink/68">
                  {t.level}
                  <select name="chineseLevel" className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 outline-none focus:border-tea">
                    <option value="beginner">Beginner / 零基础</option>
                    <option value="elementary">Elementary / 初级</option>
                    <option value="intermediate">Intermediate / 中级</option>
                  </select>
                </label>
                <Field
                  name="date"
                  label={lang === "en" ? "Google Calendar trial date" : "Google Calendar 试听日期"}
                  icon={CalendarCheck}
                  type="date"
                  required
                  compact
                />
              </div>
              <label className="mt-4 block text-sm font-bold text-ink/68">
                {t.message}
                <textarea name="message" rows={3} className="mt-2 w-full resize-none rounded-2xl border border-ink/10 bg-ivory px-4 py-3 outline-none focus:border-tea" />
              </label>
              <button className="mt-5 w-full rounded-full bg-tea px-5 py-3 font-bold text-white hover:bg-ink">{t.submitBooking}</button>
            </form>

            <section className="rounded-[2rem] bg-ivory p-6 shadow-card">
              <h3 className="text-2xl font-bold">{t.myBookings}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/60">
                {lang === "en"
                  ? "After booking, add the trial lesson date to Google Calendar and view your submitted requests here."
                  : "提交预约后，可一键加入 Google Calendar，并在这里查看已提交的预约。"}
              </p>
              <div className="mt-5 grid gap-3">
                {bookings.length === 0 ? (
                  <p className="rounded-2xl bg-white p-4 text-sm font-bold text-ink/50">{t.noBookings}</p>
                ) : (
                  bookings.map((booking) => (
                    <article key={booking.id} className="rounded-2xl bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-ink">{stageLabel(booking.stage)}</p>
                          <p className="mt-1 text-sm text-ink/55">{booking.date} · {booking.status}</p>
                        </div>
                        <a
                          href={googleCalendarUrl(booking)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-tea"
                        >
                          {t.addToGoogle}
                        </a>
                      </div>
                      {booking.message && <p className="mt-3 text-sm leading-6 text-ink/60">{booking.message}</p>}
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      <footer className="bg-ink py-10 text-white">
        <div className="section-shell flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-bold">Lucy Chinese Studio</p>
            <p className="mt-2 text-white/62">{t.footer}</p>
          </div>
          <p className="text-sm text-white/50">© 2026 Lucy Chinese Studio. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function Field({
  name,
  label,
  icon: Icon,
  type = "text",
  required,
  minLength,
  defaultValue,
  inputMode,
  compact
}: {
  name: string;
  label: string;
  icon: typeof UserRound;
  type?: string;
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  compact?: boolean;
}) {
  return (
    <label className={`block text-sm font-bold text-ink/68 ${compact ? "" : "mt-4"}`}>
      {label}
      <span className="mt-2 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 focus-within:border-tea">
        <Icon size={18} className="text-ink/42" />
        <input
          name={name}
          type={type}
          required={required}
          minLength={minLength}
          defaultValue={defaultValue}
          inputMode={inputMode}
          className="w-full bg-transparent outline-none"
        />
      </span>
    </label>
  );
}
