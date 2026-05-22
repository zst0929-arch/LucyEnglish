"use client";

import { BookOpen, ChevronLeft, Languages, Volume2 } from "lucide-react";
import { useState } from "react";
import { resourceLinks, type Resource } from "@/lib/resources";
import type { Language } from "@/lib/types";

const PINYIN_AUDIO_BASE = "http://du.hanyupinyin.cn/du/pinyin/";

function getBroadcastMandarinVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;

  const voices = window.speechSynthesis.getVoices();
  const preferredNames = ["xiaoxiao", "tingting", "mei-jia", "meijia", "huihui", "hanhan"];
  return (
    voices.find((voice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      return lang.startsWith("zh") && preferredNames.some((preferred) => name.includes(preferred));
    }) ||
    voices.find((voice) => voice.lang.toLowerCase() === "zh-cn") ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("zh"))
  );
}

export default function ResourceDetailClient({ resource }: { resource: Resource }) {
  const [lang, setLang] = useState<Language>("en");
  const [notice, setNotice] = useState("");

  function playPronunciation(text: string, audioFile?: string) {
    if (audioFile) {
      const audio = new Audio(`${PINYIN_AUDIO_BASE}${audioFile}`);
      audio.play().catch(() => {
        setNotice(lang === "en" ? "Audio could not be played. Please try again." : "音频暂时无法播放，请再试一次。");
      });
      return;
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setNotice(lang === "en" ? "Audio is not supported in this browser." : "当前浏览器不支持语音播放。");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.voice = getBroadcastMandarinVoice() || null;
    utterance.rate = 0.76;
    utterance.pitch = 1.04;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="min-h-screen bg-ivory">
      <header className="glass-nav sticky top-0 z-50 border-b border-white/70">
        <div className="section-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-3">
          <a href="/#home" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-tea text-white shadow-card">
              <Languages size={22} />
            </span>
            <span>
              <span className="block font-display text-lg font-bold tracking-tight">Lucy Chinese Studio</span>
              <span className="block text-xs font-semibold text-ink/60">Lucy老师中文课堂</span>
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <a href="/#resources" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
              <ChevronLeft size={16} />
              {lang === "en" ? "Resources" : "学习资源"}
            </a>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold shadow-sm transition hover:border-tea/40"
            >
              {lang === "en" ? "中文" : "EN"}
            </button>
          </div>
        </div>
      </header>

      <section className="section-shell py-12 md:py-16">
        <div className="grid overflow-hidden rounded-[2.2rem] bg-white shadow-soft lg:grid-cols-[.95fr_1.05fr]">
          <div className="relative min-h-[360px]">
            <img src={resource.image} alt={resource.title.en} className="h-full min-h-[360px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-wood">
                {lang === "en" ? "Free learning resource" : "免费学习资源"}
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold md:text-6xl">{resource.title[lang]}</h1>
              <p className="mt-2 text-white/72">{lang === "en" ? resource.title.zh : resource.title.en}</p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <p className="text-lg leading-8 text-ink/70">{resource.intro[lang]}</p>
            {notice && <p className="mt-5 rounded-2xl bg-mint p-4 text-sm font-bold text-ink">{notice}</p>}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {resourceLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    item.id === resource.id ? "bg-ink text-white" : "bg-ivory text-ink/70 hover:bg-mint"
                  }`}
                >
                  {item.title[lang]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          {resource.groups.map((group) => (
            <section key={group.label.en} className="rounded-[2rem] bg-white p-5 shadow-card md:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-ink">
                  <BookOpen size={20} />
                </span>
                <h2 className="text-2xl font-bold text-ink">{group.label[lang]}</h2>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map(([hanzi, pinyin, english, audioText, audioFile]) => (
                  <div key={`${resource.id}-${group.label.en}-${hanzi}-${english}`} className="flex items-start gap-3 rounded-2xl bg-ivory p-4">
                    <button
                      type="button"
                      onClick={() => playPronunciation(audioText || hanzi, audioFile)}
                      className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tea text-white transition hover:bg-ink"
                      aria-label={`Play pronunciation for ${hanzi}`}
                    >
                      <Volume2 size={18} />
                    </button>
                    <div className="min-w-0">
                      <p className="text-xl font-bold text-ink">{hanzi}</p>
                      <p className="text-sm font-semibold text-tea">{pinyin}</p>
                      <p className="mt-1 text-sm leading-6 text-ink/62">{english}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
