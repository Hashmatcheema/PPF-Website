import { stripEmDashesDeep } from "@/lib/forDisplay"

const contentSource = {
  en: {
    siteName: "Pak Palestine Forum",
    tagline: "Peaceful, Non-Violent Activism for Palestine",
    swipeHint: "swipe",
    nav: {
      mission: "Vision",
      where: "Our Chapters",
      impact: "Our Impact",
      act: "Join Us",
      faq: "FAQs",
      team: "Team",
      contact: "Contact",
    },
    cta: { join: "Join Us", volunteer: "Volunteer", donate: "Donate" },
    floatingBar: {
      contactBtn: "Contact us",
      eventBtn: "Pakistanis March For Gaza",
      contactTitle: "Contact us",
      contactHint: "Reach the Pak Palestine Forum team.",
      whatsappLabel: "WhatsApp",
      emailLabel: "Email",
      phoneDisplay: "+92 340 4555542",
      /** E.164 without + for wa.me */
      phoneWaDigits: "923404555542",
      email: "pakpalforum@gmail.com",
      eventTitle: "Pakistanis March For Gaza",
      eventBody:
        "Stand with Palestine in the streets. Dates, cities, and how to join will be shared on our channels — follow PPF so you do not miss the march.",
      close: "Close",
      dismissOverlay: "Close dialog",
    },
    heroSlides: [
      {
        tagline: "Peaceful, Non-Violent Activism for Palestine",
        subtext: "Answer the call to stand for Al-Aqsa and Palestine.",
      },
      {
        tagline: "Unity and Support Beyond Borders",
        subtext: "Join a united stand from Pakistan for Palestine.",
      },
      {
        tagline: "From Pakistan to Palestine - We Resist the Oppression",
        subtext: "Add your voice to Pakistan's support for Palestine.",
      },
    ],
    vision: {
      title: "Vision & Objectives",
      intro:
        "Our mission is to advance the Palestinian cause - the freedom of Palestine and the liberation of Al-Aqsa - by mobilizing and empowering Pakistani society to engage in informed, principled, and sustained solidarity for Palestine.",
      objectives:
        "Pak-Palestine Forum is committed to actively supporting the Palestinian cause through peaceful yet powerful means, including activism, public awareness, boycott movements, relief efforts, and diplomatic engagement. In the long term, the platform seeks to empower Pakistani youth, women, and future generations to be aware, active, and principled in defending their values and advocating for Palestine. By connecting, supporting, and uniting pro-Palestinian voices, and engaging with notable figures across Pakistan, the Forum aims to strengthen sustained solidarity for the freedom of Palestine and the liberation of Al-Aqsa.",
      objectivePoints: [
        {
          title: "Activism & awareness",
          body: "Pak-Palestine Forum is committed to actively supporting the Palestinian cause through peaceful yet powerful means, including activism, public awareness, boycott movements, relief efforts, and diplomatic engagement.",
        },
        {
          title: "Empowerment",
          body: "In the long term, the platform seeks to empower Pakistani youth, women, and future generations to be aware, active, and principled in defending their values and advocating for Palestine.",
        },
        {
          title: "Solidarity & voices",
          body: "By connecting, supporting, and uniting pro-Palestinian voices, and engaging with notable figures across Pakistan, the Forum aims to strengthen sustained solidarity for the freedom of Palestine and the liberation of Al-Aqsa.",
        },
      ],
      cards: [
        { title: "Activism & Awareness", body: "Raising awareness, peaceful protests, advocacy, community engagement, and promoting initiatives such as boycotts to support the Palestinian cause." },
        { title: "Relief & Aid", body: "Channel resources and efforts toward those most in need. Delivering aid through partner organizations and supporting families in Gaza." },
        { title: "Empowerment", body: "Empowering Pakistani youth, women, and future generations to be aware, active, and principled in defending shared values and advocating for Palestine." },
      ],
    },
    impact: {
      title: "Our Impact",
      intro: "PPF's activities and achievements across awareness, relief, and community building.",
      stats: [
        { value: "300+", label: "Protests & Campaigns" },
        { value: "3.5M+", label: "Social Following" },
        { value: "PKR 10M+", label: "Aid Delivered" },
      ],
      achievements: [
        "International representation of Pakistan in Global Sumud Flotilla, via 5 member delegation",
        "Central membership of Nationwide coalition for Palestine (Palestine Action Coalition, Pak)",
        "300+ protests, campaigns, and awareness sessions held across 15+ cities of Pakistan",
        "Engaged 100+ politicians, diplomats, and leaders of Pakistan",
        "Secured an Agreement with Gov of Pakistan for Gaza, after a 42-day Sit-in in the Capital",
        "Successfully won the legal battles against the state repression, including multiple detentions and false criminal proceedings, most of which were successfully fought on legal fronts",
        "Social following of 3.5 million and an average monthly outreach to 100+ million audience",
        "Delivered PKR 10+ million in aid to Palestine through partner organizations",
        "Delivered monthly Kafalah of 40+ Palestinian families in Gaza, for a year",
        "Distributed 170,000+ boycott guides across Pakistan",
        "Successfully negotiated Divestment from a McDonald's branch in I-8 Sector, Islamabad",
        "Assisted admission of a Palestinian student and evacuation/immigration of more than 7+ Palestinians",
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "What is Pak-Palestine Forum?",
          a: "The Pak-Palestine Forum is a dedicated platform based in Pakistan to support the Palestinian cause, particularly the liberation of Al-Aqsa and the freedom of Palestine.\n\nWe're committed to support the Palestinian cause through peaceful yet impactful ways - specifically through activism (protests and collaborating with like-minded organizations), public awareness (media/on ground), boycott movements, relief activities, and diplomatic or political networking.",
        },
        { q: "How can I join PPF?", rich: "joinHow" as const },
        {
          q: "How Can I Make a Difference for Gaza as a Pakistani?",
          a: "The real solution for Gaza and Palestine is in the hands of the Governments. But that doesn't mean you cannot make an impact.\n\nThrough peaceful activism we can shape the initiatives taken by the Government of Pakistan for Palestine.\n\nThrough collective efforts on ground and in the media, we can shape the public narrative adding to the public pressure.\n\nThrough education and awareness we can make people of Pakistan more responsive to such challenging times.\n\nSimilarly, individuals can contribute by observing boycotts of companies linked to the oppression of Palestinians and donating to credible organizations providing relief for Gaza.",
        },
        {
          q: "What is Activism?",
          a: "Activism means taking action to create change. It involves using your voice and efforts to challenge injustice and hold those in power accountable in order to bring positive change in society.\n\nAt Pak-Palestine Forum, we adopt peaceful non-violent Activism that includes raising Awareness, Peaceful Protests, Advocacy, Community Engagement, and Promoting initiatives such as boycotts to support the Palestinian cause and resisting oppression and complicity.\n\nAt its core, activism is about standing against injustice and working collectively for a more just and ethical world.",
        },
        {
          q: "Do Protests and Solidarity Efforts Help the Palestinian Cause?",
          a: "Protests and public solidarity not only raise awareness and keep the issue visible, but they build public pressure on governments, institutions, and companies to take action.\n\nThey also show Palestinians that they are not alone in their struggle, while helping mobilize communities to support the cause through advocacy, boycotts, and humanitarian efforts.",
        },
        {
          q: "Why Should Pakistanis Care About Palestine?",
          a: "Palestine is not only our religious and moral imperative, the Pro-Palestinian wave crafted through Oct 7, offers a big opportunity to liberate Palestinians and Al Quds from the Zionist occupation. At the same time, we find this changing scenario, post Oct 7, as a gateway for free minds to unite, activate and liberate lost humanity that is being oppressed across the world.",
        },
        {
          q: "Where does PPF get its financial support?",
          a: "PPF is funded through the dedicated support of its internal team and members, who contribute regular donations to sustain the organization's activities. Additionally, PPF occasionally reaches out to individuals and groups invested in the Palestinian cause, inviting them to support awareness, advocacy, and relief initiatives.",
        },
      ],
    },
    where: {
      title: "PPF TEAMS ACROSS CITIES OF PAKISTAN",
      intro: "Our geographical presence and reach.",
      overlay: "Pakistan · Regional Hubs · International Partners",
      chapters: ["Islamabad", "Lahore", "Karachi", "Faisalabad", "Sargodha", "Multan"],
      smallerUnits: "Peshawar, Jhelum, Lala Musa, Sukkur, Lakki Marwat, Bhawalnagar, Rahim Yar Khan, Muzaffargarh, Swabi, Quetta, Sheikhupura, Phalia, Hyderabad and Wah Cantt",
    },
    nation: {
      headline1: "Across the Nation,",
      headline2: "United for a Cause.",
      description: "The Pak-Palestine Forum is a nationwide movement. From the mountains of the north to the shores of the south, our volunteers are active in every major city, organizing relief and raising awareness.",
      stats: [
        { value: "50+", label: "CITIES ACTIVE" },
        { value: "5,000+", label: "VOLUNTEERS" },
        { value: "100+", label: "PARTNERS" },
        { value: "24/7", label: "SUPPORT" },
      ],
      cta: "Find a Chapter Near You",
      liveActivity: {
        title: "Live Activity",
        subtitle: "Real-time presence",
        newVolunteersLabel: "New Volunteers",
        newVolunteersValue: "+12 (Last hour)",
      },
    },
    team: {
      title: "Our Team",
      intro: "People behind PPF's mission and impact.",
      chapterHeadsLabel: "Chapter Heads",
      names: ["Name One", "Name Two", "Name Three"],
      role: "Role / Title",
      members: [
        {
          name: "Wahaj Ahmad",
          tag: "President",
          bio: "By Day, AI Engineer.\nBy Heart, Full-time Palestine Activist.",
          imageKey: "team1" as const,
          imagePosition: "top" as const,
        },
        {
          name: "Ex Senator Mushtaq Ahmad Khan",
          tag: "Patron",
          bio: "From the halls of power to the decks of the Sumud Flotilla: An ex Senator, human rights activist and unyielding champion of Palestine and the oppressed.",
          imageKey: "team2" as const,
        },
        {
          name: "Dr Hassaan Bokhari",
          tag: "Research Mentor",
          bio: "Surgeon by training, historian by passion.\nAvid reader, thoughtful author and a dedicated mentor.",
          imageKey: "team3" as const,
          imagePosition: "top" as const,
        },
        {
          name: "Hamza Zeb",
          tag: "Islamabad Lead",
          bio: "A Market research Analyst in the expert networking industry,\nbut his true calling lies in activism.",
          imageKey: "team4" as const,
        },
        {
          name: "Armaghan Mahmood",
          tag: "Lahore Lead",
          bio: "Financial Professional who's got a thing for history and geopolitics.\nEqually passionate about numbers and narratives.",
          imageKey: "team5" as const,
        },
        {
          name: "Saad Humayun",
          tag: "Karachi Lead",
          bio: "Forging strength beyond the gym.\nFitness trainer, youth mentor, and activist inspiring discipline, leadership, and awareness for global justice.",
          imageKey: "team6" as const,
        },
        {
          name: "Ibrahim Bajwa",
          tag: "Faisalabad Lead",
          bio: "Building intelligent systems but invested more in driving awareness and activism.",
          imageKey: "team7" as const,
        },
        {
          name: "Adv. Jawad Bhutta",
          tag: "Multan Lead",
          bio: "An all-round fighter for justice - here at home or wherever it calls.\nSpends his free time devouring books of history.",
          imageKey: "team8" as const,
          imagePosition: "top" as const,
        },
        {
          name: "Huzaifa Iqbal",
          tag: "Sargodha Lead",
          bio: "Part activist, part coalition-builder.\nOften found connecting campuses, communities, and causes into one movement.",
          imageKey: "team9" as const,
        },
      ],
    },
    contact: {
      title: "Contact Us",
      intro: "Become a volunteer, donate, or get in touch.",
      volunteer: {
        title: "Join Us as a Volunteer",
        body: "Join our initiatives and contribute your time and skills. Pick a role that fits you and sign up below.",
        cta: "Sign up to volunteer",
        formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScmKyTfY3oCA069IjnZRS-mL_RfHfXpHA2HfKkIoLAF0lw4Tg/viewform",
        roles: ["University Ambassador", "Ground Activist", "Video Editor", "Graphics Designer", "Social Media Handler", "Content Writer"],
      },
      donate: {
        title: "Donate To The Cause Now",
        body: "Support relief efforts with a secure donation.",
        cta: "Donate now",
        contactName: "Maria Paracha",
        contactRole: "Relief Head",
        contactPhone: "+92 340 4555542",
      },
      form: { title: "Send a message", name: "Name", email: "Email", message: "Message", send: "Send" },
      social: [
        { name: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VaaBFEaDzgTFDQa5yn3u", label: "Pak-Palestine Forum" },
        { name: "Facebook", url: "https://www.facebook.com/share/18UtUumkQL/?mibextid=wwXIfr", label: "PakPalForumm" },
        { name: "Instagram", url: "https://www.instagram.com/pakpalforum2?igsh=MXJ3aWduMHpybjZjZg==", label: "pakpalforum" },
        { name: "X (Twitter)", url: "https://x.com/pak_palforum?s=11", label: "Pak_PalForum" },
        { name: "UpScrolled", url: "https://share.upscrolled.com/en/user/c2dd3f99-5bd2-4ee0-aae7-1dc3030a156e/", label: "pakpalforum" },
        { name: "YouTube", url: "https://youtube.com/@pakpalforum2?si=NdrBXmErGSt7Ru9i", label: "Pak Pal Forum" },
      ],
    },
    join: {
      badge: "Volunteer & Collaborate",
      h2: "Join Pak-Palestine Forum",
      p: "Pak-Palestine Forum welcomes volunteers, professionals, and organizations to contribute to humanitarian and advocacy initiatives.",
      skillsHeading: "Roles & skills",
      skillCards: [
        {
          title: "Ground Activism",
          detail: "Onboard volunteers onto ground teams for peaceful, organised events.",
        },
        {
          title: "Networking and Public Relations",
          detail: "Brief new volunteers and pair them with the right ground team.",
        },
        {
          title: "Photography",
          detail: "Documenting events, marches, and community moments for archives, awareness, and our channels.",
        },
        {
          title: "Vlogs or Video Messages",
          detail: "Recording short updates, appeals, or personal messages people can share online.",
        },
        {
          title: "Video Editing",
          detail: "Cutting footage, pacing, captions, and polishing clips so campaigns look sharp and readable.",
        },
        {
          title: "Graphics Designing",
          detail: "Posters, stories, thumbnails, and visual assets that make our calls to action easy to spot.",
        },
        {
          title: "Social Media Management",
          detail: "Scheduling posts, replying to supporters, and keeping pages active, accurate, and on-message.",
        },
        {
          title: "Content Writing and Research",
          detail: "Short social media–savvy content",
        },
        {
          title: "Any other skill relevant to the mission",
          detail: "Tell us what you bring — if it supports Palestine and our work in Pakistan, we still want to hear from you.",
        },
      ],
      cta: "Join Us",
      ways: [
        { title: "Volunteer for Campaigns", short: "On-ground activism & event coordination" },
        { title: "Support Awareness Initiatives", short: "Content creation & public outreach" },
        { title: "Join Advocacy Efforts", short: "Policy, media & institutional engagement" },
        { title: "Provide Professional Expertise", short: "Legal, medical, tech & creative skills" },
        { title: "Collaborate as Partner Organization", short: "Organisational collaboration & resources" },
      ],
      waysHeading: "How you can help",
    },
    footer: { tagline: "Peaceful, Non-Violent Activism for Palestine" },
    chatbot: {
      title: "PPF Assistant",
      welcome: "Ask about PPF, volunteering, or donations.",
      placeholder: "Type your message...",
      send: "Send",
      defaultReply: "Thanks for your message. Our team will get back to you soon.",
    },
    lang: "EN",
  },
  ur: {
    siteName: "پاک فلسطین فورم",
    tagline: "فلسطین کے لیے متحدہ موقف",
    swipeHint: "سوائپ",
    nav: {
      mission: "ویژن",
      where: "ہمارے چیپٹر",
      impact: "ہمارا اثر",
      act: "شامل ہوں",
      faq: "سوالات",
      team: "ٹیم",
      contact: "رابطہ",
    },
    cta: { join: "شامل ہوں", volunteer: "رضاکار", donate: "عطیہ" },
    floatingBar: {
      contactBtn: "ہم سے رابطہ",
      eventBtn: "غزہ کے لیے پاکستانی مارچ",
      contactTitle: "ہم سے رابطہ",
      contactHint: "پاک فلسطین فورم کی ٹیم تک پہنچیں۔",
      whatsappLabel: "واٹس ایپ",
      emailLabel: "ای میل",
      phoneDisplay: "+92 340 4555542",
      phoneWaDigits: "923404555542",
      email: "pakpalforum@gmail.com",
      eventTitle: "غزہ کے لیے پاکستانی مارچ",
      eventBody:
        "فلسطین کے ساتھ سڑکوں پر یکجہتی۔ تاریخیں، شہروں کی تفصیل اور شرکت کا طریقہ ہمارے چینلز پر شیئر کیا جائے گا — پی پی ایف فالو کریں تاکہ مارچ کی تازہ خبریں نہ چھوٹیں۔",
      close: "بند کریں",
      dismissOverlay: "باکس بند کریں",
    },
    heroSlides: [
      { tagline: "فلسطین کے لیے متحدہ موقف", subtext: "فلسطین اور اقصی کی پکار پر لبیک!" },
      { tagline: "سرحدوں سے ماورا یکجہتی", subtext: "پاکستان سے فلسطین کی آواز بنیں!" },
      { tagline: "فلسطین تا پاکستان؛ ایک جدوجہد", subtext: "پاکستان سے فلسطین کاز کے لیے ۔۔۔۔ ہاتھوں میں ہاتھ دیں!" },
    ],
    vision: {
      title: "ویژن اور مقاصد",
      intro:
        "ہمارا مشن فلسطینی کاز کو آگے بڑھانا ہے — فلسطین کی آزادی اور المسجد الاقصیٰ کی آزادی — باخبر، اصول پسند اور پائیدار یکجہتی کے لیے پاکستانی معاشرے کو متحرک اور بااختیار بنانا، خاص طور پر فلسطین کے لیے۔",
      objectives:
        "پاک-فلسطین فورم فلسطینی کاز کی بھرپور حمایت کے لیے پرامن مگر مؤثر ذرائع سے وابستہ ہے، جن میں فعالیت، عوامی آگاہی، بائیکاٹ کی تحریکیں، امدادی کوششیں اور سفارتی یا سیاسی رابطے شامل ہیں۔ طویل مدت میں پلیٹ فارم پاکستانی نوجوانوں، خواتین اور آنے والی نسلوں کو باخبر، فعال اور اصول پسند بنا کر اپنی اقدار کے دفاع اور فلسطین کی وکالت کے لیے تیار کرنا چاہتا ہے۔ پرو-فلسطینی آوازوں کو جوڑ کر، سپورٹ کر کے اور یکجا کر کے، اور پاکستان بھر کے نمایاں افراد سے مشغول ہو کر، فورم فلسطین کی آزادی اور المسجد الاقصیٰ کی آزادی کے لیے پائیدار یکجہتی مضبوط بنانے کا ہدف رکھتا ہے۔",
      objectivePoints: [
        {
          title: "فعالیت اور آگاہی",
          body: "پاک-فلسطین فورم فلسطینی کاز کی بھرپور حمایت کے لیے پرامن مگر مؤثر ذرائع سے وابستہ ہے، جن میں فعالیت، عوامی آگاہی، بائیکاٹ کی تحریکیں، امدادی کوششیں اور سفارتی یا سیاسی رابطے شامل ہیں۔",
        },
        {
          title: "بااختیار بنانا",
          body: "طویل مدت میں پلیٹ فارم پاکستانی نوجوانوں، خواتین اور آنے والی نسلوں کو باخبر، فعال اور اصول پسند بنا کر اپنی اقدار کے دفاع اور فلسطین کی وکالت کے لیے تیار کرنا چاہتا ہے۔",
        },
        {
          title: "یکجہتی اور آوازیں",
          body: "پرو-فلسطینی آوازوں کو جوڑ کر، سپورٹ کر کے اور یکجا کر کے، اور پاکستان بھر کے نمایاں افراد سے مشغول ہو کر، فورم فلسطین کی آزادی اور المسجد الاقصیٰ کی آزادی کے لیے پائیدار یکجہتی مضبوط بنانے کا ہدف رکھتا ہے۔",
        },
      ],
      cards: [
        { title: "فعالیت اور آگاہی", body: "فلسطینی مقصد کی حمایت کے لیے آگاہی، پرامن احتجاج، وکالت، کمیونٹی کی مصروفیت اور بائیکاٹ جیسے اقدامات کو فروغ دینا۔" },
        { title: "امداد", body: "وسائل اور کوششوں کو ان لوگوں کی طرف موڑنا جو سب سے زیادہ ضرورت مند ہیں۔ پارٹنر تنظیموں کے ذریعے امداد اور غزہ میں خاندانوں کی حمایت۔" },
        { title: "بااختیار بنانا", body: "پاکستانی نوجوانوں، خواتین اور آنے والی نسلوں کو اپنی اقدار کا دفاع کرنے اور فلسطین کی وکالت کرنے میں باخبر، فعال اور اصول پسند بنانا۔" },
      ],
    },
    impact: {
      title: "ہمارا اثر",
      intro: "PPF کی سرگرمیاں اور کامیابیاں بیداری، امداد اور کمیونٹی کی تعمیر میں۔",
      stats: [
        { value: "300+", label: "احتجاج اور مہمات" },
        { value: "3.5M+", label: "سوشل فالورز" },
        { value: "PKR 10M+", label: "امداد فراہم" },
      ],
      achievements: [
        "Global Sumud Flotilla میں پاکستان کی بین الاقوامی نمائندگی، 5 رکنی وفد کے ذریعے",
        "قومی سطح پر فلسطین کے اتحاد (Palestine Action Coalition, Pak) میں مرکزی رکنیت",
        "پاکستان کے 15 سے زیادہ شہروں میں 300 سے زیادہ احتجاج، مہمات اور آگاہی سیشن",
        "100 سے زیادہ سیاست دانوں، سفارت کاروں اور پاکستان کے رہنماؤں سے مشغول",
        "دارالحکومت میں 42 دن کے دھرنے کے بعد غزہ کے لیے پاکستان کی حکومت کے ساتھ معاہدہ",
        "ریاستی دباؤ کے خلاف قانونی جنگیں کامیابی سے لڑیں، جن میں متعدد حراستیں اور جھوٹے فوجداری مقدمات شامل ہیں؛ بیشتر قانونی محاذ پر کامیابی ملی۔",
        "3.5 ملین سوشل فالورز اور اوسطاً ماہانہ 100 ملین سے زیادہ سامعین تک رسائی",
        "پارٹنر تنظیموں کے ذریعے فلسطین کو PKR 10 ملین سے زیادہ امداد فراہم کی",
        "غزہ میں 40 سے زیادہ فلسطینی خاندانوں کی ایک سال تک ماہانہ کفالت",
        "پاکستان بھر میں 170,000 سے زیادہ بائیکاٹ گائیڈز تقسیم کیے",
        "اسلام آباد آئی-8 سیکٹر میں مک ڈونلڈز برانچ سے ڈائیویسٹمنٹ پر کامیاب مذاکرات",
        "ایک فلسطینی طالب علم کی داخلہ اور 7 سے زیادہ فلسطینیوں کی تخلیص/امigration میں مدد",
      ],
    },
    faq: {
      title: "اکثر پوچھے گئے سوالات",
      items: [
        {
          q: "پاک فلسطین فورم کیا ہے؟",
          a: "پاک-فلسطین فورم پاکستان میں قائم ایک متحدہ پلیٹ فارم ہے جو خصوصی طور پر المسجد الاقصیٰ کی آزادی اور فلسطین کی آزادی کے لیے سرگرم عمل ہے۔\n\nہمارا مشن پاکستان کے عوام اور ریاست دونوں کو بیدار کرنا، انہیں جدوجہد میں شامل کرنا اور معاشرتی اقدامات کے ذریعے آزادی فلسطین کی جدوجہد میں شامل کرنا ہے۔ہمارا مقصد عوامی شعور کو بڑھانا اور قوم کو انصاف،ہماری مشترکہ اقدار اور فلسطینی کاز کے تحفظ کے لیے ایک سرگرم اور اصولی کردار ادا کرنے کے لیے تیار کرنا ہے۔",
        },
        { q: "میں PPF میں کیسے شامل ہو سکتا ہوں؟", rich: "joinHow" as const },
        {
          q: "میں ایک پاکستانی کے طور پر غزہ کے لیے کیسے فرق بنا سکتا ہوں؟",
          a: "غزہ اور فلسطین کا حقیقی حل حکومتوں کے ہاتھ میں ہے، مگر اس کا مطلب یہ نہیں کہ آپ اثر نہیں ڈال سکتے۔\n\nپرامن فعالیت کے ذریعے ہم پاکستان کی حکومت کی فلسطین کے لیے اقدامات کو متاثر کر سکتے ہیں۔\n\nزمین پر اور میڈیا میں اجتماعی کوششوں سے ہم عوامی بیانیہ اور عوامی دباؤ میں اضافے میں کردار ادا کر سکتے ہیں۔\n\nتعلیم اور آگاہی سے ہم پاکستان کے لوگوں کو ایسے مشکل ادوار میں زیادہ ذمہ دار بنا سکتے ہیں۔\n\nاسی طرح افراد فلسطینیوں پر ظلم سے جڑی کمپنیوں کے بائیکاٹ اور غزہ کے لیے امداد دینے والی معتبر تنظیموں کو عطیات سے بھی حصہ ڈال سکتے ہیں۔",
        },
        {
          q: "فعالیت کیا ہے؟",
          a: "فعالیت کا مطلب تبدیلی لانے کے لیے عمل کرنا ہے۔ یہ ظلم کا مقابلہ کرنے اور اقتدار والوں کو جوابدہ ٹھہرانے کے لیے اپنی آواز اور کوششیں استعمال کرنا ہے تاکہ معاشرے میں مثبت تبدیلی آئے۔\n\nپاک-فلسطین فورم پرامن، غیر تشدد فعالیت اختیار کرتا ہے جس میں آگاہی، پرامن احتجاج، وکالت، کمیونٹی کی مشغولیت، اور فلسطینی کاز کی حمایت اور ظلم و بے ضمیری کا مقابلہ کرنے کے لیے بائیکاٹ جیسے اقدامات شامل ہیں۔\n\nاصل میں فعالیت ظلم کے خلاف کھڑے ہونا اور زیادہ منصفانہ اور اخلاقی دنیا کے لیے اجتماعی طور پر کام کرنا ہے۔",
        },
        {
          q: "کیا احتجاج اور یکجہتی کی کوششیں فلسطینی مقصد میں مدد کرتی ہیں؟",
          a: "احتجاج اور عوامی یکجہتی نہ صرف آگاہی بڑھاتی اور مسئلے کو زندہ رکھتی ہیں، بلکہ حکومتوں، اداروں اور کمپنیوں پر عمل کے لیے عوامی دباؤ بھی بناتی ہیں۔\n\nیہ فلسطینیوں کو یہ پیغام بھی دیتے ہیں کہ وہ اپنی جدوجہد میں اکیلے نہیں، اور وکالت، بائیکاٹ اور انسانی امداد کے ذریعے کمیونٹیوں کو متحرک کرنے میں مدد کرتے ہیں۔",
        },
        {
          q: "پاکستانیوں کو فلسطین کیوں پرواہ کرنی چاہیے؟",
          a: "فلسطین صرف ہمارا مذہبی اور اخلاقی فریضہ نہیں؛ ۷ اکتوبر کے بعد پرو-فلسطینی لہر فلسطینیوں اور بیت المقدس کو صیہونی قبضے سے آزاد کرانے کا بڑا موقع فراہم کرتی ہے۔ ساتھ ہی ہم ۷ اکتوبر کے بعد کے منظرنامے کو آزاد ذہنوں کے لیے ایک دروازہ سمجھتے ہیں تاکہ وہ یکجا ہوں، متحرک ہوں، اور دنیا بھر میں دبائے جانے والے انسانیت کے لیے جدوجہد کریں۔",
        },
        {
          q: "PPF کو اپنی مالی حمایت کہاں سے ملتی ہے؟",
          a: "PPF اپنے اندرونی ٹیم اور اراکین کی سرگرم حمایت کے ذریعے فنڈ حاصل کرتا ہے، جو باقاعدہ عطیات دے کر تنظیم کی سرگرمیوں کو جاری رکھتے ہیں۔ اس کے علاوہ PPF کبھی کبھار فلسطینی کاز میں دلچسپی رکھنے والے افراد اور گروہوں سے رابطہ کرتا ہے تاکہ وہ آگاہی، وکالت اور امدادی اقدامات کی حمایت کریں۔",
        },
      ],
    },
    where: {
      title: "پاکستان کے شہروں میں پی پی ایف کی ٹیمیں",
      intro: "ہماری جغرافیائی موجودگی اور رسائی۔",
      overlay: "پاکستان · علاقائی مراکز · بین الاقوامی شراکت دار",
      chapters: ["اسلام آباد", "لاہور", "کراچی", "فیصل آباد", "سرگودھا", "ملتان"],
      smallerUnits: "پشاور، جہلم، لالہ موسیٰ، سکھر، لکی مروت، بہاولنگر، رحیم یار خان، مظفر گڑھ، صوابی، کوئٹہ، شیخوپورہ، پھالیہ، حیدرآباد اور واہ کینٹ",
    },
    nation: {
      headline1: "پورے ملک میں،",
      headline2: "ایک مقصد کے لیے متحد۔",
      description: "پاک فلسطین فورم ایک قومی تحریک ہے۔ شمال کے پہاڑوں سے لے کر جنوب کے ساحلوں تک، ہمارے رضاکار ہر بڑے شہر میں فعال ہیں، امداد منظم کر رہے ہیں اور آگاہی بڑھا رہے ہیں۔",
      stats: [
        { value: "50+", label: "شہر فعال" },
        { value: "5,000+", label: "رضاکار" },
        { value: "100+", label: "شراکت دار" },
        { value: "24/7", label: "مدد" },
      ],
      cta: "اپنے قریب کا چاپٹر تلاش کریں",
      liveActivity: {
        title: "لائیو سرگرمی",
        subtitle: "ریل ٹائم موجودگی",
        newVolunteersLabel: "نئے رضاکار",
        newVolunteersValue: "+12 (آخری گھنٹہ)",
      },
    },
    team: {
      title: "ہماری ٹیم",
      intro: "PPF کے مشن اور اثر کے پیچھے لوگ۔",
      chapterHeadsLabel: "چاپٹر ہیڈز",
      names: ["Name One", "Name Two", "Name Three"],
      role: "Role / Title",
      members: [
        {
          name: "Wahaj Ahmad",
          tag: "President",
          bio: "By Day, AI Engineer.\nBy Heart, Full-time Palestine Activist.",
          imageKey: "team1" as const,
          imagePosition: "top" as const,
        },
        {
          name: "Ex Senator Mushtaq Ahmad Khan",
          tag: "Patron",
          bio: "From the halls of power to the decks of the Sumud Flotilla: An ex Senator, human rights activist and unyielding champion of Palestine and the oppressed.",
          imageKey: "team2" as const,
        },
        {
          name: "Dr Hassaan Bokhari",
          tag: "Research Mentor",
          bio: "Surgeon by training, historian by passion.\nAvid reader, thoughtful author and a dedicated mentor.",
          imageKey: "team3" as const,
          imagePosition: "top" as const,
        },
        {
          name: "Hamza Zeb",
          tag: "Islamabad Lead",
          bio: "A Market research Analyst in the expert networking industry,\nbut his true calling lies in activism.",
          imageKey: "team4" as const,
        },
        {
          name: "Armaghan Mahmood",
          tag: "Lahore Lead",
          bio: "Financial Professional who's got a thing for history and geopolitics.\nEqually passionate about numbers and narratives.",
          imageKey: "team5" as const,
        },
        {
          name: "Saad Humayun",
          tag: "Karachi Lead",
          bio: "Forging strength beyond the gym.\nFitness trainer, youth mentor, and activist inspiring discipline, leadership, and awareness for global justice.",
          imageKey: "team6" as const,
        },
        {
          name: "Ibrahim Bajwa",
          tag: "Faisalabad Lead",
          bio: "Building intelligent systems but invested more in driving awareness and activism.",
          imageKey: "team7" as const,
        },
        {
          name: "Adv. Jawad Bhutta",
          tag: "Multan Lead",
          bio: "An all-round fighter for justice - here at home or wherever it calls.\nSpends his free time devouring books of history.",
          imageKey: "team8" as const,
          imagePosition: "top" as const,
        },
        {
          name: "Huzaifa Iqbal",
          tag: "Sargodha Lead",
          bio: "Part activist, part coalition-builder.\nOften found connecting campuses, communities, and causes into one movement.",
          imageKey: "team9" as const,
        },
      ],
    },
    contact: {
      title: "ہم سے رابطہ کریں",
      intro: "رضاکار بنیں، عطیہ دیں، یا رابطہ کریں۔",
      volunteer: {
        title: "رضاکار کے طور پر شامل ہوں",
        body: "ہماری کوششوں میں شامل ہوں اور اپنا وقت اور صلاحیتیں پیش کریں۔ اپنے مطابق کردار منتخب کریں اور نیچے سائن اپ کریں۔",
        cta: "رضاکار بننے کے لیے سائن اپ کریں",
        formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScmKyTfY3oCA069IjnZRS-mL_RfHfXpHA2HfKkIoLAF0lw4Tg/viewform",
        roles: ["یونیورسٹی ایمبیسیڈر", "گراؤنڈ ایکٹوسٹ", "ویڈیو ایڈیٹر", "گرافکس ڈیزائنر", "سوشل میڈیا ہینڈلر", "کنٹینٹ رائٹر"],
      },
      donate: {
        title: "ابھی مقصد کے لیے عطیہ دیں",
        body: "محفوظ عطیہ کے ساتھ امدادی کوششوں کی حمایت کریں۔",
        cta: "ابھی عطیہ کریں",
        contactName: "Maria Paracha",
        contactRole: "Relief Head",
        contactPhone: "+92 340 4555542",
      },
      form: { title: "پیغام بھیجیں", name: "نام", email: "ای میل", message: "پیغام", send: "بھیجیں" },
      social: [
        { name: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VaaBFEaDzgTFDQa5yn3u", label: "Pak-Palestine Forum" },
        { name: "Facebook", url: "https://www.facebook.com/share/18UtUumkQL/?mibextid=wwXIfr", label: "PakPalForumm" },
        { name: "Instagram", url: "https://www.instagram.com/pakpalforum2?igsh=MXJ3aWduMHpybjZjZg==", label: "pakpalforum" },
        { name: "X (Twitter)", url: "https://x.com/pak_palforum?s=11", label: "Pak_PalForum" },
        { name: "UpScrolled", url: "https://share.upscrolled.com/en/user/c2dd3f99-5bd2-4ee0-aae7-1dc3030a156e/", label: "pakpalforum" },
        { name: "YouTube", url: "https://youtube.com/@pakpalforum2?si=NdrBXmErGSt7Ru9i", label: "Pak Pal Forum" },
      ],
    },
    join: {
      badge: "رضاکار اور تعاون",
      h2: "پاک فلسطین فورم میں شامل ہوں",
      p: "پاک فلسطین فورم انسانی اور وکالت کی کوششوں میں حصہ ڈالنے کے لیے رضاکاروں، پیشہ ور افراد اور تنظیموں کا خیرمقدم کرتا ہے۔",
      skillsHeading: "کردار اور مہارتیں",
      skillCards: [
        {
          title: "زمینی سرگرمی",
          detail: "رضاکاروں کو زمینی ٹیموں میں شامل کرنا — پرامن، منظم تقریبات کے لیے۔",
        },
        {
          title: "نیٹ ورکنگ اور عوامی تعلقات",
          detail: "نئے رضاکاروں کو بریف کرنا اور مناسب زمینی ٹیم سے جوڑنا۔",
        },
        {
          title: "فوٹو گرافی",
          detail: "مارچوں، تقریبات اور کمیونٹی لمحات کی دستاویز — آگاہی اور چینلز کے لیے۔",
        },
        {
          title: "ولاغز یا ویڈیو پیغامات",
          detail: "مختصر اپ ڈیٹس، اپیلیں یا ذاتی پیغامات جو آن لائن شیئر کیے جا سکیں۔",
        },
        {
          title: "ویڈیو ایڈیٹنگ",
          detail: "فوٹیج کاٹنا، رفتار، سب ٹائٹل اور کلپس کو مہمات کے لیے تیار کرنا۔",
        },
        {
          title: "گرافک ڈیزائننگ",
          detail: "پوسٹر، اسٹوریز، تھمب نیل اور بصری مواد تاکہ ہماری کال واضح نظر آئے۔",
        },
        {
          title: "سوشل میڈیا کا انتظام",
          detail: "پوسٹ شیڈول، جوابات، اور صفحات کو فعال، درست اور پیغام کے مطابق رکھنا۔",
        },
        {
          title: "مواد کی تحریر اور تحقیق",
          detail: "سوشل میڈیا کے لیے مختصر اور موثر مواد",
        },
        {
          title: "مشن سے متعلق کوئی اور مہارت",
          detail: "اپنی مہارت لکھیں — اگر فلسطین اور پاکستان میں ہمارے کام میں مددگار ہو تو ہم سننا چاہتے ہیں۔",
        },
      ],
      cta: "شامل ہوں",
      ways: [
        { title: "مہمات کے لیے رضاکار", short: "زمینی سرگرمی اور ایونٹ کوآرڈینیشن" },
        { title: "آگاہی کی کوششوں کی حمایت", short: "مواد کی تخلیق اور عوامی رسائی" },
        { title: "وکالت کی کوششوں میں شامل ہوں", short: "پالیسی، میڈیا اور ادارہ جاتی مشغولیت" },
        { title: "پیشہ ورانہ مہارت فراہم کریں", short: "قانونی، طبی، ٹیک اور تخلیقی صلاحیتیں" },
        { title: "پارٹنر تنظیم کے طور پر تعاون", short: "تنظیمی تعاون اور وسائل" },
      ],
      waysHeading: "آپ کیسے مدد کر سکتے ہیں",
    },
    footer: { tagline: "فلسطین کے لیے متحدہ موقف" },
    chatbot: {
      title: "PPF اسسٹنٹ",
      welcome: "PPF، رضاکاری، یا عطیات کے بارے میں پوچھیں۔",
      placeholder: "اپنا پیغام لکھیں...",
      send: "بھیجیں",
      defaultReply: "آپ کے پیغام کا شکریہ۔ ہماری ٹیم جلد رابطہ کرے گی۔",
    },
    lang: "اردو",
  },
} as const

export const content = stripEmDashesDeep(contentSource) as typeof contentSource

export type Locale = keyof typeof contentSource
