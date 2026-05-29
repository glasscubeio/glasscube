import { useEffect, useRef, useState } from "react";
import type { Lang } from "../App";

const contactTranslations: Record<
  Lang,
  { label: string; value: string; href?: string }[]
> = {
  en: [
    {
      label: "📧 Email",
      value: "worknadir95@gmail.com",
      href: "mailto:worknadir95@gmail.com",
    },
    {
      label: "📞 Phone",
      value: "+82 (10) 8173 7778",
      href: "tel:+821081737778",
    },
    {
      label: "📍 Location",
      value: "Sasang, Busan, South Korea (Remote/Worldwide)",
    },
    { label: "⏱️ Response Time", value: "Usually within 24 hours" },
  ],
  uz: [
    {
      label: "📧 Email",
      value: "worknadir95@gmail.com",
      href: "mailto:worknadir95@gmail.com",
    },
    {
      label: "📞 Telefon",
      value: "+82 (10) 8173 7778",
      href: "tel:+821081737778",
    },
    {
      label: "📍 Manzil",
      value: "Sasang, Busan, Janubiy Koreya (masofaviy/global)",
    },
    { label: "⏱️ Javob vaqti", value: "Odatda 24 soat ichida" },
  ],
  ru: [
    {
      label: "📧 Email",
      value: "worknadir95@gmail.com",
      href: "mailto:worknadir95@gmail.com",
    },
    {
      label: "📞 Телефон",
      value: "+82 (10) 8173 7778",
      href: "tel:+821081737778",
    },
    {
      label: "📍 Адрес",
      value: "Сасанг, Пусан, Южная Корея (Удалённо/по всему миру)",
    },
    { label: "⏱️ Время отклика", value: "Обычно в течение 24 часов" },
  ],
  ko: [
    {
      label: "📧 이메일",
      value: "worknadir95@gmail.com",
      href: "mailto:worknadir95@gmail.com",
    },
    {
      label: "📞 전화번호",
      value: "+82 (10) 8173 7778",
      href: "tel:+821081737778",
    },
    { label: "📍 위치", value: "부산 사상구 (재택 / 전세계 가능)" },
    { label: "⏱️ 응답 시간", value: "보통 24시간 이내" },
  ],
};

export default function ContactTab({ lang }: { lang: Lang }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const lines = contactTranslations[lang] || contactTranslations.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < lines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [visibleLines]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-100px)] p-4 overflow-y-auto bg-black text-terminal-green font-mono text-base space-y-6"
    >
      <p className="text-xl mb-4">
        {lang === "ko"
          ? "로버트의 터미널 이력서에 오신 것을 환영합니다."
          : lang === "ru"
          ? "Добро пожаловать в терминальное резюме Роберта."
          : lang === "uz"
          ? "Robert'ning Terminal Rezyumesiga xush kelibsiz."
          : "Welcome to Robert's Terminal Resume."}
      </p>
      <p className="mb-8">
        {lang === "ko"
          ? "← → 키로 탭을 이동하세요."
          : lang === "ru"
          ? "Используйте ← → для переключения вкладок."
          : lang === "uz"
          ? "← → tugmalari bilan sahifalar o‘rtasida harakat qiling."
          : "Use ← → to navigate tabs."}
      </p>

      {lines.slice(0, visibleLines).map((item, i) => (
        <div key={i} className="whitespace-pre-wrap">
          <strong>{item.label}</strong>:{" "}
          {item.href ? (
            <a
              href={item.href}
              className="underline hover:text-green-400 transition-colors"
            >
              {item.value}
            </a>
          ) : (
            <span>{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
