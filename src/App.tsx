import { useState, useEffect } from "react"
import { CtasProvider } from "@/contexts/CtasContext"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { FAQTalha } from "@/components/FAQTalha"
import { MissionVisionTalha } from "@/components/MissionVisionTalha"
import { Impact } from "@/components/Impact"
import { LocationsTalha } from "@/components/LocationsTalha"
import { JoinPPFTalha } from "@/components/JoinPPFTalha"
import { Team } from "@/components/Team"
import { FooterTalha } from "@/components/FooterTalha"
import { FloatingCta } from "@/components/FloatingCta"
import { AdminLogin } from "@/pages/AdminLogin"
import { ProtectedAdmin } from "@/components/ProtectedAdmin"
import type { Locale } from "@/data/content"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const SEO_TITLES: Record<Locale, string> = {
  en: "Pak Palestine Forum - PPF",
  ur: "پاک فلسطین فورم - PPF",
}
const SEO_DESCRIPTIONS: Record<Locale, string> = {
  en: "A united platform based in Pakistan, dedicated to supporting the Palestinian cause. Answer the call to stand for Al-Aqsa and Palestine.",
  ur: "پاکستان میں قائم ایک متحد پلیٹ فارم، فلسطینی مقصد کی حمایت کے لیے وقف۔ الاقصیٰ اور فلسطین کے لیے کھڑے ہونے کی دعوت کا جواب دیں۔",
}

function MainSite() {
  const [lang, setLang] = useState<Locale>(() => {
    try {
      return (localStorage.getItem("ppf-lang") === "ur" ? "ur" : "en") as Locale
    } catch {
      return "en"
    }
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = "ltr"
    document.documentElement.classList.add("dark")
  }, [lang])

  useEffect(() => {
    document.title = SEO_TITLES[lang]
    const meta = document.getElementById("meta-description") as HTMLMetaElement | null
    if (meta) meta.content = SEO_DESCRIPTIONS[lang]
  }, [lang])

  useEffect(() => {
    try {
      localStorage.setItem("ppf-lang", lang)
    } catch {}
  }, [lang])

  return (
    <div className="ppf-marketing min-h-screen min-w-0 bg-[var(--color-bg)]">
      <Header lang={lang} setLang={setLang} />
      <main className="min-w-0">
        <Hero lang={lang} />
        <FAQTalha lang={lang} />
        <MissionVisionTalha lang={lang} />
        <Impact lang={lang} />
        <LocationsTalha lang={lang} />
        <JoinPPFTalha lang={lang} />
        <Team lang={lang} />
        <FooterTalha lang={lang} />
      </main>
      <FloatingCta lang={lang} />
    </div>
  )
}

function App() {
  return (
    <CtasProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
        </Routes>
      </BrowserRouter>
    </CtasProvider>
  )
}

export default App
