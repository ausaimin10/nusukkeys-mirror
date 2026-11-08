// NusukKeys frontend. Identity = the user's own Nusuk key, stored in the `mk_key` cookie
// (mirrored to localStorage). Displays real visitor stats and newly added code stats,
// and a top warning bar whenever a user is browsing without entering their own key.

const I18N = {
  en: {
    dir: 'ltr',
    guestWarnText: 'You are browsing without your Nusuk key — enter your key so your used & remaining codes stay saved across devices.',
    inappText: 'You\'re viewing this inside another app. The "Open in Nusuk" button may not work here — open this page in your browser instead.',
    inappOpenChrome: 'Open in Chrome',
    inappCopyLink: 'Copy link to open in Safari',
    inappCopied: 'Link copied — paste it in Safari to open this page.',
    guestWarnBtn: 'Enter My Key →',
    mVisitorsLabel: 'Real Visitors',
    mCopiesLabel: 'Code Copy Times',
    mAddedLabel: 'Newly Added Codes',
    mTotalCopiesLabel: 'Total Copies',
    mTotalCopiesSub: 'copied by everyone',
    metricsNote: 'We never give you the same code twice from our collection of nearly 100,000 codes. However, if you have already used a code elsewhere before copying it from this website, it may not work for you again, as each code can only be used once.',
    viewCodeList: 'View Code List',
    compSummary: 'New Free Umrah Competition 2026',
    footSummary: 'Independent Community Tool',
    heroTitle: 'referral codes. Copy one, get a key.',
    heroSub: "Tap once to copy, paste it in the Nusuk app. We remember what you've used, so you never see the same code twice.",
    nextCode: 'Your next code', copyNext: 'Copy & show next', skip: 'Skip',
    copied: 'Copied', alreadyUsed: 'Already used', invalid: "Doesn't work", undo: 'Undo',
    s2t: 'Open in Nusuk app', s2d: 'Start the challenge in the Nusuk app first, then tap here — the code should already be filled in. If not, just paste it. Keep the Nusuk app open in the background so the code goes straight to it. When the Congratulations page shows, stay on it — don\'t close the app or go back.',
    s3t: 'Not accepted? Next.', s3d: "Mark it and we'll never show it again.",
    search: 'Search codes…', fRemaining: 'Remaining', fNew: 'Newly Added', fUsed: 'Used', fAll: 'All', more: 'Load more',
    shareMsg: 'Please share this for the benefit of the Ummah.',
    shareTitle: 'Share NusukKeys',
    shareClose: 'Close',
    sponsorTitle: 'Sponsor Hosting',
    sponsorLine1: "Your contribution goes directly towards upgrading the website's primary hosting server.",
    sponsorLine2: 'A small contribution, a lasting benefit for the Ummah.',
    sponsorBtn: 'Sponsor Hosting',
    sponsorNote: 'This site runs on free hosting. A paid plan for the main server starts at about $5 a month and raises the limits. Every contribution goes to that upgrade, nothing else.',
    sponsorEmail: 'Email to sponsor',
    sponsorClose: 'Close',
    sponsorHint: 'Contributions are voluntary. No payment details are collected on this site.',
    failoverMsg: 'This site could not load its code list. Try a backup mirror \u2014 codes you use there are saved only in that browser.',
    failoverCount: (n) => `Moving to the backup mirror in ${n}s\u2026`,
    failoverStay: 'Stay here',
    gateShareNote: 'Your code is also added to the pool, so others can use it. It will never be shown back to you.',
    foot: 'Independent community tool. Not affiliated with Nusuk or the Ministry of Hajj and Umrah. We never ask for your login.',
    gateTitle: 'Enter your Nusuk key',
    gateSub: "It's your private ID here. We use it to remember which codes you've already used, on any device. It's saved in a cookie so you only do this once.",
    gateGo: 'Continue', gateAnon: "I don't have a key yet",
    gateHint: 'Find it in Nusuk: Start the challenge → Share → copy the code that starts with NG-. You can also paste your full Nusuk share link here — the code is pulled out automatically.',
    by: (n) => (n ? `shared by ${n}` : ''),
    activeNow: (n) => `${n} active now`,
    copiedToday: (n) => `${n} copied today`,
    addedSub: (today, latest) => (latest ? `Latest: ${latest} (+${today} today)` : `${today} added today`),
    copy: 'Copy',
    navHome: 'Home',
    navCodes: 'Codes',
    navGuide: 'Guide',
    navFix: 'Fix',
    navFind: 'Find your code',
    navComp: 'Competition 2026',
    hadithText: 'Whoever guides to good gets the same reward as the one who does it.',
    hadithRef: 'Sahih Muslim 1893',
    badgeNoAccount: 'No account needed',
    badgeNoLogin: 'No login needed',
    badgeNoSub: 'No subscription needed',
    duaTitle: 'A request',
    duaText: 'If you win, remember us in your duas. May Allah accept our and your deeds and grant it to all who hope for it.',
    fixTitle: 'Fix — code not working?',
    fixIntro: 'Try these in order. Most problems are one of these ten.',
    toolsTitle: 'Tools',
    findToolTitle: 'Find your code',
    findToolHint: 'Paste your Nusuk invite link or message — the code is pulled out automatically.',
    findToolBtn: 'Get my code',
    checkToolTitle: 'Is my code on the list?',
    checkToolHint: 'Paste a code, a full invite link or a shared message — up to 10 at once.',
    checkToolBtn: 'Check',
    myCodesTitle: 'My copied codes',
    codesExplainer: 'Every code gets a fair turn: new codes are added all day, so come back daily. Codes that stop working are reported and removed — tap Problem in your copied codes if one does not work.',
    checklistTitle: 'Umrah packing checklist',
    checklistClear: 'Clear marks',
    checklistPrint: 'Print list',
    footNote1: 'If the link does not open, copy the referral code and type it in Nusuk yourself, or open the link in a browser instead of the app.',
    footNote2: 'Codes are ordered newest first.',
    footNote3: '60 codes per page; the count includes all codes.',
    legalPrivacy: 'Privacy policy',
    legalTerms: 'Terms of use',
    legalDevelopers: 'Developers — open data',
    toolFindNone: 'No code found in that text. Paste your full Nusuk invite link or message.',
    toolCheckNotLoaded: 'The code list has not loaded yet. Please wait a moment and try again.',
    toolCheckOn: 'On the list',
    toolCheckOff: 'Not yet listed',
    toolCheckNote: 'Being on the list does not mean the code works in Nusuk — it only means it was shared here. New codes are added after review.',
    myCodesEmpty: 'No codes copied yet. Codes you copy will show up here.',
    myCodesProblem: 'Problem',
    checklistProgress: (d, t) => `${d} / ${t} ready`,
    stats: (c, r, mine) =>
      `You copied <b>${c}</b> · Remaining <b>${r}</b>` +
      (mine ? ` · Your key (${mine.code}) copied <b>${mine.copies}×</b>` : ''),
    shown: (n, f) => `${n}${n >= 60 ? '+' : ''} ${f} shown`,
    none: 'Nothing here yet.', allDone: "You've used every code. Check back soon!",
    toastCopied: (c) => `Copied ${c}. Paste it in Nusuk`,
    toastNusuk: (c) => `Opening Nusuk app — ${c} copied, paste it there if needed`,
    toastNoted: 'Noted. Next one!', toastBad: 'Thanks, reported', toastUndo: 'Undone',
    toastShared: 'Your code is in the pool', toastWelcome: 'Welcome back',
    err: {
      empty: 'Please paste a code first.', invalid_code: 'That does not look like a Nusuk key. It is NG- followed by 8 characters.', server: 'Something went wrong. Try again.'
    }
  },
  bn: {
    dir: 'ltr',
    guestWarnText: 'আপনি এখনো আপনার নিজের নুসুক কী দেননি — আপনার ব্যবহৃত ও বাকি কোডের হিসাব যেকোনো ডিভাইসে সেভ রাখতে আপনার কী দিন।',
    inappText: 'আপনি অন্য একটি অ্যাপের ভেতরে দেখছেন। এখানে "Open in Nusuk" বোতাম কাজ নাও করতে পারে — পেজটি আপনার ব্রাউজারে খুলুন।',
    inappOpenChrome: 'Chrome-এ খুলুন',
    inappCopyLink: 'Safari-তে খুলতে লিংক কপি করুন',
    inappCopied: 'লিংক কপি হয়েছে — পেজটি খুলতে Safari-তে পেস্ট করুন।',
    guestWarnBtn: 'আমার কী দিন →',
    mVisitorsLabel: 'মোট ভিজিটর',
    mCopiesLabel: 'কোড কপি সংখ্যা',
    mAddedLabel: 'নতুন যুক্ত কোড',
    mTotalCopiesLabel: 'মোট কপি',
    mTotalCopiesSub: 'সবাই কপি করেছে',
    metricsNote: 'আমাদের প্রায় ১,০০,০০০ কোডের সংগ্রহ থেকে আমরা কখনো একই কোড দুইবার দিই না। তবে এই ওয়েবসাইট থেকে কপি করার আগে আপনি যদি অন্য কোথাও কোনো কোড ব্যবহার করে থাকেন, তাহলে সেটি আপনার জন্য আবার কাজ নাও করতে পারে, কারণ প্রতিটি কোড শুধু একবারই ব্যবহার করা যায়।',
    heroTitle: 'টি রেফারেল কোড। কপি করুন, কী পান।',
    heroSub: 'একবার ট্যাপ করে কপি করুন, নুসুক অ্যাপে পেস্ট করুন। কোনটা ব্যবহার করেছেন আমরা মনে রাখি, তাই একই কোড দ্বিতীয়বার দেখবেন না।',
    nextCode: 'আপনার পরের কোড', copyNext: 'কপি করুন ও পরেরটা দেখুন', skip: 'স্কিপ',
    copied: 'কপি হয়েছে', alreadyUsed: 'আগে ব্যবহৃত', invalid: 'কাজ করছে না', undo: 'আনডু',
    s2t: 'নুসুক অ্যাপে খুলুন', s2d: 'প্রথমে নুসুক অ্যাপে চ্যালেঞ্জ শুরু করুন, তারপর এখানে চাপ দিন — কোড সাধারণত আগেই পূরণ করা থাকে। না থাকলে শুধু পেস্ট করুন। নুসুক অ্যাপ ব্যাকগ্রাউন্ডে খোলা রাখুন, যাতে কোড সরাসরি সেখানে যায়। Congratulations পেজ দেখা গেলে সেখানেই থাকুন — অ্যাপ বন্ধ করবেন না বা ফিরে যাবেন না।',
    s3t: 'কাজ না করলে পরেরটা', s3d: 'মার্ক করুন, আর কখনো দেখাব না।',
    search: 'কোড খুঁজুন…', fRemaining: 'বাকি', fNew: 'নতুন যুক্ত', fUsed: 'ব্যবহৃত', fAll: 'সব', more: 'আরও দেখুন',
    shareMsg: 'Please share this for the benefit of the Ummah.',
    shareTitle: 'NusukKeys শেয়ার করুন',
    shareClose: 'বন্ধ করুন',
    sponsorTitle: 'হোস্টিং স্পনসর করুন',
    sponsorLine1: 'আপনার অবদান সরাসরি এই ওয়েবসাইটের প্রধান হোস্টিং সার্ভার আপগ্রেডের কাজে যাবে।',
    sponsorLine2: 'একটি ছোট অবদান, উম্মাহর জন্য স্থায়ী উপকার।',
    sponsorBtn: 'হোস্টিং স্পনসর করুন',
    sponsorNote: 'এই সাইটটি এখন বিনামূল্যের হোস্টিংয়ে চলে। মূল সার্ভারের জন্য পেইড প্ল্যান মাসে প্রায় $৫ থেকে শুরু হয় এবং সীমা বাড়ায়। প্রতিটি অবদান শুধু সেই আপগ্রেডের কাজেই যাবে।',
    sponsorEmail: 'স্পনসর করতে ইমেইল করুন',
    sponsorClose: 'বন্ধ করুন',
    sponsorHint: 'অবদান সম্পূর্ণ স্বেচ্ছায়। এই সাইটে কোনো পেমেন্ট তথ্য নেওয়া হয় না।',
    failoverMsg: '\u098f\u0987 \u09b8\u09be\u0987\u099f\u099f\u09bf \u0995\u09cb\u09a1\u09c7\u09b0 \u09a4\u09be\u09b2\u09bf\u0995\u09be \u09b2\u09cb\u09a1 \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u09a8\u09bf. \u09ac\u09cd\u09af\u09be\u0995\u09be\u09aa \u09ae\u09bf\u09b0\u09b0 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c1\u09a8 \u2014 \u09b8\u09c7\u0996\u09be\u09a8\u09c7 \u0995\u09cb\u09a1 \u09b6\u09c1\u09a7\u09c1 \u0993\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09bf\u09a4 \u09a5\u09be\u0995\u09ac\u09c7.',
    failoverCount: (n) => `ব্যাকআপ মিররে যাওয়া হচ্ছে ${n} সেকেন্ডের মধ্যে…`,
    failoverStay: 'এখানেই থাকুন',
    gateShareNote: 'আপনার কোডও পুলে যোগ হবে, যেন অন্যরা ব্যবহার করতে পারে। এটি আর কখনো আপনাকে দেখানো হবে না।',
    foot: 'স্বাধীন কমিউনিটি টুল। নুসুক বা হজ ও উমরাহ মন্ত্রণালয়ের সাথে সম্পর্কিত নয়। আমরা কখনো লগইন চাই না।',
    gateTitle: 'আপনার নুসুক কী দিন',
    gateSub: 'এটিই এখানে আপনার ব্যক্তিগত আইডি। কোন কোড আপনি ব্যবহার করেছেন তা যেকোনো ডিভাইসে মনে রাখতে এটি ব্যবহার হয়। কুকিতে সেভ থাকে, তাই একবারই দিতে হবে।',
    gateGo: 'এগিয়ে যান', gateAnon: 'আমার এখনো কী নেই',
    gateHint: 'নুসুকে পাবেন: Start the challenge → Share → NG- দিয়ে শুরু কোডটি কপি করুন। পুরো নুসুক শেয়ার লিংকও এখানে পেস্ট করতে পারেন — কোডটি নিজে থেকেই বের করা হবে।',
    by: (n) => (n ? `শেয়ার করেছেন ${n}` : ''),
    activeNow: (n) => `${n} জন এখন সক্রিয়`,
    copiedToday: (n) => `আজ ${n} বার কপি`,
    addedSub: (today, latest) => (latest ? `সর্বশেষ: ${latest} (আজ +${today})` : `আজ +${today}টি যুক্ত`),
    copy: 'কপি',
    navHome: 'হোম',
    navCodes: 'কোড',
    navGuide: 'গাইড',
    navFix: 'সমাধান',
    navFind: 'আপনার কোড খুঁজুন',
    navComp: 'প্রতিযোগিতা ২০২৬',
    hadithText: 'যে ভালো কাজের পথ দেখায়, সে সেই কাজ করা ব্যক্তির সমান সওয়াব পায়।',
    hadithRef: 'সহীহ মুসলিম ১৮৯৩',
    badgeNoAccount: 'অ্যাকাউন্ট লাগবে না',
    badgeNoLogin: 'লগইন লাগবে না',
    badgeNoSub: 'সাবস্ক্রিপশন লাগবে না',
    duaTitle: 'একটি অনুরোধ',
    duaText: 'আপনি জিতলে দোয়ায় আমাদেরও মনে রাখবেন। আল্লাহ আমাদের ও আপনাদের আমল কবুল করুন এবং প্রত্যাশী সবাইকে তা দান করুন।',
    fixTitle: 'সমাধান — কোড কাজ করছে না?',
    fixIntro: 'এগুলো ক্রমানুসারে চেষ্টা করুন। বেশিরভাগ সমস্যা এই দশটির একটি।',
    toolsTitle: 'টুলস',
    findToolTitle: 'আপনার কোড খুঁজুন',
    findToolHint: 'আপনার নুসুক ইনভাইট লিংক বা বার্তা পেস্ট করুন — কোডটি নিজে থেকে বের হয়ে আসবে।',
    findToolBtn: 'আমার কোড নিন',
    checkToolTitle: 'আমার কোড কি তালিকায় আছে?',
    checkToolHint: 'একটি কোড, পুরো ইনভাইট লিংক বা শেয়ার করা বার্তা পেস্ট করুন — একবারে সর্বোচ্চ ১০টি।',
    checkToolBtn: 'যাচাই করুন',
    myCodesTitle: 'আমার কপি করা কোড',
    codesExplainer: 'প্রতিটি কোড ন্যায্য সুযোগ পায়: সারাদিন নতুন কোড যোগ হয়, তাই প্রতিদিন ফিরে আসুন। যে কোড কাজ করে না তা জানানো ও সরানো হয় — কোনো কোড কাজ না করলে আপনার কপি করা কোডে Problem-এ ট্যাপ করুন।',
    checklistTitle: 'উমরাহ প্যাকিং চেকলিস্ট',
    checklistClear: 'চিহ্ন মুছুন',
    checklistPrint: 'তালিকা প্রিন্ট করুন',
    footNote1: 'লিংক না খুললে রেফারেল কোড কপি করে নুসুকে নিজে লিখুন, অথবা অ্যাপের বদলে ব্রাউজারে লিংকটি খুলুন।',
    footNote2: 'কোডের ক্রম নতুন থেকে পুরোনো।',
    footNote3: 'প্রতি পাতায় ৬০টি কোড; গণনায় সব কোড অন্তর্ভুক্ত।',
    legalPrivacy: 'গোপনীয়তা নীতি',
    legalTerms: 'ব্যবহারের শর্তাবলি',
    legalDevelopers: 'ডেভেলপারদের জন্য — উন্মুক্ত তথ্য',
    toolFindNone: 'এই লেখায় কোনো কোড পাওয়া যায়নি। আপনার পুরো নুসুক ইনভাইট লিংক বা বার্তা পেস্ট করুন।',
    toolCheckNotLoaded: 'কোডের তালিকা এখনো লোড হয়নি। একটু অপেক্ষা করে আবার চেষ্টা করুন।',
    toolCheckOn: 'তালিকায় আছে',
    toolCheckOff: 'এখনো তালিকায় নেই',
    toolCheckNote: 'তালিকায় থাকার মানে এই নয় যে কোডটি নুসুকে কাজ করবে — এর মানে শুধু এটি এখানে শেয়ার করা হয়েছে। নতুন কোড পর্যালোচনার পর যোগ করা হয়।',
    myCodesEmpty: 'এখনো কোনো কোড কপি করা হয়নি। আপনি যে কোড কপি করবেন তা এখানে দেখাবে।',
    myCodesProblem: 'সমস্যা',
    checklistProgress: (d, t) => `${d} / ${t} প্রস্তুত`,
    stats: (c, r, mine) =>
      `কপি করেছেন <b>${c}</b> · বাকি <b>${r}</b>` +
      (mine ? ` · আপনার কোড (${mine.code}) কপি হয়েছে <b>${mine.copies} বার</b>` : ''),
    shown: (n) => `${n}${n >= 60 ? '+' : ''}টি দেখানো হচ্ছে`,
    none: 'এখানে কিছু নেই।', allDone: 'সব কোড ব্যবহার হয়ে গেছে। পরে আবার দেখুন!',
    toastCopied: (c) => `${c} কপি হয়েছে। নুসুকে পেস্ট করুন`,
    toastNusuk: (c) => `নুসুক অ্যাপ খুলছে — ${c} কপি হয়েছে, প্রয়োজনে সেখানে পেস্ট করুন`,
    toastNoted: 'ঠিক আছে, পরেরটা!', toastBad: 'ধন্যবাদ, রিপোর্ট হয়েছে', toastUndo: 'আনডু হয়েছে',
    toastShared: 'আপনার কোড পুলে যোগ হয়েছে', toastWelcome: 'স্বাগতম',
    err: {
      empty: 'আগে একটি কোড পেস্ট করুন।', invalid_code: 'এটি নুসুক কী মনে হচ্ছে না। NG- এর পরে ৮টি অক্ষর থাকতে হবে।', server: 'সমস্যা হয়েছে, আবার চেষ্টা করুন।'
    }
  },
  ar: {
    dir: 'rtl',
    guestWarnText: 'أنت تتصفح بدون مفتاح نسك الخاص بك — أدخل مفتاحك لحفظ سجل الأكواد المستخدمة والمتبقية عبر جميع أجهزتك.',
    inappText: 'أنت تشاهد هذه الصفحة داخل تطبيق آخر. قد لا يعمل زر "الفتح في نسك" هنا — افتح هذه الصفحة في متصفحك بدلاً من ذلك.',
    inappOpenChrome: 'فتح في Chrome',
    inappCopyLink: 'انسخ الرابط لفتحه في Safari',
    inappCopied: 'تم نسخ الرابط — الصقه في Safari لفتح هذه الصفحة.',
    guestWarnBtn: 'أدخل مفتاحي ←',
    mVisitorsLabel: 'الزوار الفعليون',
    mCopiesLabel: 'مرات نسخ الكود',
    mAddedLabel: 'أكواد أُضيفت حديثًا',
    mTotalCopiesLabel: 'إجمالي النسخ',
    mTotalCopiesSub: 'نسخها الجميع',
    metricsNote: 'لا نمنحك الكود نفسه مرتين أبدًا من مجموعتنا التي تضم ما يقرب من 100,000 كود. ومع ذلك، إذا كنت قد استخدمت كودًا في مكان آخر قبل نسخه من هذا الموقع، فقد لا يعمل لك مرة أخرى، لأن كل كود يمكن استخدامه مرة واحدة فقط.',
    heroTitle: 'كود إحالة. انسخ كودًا واحصل على مفتاح.',
    heroSub: 'اضغط مرة واحدة للنسخ ثم الصقه في تطبيق نسك. نتذكر ما استخدمته فلا يظهر لك الكود نفسه مرتين.',
    nextCode: 'كودك التالي', copyNext: 'انسخ واعرض التالي', skip: 'تخطي',
    copied: 'تم النسخ', alreadyUsed: 'مستخدم سابقًا', invalid: 'لا يعمل', undo: 'تراجع',
    s2t: 'افتح في تطبيق نسك', s2d: 'ابدأ التحدي في تطبيق نسك أولاً، ثم اضغط هنا — من المفترض أن يكون الكود مملوءًا بالفعل. إن لم يكن، الصقه فقط. أبقِ تطبيق نسك مفتوحًا في الخلفية ليصل الكود إليه مباشرة. عند ظهور صفحة التهنئة، ابقَ عليها — لا تغلق التطبيق ولا ترجع.',
    s3t: 'لم يُقبل؟ التالي.', s3d: 'علّمه ولن نعرضه لك مجددًا.',
    search: 'ابحث عن كود…', fRemaining: 'المتبقي', fNew: 'المضاف حديثًا', fUsed: 'المستخدم', fAll: 'الكل', more: 'عرض المزيد',
    shareMsg: 'Please share this for the benefit of the Ummah.',
    shareTitle: 'شارك NusukKeys',
    shareClose: 'إغلاق',
    sponsorTitle: 'ادعم الاستضافة',
    sponsorLine1: 'تذهب مساهمتك مباشرة إلى ترقية خادم الاستضافة الرئيسي للموقع.',
    sponsorLine2: 'مساهمة صغيرة، وفائدة دائمة للأمة.',
    sponsorBtn: 'ادعم الاستضافة',
    sponsorNote: 'يعمل هذا الموقع حاليًا على استضافة مجانية. تبدأ الخطة المدفوعة للخادم الرئيسي من نحو ٥ دولارات شهريًا وترفع الحدود، وتذهب كل مساهمة إلى تلك الترقية فقط.',
    sponsorEmail: 'راسلنا للرعاية',
    sponsorClose: 'إغلاق',
    sponsorHint: 'المساهمات طوعية. لا يجمع هذا الموقع أي بيانات دفع.',
    failoverMsg: '\u062a\u0639\u0630\u0651\u0631 \u062a\u062d\u0645\u064a\u0644 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0631\u0645\u0648\u0632 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0642\u0639. \u062c\u0631\u0651\u0628 \u0646\u0633\u062e\u0629 \u0627\u062d\u062a\u064a\u0627\u0637\u064a\u0629 \u2014 \u062a\u064f\u062d\u0641\u0638 \u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0629 \u0647\u0646\u0627\u0643 \u0641\u064a \u0630\u0644\u0643 \u0627\u0644\u0645\u062a\u0635\u0641\u062d \u0641\u0642\u0637.',
    failoverCount: (n) => `جارٍ الانتقال إلى النسخة الاحتياطية خلال ${n} ثوانٍ…`,
    failoverStay: 'ابقَ هنا',
    gateShareNote: 'سيُضاف كودك أيضًا إلى القائمة ليستخدمه الآخرون، ولن يظهر لك مرة أخرى أبدًا.',
    foot: 'أداة مجتمعية مستقلة، غير تابعة لنسك أو وزارة الحج والعمرة. لا نطلب بيانات دخولك أبدًا.',
    gateTitle: 'أدخل مفتاح نسك الخاص بك',
    gateSub: 'هو معرّفك الخاص هنا. نستخدمه لنتذكر الأكواد التي استخدمتها على أي جهاز. يُحفظ في كوكي فتدخله مرة واحدة فقط.',
    gateGo: 'متابعة', gateAnon: 'ليس لدي مفتاح بعد',
    gateHint: 'تجده في نسك: ابدأ التحدي ← مشاركة ← انسخ الكود الذي يبدأ بـ NG-. ويمكنك أيضًا لصق رابط مشاركة نسك الكامل هنا — وسيُستخرج الكود تلقائيًا.',
    by: (n) => (n ? `شاركه ${n}` : ''),
    activeNow: (n) => `${n} متصل الآن`,
    copiedToday: (n) => `${n} نُسخ اليوم`,
    addedSub: (today, latest) => (latest ? `الأحدث: ${latest} (+${today} اليوم)` : `+${today} أُضيف اليوم`),
    copy: 'نسخ',
    navHome: 'الرئيسية',
    navCodes: 'الأكواد',
    navGuide: 'الدليل',
    navFix: 'إصلاح',
    navFind: 'اعثر على كودك',
    navComp: 'مسابقة 2026',
    hadithText: 'من دلّ على خير فله مثل أجر فاعله.',
    hadithRef: 'صحيح مسلم 1893',
    badgeNoAccount: 'لا حاجة إلى حساب',
    badgeNoLogin: 'لا حاجة إلى تسجيل دخول',
    badgeNoSub: 'لا حاجة إلى اشتراك',
    duaTitle: 'طلب',
    duaText: 'إذا فزت فتذكرنا في دعائك. تقبل الله منا ومنكم ووفق كل من يرجو ذلك.',
    fixTitle: 'إصلاح — الكود لا يعمل؟',
    fixIntro: 'جرّب هذه بالترتيب. معظم المشاكل واحدة من هذه العشر.',
    toolsTitle: 'أدوات',
    findToolTitle: 'اعثر على كودك',
    findToolHint: 'الصق رابط دعوة نسك أو الرسالة — يُستخرج الكود تلقائيًا.',
    findToolBtn: 'احصل على كودي',
    checkToolTitle: 'هل كودي في القائمة؟',
    checkToolHint: 'الصق كودًا أو رابط دعوة كاملًا أو رسالة مشاركة — حتى 10 دفعة واحدة.',
    checkToolBtn: 'تحقق',
    myCodesTitle: 'الأكواد التي نسختها',
    codesExplainer: 'كل كود يحصل على فرصة عادلة: تُضاف أكواد جديدة طوال اليوم، فعُد يوميًا. والأكواد التي تتوقف عن العمل يُبلَّغ عنها وتُزال — اضغط "Problem" في أكوادك المنسوخة إن لم يعمل أحدها.',
    checklistTitle: 'قائمة تجهيز العمرة',
    checklistClear: 'مسح العلامات',
    checklistPrint: 'اطبع القائمة',
    footNote1: 'إذا لم يُفتح الرابط، انسخ كود الإحالة واكتبه في نسك بنفسك، أو افتح الرابط في المتصفح بدل التطبيق.',
    footNote2: 'الأكواد مرتبة من الأحدث إلى الأقدم.',
    footNote3: '60 كودًا في كل صفحة؛ والعدد يشمل كل الأكواد.',
    legalPrivacy: 'سياسة الخصوصية',
    legalTerms: 'شروط الاستخدام',
    legalDevelopers: 'للمطورين — بيانات مفتوحة',
    toolFindNone: 'لم يُعثر على كود في هذا النص. الصق رابط دعوة نسك الكامل أو الرسالة.',
    toolCheckNotLoaded: 'لم تُحمَّل قائمة الأكواد بعد. انتظر لحظة وحاول مجددًا.',
    toolCheckOn: 'في القائمة',
    toolCheckOff: 'ليس في القائمة بعد',
    toolCheckNote: 'وجود الكود في القائمة لا يعني أنه يعمل في نسك — بل يعني فقط أنه شُارك هنا. وتُضاف الأكواد الجديدة بعد المراجعة.',
    myCodesEmpty: 'لم تنسخ أي أكواد بعد. الأكواد التي تنسخها ستظهر هنا.',
    myCodesProblem: 'مشكلة',
    checklistProgress: (d, t) => `${d} / ${t} جاهز`,
    stats: (c, r, mine) =>
      `نسخت <b>${c}</b> · المتبقي <b>${r}</b>` +
      (mine ? ` · كودك (${mine.code}) نُسخ <b>${mine.copies}×</b>` : ''),
    shown: (n) => `${n}${n >= 60 ? '+' : ''} معروض`,
    none: 'لا شيء هنا بعد.', allDone: 'استخدمت كل الأكواد. عد قريبًا!',
    toastCopied: (c) => `تم نسخ ${c}. الصقه في نسك`,
    toastNusuk: (c) => `جارٍ فتح تطبيق نسك — تم نسخ ${c}، الصقه هناك إذا لزم الأمر`,
    toastNoted: 'تم. التالي!', toastBad: 'شكرًا، تم الإبلاغ', toastUndo: 'تم التراجع',
    toastShared: 'تمت إضافة كودك', toastWelcome: 'أهلًا بعودتك',
    err: {
      empty: 'الصق كودًا أولًا.', invalid_code: 'لا يبدو مفتاح نسك. هو NG- يليه 8 أحرف.', server: 'حدث خطأ، حاول مرة أخرى.'
    }
  },
  ur: {
    dir: 'rtl',
    guestWarnText: 'آپ اپنی نسک کی کے بغیر براؤز کر رہے ہیں — اپنی کی درج کریں تاکہ آپ کے استعمال شدہ اور باقی کوڈز تمام آلات پر محفوظ رہیں۔',
    inappText: 'آپ یہ صفحہ کسی اور ایپ کے اندر دیکھ رہے ہیں۔ یہاں "Open in Nusuk" بٹن کام نہیں کر سکتا — اس صفحے کو اپنے براؤزر میں کھولیں۔',
    inappOpenChrome: 'Chrome میں کھولیں',
    inappCopyLink: 'Safari میں کھولنے کے لیے لنک کاپی کریں',
    inappCopied: 'لنک کاپی ہو گیا — یہ صفحہ کھولنے کے لیے اسے Safari میں پیسٹ کریں۔',
    guestWarnBtn: 'میری کی درج کریں →',
    mVisitorsLabel: 'اصل وزٹرز',
    mCopiesLabel: 'کوڈ کاپی کی تعداد',
    mAddedLabel: 'نئے شامل شدہ کوڈز',
    mTotalCopiesLabel: 'کل کاپیاں',
    mTotalCopiesSub: 'سب نے کاپی کیے',
    metricsNote: 'ہم اپنے تقریباً 100,000 کوڈز کے ذخیرے سے آپ کو کبھی ایک ہی کوڈ دو بار نہیں دیتے۔ تاہم، اگر آپ نے اس ویب سائٹ سے کاپی کرنے سے پہلے کہیں اور کوئی کوڈ استعمال کر لیا ہو، تو شاید وہ آپ کے لیے دوبارہ کام نہ کرے، کیونکہ ہر کوڈ صرف ایک بار استعمال ہو سکتا ہے۔',
    heroTitle: 'ریفرل کوڈز۔ ایک کاپی کریں، ایک کی حاصل کریں۔',
    heroSub: 'ایک بار ٹیپ کر کے کاپی کریں، نسک ایپ میں پیسٹ کریں۔ ہم یاد رکھتے ہیں کہ آپ نے کیا استعمال کیا، اس لیے آپ کو وہی کوڈ دوبارہ کبھی نہیں دکھایا جائے گا۔',
    nextCode: 'آپ کا اگلا کوڈ',
    copyNext: 'کاپی کریں اور اگلا دکھائیں',
    skip: 'چھوڑیں',
    copied: 'کاپی ہو گیا',
    alreadyUsed: 'پہلے سے استعمال شدہ',
    invalid: 'کام نہیں کرتا',
    undo: 'واپس کریں',
    s2t: 'نسک ایپ میں کھولیں',
    s2d: 'پہلے نسک ایپ میں چیلنج شروع کریں، پھر یہاں ٹیپ کریں — کوڈ پہلے سے بھرا ہونا چاہیے۔ اگر نہیں، تو بس پیسٹ کریں۔ نسک ایپ بیک گراؤنڈ میں کھلی رکھیں تاکہ کوڈ سیدھا وہاں جائے۔ جب مبارکباد کا صفحہ ظاہر ہو تو وہیں رہیں — ایپ بند نہ کریں اور واپس نہ جائیں۔',
    s3t: 'قبول نہیں ہوا؟ اگلا۔',
    s3d: 'اسے نشان زد کریں اور ہم اسے دوبارہ کبھی نہیں دکھائیں گے۔',
    search: 'کوڈز تلاش کریں…',
    fRemaining: 'باقی',
    fNew: 'نئے شامل شدہ',
    fUsed: 'استعمال شدہ',
    fAll: 'سب',
    more: 'مزید لوڈ کریں',
    shareMsg: 'براہ کرم امت کے فائدے کے لیے اسے شیئر کریں۔',
    shareTitle: 'نسک کیز شیئر کریں',
    shareClose: 'بند کریں',
    sponsorTitle: 'ہوسٹنگ سپانسر کریں',
    sponsorLine1: 'آپ کا تعاون براہ راست ویب سائٹ کے مرکزی ہوسٹنگ سرور کو اپ گریڈ کرنے کے لیے جاتا ہے۔',
    sponsorLine2: 'ایک چھوٹا تعاون، امت کے لیے دیرپا فائدہ۔',
    sponsorBtn: 'ہوسٹنگ سپانسر کریں',
    sponsorNote: 'یہ سائٹ مفت ہوسٹنگ پر چلتی ہے۔ مرکزی سرور کے لیے ایک ادا شدہ پلان تقریباً $5 ماہانہ سے شروع ہوتا ہے اور حدود بڑھاتا ہے۔ ہر تعاون صرف اس اپ گریڈ کے لیے جاتا ہے، اور کچھ نہیں۔',
    sponsorEmail: 'سپانسر کرنے کے لیے ای میل کریں',
    sponsorClose: 'بند کریں',
    sponsorHint: 'تعاون رضاکارانہ ہے۔ اس سائٹ پر ادائیگی کی کوئی تفصیلات جمع نہیں کی جاتیں۔',
    failoverMsg: 'یہ سائٹ اپنی کوڈ لسٹ لوڈ نہیں کر سکی۔ بیک اپ مرر آزمائیں — وہاں استعمال کیے گئے کوڈز صرف اس براؤزر میں محفوظ ہوتے ہیں۔',
    failoverCount: (n) => `بیک اپ مرر پر ${n}s میں جا رہے ہیں…`,
    failoverStay: 'یہیں رہیں',
    gateShareNote: 'آپ کا کوڈ بھی پول میں شامل کیا جاتا ہے، تاکہ دوسرے اسے استعمال کر سکیں۔ یہ آپ کو کبھی واپس نہیں دکھایا جائے گا۔',
    foot: 'آزاد کمیونٹی ٹول۔ نسک یا وزارت حج و عمرہ سے وابستہ نہیں۔ ہم کبھی آپ کا لاگ ان نہیں مانگتے۔',
    gateTitle: 'اپنی نسک کی درج کریں',
    gateSub: 'یہ یہاں آپ کی نجی شناخت ہے۔ ہم اسے یہ یاد رکھنے کے لیے استعمال کرتے ہیں کہ آپ نے کون سے کوڈز پہلے استعمال کیے ہیں، کسی بھی ڈیوائس پر۔ یہ کوکی میں محفوظ ہے اس لیے آپ یہ صرف ایک بار کرتے ہیں۔',
    gateGo: 'جاری رکھیں',
    gateAnon: 'میرے پاس ابھی کی نہیں ہے',
    gateHint: 'نسک میں تلاش کریں: چیلنج شروع کریں → شیئر کریں → وہ کوڈ کاپی کریں جو NG- سے شروع ہوتا ہے۔ آپ اپنا مکمل نسک شیئر لنک بھی یہاں پیسٹ کر سکتے ہیں — کوڈ خود بخود نکال لیا جائے گا۔',
    by: (n) => (n ? `${n} کے ذریعے شیئر کیا گیا` : ''),
    activeNow: (n) => `${n} ابھی فعال`,
    copiedToday: (n) => `آج ${n} کاپی کیے گئے`,
    addedSub: (today, latest) => (latest ? `تازہ ترین: ${latest} (+آج ${today})` : `آج ${today} شامل کیے گئے`),
    stats: (c, r, mine) => `آپ نے <b>${c}</b> کاپی کیے · باقی <b>${r}</b>` + (mine ? ` · آپ کی کی (${mine.code}) <b>${mine.copies}×</b> کاپی کی گئی` : ''),
    shown: (n, f) => `${n}${n >= 60 ? '+' : ''} ${f} دکھائے گئے`,
    none: 'یہاں ابھی کچھ نہیں ہے۔',
    allDone: 'آپ نے ہر کوڈ استعمال کر لیا ہے۔ جلد واپس چیک کریں!',
    toastCopied: (c) => `کاپی ہو گیا ${c}۔ نسک میں پیسٹ کریں`,
    toastNusuk: (c) => `نسک ایپ کھل رہی ہے — ${c} کاپی ہو گیا، اگر ضرورت ہو تو وہاں پیسٹ کریں`,
    toastNoted: 'نوٹ کر لیا۔ اگلا!',
    toastBad: 'شکریہ، رپورٹ کر دیا گیا',
    toastUndo: 'واپس کر دیا گیا',
    toastShared: 'آپ کا کوڈ پول میں شامل ہے',
    toastWelcome: 'واپس خوش آمدید',
    err: { empty: 'براہ کرم پہلے ایک کوڈ پیسٹ کریں۔', invalid_code: 'یہ نسک کی جیسی نہیں لگتی۔ یہ NG- کے بعد 8 حروف ہوتی ہے۔', server: 'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔' },
  },
  id: {
    dir: 'ltr',
    guestWarnText: 'Anda menjelajah tanpa kunci Nusuk — masukkan kunci Anda agar kode yang sudah dipakai dan tersisa tetap tersimpan di semua perangkat.',
    inappText: 'Anda melihat halaman ini di dalam aplikasi lain. Tombol "Open in Nusuk" mungkin tidak berfungsi di sini — buka halaman ini di browser Anda.',
    inappOpenChrome: 'Buka di Chrome',
    inappCopyLink: 'Salin tautan untuk dibuka di Safari',
    inappCopied: 'Tautan disalin — tempel di Safari untuk membuka halaman ini.',
    guestWarnBtn: 'Masukkan Kunci Saya →',
    mVisitorsLabel: 'Pengunjung Asli',
    mCopiesLabel: 'Jumlah Salinan Kode',
    mAddedLabel: 'Kode Baru Ditambahkan',
    mTotalCopiesLabel: 'Total Salinan',
    mTotalCopiesSub: 'disalin semua orang',
    metricsNote: 'Kami tidak pernah memberikan kode yang sama dua kali dari koleksi kami yang berisi hampir 100.000 kode. Namun, jika Anda sudah pernah menggunakan kode di tempat lain sebelum menyalinnya dari situs web ini, kode tersebut mungkin tidak berfungsi lagi untuk Anda, karena setiap kode hanya dapat digunakan sekali.',
    heroTitle: 'kode referral. Salin satu, dapatkan satu kunci.',
    heroSub: 'Ketuk sekali untuk menyalin, tempel di aplikasi Nusuk. Kami mengingat yang sudah Anda pakai, jadi Anda tidak akan pernah melihat kode yang sama dua kali.',
    nextCode: 'Kode Anda berikutnya',
    copyNext: 'Salin & tampilkan berikutnya',
    skip: 'Lewati',
    copied: 'Tersalin',
    alreadyUsed: 'Sudah dipakai',
    invalid: 'Tidak berfungsi',
    undo: 'Urungkan',
    s2t: 'Buka di aplikasi Nusuk',
    s2d: 'Mulai tantangan di aplikasi Nusuk dulu, lalu ketuk di sini — kodenya seharusnya sudah terisi. Jika belum, tempel saja. Biarkan aplikasi Nusuk tetap terbuka di latar belakang agar kode langsung masuk ke sana. Saat halaman Selamat muncul, tetap di sana — jangan tutup aplikasi atau kembali.',
    s3t: 'Tidak diterima? Berikutnya.',
    s3d: 'Tandai, dan kami tidak akan pernah menampilkannya lagi.',
    search: 'Cari kode…',
    fRemaining: 'Tersisa',
    fNew: 'Baru Ditambahkan',
    fUsed: 'Dipakai',
    fAll: 'Semua',
    more: 'Muat lebih banyak',
    shareMsg: 'Mohon bagikan ini untuk kebaikan umat.',
    shareTitle: 'Bagikan NusukKeys',
    shareClose: 'Tutup',
    sponsorTitle: 'Sponsori Hosting',
    sponsorLine1: 'Kontribusi Anda langsung digunakan untuk meningkatkan server hosting utama situs web.',
    sponsorLine2: 'Kontribusi kecil, manfaat abadi untuk umat.',
    sponsorBtn: 'Sponsori Hosting',
    sponsorNote: 'Situs ini berjalan di hosting gratis. Paket berbayar untuk server utama mulai dari sekitar $5 per bulan dan menaikkan batas. Setiap kontribusi hanya untuk peningkatan itu, tidak ada yang lain.',
    sponsorEmail: 'Email untuk mensponsori',
    sponsorClose: 'Tutup',
    sponsorHint: 'Kontribusi bersifat sukarela. Tidak ada detail pembayaran yang dikumpulkan di situs ini.',
    failoverMsg: 'Situs ini tidak dapat memuat daftar kodenya. Coba mirror cadangan — kode yang Anda pakai di sana hanya tersimpan di browser itu.',
    failoverCount: (n) => `Beralih ke mirror cadangan dalam ${n} dtk…`,
    failoverStay: 'Tetap di sini',
    gateShareNote: 'Kode Anda juga ditambahkan ke kumpulan, agar orang lain dapat menggunakannya. Kode itu tidak akan pernah ditampilkan kembali kepada Anda.',
    foot: 'Alat komunitas independen. Tidak berafiliasi dengan Nusuk atau Kementerian Haji dan Umrah. Kami tidak pernah meminta login Anda.',
    gateTitle: 'Masukkan kunci Nusuk Anda',
    gateSub: 'Ini adalah ID pribadi Anda di sini. Kami menggunakannya untuk mengingat kode mana yang sudah Anda pakai, di perangkat apa pun. Ini disimpan dalam cookie sehingga Anda hanya melakukannya sekali.',
    gateGo: 'Lanjutkan',
    gateAnon: 'Saya belum punya kunci',
    gateHint: 'Temukan di Nusuk: Mulai tantangan → Bagikan → salin kode yang diawali NG-. Anda juga bisa menempel tautan berbagi Nusuk lengkap di sini — kodenya diambil otomatis.',
    by: (n) => (n ? `dibagikan oleh ${n}` : ''),
    activeNow: (n) => `${n} aktif sekarang`,
    copiedToday: (n) => `${n} disalin hari ini`,
    addedSub: (today, latest) => (latest ? `Terbaru: ${latest} (+${today} hari ini)` : `${today} ditambahkan hari ini`),
    stats: (c, r, mine) => `Anda menyalin <b>${c}</b> · Tersisa <b>${r}</b>` + (mine ? ` · Kunci Anda (${mine.code}) disalin <b>${mine.copies}×</b>` : ''),
    shown: (n, f) => `${n}${n >= 60 ? '+' : ''} ${f} ditampilkan`,
    none: 'Belum ada apa pun di sini.',
    allDone: 'Anda sudah memakai semua kode. Periksa lagi nanti!',
    toastCopied: (c) => `Tersalin ${c}. Tempel di Nusuk`,
    toastNusuk: (c) => `Membuka aplikasi Nusuk — ${c} tersalin, tempel di sana jika perlu`,
    toastNoted: 'Dicatat. Berikutnya!',
    toastBad: 'Terima kasih, sudah dilaporkan',
    toastUndo: 'Dibatalkan',
    toastShared: 'Kode Anda ada di kumpulan',
    toastWelcome: 'Selamat datang kembali',
    err: { empty: 'Tempel sebuah kode dulu.', invalid_code: 'Itu tidak tampak seperti kunci Nusuk. Formatnya NG- diikuti 8 karakter.', server: 'Terjadi kesalahan. Coba lagi.' },
  },
  tr: {
    dir: 'ltr',
    guestWarnText: 'Nusuk anahtarınız olmadan geziniyorsunuz — kullandığınız ve kalan kodların tüm cihazlarda kayıtlı kalması için anahtarınızı girin.',
    inappText: 'Bu sayfayı başka bir uygulamanın içinde görüntülüyorsunuz. "Open in Nusuk" düğmesi burada çalışmayabilir — sayfayı tarayıcınızda açın.',
    inappOpenChrome: 'Chrome\'da aç',
    inappCopyLink: 'Safari\'de açmak için bağlantıyı kopyala',
    inappCopied: 'Bağlantı kopyalandı — bu sayfayı açmak için Safari\'ye yapıştırın.',
    guestWarnBtn: 'Anahtarımı Gir →',
    mVisitorsLabel: 'Gerçek Ziyaretçiler',
    mCopiesLabel: 'Kod Kopyalama Sayısı',
    mAddedLabel: 'Yeni Eklenen Kodlar',
    mTotalCopiesLabel: 'Toplam Kopya',
    mTotalCopiesSub: 'herkes tarafından kopyalandı',
    metricsNote: 'Yaklaşık 100.000 kodluk koleksiyonumuzdan size asla aynı kodu iki kez vermeyiz. Ancak, bu web sitesinden kopyalamadan önce bir kodu başka bir yerde kullandıysanız, her kod yalnızca bir kez kullanılabildiğinden, sizin için tekrar çalışmayabilir.',
    heroTitle: 'yönlendirme kodları. Birini kopyalayın, bir anahtar kazanın.',
    heroSub: 'Kopyalamak için bir kez dokunun, Nusuk uygulamasına yapıştırın. Neyi kullandığınızı hatırlıyoruz, böylece aynı kodu iki kez görmezsiniz.',
    nextCode: 'Sonraki kodunuz',
    copyNext: 'Kopyala ve sonrakini göster',
    skip: 'Atla',
    copied: 'Kopyalandı',
    alreadyUsed: 'Zaten kullanılmış',
    invalid: 'Çalışmıyor',
    undo: 'Geri al',
    s2t: 'Nusuk uygulamasında açın',
    s2d: 'Önce Nusuk uygulamasında meydan okumayı başlatın, sonra buraya dokunun — kod zaten doldurulmuş olmalı. Değilse, yapıştırın. Kodun doğrudan gitmesi için Nusuk uygulamasını arka planda açık tutun. Tebrikler sayfası göründüğünde orada kalın — uygulamayı kapatmayın veya geri dönmeyin.',
    s3t: 'Kabul edilmedi mi? Sonraki.',
    s3d: 'İşaretleyin, bir daha asla göstermeyelim.',
    search: 'Kod arayın…',
    fRemaining: 'Kalan',
    fNew: 'Yeni Eklenen',
    fUsed: 'Kullanılan',
    fAll: 'Tümü',
    more: 'Daha fazla yükle',
    shareMsg: 'Lütfen ümmetin yararı için bunu paylaşın.',
    shareTitle: 'NusukKeys\'i Paylaş',
    shareClose: 'Kapat',
    sponsorTitle: 'Barındırmaya Sponsor Olun',
    sponsorLine1: 'Katkınız doğrudan web sitesinin ana barındırma sunucusunu yükseltmek için kullanılır.',
    sponsorLine2: 'Küçük bir katkı, ümmet için kalıcı bir fayda.',
    sponsorBtn: 'Barındırmaya Sponsor Olun',
    sponsorNote: 'Bu site ücretsiz barındırmada çalışıyor. Ana sunucu için ücretli plan ayda yaklaşık $5 seviyesinden başlar ve sınırları yükseltir. Her katkı yalnızca bu yükseltmeye gider, başka bir şeye değil.',
    sponsorEmail: 'Sponsor olmak için e-posta gönderin',
    sponsorClose: 'Kapat',
    sponsorHint: 'Katkılar gönüllüdür. Bu sitede ödeme bilgisi toplanmaz.',
    failoverMsg: 'Bu site kod listesini yükleyemedi. Bir yedek aynayı deneyin — orada kullandığınız kodlar yalnızca o tarayıcıda kaydedilir.',
    failoverCount: (n) => `${n} sn içinde yedek aynaya geçiliyor…`,
    failoverStay: 'Burada kal',
    gateShareNote: 'Kodunuz da havuza eklenir, böylece başkaları kullanabilir. Size asla geri gösterilmez.',
    foot: 'Bağımsız topluluk aracı. Nusuk veya Hac ve Umre Bakanlığı ile bağlantılı değildir. Giriş bilgilerinizi asla istemeyiz.',
    gateTitle: 'Nusuk anahtarınızı girin',
    gateSub: 'Bu, buradaki özel kimliğinizdir. Hangi kodları zaten kullandığınızı hatırlamak için kullanırız, herhangi bir cihazda. Bir çerezde saklanır, böylece bunu yalnızca bir kez yaparsınız.',
    gateGo: 'Devam et',
    gateAnon: 'Henüz anahtarım yok',
    gateHint: 'Nusuk\'ta bulun: Meydan okumayı başlat → Paylaş → NG- ile başlayan kodu kopyalayın. Tam Nusuk paylaşım bağlantınızı da buraya yapıştırabilirsiniz — kod otomatik olarak çıkarılır.',
    by: (n) => (n ? `${n} tarafından paylaşıldı` : ''),
    activeNow: (n) => `${n} şu an aktif`,
    copiedToday: (n) => `bugün ${n} kopyalandı`,
    addedSub: (today, latest) => (latest ? `En son: ${latest} (+bugün ${today})` : `bugün ${today} eklendi`),
    stats: (c, r, mine) => `<b>${c}</b> kopyaladınız · Kalan <b>${r}</b>` + (mine ? ` · Anahtarınız (${mine.code}) <b>${mine.copies}×</b> kopyalandı` : ''),
    shown: (n, f) => `${n}${n >= 60 ? '+' : ''} ${f} gösteriliyor`,
    none: 'Burada henüz hiçbir şey yok.',
    allDone: 'Tüm kodları kullandınız. Yakında tekrar kontrol edin!',
    toastCopied: (c) => `${c} kopyalandı. Nusuk'a yapıştırın`,
    toastNusuk: (c) => `Nusuk uygulaması açılıyor — ${c} kopyalandı, gerekirse oraya yapıştırın`,
    toastNoted: 'Not edildi. Sonraki!',
    toastBad: 'Teşekkürler, bildirildi',
    toastUndo: 'Geri alındı',
    toastShared: 'Kodunuz havuzda',
    toastWelcome: 'Tekrar hoş geldiniz',
    err: { empty: 'Önce bir kod yapıştırın.', invalid_code: 'Bu bir Nusuk anahtarına benzemiyor. NG- ve ardından 8 karakter olmalı.', server: 'Bir şeyler yanlış gitti. Tekrar deneyin.' },
  },
  hi: {
    dir: 'ltr',
    guestWarnText: 'आप अपनी नुसुक कुंजी के बिना ब्राउज़ कर रहे हैं — अपनी कुंजी दर्ज करें ताकि आपके उपयोग किए गए और शेष कोड सभी उपकरणों पर सहेजे रहें।',
    inappText: 'आप यह पेज किसी अन्य ऐप के अंदर देख रहे हैं। यहाँ "Open in Nusuk" बटन काम नहीं कर सकता — इस पेज को अपने ब्राउज़र में खोलें।',
    inappOpenChrome: 'Chrome में खोलें',
    inappCopyLink: 'Safari में खोलने के लिए लिंक कॉपी करें',
    inappCopied: 'लिंक कॉपी हो गया — यह पेज खोलने के लिए इसे Safari में पेस्ट करें।',
    guestWarnBtn: 'मेरी कुंजी दर्ज करें →',
    mVisitorsLabel: 'वास्तविक आगंतुक',
    mCopiesLabel: 'कोड कॉपी की संख्या',
    mAddedLabel: 'नए जोड़े गए कोड',
    mTotalCopiesLabel: 'कुल प्रतियाँ',
    mTotalCopiesSub: 'सभी द्वारा कॉपी किया गया',
    metricsNote: 'हम अपने लगभग 100,000 कोड के संग्रह से आपको कभी भी एक ही कोड दो बार नहीं देते। हालाँकि, यदि आपने इस वेबसाइट से कॉपी करने से पहले किसी कोड का उपयोग कहीं और कर लिया है, तो हो सकता है कि वह आपके लिए फिर से काम न करे, क्योंकि प्रत्येक कोड केवल एक बार ही उपयोग किया जा सकता है।',
    heroTitle: 'रेफ़रल कोड। एक कॉपी करें, एक कुंजी पाएं।',
    heroSub: 'कॉपी करने के लिए एक बार टैप करें, नुसुक ऐप में पेस्ट करें। हम याद रखते हैं कि आपने क्या उपयोग किया है, इसलिए आप वही कोड दोबारा कभी नहीं देखेंगे।',
    nextCode: 'आपका अगला कोड',
    copyNext: 'कॉपी करें और अगला दिखाएं',
    skip: 'छोड़ें',
    copied: 'कॉपी हो गया',
    alreadyUsed: 'पहले से उपयोग किया गया',
    invalid: 'काम नहीं करता',
    undo: 'वापस लें',
    s2t: 'नुसुक ऐप में खोलें',
    s2d: 'पहले नुसुक ऐप में चुनौती शुरू करें, फिर यहाँ टैप करें — कोड पहले से भरा होना चाहिए। यदि नहीं, तो बस पेस्ट करें। नुसुक ऐप को बैकग्राउंड में खुला रखें ताकि कोड सीधे वहाँ जाए। जब बधाई पेज दिखे, वहीं रहें — ऐप बंद न करें या वापस न जाएँ।',
    s3t: 'स्वीकार नहीं हुआ? अगला।',
    s3d: 'इसे चिह्नित करें और हम इसे फिर कभी नहीं दिखाएंगे।',
    search: 'कोड खोजें…',
    fRemaining: 'शेष',
    fNew: 'नए जोड़े गए',
    fUsed: 'उपयोग किए गए',
    fAll: 'सभी',
    more: 'और लोड करें',
    shareMsg: 'कृपया उम्मत के लाभ के लिए इसे साझा करें।',
    shareTitle: 'नुसुककीज़ साझा करें',
    shareClose: 'बंद करें',
    sponsorTitle: 'होस्टिंग प्रायोजित करें',
    sponsorLine1: 'आपका योगदान सीधे वेबसाइट के प्राथमिक होस्टिंग सर्वर को अपग्रेड करने के लिए जाता है।',
    sponsorLine2: 'एक छोटा योगदान, उम्मत के लिए स्थायी लाभ।',
    sponsorBtn: 'होस्टिंग प्रायोजित करें',
    sponsorNote: 'यह साइट मुफ्त होस्टिंग पर चलती है। मुख्य सर्वर के लिए सशुल्क योजना लगभग $5 प्रति माह से शुरू होती है और सीमाएं बढ़ाती है। हर योगदान केवल उसी अपग्रेड के लिए जाता है, और कुछ नहीं।',
    sponsorEmail: 'प्रायोजित करने के लिए ईमेल करें',
    sponsorClose: 'बंद करें',
    sponsorHint: 'योगदान स्वैच्छिक है। इस साइट पर कोई भुगतान विवरण एकत्र नहीं किया जाता है।',
    failoverMsg: 'यह साइट अपनी कोड सूची लोड नहीं कर सकी। बैकअप मिरर आज़माएं — वहाँ उपयोग किए गए कोड केवल उसी ब्राउज़र में सहेजे जाते हैं।',
    failoverCount: (n) => `${n} सेकंड में बैकअप मिरर पर जा रहे हैं…`,
    failoverStay: 'यहीं रहें',
    gateShareNote: 'आपका कोड भी पूल में जोड़ा जाता है, ताकि दूसरे इसका उपयोग कर सकें। यह आपको कभी वापस नहीं दिखाया जाएगा।',
    foot: 'स्वतंत्र सामुदायिक उपकरण। नुसुक या हज और उमराह मंत्रालय से संबद्ध नहीं। हम कभी आपका लॉगिन नहीं मांगते।',
    gateTitle: 'अपनी नुसुक कुंजी दर्ज करें',
    gateSub: 'यह यहाँ आपकी निजी पहचान है। हम इसका उपयोग यह याद रखने के लिए करते हैं कि आपने कौन से कोड पहले ही उपयोग किए हैं, किसी भी उपकरण पर। यह कुकी में सहेजा जाता है इसलिए आप यह केवल एक बार करते हैं।',
    gateGo: 'जारी रखें',
    gateAnon: 'मेरे पास अभी कुंजी नहीं है',
    gateHint: 'नुसुक में खोजें: चुनौती शुरू करें → साझा करें → NG- से शुरू होने वाला कोड कॉपी करें। आप अपना पूरा नुसुक शेयर लिंक भी यहाँ पेस्ट कर सकते हैं — कोड अपने आप निकाल लिया जाएगा।',
    by: (n) => (n ? `${n} द्वारा साझा किया गया` : ''),
    activeNow: (n) => `${n} अभी सक्रिय`,
    copiedToday: (n) => `आज ${n} कॉपी किए गए`,
    addedSub: (today, latest) => (latest ? `नवीनतम: ${latest} (+आज ${today})` : `आज ${today} जोड़े गए`),
    stats: (c, r, mine) => `आपने <b>${c}</b> कॉपी किए · शेष <b>${r}</b>` + (mine ? ` · आपकी कुंजी (${mine.code}) <b>${mine.copies}×</b> कॉपी की गई` : ''),
    shown: (n, f) => `${n}${n >= 60 ? '+' : ''} ${f} दिखाए गए`,
    none: 'यहाँ अभी कुछ नहीं है।',
    allDone: 'आपने हर कोड उपयोग कर लिया है। जल्द ही वापस देखें!',
    toastCopied: (c) => `${c} कॉपी हो गया। नुसुक में पेस्ट करें`,
    toastNusuk: (c) => `नुसुक ऐप खुल रहा है — ${c} कॉपी हो गया, यदि आवश्यक हो तो वहाँ पेस्ट करें`,
    toastNoted: 'नोट कर लिया। अगला!',
    toastBad: 'धन्यवाद, रिपोर्ट कर दिया गया',
    toastUndo: 'वापस ले लिया गया',
    toastShared: 'आपका कोड पूल में है',
    toastWelcome: 'वापस स्वागत है',
    err: { empty: 'कृपया पहले एक कोड पेस्ट करें।', invalid_code: 'यह नुसुक कुंजी जैसी नहीं लगती। यह NG- के बाद 8 वर्ण होती है।', server: 'कुछ गलत हो गया। पुनः प्रयास करें।' },
  },

};

// ---------- nk-v21: new strings (merged into I18N) ----------
// Short UI strings are translated in all 7 languages. FAQ answers
// live in FAQ_I18N below (English, Bengali, Arabic; other languages
// fall back to English — see renderFaq).
const NEW_I18N = {
  en: {
    howTitle: 'How to use a code',
    how1: 'Open the Nusuk app first and leave it open in the background.',
    how2: 'Copy a code here, then tap \u201cOpen in Nusuk\u201d.',
    how3: 'In Nusuk, check the code. If it is not filled in, paste it.',
    how4: 'If it does not work, come back and try the next code.',
    triedLast: 'Last tried', triedNext: 'Next',
    openBrowser: 'Open in browser',
    faqTitle: 'Questions, answered', guidesTitle: 'Short guides',
  },
  bn: {
    howTitle: '\u0995\u09cb\u09a1 \u0995\u09c0\u09ad\u09be\u09ac\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09ac\u09c7\u09a8',
    how1: '\u09aa\u09cd\u09b0\u09a5\u09ae\u09c7 \u09a8\u09c1\u09b8\u09c1\u0995 \u0985\u09cd\u09af\u09be\u09aa \u0996\u09c1\u09b2\u09c1\u09a8 \u098f\u09ac\u0982 \u09ac\u09cd\u09af\u09be\u0995\u0997\u09cd\u09b0\u09be\u0989\u09a8\u09cd\u09a1\u09c7 \u0996\u09cb\u09b2\u09be \u09b0\u09be\u0996\u09c1\u09a8\u0964',
    how2: '\u098f\u0996\u09be\u09a8 \u09a5\u09c7\u0995\u09c7 \u098f\u0995\u099f\u09bf \u0995\u09cb\u09a1 \u0995\u09aa\u09bf \u0995\u09b0\u09c1\u09a8, \u09a4\u09be\u09b0\u09aa\u09b0 \u201cOpen in Nusuk\u201d-\u098f \u099a\u09be\u09aa \u09a6\u09bf\u09a8\u0964',
    how3: '\u09a8\u09c1\u09b8\u09c1\u0995\u09c7 \u0995\u09cb\u09a1\u099f\u09bf \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c1\u09a8\u0964 \u09aa\u09c2\u09b0\u09a3 \u0995\u09b0\u09be \u09a8\u09be \u09a5\u09be\u0995\u09b2\u09c7 \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c1\u09a8\u0964',
    how4: '\u0995\u09be\u099c \u09a8\u09be \u0995\u09b0\u09b2\u09c7 \u09ab\u09bf\u09b0\u09c7 \u098f\u09b8\u09c7 \u09aa\u09b0\u09c7\u09b0 \u0995\u09cb\u09a1\u099f\u09bf \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09c1\u09a8\u0964',
    triedLast: '\u09b6\u09c7\u09b7 \u099a\u09c7\u09b7\u09cd\u099f\u09be', triedNext: '\u09aa\u09b0\u09c7\u09b0\u099f\u09be',
    openBrowser: '\u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7 \u0996\u09c1\u09b2\u09c1\u09a8',
    faqTitle: '\u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09c7\u09b0 \u0989\u09a4\u09cd\u09a4\u09b0', guidesTitle: '\u099b\u09cb\u099f \u09a8\u09bf\u09b0\u09cd\u09a6\u09c7\u09b6\u09bf\u0995\u09be',
  },
  ar: {
    howTitle: '\u0643\u064a\u0641 \u062a\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0643\u0648\u062f',
    how1: '\u0627\u0641\u062a\u062d \u062a\u0637\u0628\u064a\u0642 \u0646\u0633\u0643 \u0623\u0648\u0644\u0627\u064b \u0648\u0627\u062a\u0631\u0643\u0647 \u0645\u0641\u062a\u0648\u062d\u0627\u064b \u0641\u064a \u0627\u0644\u062e\u0644\u0641\u064a\u0629.',
    how2: '\u0627\u0646\u0633\u062e \u0643\u0648\u062f\u0627\u064b \u0647\u0646\u0627\u060c \u062b\u0645 \u0627\u0636\u063a\u0637 \u00ab\u0627\u0644\u0641\u062a\u062d \u0641\u064a \u0646\u0633\u0643\u00bb.',
    how3: '\u0641\u064a \u0646\u0633\u0643\u060c \u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0643\u0648\u062f. \u0625\u0630\u0627 \u0644\u0645 \u064a\u0643\u0646 \u0645\u0645\u0644\u0648\u0621\u0627\u064b\u060c \u0627\u0644\u0635\u0642\u0647.',
    how4: '\u0625\u0630\u0627 \u0644\u0645 \u064a\u0639\u0645\u0644\u060c \u0639\u064f\u062f \u0648\u062c\u0631\u0651\u0628 \u0627\u0644\u0643\u0648\u062f \u0627\u0644\u062a\u0627\u0644\u064a.',
    triedLast: '\u0622\u062e\u0631 \u0645\u0627 \u062c\u0631\u0651\u0628\u062a', triedNext: '\u0627\u0644\u062a\u0627\u0644\u064a',
    openBrowser: '\u0627\u0641\u062a\u062d \u0641\u064a \u0627\u0644\u0645\u062a\u0635\u0641\u062d',
    faqTitle: '\u0623\u0633\u0626\u0644\u0629 \u0648\u0623\u062c\u0648\u0628\u0629', guidesTitle: '\u0623\u062f\u0644\u0629 \u0642\u0635\u064a\u0631\u0629',
  },
  ur: {
    howTitle: '\u06a9\u0648\u0688 \u06a9\u06cc\u0633\u06d2 \u0627\u0633\u062a\u0639\u0645\u0627\u0644 \u06a9\u0631\u06cc\u06ba',
    how1: '\u067e\u06c1\u0644\u06d2 \u0646\u0633\u06a9 \u0627\u06cc\u067e \u06a9\u06be\u0648\u0644\u06cc\u06ba \u0627\u0648\u0631 \u0627\u0633\u06d2 \u0628\u06cc\u06a9 \u06af\u0631\u0627\u0624\u0646\u0688 \u0645\u06cc\u06ba \u06a9\u06be\u0644\u0627 \u0631\u06c1\u0646\u06d2 \u062f\u06cc\u06ba\u06d4',
    how2: '\u06cc\u06c1\u0627\u06ba \u0633\u06d2 \u0627\u06cc\u06a9 \u06a9\u0648\u0688 \u06a9\u0627\u067e\u06cc \u06a9\u0631\u06cc\u06ba\u060c \u067e\u06be\u0631 \u00abOpen in Nusuk\u00bb \u067e\u0631 \u0679\u06cc\u067e \u06a9\u0631\u06cc\u06ba\u06d4',
    how3: '\u0646\u0633\u06a9 \u0645\u06cc\u06ba \u06a9\u0648\u0688 \u0686\u06cc\u06a9 \u06a9\u0631\u06cc\u06ba\u06d4 \u0627\u06af\u0631 \u0628\u06be\u0631\u0627 \u06c1\u0648\u0627 \u06c1\u0648 \u062a\u0648 \u067e\u06cc\u0633\u0679 \u06a9\u0631\u06cc\u06ba\u06d4',
    how4: '\u0627\u06af\u0631 \u06a9\u0627\u0645 \u0646\u06c1 \u06a9\u0631\u06d2 \u062a\u0648 \u0648\u0627\u067e\u0633 \u0622\u06a9\u0631 \u0627\u06af\u0644\u0627 \u06a9\u0648\u0688 \u0622\u0632\u0645\u0627\u0626\u06cc\u06ba\u06d4',
    triedLast: '\u0622\u062e\u0631\u06cc \u0622\u0632\u0645\u0627\u06cc\u0627 \u06af\u06cc\u0627', triedNext: '\u0627\u06af\u0644\u0627',
    openBrowser: '\u0628\u0631\u0627\u0624\u0632\u0631 \u0645\u06cc\u06ba \u06a9\u06be\u0648\u0644\u06cc\u06ba',
    faqTitle: '\u0633\u0648\u0627\u0644\u0627\u062a \u06a9\u06d2 \u062c\u0648\u0627\u0628\u0627\u062a', guidesTitle: '\u0645\u062e\u062a\u0635\u0631 \u0631\u06c1\u0646\u0645\u0627',
  },
  id: {
    howTitle: 'Cara menggunakan kode',
    how1: 'Buka aplikasi Nusuk dulu dan biarkan tetap terbuka di latar belakang.',
    how2: 'Salin kode di sini, lalu ketuk \u201cOpen in Nusuk\u201d.',
    how3: 'Di Nusuk, periksa kodenya. Jika belum terisi, tempel.',
    how4: 'Jika tidak berhasil, kembali dan coba kode berikutnya.',
    triedLast: 'Terakhir dicoba', triedNext: 'Berikutnya',
    openBrowser: 'Buka di browser',
    faqTitle: 'Pertanyaan, dijawab', guidesTitle: 'Panduan singkat',
  },
  tr: {
    howTitle: 'Kod nas\u0131l kullan\u0131l\u0131r',
    how1: '\u00d6nce Nusuk uygulamas\u0131n\u0131 a\u00e7\u0131n ve arka planda a\u00e7\u0131k b\u0131rak\u0131n.',
    how2: 'Buradan bir kod kopyalay\u0131n, sonra \u201cOpen in Nusuk\u201da dokunun.',
    how3: "Nusuk'ta kodu kontrol edin. Doldurulmam\u0131\u015fsa yap\u0131\u015ft\u0131r\u0131n.",
    how4: '\u00c7al\u0131\u015fmazsa geri d\u00f6n\u00fcn ve sonraki kodu deneyin.',
    triedLast: 'Son denenen', triedNext: 'Sonraki',
    openBrowser: 'Taray\u0131c\u0131da a\u00e7',
    faqTitle: 'Sorular, cevapland\u0131', guidesTitle: 'K\u0131sa k\u0131lavuzlar',
  },
  hi: {
    howTitle: '\u0915\u094b\u0921 \u0915\u0948\u0938\u0947 \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0947\u0902',
    how1: '\u092a\u0939\u0932\u0947 \u0928\u0941\u0938\u0941\u0915 \u0910\u092a \u0916\u094b\u0932\u0947\u0902 \u0914\u094c\u0930 \u0909\u0938\u0947 \u092c\u0948\u0915\u0917\u094d\u0930\u093e\u0909\u0902\u0921 \u092e\u0947\u0902 \u0916\u0941\u0932\u093e \u0930\u0939\u0928\u0947 \u0926\u0947\u0902\u0964',
    how2: '\u092f\u0939\u093e\u0901 \u0938\u0947 \u090f\u0915 \u0915\u094b\u0921 \u0915\u0949\u092a\u0940 \u0915\u0930\u0947\u0902, \u092b\u093f\u0930 \u201cOpen in Nusuk\u201d \u092a\u0930 \u091f\u0948\u092a \u0915\u0930\u0947\u0902\u0964',
    how3: '\u0928\u0941\u0938\u0941\u0915 \u092e\u0947\u0902 \u0915\u094b\u0921 \u091c\u093e\u0901\u091a\u0947\u0902\u0964 \u092f\u0926\u093f \u092d\u0930\u093e \u0928\u0939\u0940\u0902 \u0939\u0948, \u0924\u094b \u092a\u0947\u0938\u094d\u091f \u0915\u0930\u0947\u0902\u0964',
    how4: '\u092f\u0926\u093f \u092f\u0939 \u0915\u093e\u092e \u0928 \u0915\u0930\u0947, \u0924\u094b \u0935\u093e\u092a\u0938 \u0906\u0915\u0930 \u0905\u0917\u0932\u093e \u0915\u094b\u0921 \u0906\u091c\u093c\u092e\u093e\u090f\u0901\u0964',
    triedLast: '\u0905\u0902\u0924\u093f\u092e \u0906\u091c\u093c\u092e\u093e\u092f\u093e \u0917\u092f\u093e', triedNext: '\u0905\u0917\u0932\u093e',
    openBrowser: '\u092c\u094d\u0930\u093e\u0909\u091c\u093c\u0930 \u092e\u0947\u0902 \u0916\u094b\u0932\u0947\u0902',
    faqTitle: '\u092a\u094d\u0930\u0936\u094d\u0928\u094b\u0902 \u0915\u0947 \u0909\u0924\u094d\u0924\u0930', guidesTitle: '\u0938\u0902\u0915\u094d\u0937\u093f\u092a\u094d\u0924 \u092e\u093e\u0930\u094d\u0917\u0926\u0930\u094d\u0936\u093f\u0915\u093e\u090f\u0901',
  },
};
for (const [lang, dict] of Object.entries(NEW_I18N)) Object.assign(I18N[lang], dict);

// ---------- nk-v21: FAQ + guides ----------
// 8 questions (from umrahcodes.click + nusukkey.xyz FAQs), 7 short
// guides. Full text in English, Bengali, Arabic; other languages
// fall back to English (see renderFaq) — a wrong translation would
// be worse than English here. Codes are community-submitted, not
// Nusuk-verified; nothing here claims autopaste or auto-fill works.
const FAQ_I18N = {
  en: [
    ['What is a Nusuk code?', 'A code lets you answer one question in the Free Umrah Challenge. A correct answer enters the daily draw for a free Umrah trip.'],
    ['How do I use a code?', 'Open the Nusuk app first and leave it open, copy a code here, tap Open in Nusuk, then check the code in the app. If it is not filled in, paste it.'],
    ['Why does a code say \u201calready used\u201d?', 'Each pair of people can only swap once. If you already used a code from that person, copy the next code instead.'],
    ['Where do I paste a code in Nusuk?', 'Open Nusuk, tap Start the challenge, open the Keys tab, paste the code in \u201cAdd code to get new key\u201d and tap Check the code.'],
    ['How do I get more keys?', 'Everyone gets one free key a day. You get an extra key each time you use someone else\u2019s code, and each time someone uses yours.'],
    ['How do I share my codes?', 'Paste up to 10 codes in \u201cHave another code to share?\u201d \u2014 one per line. Each code is checked, then added to the pool for others.'],
    ['Are these codes checked by Nusuk?', 'No. Codes are shared by the community and are not checked by Nusuk. Some may already be used \u2014 try the next one.'],
    ['Is NusukKeys the official Nusuk site?', 'No. It is an independent community tool, not affiliated with Nusuk. It never asks for your login.'],
    ['Is NusukKeys free?', 'Yes. Copying and sharing codes is completely free, with no sign up.'],
    ['Are a key code and a referral code the same?', 'No. A referral code starts with NG- and belongs to an account. A key is what the app counts in the challenge — one key opens one question. What a code gives you is decided by Nusuk\u2019s own rules. We never publish a code that promises a guaranteed key, and nobody can sell you keys.'],
    ['What prizes are in the Nusuk challenge?', '100 free Umrah trips (50 winners, each with a companion) and 10,000 cartons of Zamzam water. Winners are drawn daily from 1 November to 20 December 2026. Using a code does not guarantee a win.'],
  ],
  bn: [
    ['\u09a8\u09c1\u09b8\u09c1\u0995 \u0995\u09cb\u09a1 \u0995\u09c0?', '\u098f\u0995\u099f\u09bf \u0995\u09cb\u09a1 \u09a6\u09bf\u09df\u09c7 \u09ab\u09cd\u09b0\u09bf \u0989\u09ae\u09b0\u09be\u09b9 \u099a\u09cd\u09af\u09be\u09b2\u09c7\u099e\u09cd\u099c\u09c7\u09b0 \u098f\u0995\u099f\u09bf \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09c7\u09b0 \u0989\u09a4\u09cd\u09a4\u09b0 \u09a6\u09c7\u0993\u09df\u09be \u09af\u09be\u09df\u0964 \u09b8\u09a0\u09bf\u0995 \u0989\u09a4\u09cd\u09a4\u09b0 \u09a6\u09bf\u09b2\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf\u09a6\u09bf\u09a8\u09c7\u09b0 \u09a1\u09cd\u09b0\u09df\u09c7 \u09ab\u09cd\u09b0\u09bf \u0989\u09ae\u09b0\u09be\u09b9 \u09af\u09be\u09a4\u09cd\u09b0\u09be\u09b0 \u09b8\u09c1\u09af\u09cb\u0997 \u09a5\u09be\u0995\u09c7\u0964'],
    ['\u0995\u09cb\u09a1 \u0995\u09c0\u09ad\u09be\u09ac\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09ac?', '\u09aa\u09cd\u09b0\u09a5\u09ae\u09c7 \u09a8\u09c1\u09b8\u09c1\u0995 \u0985\u09cd\u09af\u09be\u09aa \u0996\u09c1\u09b2\u09c7 \u0996\u09cb\u09b2\u09be \u09b0\u09be\u0996\u09c1\u09a8, \u098f\u0996\u09be\u09a8 \u09a5\u09c7\u0995\u09c7 \u0995\u09cb\u09a1 \u0995\u09aa\u09bf \u0995\u09b0\u09c1\u09a8, Open in Nusuk-\u098f \u099a\u09be\u09aa \u09a6\u09bf\u09a8, \u09a4\u09be\u09b0\u09aa\u09b0 \u0985\u09cd\u09af\u09be\u09aa\u09c7 \u0995\u09cb\u09a1\u099f\u09bf \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c1\u09a8\u0964 \u09aa\u09c2\u09b0\u09a3 \u0995\u09b0\u09be \u09a8\u09be \u09a5\u09be\u0995\u09b2\u09c7 \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c1\u09a8\u0964'],
    ['\u0995\u09cb\u09a1 \u201calready used\u201d \u0995\u09c7\u09a8 \u09ac\u09b2\u09c7?', '\u09a6\u09c1\u099c\u09a8 \u09ae\u09be\u09a8\u09c1\u09b7\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u098f\u0995\u09ac\u09be\u09b0\u0987 \u09ac\u09bf\u09a8\u09bf\u09ae\u09df \u09b9\u09df\u0964 \u09b8\u09c7\u0987 \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf\u09b0 \u0995\u09cb\u09a1 \u0986\u0997\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7 \u09a5\u09be\u0995\u09b2\u09c7 \u09aa\u09b0\u09c7\u09b0 \u0995\u09cb\u09a1\u099f\u09bf \u09a8\u09bf\u09a8\u0964'],
    ['\u09a8\u09c1\u09b8\u09c1\u0995\u09c7 \u0995\u09cb\u09a1 \u0995\u09cb\u09a5\u09be\u09df \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09ac?', '\u09a8\u09c1\u09b8\u09c1\u0995 \u0996\u09c1\u09b2\u09c7 Start the challenge-\u098f \u099a\u09be\u09aa \u09a6\u09bf\u09a8, Keys \u099f\u09cd\u09af\u09be\u09ac \u0996\u09c1\u09b2\u09c1\u09a8, \u201cAdd code to get new key\u201d \u0998\u09b0\u09c7 \u0995\u09cb\u09a1 \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c7 Check the code-\u098f \u099a\u09be\u09aa \u09a6\u09bf\u09a8\u0964'],
    ['\u0986\u09b0\u09cb \u0995\u09c0 \u09aa\u09be\u09ac \u0995\u09c0\u09ad\u09be\u09ac\u09c7?', '\u09b8\u09ac\u09be\u0987 \u09a6\u09bf\u09a8\u09c7 \u098f\u0995\u099f\u09bf \u09ab\u09cd\u09b0\u09bf \u0995\u09c0 \u09aa\u09be\u09df\u0964 \u0985\u09a8\u09cd\u09af\u09c7\u09b0 \u0995\u09cb\u09a1 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09b2\u09c7 \u098f\u09ac\u0982 \u0986\u09aa\u09a8\u09be\u09b0 \u0995\u09cb\u09a1 \u0995\u09c7\u0989 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09b2\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf\u09ac\u09be\u09b0 \u098f\u0995\u099f\u09bf \u0995\u09b0\u09c7 \u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u0995\u09c0 \u09aa\u09be\u09ac\u09c7\u09a8\u0964'],
    ['\u0986\u09ae\u09be\u09b0 \u0995\u09cb\u09a1 \u0995\u09c0\u09ad\u09be\u09ac\u09c7 \u09b6\u09c7\u09df\u09be\u09b0 \u0995\u09b0\u09ac?', '\u201cHave another code to share?\u201d \u0998\u09b0\u09c7 \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a \u09e7\u09e6\u099f\u09bf \u0995\u09cb\u09a1 \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c1\u09a8 \u2014 \u09aa\u09cd\u09b0\u09a4\u09bf \u09b2\u09be\u0987\u09a8\u09c7 \u098f\u0995\u099f\u09bf\u0964 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u0995\u09cb\u09a1 \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c7 \u09aa\u09c1\u09b2\u09c7 \u09af\u09cb\u0997 \u0995\u09b0\u09be \u09b9\u09df\u0964'],
    ['\u098f\u0987 \u0995\u09cb\u09a1\u0997\u09c1\u09b2\u09cb \u0995\u09bf \u09a8\u09c1\u09b8\u09c1\u0995 \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c7\u099b\u09c7?', '\u09a8\u09be\u0964 \u0995\u09cb\u09a1\u0997\u09c1\u09b2\u09cb \u0995\u09ae\u09bf\u0989\u09a8\u09bf\u099f\u09bf \u09a6\u09bf\u09df\u09c7\u099b\u09c7, \u09a8\u09c1\u09b8\u09c1\u0995 \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09c7\u09a8\u09bf\u0964 \u0995\u09bf\u099b\u09c1 \u0995\u09cb\u09a1 \u0986\u0997\u09c7\u0987 \u09ac\u09cd\u09af\u09ac\u09b9\u09c3\u09a4 \u09b9\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7 \u2014 \u09aa\u09b0\u09c7\u09b0\u099f\u09be \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09c1\u09a8\u0964'],
    ['NusukKeys \u0995\u09bf \u09a8\u09c1\u09b8\u09c1\u0995\u09c7\u09b0 \u0985\u09ab\u09bf\u09b8\u09bf\u09df\u09be\u09b2 \u09b8\u09be\u0987\u099f?', '\u09a8\u09be\u0964 \u098f\u099f\u09bf \u098f\u0995\u099f\u09bf \u09b8\u09cd\u09ac\u09be\u09a7\u09c0\u09a8 \u0995\u09ae\u09bf\u0989\u09a8\u09bf\u099f\u09bf \u099f\u09c1\u09b2, \u09a8\u09c1\u09b8\u09c1\u0995\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995\u09bf\u09a4 \u09a8\u09df\u0964 \u098f\u099f\u09bf \u0995\u0996\u09a8\u09cb \u0986\u09aa\u09a8\u09be\u09b0 \u09b2\u0997\u09bf\u09a8 \u099a\u09be\u09df \u09a8\u09be\u0964'],
    ['NusukKeys \u0995\u09bf \u09ab\u09cd\u09b0\u09bf?', '\u09b9\u09cd\u09af\u09be\u0981\u0964 \u0995\u09cb\u09a1 \u0995\u09aa\u09bf \u0995\u09b0\u09be \u0993 \u09b6\u09c7\u09df\u09be\u09b0 \u0995\u09b0\u09be \u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09ab\u09cd\u09b0\u09bf, \u0995\u09cb\u09a8\u09cb \u09b8\u09be\u0987\u09a8 \u0986\u09aa \u09b2\u09be\u0997\u09c7 \u09a8\u09be\u0964'],
    ['\u0995\u09c0 \u0995\u09cb\u09a1 \u0986\u09b0 \u09b0\u09c7\u09ab\u09be\u09b0\u09c7\u09b2 \u0995\u09cb\u09a1 \u0995\u09bf \u098f\u0995\u0987?', '\u09a8\u09be\u0964 \u09b0\u09c7\u09ab\u09be\u09b0\u09c7\u09b2 \u0995\u09cb\u09a1 NG- \u09a6\u09bf\u09df\u09c7 \u09b6\u09c1\u09b0\u09c1 \u09b9\u09df \u098f\u09ac\u0982 \u098f\u0995\u099f\u09bf \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f\u09c7\u09b0\u0964 \u0995\u09c0 \u09b9\u09b2\u09cb \u0985\u09cd\u09af\u09be\u09aa\u09c7 \u099a\u09cd\u09af\u09be\u09b2\u09c7\u099e\u09cd\u099c\u09c7 \u0997\u09cb\u09a8\u09be \u099c\u09bf\u09a8\u09bf\u09b8 \u2014 \u098f\u0995\u099f\u09bf \u0995\u09c0 \u09a6\u09bf\u09df\u09c7 \u098f\u0995\u099f\u09bf \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09c7\u09b0 \u0989\u09a4\u09cd\u09a4\u09b0 \u09a6\u09c7\u0993\u09df\u09be \u09af\u09be\u09df\u0964 \u098f\u0995\u099f\u09bf \u0995\u09cb\u09a1 \u0995\u09c0 \u09a6\u09c7\u09ac\u09c7 \u09a4\u09be \u09a8\u09c1\u09b8\u09c1\u0995\u09c7\u09b0 \u09a8\u09bf\u099c\u09c7\u09b0 \u09a8\u09bf\u09df\u09ae\u09c7 \u09a0\u09bf\u0995 \u09b9\u09df\u0964 \u0986\u09ae\u09b0\u09be \u0995\u0996\u09a8\u09cb \u098f\u09ae\u09a8 \u0995\u09cb\u09a1 \u09a6\u09bf\u0987 \u09a8\u09be \u09af\u09be \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09c0 \u09a6\u09c7\u0993\u09df\u09be\u09b0 \u09aa\u09cd\u09b0\u09a4\u09bf\u09b6\u09cd\u09b0\u09c1\u09a4\u09bf \u09a6\u09c7\u09df, \u0986\u09b0 \u0995\u09c7\u0989 \u0986\u09aa\u09a8\u09be\u0995\u09c7 \u0995\u09c0 \u09ac\u09bf\u0995\u09cd\u09b0\u09bf \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7 \u09a8\u09be\u0964'],
    ['\u09a8\u09c1\u09b8\u09c1\u0995 \u099a\u09cd\u09af\u09be\u09b2\u09c7\u099e\u09cd\u099c\u09c7 \u0995\u09c0 \u09aa\u09c1\u09b0\u09b8\u09cd\u0995\u09be\u09b0 \u0986\u099b\u09c7?', '\u09e7\u09e6\u09e6\u099f\u09bf \u09ab\u09cd\u09b0\u09bf \u0989\u09ae\u09b0\u09be\u09b9 \u09b8\u09ab\u09b0 (\u09eb\u09e6 \u099c\u09a8 \u09ac\u09bf\u099c\u09df\u09c0, \u09aa\u09cd\u09b0\u09a4\u09cd\u09af\u09c7\u0995\u09c7\u09b0 \u09b8\u0999\u09cd\u0997\u09c7 \u098f\u0995\u099c\u09a8 \u09b8\u0999\u09cd\u0997\u09c0) \u098f\u09ac\u0982 \u09e7\u09e6,\u09e6\u09e6\u09e6 \u0995\u09be\u09b0\u09cd\u099f\u09a8 \u099c\u09ae\u099c\u09ae \u09aa\u09be\u09a8\u09bf\u0964 \u09e7 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a5\u09c7\u0995\u09c7 \u09e8\u09e6 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0 \u09e8\u09e6\u09e8\u09ec \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 \u09aa\u09cd\u09b0\u09a4\u09bf\u09a6\u09bf\u09a8 \u09a1\u09cd\u09b0 \u09b9\u09df\u0964 \u0995\u09cb\u09a1 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09b2\u09c7\u0987 \u099c\u09c7\u09a4\u09be \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u09a8\u09df\u0964'],
  ],
  ar: [
    ['\u0645\u0627 \u0647\u0648 \u0643\u0648\u062f \u0646\u0633\u0643\u061f', '\u0627\u0644\u0643\u0648\u062f \u064a\u062a\u064a\u062d \u0644\u0643 \u0627\u0644\u0625\u062c\u0627\u0628\u0629 \u0639\u0646 \u0633\u0624\u0627\u0644 \u0648\u0627\u062d\u062f \u0641\u064a \u062a\u062d\u062f\u064a \u0627\u0644\u0639\u0645\u0631\u0629 \u0627\u0644\u0645\u062c\u0627\u0646\u064a. \u0627\u0644\u0625\u062c\u0627\u0628\u0629 \u0627\u0644\u0635\u062d\u064a\u062d\u0629 \u062a\u062f\u062e\u0644\u0643 \u0641\u064a \u0627\u0644\u0633\u062d\u0628 \u0627\u0644\u064a\u0648\u0645\u064a \u0639\u0644\u0649 \u0631\u062d\u0644\u0629 \u0639\u0645\u0631\u0629 \u0645\u062c\u0627\u0646\u064a\u0629.'],
    ['\u0643\u064a\u0641 \u0623\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0643\u0648\u062f\u061f', '\u0627\u0641\u062a\u062d \u062a\u0637\u0628\u064a\u0642 \u0646\u0633\u0643 \u0623\u0648\u0644\u0627\u064b \u0648\u0627\u062a\u0631\u0643\u0647 \u0645\u0641\u062a\u0648\u062d\u0627\u064b\u060c \u0648\u0627\u0646\u0633\u062e \u0643\u0648\u062f\u0627\u064b \u0647\u0646\u0627\u060c \u0648\u0627\u0636\u063a\u0637 \u00ab\u0627\u0644\u0641\u062a\u062d \u0641\u064a \u0646\u0633\u0643\u00bb\u060c \u062b\u0645 \u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0643\u0648\u062f \u0641\u064a \u0627\u0644\u062a\u0637\u0628\u064a\u0642. \u0625\u0630\u0627 \u0644\u0645 \u064a\u0643\u0646 \u0645\u0645\u0644\u0648\u0621\u0627\u064b\u060c \u0627\u0644\u0635\u0642\u0647.'],
    ['\u0644\u0645\u0627\u0630\u0627 \u064a\u0642\u0648\u0644 \u0627\u0644\u0643\u0648\u062f \u00ab\u0645\u064f\u0633\u062a\u062e\u062f\u0645 \u0645\u0646 \u0642\u0628\u0644\u00bb\u061f', '\u0644\u0627 \u064a\u0645\u0643\u0646 \u0644\u0643\u0644 \u0634\u062e\u0635\u064a\u0646 \u0627\u0644\u062a\u0628\u0627\u062f\u0644 \u0625\u0644\u0627 \u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629. \u0625\u0630\u0627 \u0627\u0633\u062a\u062e\u062f\u0645\u062a \u0643\u0648\u062f\u0627\u064b \u0645\u0646 \u0630\u0644\u0643 \u0627\u0644\u0634\u062e\u0635 \u0645\u0646 \u0642\u0628\u0644\u060c \u0641\u0627\u0646\u0633\u062e \u0627\u0644\u0643\u0648\u062f \u0627\u0644\u062a\u0627\u0644\u064a \u0628\u062f\u0644\u0627\u064b.'],
    ['\u0623\u064a\u0646 \u0623\u0644\u0635\u0642 \u0627\u0644\u0643\u0648\u062f \u0641\u064a \u0646\u0633\u0643\u061f', '\u0627\u0641\u062a\u062d \u0646\u0633\u0643\u060c \u0648\u0627\u0636\u063a\u0637 \u00ab\u0627\u0628\u062f\u0623 \u0627\u0644\u062a\u062d\u062f\u064a\u00bb\u060c \u0648\u0627\u0641\u062a\u062d \u062a\u0628\u0648\u064a\u0628 \u0627\u0644\u0645\u0641\u0627\u062a\u064a\u062d\u060c \u0648\u0627\u0644\u0635\u0642 \u0627\u0644\u0643\u0648\u062f \u0641\u064a \u00ab\u0623\u0636\u0641 \u0643\u0648\u062f\u0627\u064b \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0645\u0641\u062a\u0627\u062d \u062c\u062f\u064a\u062f\u00bb \u0648\u0627\u0636\u063a\u0637 \u00ab\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0643\u0648\u062f\u00bb.'],
    ['\u0643\u064a\u0641 \u0623\u062d\u0635\u0644 \u0639\u0644\u0649 \u0645\u0641\u0627\u062a\u064a\u062d \u0623\u0643\u062b\u0631\u061f', '\u064a\u062d\u0635\u0644 \u0627\u0644\u062c\u0645\u064a\u0639 \u0639\u0644\u0649 \u0645\u0641\u062a\u0627\u062d \u0645\u062c\u0627\u0646\u064a \u0648\u0627\u062d\u062f \u064a\u0648\u0645\u064a\u0627\u064b. \u0648\u062a\u062d\u0635\u0644 \u0639\u0644\u0649 \u0645\u0641\u062a\u0627\u062d \u0625\u0636\u0627\u0641\u064a \u0641\u064a \u0643\u0644 \u0645\u0631\u0629 \u062a\u0633\u062a\u062e\u062f\u0645 \u0641\u064a\u0647\u0627 \u0643\u0648\u062f \u0634\u062e\u0635 \u0622\u062e\u0631\u060c \u0648\u0641\u064a \u0643\u0644 \u0645\u0631\u0629 \u064a\u0633\u062a\u062e\u062f\u0645 \u0641\u064a\u0647\u0627 \u0634\u062e\u0635 \u0645\u0627 \u0643\u0648\u062f\u0643.'],
    ['\u0643\u064a\u0641 \u0623\u0634\u0627\u0631\u0643 \u0623\u0643\u0648\u0627\u062f\u064a\u061f', '\u0627\u0644\u0635\u0642 \u062d\u062a\u0649 10 \u0623\u0643\u0648\u0627\u062f \u0641\u064a \u00ab\u0647\u0644 \u0644\u062f\u064a\u0643 \u0643\u0648\u062f \u0622\u062e\u0631 \u0644\u0644\u0645\u0634\u0627\u0631\u0643\u0629\u061f\u00bb \u2014 \u0643\u0648\u062f \u0641\u064a \u0643\u0644 \u0633\u0637\u0631. \u064a\u062a\u0645 \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0643\u0644 \u0643\u0648\u062f \u062b\u0645 \u0625\u0636\u0627\u0641\u062a\u0647 \u0625\u0644\u0649 \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629 \u0644\u0644\u0622\u062e\u0631\u064a\u0646.'],
    ['\u0647\u0644 \u062a\u062d\u0642\u0642 \u0646\u0633\u0643 \u0645\u0646 \u0647\u0630\u0647 \u0627\u0644\u0623\u0643\u0648\u0627\u062f\u061f', '\u0644\u0627. \u0627\u0644\u0623\u0643\u0648\u0627\u062f \u0645\u0646 \u0627\u0644\u0645\u062c\u062a\u0645\u0639 \u0648\u0644\u0645 \u064a\u062a\u062d\u0642\u0642 \u0645\u0646\u0647\u0627 \u0646\u0633\u0643. \u0648\u0642\u062f \u064a\u0643\u0648\u0646 \u0628\u0639\u0636\u0647\u0627 \u0645\u0633\u062a\u062e\u062f\u0645\u0627\u064b \u0645\u0646 \u0642\u0628\u0644 \u2014 \u062c\u0631\u0651\u0628 \u0627\u0644\u062a\u0627\u0644\u064a.'],
    ['\u0647\u0644 NusukKeys \u0647\u0648 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0631\u0633\u0645\u064a \u0644\u0646\u0633\u0643\u061f', '\u0644\u0627. \u0625\u0646\u0647 \u0623\u062f\u0627\u0629 \u0645\u062c\u062a\u0645\u0639 \u0645\u0633\u062a\u0642\u0644\u0629\u060c \u063a\u064a\u0631 \u062a\u0627\u0628\u0639\u0629 \u0644\u0646\u0633\u0643. \u0648\u0644\u0627 \u064a\u0637\u0644\u0628 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0623\u0628\u062f\u0627\u064b.'],
    ['\u0647\u0644 NusukKeys \u0645\u062c\u0627\u0646\u064a\u061f', '\u0646\u0639\u0645. \u0646\u0633\u062e \u0627\u0644\u0623\u0643\u0648\u0627\u062f \u0648\u0645\u0634\u0627\u0631\u0643\u062a\u0647\u0627 \u0645\u062c\u0627\u0646\u064a \u062a\u0645\u0627\u0645\u064b\u0627\u060c \u062f\u0648\u0646 \u0623\u064a \u062a\u0633\u062c\u064a\u0644.'],
    ['\u0647\u0644 \u0643\u0648\u062f \u0627\u0644\u0645\u0641\u062a\u0627\u062d \u0647\u0648 \u0646\u0641\u0633\u0647 \u0643\u0648\u062f \u0627\u0644\u0625\u062d\u0627\u0644\u0629\u061f', '\u0644\u0627. \u0643\u0648\u062f \u0627\u0644\u0625\u062d\u0627\u0644\u0629 \u064a\u0628\u062f\u0623 \u0628\u0640 NG- \u0648\u064a\u0646\u062a\u0645\u064a \u0625\u0644\u0649 \u062d\u0633\u0627\u0628. \u0623\u0645\u0627 \u0627\u0644\u0645\u0641\u062a\u0627\u062d \u0641\u0647\u0648 \u0645\u0627 \u064a\u062d\u0633\u0628\u0647 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0641\u064a \u0627\u0644\u062a\u062d\u062f\u064a \u2014 \u0645\u0641\u062a\u0627\u062d \u0648\u0627\u062d\u062f \u064a\u0641\u062a\u062d \u0633\u0624\u0627\u0644\u064b\u0627 \u0648\u0627\u062d\u062f\u064b\u0627. \u0648\u0645\u0627 \u064a\u0639\u0637\u064a\u0647 \u0627\u0644\u0643\u0648\u062f \u064a\u0642\u0631\u0631\u0647 \u0646\u0633\u0643 \u0646\u0641\u0633\u0647. \u0648\u0644\u0627 \u0646\u0646\u0634\u0631 \u0623\u0628\u062f\u064b\u0627 \u0643\u0648\u062f\u064b\u0627 \u064a\u0639\u062f \u0628\u0645\u0641\u062a\u0627\u062d \u0645\u0636\u0645\u0648\u0646\u060c \u0648\u0644\u0627 \u064a\u0645\u0643\u0646 \u0644\u0623\u062d\u062f \u0623\u0646 \u064a\u0628\u064a\u0639\u0643 \u0627\u0644\u0645\u0641\u0627\u062a\u064a\u062d.'],
    ['\u0645\u0627 \u062c\u0648\u0627\u0626\u0632 \u062a\u062d\u062f\u064a \u0646\u0633\u0643\u061f', '100 \u0631\u062d\u0644\u0629 \u0639\u0645\u0631\u0629 \u0645\u062c\u0627\u0646\u064a\u0629 (50 \u0641\u0627\u0626\u0632\u064b\u0627\u060c \u0643\u0644 \u0641\u0627\u0626\u0632 \u0645\u0639 \u0645\u0631\u0627\u0641\u0642) \u064810,000 \u0643\u0631\u062a\u0648\u0646 \u0645\u0646 \u0645\u0627\u0621 \u0632\u0645\u0632\u0645. \u064a\u064f\u062c\u0631\u0649 \u0627\u0644\u0633\u062d\u0628 \u064a\u0648\u0645\u064a\u064b\u0627 \u0645\u0646 1 \u0646\u0648\u0641\u0645\u0628\u0631 \u0625\u0644\u0649 20 \u062f\u064a\u0633\u0645\u0628\u0631 2026. \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0643\u0648\u062f \u0644\u0627 \u064a\u0636\u0645\u0646 \u0627\u0644\u0641\u0648\u0632.'],
  ],
};
const GUIDES_I18N = {
  en: [
    ['Find your code', 'In Nusuk: Start the challenge \u2192 Share \u2192 copy the code that starts with NG-.'],
    ['Use a code', 'Open Nusuk first, keep it open, then copy and open a code here.'],
    ['Code not working', 'Come back and try the next code \u2014 each pair can only swap once.'],
    ['Share codes', 'Paste up to 10 codes at once in the share box.'],
    ['Get more keys', 'Use a code each day, and share your own code with others.'],
    ['The Umrah competition', 'Answer one question per key; correct answers enter the daily draw.'],
    ['Stay safe', 'Never share your Nusuk login. This site never asks for it.'],
  ],
  bn: [
    ['\u0986\u09aa\u09a8\u09be\u09b0 \u0995\u09cb\u09a1 \u0996\u09c1\u0981\u099c\u09c1\u09a8', '\u09a8\u09c1\u09b8\u09c1\u0995\u09c7: Start the challenge \u2192 Share \u2192 NG- \u09a6\u09bf\u09df\u09c7 \u09b6\u09c1\u09b0\u09c1 \u0995\u09cb\u09a1\u099f\u09bf \u0995\u09aa\u09bf \u0995\u09b0\u09c1\u09a8\u0964'],
    ['\u0995\u09cb\u09a1 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c1\u09a8', '\u09aa\u09cd\u09b0\u09a5\u09ae\u09c7 \u09a8\u09c1\u09b8\u09c1\u0995 \u0996\u09c1\u09b2\u09c7 \u0996\u09cb\u09b2\u09be \u09b0\u09be\u0996\u09c1\u09a8, \u09a4\u09be\u09b0\u09aa\u09b0 \u098f\u0996\u09be\u09a8 \u09a5\u09c7\u0995\u09c7 \u0995\u09cb\u09a1 \u0995\u09aa\u09bf \u0995\u09b0\u09c7 \u0996\u09c1\u09b2\u09c1\u09a8\u0964'],
    ['\u0995\u09cb\u09a1 \u0995\u09be\u099c \u09a8\u09be \u0995\u09b0\u09b2\u09c7', '\u09ab\u09bf\u09b0\u09c7 \u098f\u09b8\u09c7 \u09aa\u09b0\u09c7\u09b0 \u0995\u09cb\u09a1 \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09c1\u09a8 \u2014 \u09a6\u09c1\u099c\u09a8\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u098f\u0995\u09ac\u09be\u09b0\u0987 \u09ac\u09bf\u09a8\u09bf\u09ae\u09df \u09b9\u09df\u0964'],
    ['\u0995\u09cb\u09a1 \u09b6\u09c7\u09df\u09be\u09b0 \u0995\u09b0\u09c1\u09a8', '\u09b6\u09c7\u09df\u09be\u09b0 \u09ac\u09be\u0995\u09cd\u09b8\u09c7 \u098f\u0995\u09b8\u09be\u09a5\u09c7 \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a \u09e7\u09e6\u099f\u09bf \u0995\u09cb\u09a1 \u09aa\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c1\u09a8\u0964'],
    ['\u0986\u09b0\u09cb \u0995\u09c0 \u09aa\u09be\u09a8', '\u09aa\u09cd\u09b0\u09a4\u09bf\u09a6\u09bf\u09a8 \u098f\u0995\u099f\u09bf \u0995\u09cb\u09a1 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c1\u09a8, \u0986\u09b0 \u0986\u09aa\u09a8\u09be\u09b0 \u0995\u09cb\u09a1 \u0985\u09a8\u09cd\u09af\u09a6\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09b6\u09c7\u09df\u09be\u09b0 \u0995\u09b0\u09c1\u09a8\u0964'],
    ['\u0989\u09ae\u09b0\u09be\u09b9 \u09aa\u09cd\u09b0\u09a4\u09bf\u09af\u09cb\u0997\u09bf\u09a4\u09be', '\u09aa\u09cd\u09b0\u09a4\u09bf \u0995\u09c0 \u09a6\u09bf\u09df\u09c7 \u098f\u0995\u099f\u09bf \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u09c7\u09b0 \u0989\u09a4\u09cd\u09a4\u09b0 \u09a6\u09bf\u09a8; \u09b8\u09a0\u09bf\u0995 \u0989\u09a4\u09cd\u09a4\u09b0 \u09aa\u09cd\u09b0\u09a4\u09bf\u09a6\u09bf\u09a8\u09c7\u09b0 \u09a1\u09cd\u09b0\u09df\u09c7 \u09af\u09be\u09df\u0964'],
    ['\u09a8\u09bf\u09b0\u09be\u09aa\u09a6 \u09a5\u09be\u0995\u09c1\u09a8', '\u0986\u09aa\u09a8\u09be\u09b0 \u09a8\u09c1\u09b8\u09c1\u0995 \u09b2\u0997\u09bf\u09a8 \u0995\u0996\u09a8\u09cb \u09b6\u09c7\u09df\u09be\u09b0 \u0995\u09b0\u09ac\u09c7\u09a8 \u09a8\u09be\u0964 \u098f\u0987 \u09b8\u09be\u0987\u099f \u0995\u0996\u09a8\u09cb \u09a4\u09be \u099a\u09be\u09df \u09a8\u09be\u0964'],
  ],
  ar: [
    ['\u0627\u0639\u062b\u0631 \u0639\u0644\u0649 \u0643\u0648\u062f\u0643', '\u0641\u064a \u0646\u0633\u0643: \u00ab\u0627\u0628\u062f\u0623 \u0627\u0644\u062a\u062d\u062f\u064a\u00bb \u2192 \u00ab\u0645\u0634\u0627\u0631\u0643\u0629\u00bb \u2192 \u0627\u0646\u0633\u062e \u0627\u0644\u0643\u0648\u062f \u0627\u0644\u0630\u064a \u064a\u0628\u062f\u0623 \u0628\u0640 NG-.'],
    ['\u0627\u0633\u062a\u062e\u062f\u0645 \u0643\u0648\u062f\u0627\u064b', '\u0627\u0641\u062a\u062d \u0646\u0633\u0643 \u0623\u0648\u0644\u0627\u064b \u0648\u0627\u062a\u0631\u0643\u0647 \u0645\u0641\u062a\u0648\u062d\u0627\u064b\u060c \u062b\u0645 \u0627\u0646\u0633\u062e \u0643\u0648\u062f\u0627\u064b \u0647\u0646\u0627 \u0648\u0627\u0641\u062a\u062d\u0647.'],
    ['\u0627\u0644\u0643\u0648\u062f \u0644\u0627 \u064a\u0639\u0645\u0644', '\u0639\u064f\u062f \u0648\u062c\u0631\u0651\u0628 \u0627\u0644\u062a\u0627\u0644\u064a \u2014 \u0644\u0627 \u064a\u0645\u0643\u0646 \u0644\u0643\u0644 \u0634\u062e\u0635\u064a\u0646 \u0627\u0644\u062a\u0628\u0627\u062f\u0644 \u0625\u0644\u0627 \u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629.'],
    ['\u0634\u0627\u0631\u0643 \u0627\u0644\u0623\u0643\u0648\u0627\u062f', '\u0627\u0644\u0635\u0642 \u062d\u062a\u0649 10 \u0623\u0643\u0648\u0627\u062f \u062f\u0641\u0639\u0629 \u0648\u0627\u062d\u062f\u0629 \u0641\u064a \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629.'],
    ['\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0645\u0641\u0627\u062a\u064a\u062d \u0623\u0643\u062b\u0631', '\u0627\u0633\u062a\u062e\u062f\u0645 \u0643\u0648\u062f\u0627\u064b \u0643\u0644 \u064a\u0648\u0645\u060c \u0648\u0634\u0627\u0631\u0643 \u0643\u0648\u062f\u0643 \u0645\u0639 \u0627\u0644\u0622\u062e\u0631\u064a\u0646.'],
    ['\u0645\u0633\u0627\u0628\u0642\u0629 \u0627\u0644\u0639\u0645\u0631\u0629', '\u0623\u062c\u0628 \u0639\u0646 \u0633\u0624\u0627\u0644 \u0648\u0627\u062d\u062f \u0644\u0643\u0644 \u0645\u0641\u062a\u0627\u062d\u061b \u0648\u0627\u0644\u0625\u062c\u0627\u0628\u0627\u062a \u0627\u0644\u0635\u062d\u064a\u062d\u0629 \u062a\u062f\u062e\u0644 \u0627\u0644\u0633\u062d\u0628 \u0627\u0644\u064a\u0648\u0645\u064a.'],
    ['\u0643\u0646 \u0622\u0645\u0646\u0627\u064b', '\u0644\u0627 \u062a\u0634\u0627\u0631\u0643 \u0628\u064a\u0627\u0646 \u0627\u0644\u0644\u062e\u0648\u0644 \u0641\u064a \u0646\u0633\u0643. \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0642\u0639 \u0644\u0627 \u064a\u0637\u0644\u0628\u0647\u0627 \u0623\u0628\u062f\u0627\u064b.'],
  ],
};
// Troubleshooting (Fix) — 10 items, English, Bengali, Arabic;
// other languages show English (see renderFixes).
const FIXES_I18N = {
  en: [
    ['The code already has been used', 'You and that person have already swapped keys once — each pair can only swap one time. Copy the next code instead. On this site, tap "Already used" so it is never shown to you again.'],
    ['The entered code is not correct', 'Copy the whole code starting with NG- — no spaces or extra letters — and paste it instead of typing it. Upper and lower case matter. Tap "Doesn’t work" so the code is hidden, and it is removed once two people report it.'],
    ['I pasted a code but didn’t get an extra key', 'Check it went into the "Add code to get new key" box on the Keys tab and that you tapped Check the code. Close and reopen the app and try again. Remember: one key per pair only.'],
    ['Is there a daily limit on extra keys?', 'Nusuk has not published an official limit, but some guides report a daily cap. If many codes stop working in one day, try again after the daily reset.'],
    ['When does my free daily key reset?', 'One free key at the start of each day, Saudi time. An unused key expires at the end of the day.'],
    ['The OTP (verification code) isn’t arriving', 'Wait a minute before asking for a new one. If you signed up with email, check your spam or junk folder, and check the email or phone number is typed correctly. Visitors outside Saudi Arabia usually sign up with email. The service can be busy during big campaigns.'],
    ['It says the account already exists', 'You probably signed up before — for an Umrah booking or an earlier competition. Choose sign in, and use Forgot password if needed. There is no need for a second account.'],
    ['I can’t find the competition in the app', 'Update the Nusuk app, reopen it, and find the 100-Umrah-trips banner — tap "Start the challenge" — or open the Games Center.'],
    ['Who do I contact for app problems?', 'Nusuk technical support on 920002814. NusukKeys cannot fix Nusuk account problems.'],
    ['Is it safe to use codes from here?', 'Yes. An invite code only gives keys and cannot access anyone’s account. Only paste codes inside the official Nusuk app — never share your password or OTP with anyone.'],
  ],
  bn: [
    ['কোডটি "already used" বলছে', 'আপনি আর সেই ব্যক্তি একবার কী বিনিময় করেছেন — দুজনের মধ্যে একবারই বিনিময় হয়। পরের কোডটি নিন। এই সাইটে "Already used"-এ ট্যাপ করুন, তাহলে আর দেখাবে না।'],
    ['কোডটি সঠিক নয় বলছে', 'NG- সহ পুরো কোডটি কপি করুন — কোনো স্পেস বা বাড়তি অক্ষর নয় — আর টাইপ না করে পেস্ট করুন। বড়-ছোট অক্ষর গুরুত্বপূর্ণ। "Doesn’t work"-এ ট্যাপ করুন; দুজন জানালে কোডটি সরিয়ে দেওয়া হয়।'],
    ['কোড পেস্ট করলাম, তবু বাড়তি কী পেলাম না', 'দেখুন কোডটি Keys ট্যাবে "Add code to get new key" বাক্সে গেছে কি না এবং Check the code-এ ট্যাপ করেছেন কি না। অ্যাপ বন্ধ করে আবার খুলে চেষ্টা করুন। মনে রাখবেন: এক জোড়ায় একটিই কী।'],
    ['বাড়তি কীতে কি দৈনিক সীমা আছে?', 'নুসুক আনুষ্ঠানিক কোনো সীমা জানায়নি, তবে কিছু গাইডে দৈনিক সীমার কথা আছে। একদিনে অনেক কোড কাজ না করলে দৈনিক রিসেটের পর আবার চেষ্টা করুন।'],
    ['আমার ফ্রি দৈনিক কী কখন রিসেট হয়?', 'সৌদি সময়ে প্রতিদিনের শুরুতে একটি ফ্রি কী। অব্যবহৃত কী দিনের শেষে মেয়াদ শেষ হয়।'],
    ['OTP (যাচাইকরণ কোড) আসছে না', 'আবার চাওয়ার আগে এক মিনিট অপেক্ষা করুন। ইমেইলে সাইন আপ করলে স্প্যাম বা জাঙ্ক ফোল্ডার দেখুন, আর ইমেইল বা ফোন নম্বর ঠিক আছে কি না দেখুন। সৌদি আরবের বাইরের দর্শনার্থীরা সাধারণত ইমেইলে সাইন আপ করেন। বড় ক্যাম্পেইনের সময় সার্ভিস ব্যস্ত থাকতে পারে।'],
    ['বলছে অ্যাকাউন্ট আগেই আছে', 'আপনি সম্ভবত আগেই সাইন আপ করেছেন — উমরাহ বুকিং বা আগের প্রতিযোগিতার জন্য। সাইন ইন বেছে নিন, প্রয়োজনে Forgot password ব্যবহার করুন। দ্বিতীয় অ্যাকাউন্টের দরকার নেই।'],
    ['অ্যাপে প্রতিযোগিতা খুঁজে পাচ্ছি না', 'নুসুক অ্যাপ আপডেট করে আবার খুলুন, ১০০-উমরাহ-সফর ব্যানার খুঁজে "Start the challenge"-এ ট্যাপ করুন, অথবা Games Center খুলুন।'],
    ['অ্যাপের সমস্যায় কার সঙ্গে যোগাযোগ করব?', 'নুসুক টেকনিক্যাল সাপোর্ট: 920002814। NusukKeys নুসুক অ্যাকাউন্টের সমস্যা ঠিক করতে পারে না।'],
    ['এখানকার কোড ব্যবহার কি নিরাপদ?', 'হ্যাঁ। একটি ইনভাইট কোড শুধু কী দেয়, কারো অ্যাকাউন্টে ঢুকতে পারে না। কোড শুধু অফিসিয়াল নুসুক অ্যাপের ভেতরে পেস্ট করুন — আপনার পাসওয়ার্ড বা OTP কাউকে দেবেন না।'],
  ],
  ar: [
    ['يقول الكود "مُستخدم من قبل"', 'أنت وذلك الشخص تبادلتما المفاتيح مرة واحدة — ولا يمكن لكل شخصين التبادل إلا مرة واحدة. انسخ الكود التالي بدلًا منه. واضغط "Already used" هنا حتى لا يظهر لك مرة أخرى.'],
    ['يقول الكود "غير صحيح"', 'انسخ الكود كاملًا بدءًا من NG- — دون مسافات أو حروف زائدة — والصقه بدل كتابته. والأحرف الكبيرة والصغيرة مهمة. واضغط "Doesn’t work" لإخفائه، ويُزال الكود بعد أن يبلغ عنه شخصان.'],
    ['لصقت كودًا ولم أحصل على مفتاح إضافي', 'تأكد أن الكود دخل في مربع "Add code to get new key" في تبويب المفاتيح وأنك ضغطت "Check the code". أغلق التطبيق وأعد فتحه وحاول مجددًا. وتذكر: مفتاح واحد لكل شخصين فقط.'],
    ['هل هناك حد يومي للمفاتيح الإضافية؟', 'لم ينشر نسك حدًا رسميًا، لكن بعض الأدلة تذكر حدًا يوميًا. إذا توقفت أكواد كثيرة عن العمل في يوم واحد، فحاول مجددًا بعد إعادة التعيين اليومية.'],
    ['متى تُعاد تعيين مفتاحي اليومي المجاني؟', 'مفتاح مجاني واحد في بداية كل يوم، بتوقيت السعودية. وينتهي المفتاح غير المستخدم في نهاية اليوم.'],
    ['رمز التحقق (OTP) لا يصل', 'انتظر دقيقة قبل طلب رمز جديد. وإذا سجلت بالبريد الإلكتروني، فتحقق من مجلد البريد غير المرغوب فيه، وتأكد أن البريد أو رقم الهاتف مكتوب صحيحًا. والزوار من خارج السعودية يسجلون عادة بالبريد الإلكتروني. وقد تكون الخدمة مشغولة أثناء الحملات الكبيرة.'],
    ['يقول إن الحساب موجود بالفعل', 'غالبًا أنك سجلت من قبل — لحجز عمرة أو مسابقة سابقة. اختر تسجيل الدخول، واستخدم "نسيت كلمة المرور" عند الحاجة. ولا حاجة لحساب ثانٍ.'],
    ['لا أجد المسابقة في التطبيق', 'حدّث تطبيق نسك، وأعد فتحه، وابحث عن لافتة 100 رحلة عمرة — واضغط "Start the challenge" — أو افتح مركز الألعاب.'],
    ['لمن أتوجه عند مشاكل التطبيق؟', 'الدعم الفني لنسك على الرقم 920002814. ولا يمكن لـ NusukKeys إصلاح مشاكل حساب نسك.'],
    ['هل استخدام الأكواد من هنا آمن؟', 'نعم. كود الدعوة يمنح المفاتيح فقط ولا يمكنه الوصول إلى حساب أحد. الصق الأكواد داخل تطبيق نسك الرسمي فقط — ولا تشارك كلمة مرورك أو رمز التحقق مع أحد.'],
  ],
};

// Big guide sections (Find your code, Competition, Umrah steps,
// Privacy, Terms, Developers) — English, Bengali, Arabic;
// other languages show English (see renderSections).
const SECTIONS_I18N = {
  findCode: {
    en: { title: 'Find your code', html: `<p>Get your own code in 3 steps:</p><ol><li>Open the Nusuk app and tap "Start the challenge".</li><li>Tap Share in the bottom menu — your code is inside the invite message.</li><li>Copy the whole message and paste it here — no need to find the code yourself. We pick out the NG- code for you.</li></ol><p><strong>What does a code look like?</strong> It starts with NG- followed by 8 letters and numbers, for example NG-Ab12Cd34. Capital and small letters can matter, so always copy and paste — never type it.</p><p><strong>Where should you share it?</strong> Here, and in family WhatsApp and Facebook groups. Share only the code — never your password.</p><p><strong>Can I share more than one code?</strong> Each account has its own code; family members can share theirs. You get one extra key each time a new person uses your code.</p>` },
    bn: { title: 'আপনার কোড খুঁজুন', html: `<p>৩ ধাপে আপনার নিজের কোড পান:</p><ol><li>নুসুক অ্যাপ খুলে "Start the challenge"-এ ট্যাপ করুন।</li><li>নিচের মেনুতে Share-এ ট্যাপ করুন — আপনার কোডটি ইনভাইট বার্তার ভেতরে আছে।</li><li>পুরো বার্তাটি কপি করে এখানে পেস্ট করুন — নিজে কোড খোঁজার দরকার নেই। আমরা NG- কোডটি বের করে নেব।</li></ol><p><strong>কোড দেখতে কেমন?</strong> NG- দিয়ে শুরু হয়, তারপর ৮টি অক্ষর ও সংখ্যা, যেমন NG-Ab12Cd34। বড়-ছোট অক্ষর গুরুত্বপূর্ণ হতে পারে, তাই সবসময় কপি-পেস্ট করুন — টাইপ করবেন না।</p><p><strong>কোথায় শেয়ার করবেন?</strong> এখানে, আর পরিবারের WhatsApp ও Facebook গ্রুপে। শুধু কোডটি শেয়ার করুন — পাসওয়ার্ড কখনো নয়।</p><p><strong>একাধিক কোড শেয়ার করা যাবে?</strong> প্রতিটি অ্যাকাউন্টের নিজের কোড আছে; পরিবারের সদস্যরা নিজেদের কোড শেয়ার করতে পারেন। নতুন কেউ আপনার কোড ব্যবহার করলে আপনি একটি বাড়তি কী পাবেন।</p>` },
    ar: { title: 'اعثر على كودك', html: `<p>احصل على كودك في 3 خطوات:</p><ol><li>افتح تطبيق نسك واضغط "Start the challenge".</li><li>اضغط "مشاركة" في القائمة السفلية — كودك موجود داخل رسالة الدعوة.</li><li>انسخ الرسالة كاملة والصقها هنا — لا حاجة للبحث عن الكود بنفسك. نستخرج كود NG- من أجلك.</li></ol><p><strong>كيف يبدو الكود؟</strong> يبدأ بـ NG- متبوعًا بـ 8 أحرف وأرقام، مثل NG-Ab12Cd34. وقد تهم الأحرف الكبيرة والصغيرة، لذا انسخ والصق دائمًا — ولا تكتبه. </p><p><strong>أين تشاركه؟</strong> هنا، وفي مجموعات واتساب وفيسبوك العائلية. شارك الكود فقط — ولا تشارك كلمة مرورك أبدًا.</p><p><strong>هل يمكنني مشاركة أكثر من كود؟</strong> لكل حساب كوده الخاص؛ ويمكن لأفراد العائلة مشاركة أكوادهم. تحصل على مفتاح إضافي في كل مرة يستخدم فيها شخص جديد كودك.</p>` },
  },
  competition: {
    en: { title: 'The Nusuk Free Umrah Competition 2026', html: `<p>The competition runs in the official Nusuk app from <strong>1 November to 20 December 2026</strong> — 50 days, with a draw every day.</p><h3>Prizes</h3><ul><li><strong>100 free Umrah trips:</strong> 50 winners, each with a companion.</li><li><strong>10,000 cartons of Zamzam water:</strong> 20 cartons per Zamzam winner.</li><li>Each Umrah prize includes the visa, travel tickets, 10 nights' accommodation in Makkah and Madinah, transport and guidance. It cannot be transferred, exchanged or paid out in cash.</li><li>Zamzam delivery is only inside Saudi Arabia.</li></ul><h3>How to take part</h3><ol><li>Download the Nusuk app and sign in (visitors outside Saudi Arabia usually sign in with email).</li><li>Tap "Start the challenge" on the 100-Umrah-trips banner, or find it in the Games Center.</li><li>Choose a door — the Quran, the Prophet's Seerah, Makkah, or Madinah — and answer the question.</li><li>One free key a day; a correct answer enters that day's draw. An answer after that day's draw goes into the next one automatically.</li><li>Get extra keys with invite codes: each pair can swap only once, so use many different codes.</li></ol><h3>Winners</h3><p>One winner is drawn daily for a free Umrah trip. Winners are announced every day on Nusuk's official accounts and on the Winners page inside the game, and contacted by email — use a valid email. If a winner cannot be reached within 30 days, they lose the prize. Anyone 18 or older, of any nationality, can take part; each person can win only once.</p><p><strong>Stay safe:</strong> it is free. Ignore any message asking you to pay a fee, share your password or OTP, or send passport details to claim a prize. For app problems, Nusuk technical support is on <strong>920002814</strong>.</p>` },
    bn: { title: 'নুসুক ফ্রি উমরাহ প্রতিযোগিতা ২০২৬', html: `<p>প্রতিযোগিতা চলে অফিসিয়াল নুসুক অ্যাপে <strong>১ নভেম্বর থেকে ২০ ডিসেম্বর ২০২৬</strong> পর্যন্ত — ৫০ দিন, প্রতিদিন ড্র।</p><h3>পুরস্কার</h3><ul><li><strong>১০০টি ফ্রি উমরাহ সফর:</strong> ৫০ জন বিজয়ী, প্রত্যেকের সঙ্গে একজন সঙ্গী।</li><li><strong>১০,০০০ কার্টন জমজম পানি:</strong> প্রত্যেক জমজম বিজয়ী পাবেন ২০ কার্টন।</li><li>প্রতিটি উমরাহ পুরস্কারে আছে ভিসা, যাতায়াতের টিকিট, মক্কা ও মদিনায় ১০ রাতের থাকা, পরিবহন ও গাইড। এটি হস্তান্তর বা নগদে বিনিময় করা যায় না।</li><li>জমজম ডেলিভারি শুধু সৌদি আরবের ভেতরে।</li></ul><h3>কীভাবে অংশ নেবেন</h3><ol><li>নুসুক অ্যাপ ডাউনলোড করে সাইন ইন করুন (সৌদি আরবের বাইরের দর্শনার্থীরা সাধারণত ইমেইলে সাইন ইন করেন)।</li><li>১০০-উমরাহ-সফর ব্যানারে "Start the challenge"-এ ট্যাপ করুন, অথবা Games Center-এ খুঁজুন।</li><li>একটি দরজা বেছে নিন — কুরআন, নবীজির সিরাহ, মক্কা, অথবা মদিনা — আর প্রশ্নের উত্তর দিন।</li><li>প্রতিদিন একটি ফ্রি কী; সঠিক উত্তর সেই দিনের ড্রয়ে যায়। দিনের ড্রয়ের পর উত্তর দিলে তা পরের দিনের ড্রয়ে যায়।</li><li>ইনভাইট কোড দিয়ে বাড়তি কী পান: এক জোড়ায় একবারই বিনিময় হয়, তাই অনেক ভিন্ন কোড ব্যবহার করুন।</li></ol><h3>বিজয়ীরা</h3><p>প্রতিদিন একজন বিজয়ীকে ফ্রি উমরাহ সফরের জন্য ড্র করা হয়। বিজয়ীদের নাম প্রতিদিন নুসুকের অফিসিয়াল অ্যাকাউন্টে এবং গেমের ভেতরে Winners পাতায় ঘোষণা করা হয়, আর ইমেইলে যোগাযোগ করা হয় — সঠিক ইমেইল ব্যবহার করুন। ৩০ দিনের মধ্যে যোগাযোগ করা না গেলে বিজয়ী পুরস্কার হারাবেন। ১৮ বছর বা তার বেশি যে কেউ, যেকোনো জাতীয়তার, অংশ নিতে পারেন; প্রত্যেকে একবারই জিততে পারেন।</p><p><strong>নিরাপদ থাকুন:</strong> এটি ফ্রি। পুরস্কার পেতে ফি দিতে, পাসওয়ার্ড বা OTP শেয়ার করতে, অথবা পাসপোর্টের তথ্য পাঠাতে বলা কোনো বার্তা উপেক্ষা করুন। অ্যাপের সমস্যায় নুসুক টেকনিক্যাল সাপোর্ট: <strong>920002814</strong>।</p>` },
    ar: { title: 'مسابقة نسك للعمرة المجانية 2026', html: `<p>تجري المسابقة في تطبيق نسك الرسمي من <strong>1 نوفمبر إلى 20 ديسمبر 2026</strong> — 50 يومًا، مع سحب كل يوم.</p><h3>الجوائز</h3><ul><li><strong>100 رحلة عمرة مجانية:</strong> 50 فائزًا، كل فائز مع مرافق.</li><li><strong>10,000 كرتون من ماء زمزم:</strong> 20 كرتونًا لكل فائز بماء زمزم.</li><li>تشمل كل جائزة عمرة التأشيرة وتذاكر السفر و10 ليالٍ من الإقامة في مكة والمدينة والنقل والإرشاد. ولا يمكن تحويلها أو استبدالها أو صرفها نقدًا.</li><li>توصيل زمزم داخل السعودية فقط.</li></ul><h3>كيف تشارك</h3><ol><li>نزّل تطبيق نسك وسجّل الدخول (الزوار من خارج السعودية يسجلون عادة بالبريد الإلكتروني).</li><li>اضغط "Start the challenge" على لافتة 100 رحلة عمرة، أو ابحث عنها في مركز الألعاب.</li><li>اختر بابًا — القرآن، أو سيرة النبي، أو مكة، أو المدينة — وأجب عن السؤال.</li><li>مفتاح مجاني واحد كل يوم؛ والإجابة الصحيحة تدخلك سحب ذلك اليوم. والإجابة بعد سحب اليوم تدخل سحب اليوم التالي تلقائيًا.</li><li>احصل على مفاتيح إضافية بأكواد الدعوة: لا يمكن لكل شخصين التبادل إلا مرة واحدة، لذا استخدم أكوادًا مختلفة كثيرة.</li></ol><h3>الفائزون</h3><p>يُسحب فائز واحد يوميًا لرحلة عمرة مجانية. ويُعلن عن الفائزين كل يوم على حسابات نسك الرسمية وعلى صفحة الفائزين داخل اللعبة، ويُتواصل معهم بالبريد الإلكتروني — استخدم بريدًا صحيحًا. وإذا تعذر الوصول إلى فائز خلال 30 يومًا، يفقد الجائزة. ويمكن لأي شخص عمره 18 عامًا أو أكثر، من أي جنسية، المشاركة؛ ويمكن لكل شخص الفوز مرة واحدة فقط.</p><p><strong>كن آمنًا:</strong> المسابقة مجانية. تجاهل أي رسالة تطلب دفع رسوم أو مشاركة كلمة مرورك أو رمز التحقق أو إرسال تفاصيل جواز السفر لاستلام جائزة. ولمشاكل التطبيق، الدعم الفني لنسك على الرقم <strong>920002814</strong>.</p>` },
  },
  umrah: {
    en: { title: 'Umrah step by step', html: `<p>Umrah has four main acts: <strong>Ihram, Tawaf</strong> around the Kaaba (7 circuits), <strong>Sa'i</strong> between Safa and Marwa (7 circuits), then shaving the head or shortening the hair (<strong>Halq or Qasr</strong>).</p><h3>1. Ihram</h3><p>Enter Ihram from the Miqat — bathe, apply perfume before Ihram, and make the intention: "Labbayka Allahumma Umratan". Men wear two white cloths (Izar and Rida). Then keep reciting the Talbiyah on the way: "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak."</p><h3>Miqat — where to enter Ihram</h3><p>It depends on your route, not only your country. Those inside the Miqat boundary enter Ihram from their own place; Makkah residents enter from a Hill area like Tan'im.</p><ul><li><strong>Dhul-Hulayfah</strong> (Abyar Ali) — for Madinah</li><li><strong>Juhfah</strong> (Rabigh) — for Egypt, Sham and the Maghreb</li><li><strong>Qarn al-Manazil</strong> (As-Sayl al-Kabir) — for Najd and Taif</li><li><strong>Yalamlam</strong> (As-Sa'diyah) — for Yemen</li><li><strong>Dhat Irq</strong> (Ad-Dariba) — for Iraq</li></ul><p>By plane: make the intention in the air when passing the Miqat (the crew usually announces it). Men should wear Ihram clothes before flying.</p><h3>Ihram prohibitions</h3><p>From the intention until Halq/Qasr: no cutting hair or nails; no perfume on body or clothes after Ihram; no head covering for men; no sewn clothes for men (shirt, trousers); no hunting land animals; no marriage or sexual relations. Women may wear any modest clothes except niqab and gloves.</p><h3>2. Tawaf</h3><p>Start at the Black Stone, with the Kaaba on your left, and complete 7 circuits. Stop the Talbiyah once Tawaf starts. Touch the Black Stone if easy; otherwise gesture towards it and say "Allahu Akbar" without pushing. Go outside Hateem (Hijr Ismail) — it is part of the Kaaba, and a circuit through it does not count. Most scholars require purity, so do wudu first. Then pray 2 rak'ahs behind Maqam Ibrahim if possible, otherwise anywhere in the mosque, and drink Zamzam.</p><h3>3. Sa'i</h3><p>Start at Safa and end at Marwa — 7 circuits (Safa to Marwa is one circuit). At Safa recite: "Innas-Safa wal-Marwata min sha'a'irillah". Climb, face the Kaaba, say Takbir and make dua. Men walk fast between the two green markers. If unsure of the count, take the lower number.</p><h3>4. Halq / Qasr</h3><p>Men shave (Halq, better) or shorten (Qasr) their hair. Women cut a fingertip's length from the end of the hair — they do not shave.</p><h3>Women's Umrah</h3><p>Ordinary modest clothes, no specific colour required; no Raml or Idtiba; shorten the hair instead of shaving. A menstruating or postpartum woman enters Ihram from the Miqat and does everything except Tawaf until she is pure, then completes her Umrah.</p><h3>Common mistakes</h3><ul><li>Crossing the Miqat without Ihram.</li><li>Keeping the right shoulder uncovered for the whole Ihram — Idtiba is only a sunnah during Tawaf.</li><li>Doing Tawaf through Hateem.</li><li>Pushing at the Black Stone.</li><li>Clinging to a dua book for each circuit — no fixed dua per circuit is established; make any dua.</li></ul><p>How long does Umrah take? Usually 2–4 hours depending on crowds; late night and early morning are usually less crowded.</p><p><strong>For fiqh detail, ask a trusted scholar.</strong> This guide summarises the majority consensus.</p>` },
    bn: { title: 'ধাপে ধাপে উমরাহ', html: `<p>উমরাহর চারটি মূল কাজ: <strong>ইহরাম, তাওয়াফ</strong> কাবার চারপাশে (৭ চক্কর), <strong>সাঈ</strong> সাফা ও মারওয়ার মধ্যে (৭ চক্কর), তারপর মাথা মুণ্ডন বা চুল ছোট করা (<strong>হালক বা কসর</strong>)।</p><h3>১. ইহরাম</h3><p>মিকাত থেকে ইহরাম বাঁধুন — গোসল করুন, ইহরামের আগে সুগন্ধি লাগান, আর নিয়ত করুন: "লাব্বাইকা আল্লাহুম্মা উমরাতান"। পুরুষরা দুটি সাদা কাপড় (ইজার ও রিদা) পরবেন। তারপর পথে তালবিয়াহ পড়তে থাকুন: "লাব্বাইকা আল্লাহুম্মা লাব্বাইক, লাব্বাইকা লা শারীকা লাকা লাব্বাইক, ইন্নাল হামদা ওয়ান-নি'মাতা লাকা ওয়াল মুলক, লা শারীকা লাক।"</p><h3>মিকাত — কোথা থেকে ইহরাম বাঁধবেন</h3><p>এটি আপনার রুটের ওপর নির্ভর করে, শুধু দেশের ওপর নয়। মিকাতের সীমানার ভেতরে যারা আছেন তারা নিজের জায়গা থেকে ইহরাম বাঁধবেন; মক্কার বাসিন্দারা তান'ইমের মতো হিল এলাকা থেকে বাঁধবেন।</p><ul><li><strong>জুল-হুলায়ফা</strong> (আবইয়ার আলি) — মদিনার জন্য</li><li><strong>জুহফা</strong> (রাবিগ) — মিশর, শাম ও মাগরিবের জন্য</li><li><strong>কারন আল-মানাজিল</strong> (আস-সায়ল আল-কাবির) — নজদ ও তায়েফের জন্য</li><li><strong>ইয়ালামলাম</strong> (আস-সা'দিয়াহ) — ইয়েমেনের জন্য</li><li><strong>জাত ইরক</strong> (আদ-দারিবা) — ইরাকের জন্য</li></ul><p>বিমানে: মিকাত পার হওয়ার সময় আকাশে নিয়ত করুন (ক্রু সাধারণত ঘোষণা দেন)। পুরুষরা উড়ানের আগেই ইহরামের পোশাক পরে নেবেন।</p><h3>ইহরামের নিষেধাজ্ঞা</h3><p>নিয়ত থেকে হালক/কসর পর্যন্ত: চুল বা নখ কাটা যাবে না; ইহরামের পর শরীরে বা কাপড়ে সুগন্ধি নয়; পুরুষদের মাথা ঢাকা যাবে না; পুরুষদের সেলাই করা পোশাক (শার্ট, প্যান্ট) নয়; স্থলের প্রাণী শিকার নয়; বিয়ে বা সহবাস নয়। নারীরা নিকাব ও দস্তানা ছাড়া যেকোনো শালীন পোশাক পরতে পারেন।</p><h3>২. তাওয়াফ</h3><p>হাজরে আসওয়াদ থেকে শুরু করুন, কাবা আপনার বামে রেখে, ৭ চক্কর পূর্ণ করুন। তাওয়াফ শুরু হলে তালবিয়াহ বন্ধ করুন। সহজ হলে হাজরে আসওয়াদ স্পর্শ করুন; না হলে তার দিকে ইশারা করে "আল্লাহু আকবার" বলুন, ধাক্কা না দিয়ে। হাতীমের (হিজর ইসমাঈল) বাইরে দিয়ে যান — এটি কাবার অংশ, এর ভেতর দিয়ে চক্কর গণ্য হয় না। অধিকাংশ আলেম পবিত্রতা শর্ত করেন, তাই আগে ওজু করুন। তারপর সম্ভব হলে মাকামে ইবরাহীমের পেছনে ২ রাকাত নামাজ পড়ুন, না হলে মসজিদের যেকোনো জায়গায়, আর জমজম পান করুন।</p><h3>৩. সাঈ</h3><p>সাফা থেকে শুরু করে মারওয়ায় শেষ করুন — ৭ চক্কর (সাফা থেকে মারওয়া এক চক্কর)। সাফায় পড়ুন: "ইন্নাস-সাফা ওয়াল-মারওয়াতা মিন শা'আইরিল্লাহ"। উঠুন, কাবার দিকে মুখ করুন, তাকবির বলুন ও দুআ করুন। পুরুষরা দুটি সবুজ চিহ্নের মাঝে দ্রুত হাঁটবেন। গণনায় সন্দেহ হলে কম সংখ্যাটি ধরুন।</p><h3>৪. হালক / কসর</h3><p>পুরুষরা মাথা মুণ্ডন (হালক, উত্তম) বা চুল ছোট (কসর) করবেন। নারীরা চুলের আগা থেকে আঙুলের এক গিঁট পরিমাণ কাটবেন — মুণ্ডন করবেন না।</p><h3>নারীদের উমরাহ</h3><p>সাধারণ শালীন পোশাক, কোনো নির্দিষ্ট রং দরকার নেই; রমল বা ইদতিবা নেই; মুণ্ডনের বদলে চুল ছোট করবেন। ঋতুমতী বা প্রসূতি নারী মিকাত থেকে ইহরাম বাঁধবেন এবং পবিত্র না হওয়া পর্যন্ত তাওয়াফ ছাড়া সবকিছু করবেন, তারপর উমরাহ পূর্ণ করবেন।</p><h3>সাধারণ ভুল</h3><ul><li>ইহরাম ছাড়া মিকাত পার হওয়া।</li><li>পুরো ইহরাম জুড়ে ডান কাঁধ খোলা রাখা — ইদতিবা শুধু তাওয়াফের সময় সুন্নত।</li><li>হাতীমের ভেতর দিয়ে তাওয়াফ করা।</li><li>হাজরে আসওয়াদে ধাক্কা দেওয়া।</li><li>প্রতি চক্করের জন্য দুআর বই ধরে থাকা — প্রতি চক্করে নির্দিষ্ট দুআ প্রমাণিত নয়; যেকোনো দুআ করুন।</li></ul><p>উমরাহ করতে কতক্ষণ লাগে? সাধারণত ২–৪ ঘণ্টা, ভিড়ের ওপর নির্ভর করে; গভীর রাত ও ভোরে সাধারণত ভিড় কম থাকে।</p><p><strong>ফিকহি বিস্তারিত জানতে বিশ্বস্ত আলেমের কাছে জিজ্ঞেস করুন।</strong> এই গাইড সংখ্যাগরিষ্ঠ মতের সারাংশ।</p>` },
    ar: { title: 'العمرة خطوة بخطوة', html: `<p>للعمرة أربعة أعمال رئيسية: <strong>الإحرام، والطواف</strong> حول الكعبة (7 أشواط)، <strong>والسعي</strong> بين الصفا والمروة (7 أشواط)، ثم حلق الرأس أو تقصير الشعر (<strong>الحلق أو القصر</strong>).</p><h3>1. الإحرام</h3><p>أحرم من الميقات — اغتسل، وتطيّب قبل الإحرام، وانْوِ: "لبيك اللهم عمرة". ويلبس الرجال ثوبين أبيضين (الإزار والرداء). ثم واصل التلبية في الطريق: "لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك".</p><h3>المواقيت — من أين تُحرم</h3><p>يعتمد ذلك على طريقك، لا على بلدك فقط. ومن كان داخل حدود الميقات يُحرم من مكانه؛ وأهل مكة يُحرمون من منطقة الحل مثل التنعيم.</p><ul><li><strong>ذو الحليفة</strong> (أبيار علي) — لأهل المدينة</li><li><strong>الجحفة</strong> (رابغ) — لأهل مصر والشام والمغرب</li><li><strong>قرن المنازل</strong> (السيل الكبير) — لأهل نجد والطائف</li><li><strong>يلملم</strong> (السعدية) — لأهل اليمن</li><li><strong>ذات عرق</strong> (الضريبة) — لأهل العراق</li></ul><p>بالطائرة: انْوِ في الجو عند محاذاة الميقات (وعادة ما يعلن الطاقم ذلك). وعلى الرجال لبس ملابس الإحرام قبل الطيران.</p><h3>محظورات الإحرام</h3><p>من النية حتى الحلق/القصر: لا قص للشعر أو الأظافر؛ ولا طيب على الجسم أو الثياب بعد الإحرام؛ ولا تغطية للرأس للرجال؛ ولا لبس مخيط للرجال (قميص، بنطال)؛ ولا صيد لحيوانات البر؛ ولا نكاح أو جماع. ويجوز للمرأة لبس أي ثياب ساترة إلا النقاب والقفازين.</p><h3>2. الطواف</h3><p>ابدأ من الحجر الأسود، والكعبة على يسارك، وأكمل 7 أشواط. وتوقف عن التلبية عند بدء الطواف. والمس الحجر الأسود إن تيسر؛ وإلا فأشر إليه وقل "الله أكبر" دون مزاحمة. وامشِ خارج الحطيم (حجر إسماعيل) — فهو جزء من الكعبة، والشوط من خلاله لا يُحتسب. ويشترط أكثر العلماء الطهارة، فتوضأ أولًا. ثم صلِّ ركعتين خلف مقام إبراهيم إن تيسر، وإلا في أي مكان في المسجد، واشرب من زمزم.</p><h3>3. السعي</h3><p>ابدأ من الصفا وانتهِ بالمروة — 7 أشواط (من الصفا إلى المروة شوط واحد). وعند الصفا اقرأ: "إن الصفا والمروة من شعائر الله". واصعد، واستقبل الكعبة، وكبّر وادعُ. ويمشي الرجال بسرعة بين العلمين الأخضرين. وإن شككت في العدد فخذ الأقل.</p><h3>4. الحلق / القصر</h3><p>يحلق الرجال (الحلق أفضل) أو يقصّرون شعرهم. وتقص المرأة من طرف شعرها مقدار أنملة — ولا تحلق.</p><h3>عمرة المرأة</h3><p>ثياب عادية ساترة، دون لون معين؛ ولا رمل ولا اضطباع؛ وتقصّر شعرها بدل الحلق. والحائض أو النفساء تُحرم من الميقات وتفعل كل شيء إلا الطواف حتى تطهر، ثم تكمل عمرتها.</p><h3>أخطاء شائعة</h3><ul><li>تجاوز الميقات دون إحرام.</li><li>كشف الكتف الأيمن طوال الإحرام — الاضطباع سنة أثناء الطواف فقط.</li><li>الطواف من خلال الحطيم.</li><li>المزاحمة عند الحجر الأسود.</li><li>التعلق بكتاب أدعية لكل شوط — لم يثبت دعاء معين لكل شوط؛ ادعُ بما شئت.</li></ul><p>كم تستغرق العمرة؟ عادة من ساعتين إلى 4 ساعات حسب الزحام؛ وآخر الليل وأول الصباح أقل ازدحامًا عادة.</p><p><strong>للتفاصيل الفقهية، اسأل عالمًا موثوقًا.</strong> هذا الدليل ملخص لرأي الجمهور.</p>` },
  },
  privacy: {
    en: { title: 'Privacy policy', html: `<p><strong>Who runs this site:</strong> an independent community tool for sharing Nusuk referral codes. No account is needed, and we never ask for your name or email to view codes.</p><p><strong>What is processed:</strong> the codes you submit, the time they were submitted, and whether they were reported as not working. A keyed hash of the submitter's network address is used only to prevent duplicate submissions — the real address is not kept in the code record. Cloudflare processes connection technical data to serve the site.</p><p><strong>What your browser stores:</strong> which codes you have tried, your own key, and your language choice — on your device only.</p><p><strong>Ads and cookies:</strong> this site shows no ads and sets no tracking cookies. The key cookie (mk_key) only remembers your own Nusuk key so you are not asked twice.</p>` },
    bn: { title: 'গোপনীয়তা নীতি', html: `<p><strong>এই সাইট কে চালায়:</strong> নুসুক রেফারেল কোড শেয়ার করার একটি স্বাধীন কমিউনিটি টুল। কোনো অ্যাকাউন্ট দরকার নেই, আর কোড দেখতে আমরা কখনো আপনার নাম বা ইমেইল চাই না।</p><p><strong>কী প্রক্রিয়া করা হয়:</strong> আপনি যে কোড জমা দেন, জমা দেওয়ার সময়, এবং তা কাজ না করছে বলে জানানো হয়েছে কি না। ডুপ্লিকেট জমা ঠেকাতে জমাদানকারীর নেটওয়ার্ক ঠিকানার একটি হ্যাশ ব্যবহার করা হয় — আসল ঠিকানা কোডের রেকর্ডে রাখা হয় না। Cloudflare সাইট পরিবেশনের জন্য সংযোগের প্রযুক্তিগত তথ্য প্রক্রিয়া করে।</p><p><strong>আপনার ব্রাউজার কী সংরক্ষণ করে:</strong> কোন কোড চেষ্টা করেছেন, আপনার নিজের কী, আর ভাষার পছন্দ — শুধু আপনার ডিভাইসে।</p><p><strong>বিজ্ঞাপন ও কুকি:</strong> এই সাইটে কোনো বিজ্ঞাপন নেই, কোনো ট্র্যাকিং কুকি নেই। কী কুকি (mk_key) শুধু আপনার নিজের নুসুক কী মনে রাখে, যাতে দুবার জিজ্ঞেস না করতে হয়।</p>` },
    ar: { title: 'سياسة الخصوصية', html: `<p><strong>من يدير هذا الموقع:</strong> أداة مجتمع مستقلة لمشاركة أكواد إحالة نسك. لا حاجة إلى حساب، ولا نطلب اسمك أو بريدك لعرض الأكواد.</p><p><strong>ما الذي يُعالج:</strong> الأكواد التي ترسلها، ووقت إرسالها، وما إذا أُبلغ عنها بأنها لا تعمل. ويُستخدم تجزئة مفتاحية لعنوان الشبكة الخاص بالمرسل لمنع الإرسال المكرر فقط — ولا يُحفظ العنوان الحقيقي في سجل الكود. وتعالج Cloudflare بيانات الاتصال التقنية لتقديم الموقع.</p><p><strong>ما الذي يخزنه متصفحك:</strong> الأكواد التي جربتها، ومفتاحك الخاص، واختيار لغتك — على جهازك فقط.</p><p><strong>الإعلانات وملفات تعريف الارتباط:</strong> لا يعرض هذا الموقع إعلانات ولا يضع ملفات تعريف ارتباط للتتبع. وملف تعريف الارتباط الخاص بالمفتاح (mk_key) يتذكر مفتاح نسك الخاص بك فقط حتى لا يُطلب منك مرتين.</p>` },
  },
  terms: {
    en: { title: 'Terms of use', html: `<p>Using this site means you agree to these terms. It is an independent community page for viewing, copying, opening and sharing Nusuk referral codes. It is not affiliated with or endorsed by Nusuk, the Ministry of Hajj and Umrah, or any government body.</p><p><strong>No guarantee:</strong> there is no guarantee that any code is valid, active or accepted by the Nusuk app, nor that any prize will be won. Codes are shared by users.</p><p>Submit only codes you have the right to share. Do not put personal or secret information in the form. Submissions may be reviewed, rejected or removed; publication is not guaranteed. Do not submit fake or misleading codes, do not disrupt the service, and do not bypass the submission limits.</p><p>Links on this site may open the Nusuk app; the app is under its own terms. These terms may be updated; the current version is the one shown here.</p>` },
    bn: { title: 'ব্যবহারের শর্তাবলি', html: `<p>এই সাইট ব্যবহার করলে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন। এটি নুসুক রেফারেল কোড দেখা, কপি করা, খোলা ও শেয়ার করার একটি স্বাধীন কমিউনিটি পাতা। এটি নুসুক, হজ ও উমরাহ মন্ত্রণালয়, বা কোনো সরকারি সংস্থার সঙ্গে সম্পর্কিত বা তাদের অনুমোদিত নয়।</p><p><strong>কোনো নিশ্চয়তা নেই:</strong> কোনো কোড বৈধ, সক্রিয়, বা নুসুক অ্যাপে গৃহীত হবে, অথবা কোনো পুরস্কার জেতা যাবে — এর কোনো নিশ্চয়তা নেই। কোডগুলো ব্যবহারকারীদের শেয়ার করা।</p><p>শুধু সেই কোড জমা দিন যা শেয়ার করার অধিকার আপনার আছে। ফর্মে ব্যক্তিগত বা গোপন তথ্য দেবেন না। জমা পর্যালোচনা, প্রত্যাখ্যান বা সরানো হতে পারে; প্রকাশের নিশ্চয়তা নেই। ভুয়া বা বিভ্রান্তিকর কোড দেবেন না, সার্ভিসে ব্যাঘাত ঘটাবেন না, জমার সীমা এড়াবেন না।</p><p>এই সাইটের লিংক নুসুক অ্যাপ খুলতে পারে; অ্যাপ তার নিজের শর্তে চলে। এই শর্তাবলি আপডেট হতে পারে; এখানে দেখানো সংস্করণই বর্তমান।</p>` },
    ar: { title: 'شروط الاستخدام', html: `<p>استخدامك هذا الموقع يعني موافقتك على هذه الشروط. وهو صفحة مجتمع مستقلة لعرض أكواد إحالة نسك ونسخها وفتحها ومشاركتها. وهو غير تابع لنسك أو وزارة الحج والعمرة أو أي جهة حكومية، وغير معتمد منها.</p><p><strong>لا ضمان:</strong> لا ضمان بأن أي كود صالح أو نشط أو مقبول في تطبيق نسك، ولا بأن تُربح أي جائزة. الأكواد يشاركها المستخدمون.</p><p>أرسل فقط الأكواد التي يحق لك مشاركتها. ولا تضع معلومات شخصية أو سرية في النموذج. وقد تُراجع الإرسالات أو تُرفض أو تُزال؛ والنشر غير مضمون. ولا ترسل أكوادًا مزيفة أو مضللة، ولا تعطل الخدمة، ولا تتجاوز حدود الإرسال.</p><p>قد تفتح روابط هذا الموقع تطبيق نسك؛ والتطبيق يخضع لشروطه الخاصة. وقد تُحدَّث هذه الشروط؛ والنسخة المعروضة هنا هي الحالية.</p>` },
  },
  developers: {
    en: { title: 'Developers — open data', html: `<p>Our code list is open data for any website or community. No registration or key is needed.</p><ul><li><code>codes.json</code> — all codes (code, id, rid), newest first.</li><li><code>codes-head.json</code> — the first 400 codes, a small file for a quick start.</li></ul><p>Example (JavaScript):</p><pre>const res = await fetch('https://nusukkeys-cu9.pages.dev/codes.json');
const data = await res.json();
console.log(data.codes.length, data.codes[0]);</pre><p><strong>Fair use:</strong> fetch each file at most once every 15 minutes and cache it. Codes are added by users — there is no guarantee of validity in Nusuk.</p>` },
    bn: { title: 'ডেভেলপারদের জন্য — উন্মুক্ত তথ্য', html: `<p>আমাদের কোডের তালিকা যেকোনো ওয়েবসাইট বা কমিউনিটির জন্য উন্মুক্ত তথ্য। কোনো রেজিস্ট্রেশন বা কী দরকার নেই।</p><ul><li><code>codes.json</code> — সব কোড (code, id, rid), নতুন আগে।</li><li><code>codes-head.json</code> — প্রথম ৪০০ কোড, দ্রুত শুরু করার জন্য ছোট ফাইল।</li></ul><p>উদাহরণ (JavaScript):</p><pre>const res = await fetch('https://nusukkeys-cu9.pages.dev/codes.json');
const data = await res.json();
console.log(data.codes.length, data.codes[0]);</pre><p><strong>ন্যায্য ব্যবহার:</strong> প্রতিটি ফাইল ১৫ মিনিটে সর্বোচ্চ একবার নিন আর ক্যাশ করুন। কোডগুলো ব্যবহারকারীদের দেওয়া — নুসুকে বৈধতার কোনো নিশ্চয়তা নেই।</p>` },
    ar: { title: 'للمطورين — بيانات مفتوحة', html: `<p>قائمة الأكواد لدينا بيانات مفتوحة لأي موقع أو مجتمع. لا حاجة إلى تسجيل أو مفتاح.</p><ul><li><code>codes.json</code> — كل الأكواد (code, id, rid)، الأحدث أولًا.</li><li><code>codes-head.json</code> — أول 400 كود، ملف صغير لبداية سريعة.</li></ul><p>مثال (JavaScript):</p><pre>const res = await fetch('https://nusukkeys-cu9.pages.dev/codes.json');
const data = await res.json();
console.log(data.codes.length, data.codes[0]);</pre><p><strong>الاستخدام العادل:</strong> اجلب كل ملف مرة واحدة كل 15 دقيقة على الأكثر وخزّنه. الأكواد يضيفها المستخدمون — ولا ضمان لصحتها في نسك.</p>` },
  },
};

function renderFixes() {
  const el = $('fix-list');
  if (!el) return;
  const items = FIXES_I18N[state.lang] || FIXES_I18N.en;
  el.innerHTML = items.map(([q, a], i) =>
    `<details id="fix-q${i + 1}"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
}

function renderSections() {
  for (const [key, mount] of Object.entries({ findCode: 'sec-find-code', competition: 'sec-competition', umrah: 'sec-umrah', privacy: 'sec-privacy', terms: 'sec-terms', developers: 'sec-developers' })) {
    const el = $(mount);
    if (!el) continue;
    const sec = (SECTIONS_I18N[key] || {})[state.lang] || SECTIONS_I18N[key].en;
    el.innerHTML = `<h2>${esc(sec.title)}</h2>${sec.html}`;
  }
  // The Umrah heading is also the expandable button (the section's
  // <summary>), so it shows the section title in the visitor's
  // language too.
  const umrahTitle = $('umrah-summary-title');
  if (umrahTitle) umrahTitle.textContent = ((SECTIONS_I18N.umrah || {})[state.lang] || SECTIONS_I18N.umrah.en).title;
}

// Umrah packing checklist — categories + items, English, Bengali,
// Arabic; other languages show English (see renderChecklist).
const CHECKLIST_I18N = {
  en: [
    ['Documents & apps', ['Valid passport + Umrah-suitable visa', 'Umrah permit from the Nusuk app, saved on the phone', 'Flight & stay bookings, printed or as photos', 'Bank card + a little cash', 'Update and log in to the Nusuk app before travel']],
    ['Ihram clothes', ['Men: two white cloths — Izar and Rida (one spare set is better)', 'Belt for the Izar, or a pouch for money and documents', 'Comfortable open sandals', 'Women: loose, modest, comfortable clothes', 'Tip: practise wearing Izar and Rida at home first; choose cotton that absorbs sweat — Makkah is hot most of the year']],
    ['Health & comfort', ['Regular medicines + prescriptions', 'Fragrance-free anti-chafing cream — fragrance is forbidden after Ihram', 'Refillable water bottle', 'Masks and hand sanitiser', 'Power bank']],
    ['On your phone', ['Nusuk app + Umrah permit', 'Offline map of Masjid al-Haram', 'Accommodation and companions’ contact numbers', 'The Umrah-steps guide and your favourite duas']],
    ['For elderly / people needing care', ['Stick or folding wheelchair, if needed', 'Written medicine schedule', 'A card in the pocket with their name and a companion’s phone number', 'Plan Tawaf and Sa’i at less crowded times']],
    ['Pre-trip advice', ['Review the Umrah steps', 'Memorise the Talbiyah', 'Know which Miqat you will pass', 'Air passengers enter Ihram as they pass the Miqat, so men should wear Ihram clothes before flying']],
  ],
  bn: [
    ['কাগজপত্র ও অ্যাপ', ['বৈধ পাসপোর্ট + উমরাহ উপযোগী ভিসা', 'নুসুক অ্যাপ থেকে উমরাহ পারমিট, ফোনে সেভ করা', 'ফ্লাইট ও থাকার বুকিং, প্রিন্ট বা ছবি হিসেবে', 'ব্যাংক কার্ড + কিছু নগদ টাকা', 'ভ্রমণের আগে নুসুক অ্যাপ আপডেট করে লগইন করুন']],
    ['ইহরামের পোশাক', ['পুরুষ: দুটি সাদা কাপড় — ইজার ও রিদা (এক সেট বাড়তি ভালো)', 'ইজারের জন্য বেল্ট, অথবা টাকা ও কাগজপত্রের থলি', 'আরামদায়ক খোলা স্যান্ডেল', 'নারী: ঢিলেঢালা, শালীন, আরামদায়ক পোশাক', 'টিপস: বাড়িতে আগে ইজার ও রিদা পরার অভ্যাস করুন; ঘাম শোষে এমন সুতি কাপড় নিন — মক্কা বছরের বেশিরভাগ সময় গরম থাকে']],
    ['স্বাস্থ্য ও আরাম', ['নিয়মিত ওষুধ + প্রেসক্রিপশন', 'সুগন্ধিমুক্ত অ্যান্টি-চ্যাফিং ক্রিম — ইহরামের পর সুগন্ধি নিষিদ্ধ', 'রিফিল করার মতো পানির বোতল', 'মাস্ক ও হ্যান্ড স্যানিটাইজার', 'পাওয়ার ব্যাংক']],
    ['ফোনে', ['নুসুক অ্যাপ + উমরাহ পারমিট', 'মসজিদ আল-হারামের অফলাইন মানচিত্র', 'থাকার জায়গা ও সঙ্গীদের ফোন নম্বর', 'উমরাহ ধাপের গাইড ও আপনার প্রিয় দুআ']],
    ['বয়স্ক / যত্ন প্রয়োজন এমনদের জন্য', ['প্রয়োজনে লাঠি বা ভাঁজ করা হুইলচেয়ার', 'ওষুধের লিখিত সময়সূচি', 'পকেটে একটি কার্ড — নাম ও সঙ্গীর ফোন নম্বরসহ', 'কম ভিড়ের সময়ে তাওয়াফ ও সাঈ করার পরিকল্পনা']],
    ['ভ্রমণের আগে', ['উমরাহর ধাপগুলো দেখে নিন', 'তালবিয়াহ মুখস্থ করুন', 'কোন মিকাত পার হবেন জেনে নিন', 'বিমানযাত্রীরা মিকাত পার হওয়ার সময় ইহরাম বাঁধেন, তাই পুরুষরা উড়ানের আগেই ইহরামের পোশাক পরবেন']],
  ],
  ar: [
    ['الوثائق والتطبيقات', ['جواز سفر سارٍ + تأشيرة مناسبة للعمرة', 'تصريح العمرة من تطبيق نسك، محفوظ على الهاتف', 'حجوزات الطيران والإقامة، مطبوعة أو كصور', 'بطاقة بنكية + بعض النقود', 'حدّث تطبيق نسك وسجّل الدخول قبل السفر']],
    ['ملابس الإحرام', ['للرجال: ثوبان أبيضان — الإزار والرداء (طقم احتياطي أفضل)', 'حزام للإزار، أو حقيبة للمال والوثائق', 'صندل مريح مفتوح', 'للنساء: ثياب فضفاضة ساترة مريحة', 'نصيحة: تدرّب على لبس الإزار والرداء في البيت أولًا؛ واختر القطن الذي يمتص العرق — فمكة حارة معظم السنة']],
    ['الصحة والراحة', ['الأدوية المعتادة + الوصفات', 'كريم مضاد للاحتكاك بلا رائحة — العطر محرم بعد الإحرام', 'قارورة ماء قابلة لإعادة التعبئة', 'كمامات ومعقم يدين', 'بنك طاقة']],
    ['على هاتفك', ['تطبيق نسك + تصريح العمرة', 'خريطة المسجد الحرام دون اتصال', 'أرقام الإقامة والمرافقين', 'دليل خطوات العمرة وأدعيتك المفضلة']],
    ['لكبار السن / من يحتاجون رعاية', ['عصا أو كرسي متحرك قابل للطي، عند الحاجة', 'جدول أدوية مكتوب', 'بطاقة في الجيب فيها الاسم ورقم هاتف المرافق', 'خطط للطواف والسعي في أوقات أقل ازدحامًا']],
    ['قبل السفر', ['راجع خطوات العمرة', 'احفظ التلبية', 'اعرف أي ميقات ستمر به', 'مسافرو الطيران يُحرمون عند محاذاة الميقات، فعلى الرجال لبس ملابس الإحرام قبل الطيران']],
  ],
};
const CHECKLIST_FAQ_I18N = {
  en: 'Questions: Can a muhrim wear a watch, belt or glasses? Yes, most scholars say it is allowed. Moisturiser or soap? Allowed if fragrance-free; avoid scented products after the intention of Ihram. Vaccines before Umrah? Check the vaccine requirements announced by Saudi Arabia and your country’s health authority at the time of travel — they change by season.',
  bn: 'প্রশ্ন: মুহরিম কি ঘড়ি, বেল্ট বা চশমা পরতে পারেন? হ্যাঁ, অধিকাংশ আলেম বলেন জায়েজ। ময়েশ্চারাইজার বা সাবান? সুগন্ধিমুক্ত হলে জায়েজ; ইহরামের নিয়তের পর সুগন্ধিযুক্ত পণ্য এড়িয়ে চলুন। উমরাহর আগে টিকা? ভ্রমণের সময় সৌদি আরব ও আপনার দেশের স্বাস্থ্য কর্তৃপক্ষের ঘোষিত টিকার প্রয়োজনীয়তা দেখুন — মৌসুম অনুযায়ী বদলায়।',
  ar: 'أسئلة: هل يجوز للمحرم لبس الساعة أو الحزام أو النظارة؟ نعم، يقول أكثر العلماء إنه جائز. والمرطب أو الصابون؟ جائز إن كان بلا رائحة؛ وتجنب المنتجات المعطرة بعد نية الإحرام. واللقاحات قبل العمرة؟ تحقق من متطلبات اللقاحات التي تعلنها السعودية والجهة الصحية في بلدك وقت السفر — فهي تتغير حسب الموسم.',
};

function loadChecklist() {
  try { return JSON.parse(localStorage.getItem('mk_checklist_v1') || '{}') || {}; } catch { return {}; }
}
function saveChecklist(m) {
  try { localStorage.setItem('mk_checklist_v1', JSON.stringify(m)); } catch {}
}

function renderChecklist() {
  const el = $('checklist-list');
  if (!el) return;
  const data = CHECKLIST_I18N[state.lang] || CHECKLIST_I18N.en;
  const saved = loadChecklist();
  el.innerHTML = data.map((cat, ci) =>
    `<div class="check-cat"><h3>${esc(cat[0])}</h3><ul>` +
    cat[1].map((item, ii) => {
      const id = ci + '-' + ii;
      return `<li><label><input type="checkbox" data-check="${id}"${saved[id] ? ' checked' : ''}> <span>${esc(item)}</span></label></li>`;
    }).join('') + '</ul></div>').join('') +
    `<p class="hint">${esc(CHECKLIST_FAQ_I18N[state.lang] || CHECKLIST_FAQ_I18N.en)}</p>`;
  updateChecklistProgress();
}

function updateChecklistProgress() {
  const data = CHECKLIST_I18N[state.lang] || CHECKLIST_I18N.en;
  const total = data.reduce((a, c) => a + c[1].length, 0);
  const saved = loadChecklist();
  const done = Object.keys(saved).filter((k) => saved[k]).length;
  const el = $('checklist-progress');
  if (el) el.textContent = t('checklistProgress')(done, total);
}

// "Find your code" tool: paste an invite link or message, get the
// NG- code out of it (same extraction as the gate). "Is my code on
// the list?" checker: up to 10 codes, checked against the static
// code list already loaded in the browser.
function bindTools() {
  const findBtn = $('tool-find-btn');
  if (findBtn) findBtn.addEventListener('click', () => {
    const raw = $('tool-find-input').value || '';
    const code = normalizeKey(raw);
    const res = $('tool-find-result');
    if (!code) { res.textContent = t('toolFindNone'); res.classList.remove('hidden'); return; }
    res.innerHTML = `<code>${esc(code)}</code> <button type="button" class="btn-soft" id="tool-find-copy">${esc(t('copy'))}</button>`;
    res.classList.remove('hidden');
    $('tool-find-copy').addEventListener('click', () => { copyText(code); toast(t('toastCopied')(code)); });
  });
  const checkBtn = $('tool-check-btn');
  if (checkBtn) checkBtn.addEventListener('click', () => {
    const raw = $('tool-check-input').value || '';
    const found = [...new Set((raw.match(/NG-[A-Za-z0-9]{8}/gi) || []).map((c) => 'NG-' + c.slice(3)))].slice(0, 10);
    const res = $('tool-check-result');
    if (!found.length) { res.textContent = t('err').invalid_code; res.classList.remove('hidden'); return; }
    if (!state.codes.loaded) { res.textContent = t('toolCheckNotLoaded'); res.classList.remove('hidden'); return; }
    const pool = new Set(state.codes.all.map((c) => c.code.toUpperCase()));
    res.innerHTML = found.map((c) => {
      const on = pool.has(c.toUpperCase());
      return `<div class="check-row ${on ? 'on' : ''}"><code>${esc(c)}</code> <span>${esc(on ? t('toolCheckOn') : t('toolCheckOff'))}</span></div>`;
    }).join('') + `<p class="hint">${esc(t('toolCheckNote'))}</p>`;
    res.classList.remove('hidden');
  });
}

// "My copied codes": every code this user copied, with a Problem
// button per code (Already used / Doesn't work) that reports it
// through the same endpoint as the copied strip.
function renderMyCodes() {
  const el = $('my-codes-list');
  if (!el) return;
  const ids = [...new Set([...state.codes.usedIds, ...loadLocalUsed()])];
  const rows = ids.map((id) => state.codes.byId.get(id)).filter(Boolean);
  if (!rows.length) {
    el.innerHTML = `<p class="hint">${esc(t('myCodesEmpty'))}</p>`;
    return;
  }
  el.innerHTML = rows.map((c) => {
    const code = esc(c.code);
    return `<div class="my-code" data-id="${esc(c.id)}"><code>${code}</code>` +
      `<button type="button" class="btn-soft my-copy" data-code="${code}">${esc(t('copy'))}</button>` +
      `<button type="button" class="btn-soft my-problem">${esc(t('myCodesProblem'))}</button>` +
      `<span class="my-reasons hidden"><button type="button" class="btn-soft" data-reason="already_used">${esc(t('alreadyUsed'))}</button>` +
      `<button type="button" class="btn-soft" data-reason="invalid">${esc(t('doesntWork'))}</button></span></div>`;
  }).join('');
  el.querySelectorAll('.my-copy').forEach((b) => b.addEventListener('click', () => {
    copyText(b.dataset.code);
    toast(t('toastCopied')(b.dataset.code));
  }));
  el.querySelectorAll('.my-problem').forEach((b) => b.addEventListener('click', () => {
    b.nextElementSibling.classList.toggle('hidden');
  }));
  el.querySelectorAll('.my-reasons button').forEach((b) => b.addEventListener('click', async () => {
    const row = b.closest('.my-code');
    const id = row.dataset.id;
    const d = await api('report', { id, reason: b.dataset.reason });
    if (d.ok) {
      toast(t('toastBad'));
      row.remove();
      state.codes.usedIds.add(id);
      saveLocalUsed();
      refreshQueue();
      renderMyCodes();
    }
  }));
}

function renderFaq() {
  const list = $('faq-list');
  if (!list) return;
  const faqs = FAQ_I18N[state.lang] || FAQ_I18N.en;
  const guides = GUIDES_I18N[state.lang] || GUIDES_I18N.en;
  list.innerHTML = faqs.map(([q, a], i) =>
    `<details id="faq-q${i + 1}"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  $('guides-list').innerHTML = guides.map(([g, d]) =>
    `<li><b>${esc(g)}</b>${esc(d)}</li>`).join('');
}

// Mandatory first code: every new user is shown this code first.
// It already exists in the repository (id nk-12256) — reused, never
// duplicated. Once a user copies/reports it, the one-time-per-user
// rule hides it from them like any other code.
const FIRST_CODE = 'NG-0GjkSPjM';
const FIRST_CODE_ID = 'nk-12256';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Number(n || 0).toLocaleString('en');
// Historical baseline from the PREVIOUS NusukKeys website (lost
// 2026-11-06; this site is its rebuild). Same numbers as the
// backend constants: 55,000 visitors and about 100,000 copies from
// the old site. The live counts are added on top, so the totals
// count the old site's visitors and copies together with the new
// ones; the totals are shown as plain numbers.
const HISTORICAL_VISITORS = 55000;
const HISTORICAL_COPIES = 100000;

// ---------- Dua in place of the creator credit ----------
// The dua, in all 7 languages, with the creator's name inside it.
// Only the name links to the existing Facebook page; the rest of
// the text (including any case suffix or particle after the name,
// such as the Bengali কে or the Turkish ’a) is plain text. The
// name is found by its first occurrence in the text.
const CREDIT_DUA = {
  en: { name: 'Hasan Mahmud', text: 'O Allah, grant me, Hasan Mahmud, and every longing heart the joy of saying “Labbayk” at Your House and offering salām at Your Prophet’s Rawdah.' },
  bn: { name: 'হাসান মাহমুদ', text: 'হে আল্লাহ! আমাকে, হাসান মাহমুদকে এবং প্রতিটি আকুল হৃদয়কে তোমার ঘরে লাব্বাইক বলার এবং নবীর রওজায় সালাম পেশ করার সৌভাগ্য দাও।' },
  ar: { name: 'حسن محمود', text: 'اللهم ارزقني ولحسن محمود ولكل مشتاق لبيك عند بيتك وسلامًا في روضة نبيك ﷺ' },
  ur: { name: 'حسن محمود', text: 'اے اللہ! مجھے، حسن محمود کو اور ہر مشتاق دل کو اپنے گھر میں لبیک کہنے اور اپنے نبی ﷺ کے روضے پر سلام پیش کرنے کی سعادت عطا فرما۔' },
  id: { name: 'Hasan Mahmud', text: 'Ya Allah, karuniakanlah kepadaku, Hasan Mahmud, dan setiap hati yang merindukan kesempatan untuk mengucapkan “Labbaik” di Rumah-Mu dan menyampaikan salam di Raudhah Nabi-Mu ﷺ.' },
  tr: { name: 'Hasan Mahmud', text: 'Allah’ım! Bana, Hasan Mahmud’a ve özlemle bekleyen her gönle Beyt’inde “Lebbeyk” deme ve Peygamberinin Ravza’sında selam verme nasip eyle.' },
  hi: { name: 'हसन महमूद', text: 'ऐ अल्लाह! मुझे, हसन महमूद को और हर तड़पते दिल को अपने घर में “लब्बैक” कहने और अपने नबी ﷺ के रौज़े पर सलाम पेश करने की सौभाग्यपूर्ण घड़ी अता फ़रमा।' },
};

function renderCredit() {
  const el = $('credit-dua');
  if (!el) return;
  const d = CREDIT_DUA[state.lang] || CREDIT_DUA.en;
  const i = d.text.indexOf(d.name);
  if (i < 0) { el.textContent = d.text; return; }
  el.innerHTML = `${esc(d.text.slice(0, i))}<a href="https://www.facebook.com/hasan.m1a" target="_blank" rel="noopener">${esc(d.name)}</a>${esc(d.text.slice(i + d.name.length))}`;
}
function randStr(n, alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789') {
  let s = '';
  for (let i = 0; i < n; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
const COPY_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const state = {
  lang: localStorage.getItem('mk_lang') || 'en',
  key: null,
  me: { copied: 0, copied_today: 0, remaining: 0, total: 0, anon: false, mine: null },
  stats: {
    codes: 0,
    used_today: 0,
    // Local defaults already include the historical baseline, so the
    // first paint (before any server answer) shows the real totals.
    used_total: HISTORICAL_COPIES,
    used_new: 0,
    used_historical: HISTORICAL_COPIES,
    visitors_online: 1,
    visitors_total: HISTORICAL_VISITORS + 1,
    visitors_new: 1,
    visitors_historical: HISTORICAL_VISITORS,
    visitors_last_hour: 1,
    added_today: 0,
    user_added: 0,
    latest_code: null
  },
  queue: [],
  lastCopied: null,
  list: { filter: 'remaining', q: '', items: [], next: 0, hasMore: false, loading: false, seq: 0, pool: [] },
  // Static-first code data: the whole public code list is loaded once
  // from /codes.json (browser + edge cached) and filtered here, so the
  // code list never reads the database. `usedIds` is this user's used
  // set (from the session); `badIds` is codes reported dead by two
  // different users (from the session, excluded for everyone); `all`
  // is the static list plus the delta (codes shared after the seed).
  // When the static file cannot load, the frontend falls back to the
  // server queue/list endpoints.
  codes: { loaded: false, from: null, all: [], byId: new Map(), usedIds: new Set(), badIds: new Set(), maxRid: -1 }
};

const t = (k) => (I18N[state.lang] || I18N.en)[k] ?? I18N.en[k];

// ---------- API ----------
// A 401 here means the server does not know this key. That happens in
// the in-memory fallback (offline mode) because each Function isolate
// has its own memory — the identity lives in D1 in normal mode, but
// not in a fallback isolate. Showing the key gate for that would
// re-prompt the user after every copy, so only the session call (the
// one that establishes identity) may open the gate. Every other
// endpoint just returns the error; the frontend already applied the
// action locally, and the next page load re-establishes identity
// through the session.
async function api(path, payload = {}) {
  let res;
  try {
    // Slow is failing: if the host cannot answer a tiny JSON call in
    // 10s it is overloaded or dying, so the caller treats it exactly
    // like unreachable and the failover chain takes over — the page
    // never hangs on a dying host.
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 10000);
    try {
      res = await fetch('api/' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: state.key, fp: fingerprint(), ...payload }),
        signal: ctl.signal
      });
    } finally { clearTimeout(timer); }
  } catch {
    // Network unreachable (host down) — the caller decides what to do;
    // startSession turns this into the automatic failover redirect.
    return { ok: false, error: 'network' };
  }
  const data = await res.json().catch(() => ({ ok: false, error: 'server' }));
  if (res.status === 401 && path === 'session') showGate();
  return data;
}

function fingerprint() {
  try {
    return [screen.width, screen.height, devicePixelRatio, Intl.DateTimeFormat().resolvedOptions().timeZone].join('|');
  } catch {
    return '';
  }
}

// ---------- Identity (cookie + localStorage) ----------
function readCookie() {
  const m = document.cookie.match(/(?:^|;\s*)mk_key=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
function persistKey(key) {
  state.key = key;
  try { localStorage.setItem('mk_key', key); } catch {}
  document.cookie = `mk_key=${encodeURIComponent(key)}; path=/; max-age=31536000; SameSite=Lax`;
}
function forgetKey() {
  state.key = null;
  try { localStorage.removeItem('mk_key'); } catch {}
  document.cookie = 'mk_key=; path=/; max-age=0';
}
function normalizeKey(s) {
  const m = String(s || '').match(/NG-[A-Za-z0-9]{8}/i) || String(s || '').trim().match(/^()([A-Za-z0-9]{8})$/);
  if (!m) return null;
  return m[0].length === 8 ? 'NG-' + m[0] : 'NG-' + m[0].slice(3);
}

// ---------- UI helpers ----------
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  $('toasts').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .2s'; setTimeout(() => el.remove(), 220); }, 2200);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
  }
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch {}
  ta.remove();
  return ok;
}

function applyLang(lang) {
  state.lang = I18N[lang] ? lang : 'en';
  localStorage.setItem('mk_lang', state.lang);
  const d = I18N[state.lang];
  document.documentElement.lang = state.lang;
  document.documentElement.dir = d.dir;
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === state.lang));
  // Mobile language button shows the current language's short label.
  const short = { en: 'EN', bn: 'বাংলা', ar: 'عربي', ur: 'اردو', id: 'ID', tr: 'TR', hi: 'हिन्दी' };
  const cur = $('lang-current');
  if (cur) cur.textContent = short[state.lang] || 'EN';
  document.querySelectorAll('[data-i18n]').forEach((el) => { if (d[el.dataset.i18n]) el.textContent = d[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = d[el.dataset.i18nPh] || ''; });
  renderFaq();
  renderFixes();
  renderSections();
  renderChecklist();
  renderCredit();
  renderAll();
}

// ---------- Rendering ----------
function renderAll() {
  renderGuestWarning();
  renderMetrics();
  renderDispenser();
  renderGrid();
  updateNusukLink();
  renderMyCodes();
  $('hero-total').textContent = fmt(state.stats.codes || state.me.total);
  if (state.key) {
    $('acct-label').textContent = state.me.anon ? 'Guest (No Key)' : state.key;
    $('acct-dot').classList.toggle('warn', !!state.me.anon);
  }
}

function renderGuestWarning() {
  const showWarn = !state.key || !!state.me.anon;
  $('guest-alert').classList.toggle('hidden', !showWarn);
}

function renderMetrics() {
  const s = state.stats || {};
  // Show the true counts (no minimum fudge: a real 0 is honest, and
  // the backend now counts every visitor even while D1 reads are
  // exhausted, so these are accurate, not placeholders). The totals
  // are the server's combined numbers.
  $('m-visitors-total').textContent = fmt(s.visitors_total || 0);
  $('m-visitors-online').textContent = t('activeNow')(fmt(s.visitors_online || 0));

  // CODE COPY TIMES is personal: big = this user's total copied codes,
  // small = how many this user copied today. Never any global total.
  $('m-copies-total').textContent = fmt(state.me.copied || 0);
  $('m-copies-today').textContent = t('copiedToday')(fmt(state.me.copied_today || 0));

  // CODE COPY TIMES is now personal: how many codes THIS user copied
  // today. The global total is kept separately, in the subtitle.
  $('m-added-total').textContent = fmt(s.user_added || 0);
  const latestCode = s.latest_code?.code || null;
  $('m-added-sub').textContent = t('addedSub')(fmt(s.added_today || 0), latestCode);

  // TOTAL COPIES is global and honest: every copy by every user, all
  // time. It is the public popularity number, kept separate from the
  // personal CODE COPY TIMES above.
  $('m-total-copies').textContent = fmt(s.used_total || 0);
}

function renderDispenser() {
  const c = state.queue[0];
  const { copied, remaining, mine } = state.me;
  const done = copied + remaining > 0 ? Math.round((copied / (copied + remaining)) * 100) : 0;
  $('d-bar').style.width = done + '%';
  $('d-stats').innerHTML = t('stats')(fmt(copied), fmt(remaining), mine);
  $('btn-copy').disabled = !c;
  if (c) {
    $('d-code').innerHTML = `<span class="pre">NG-</span>${esc(c.code.slice(3))}`;
    const isNew = c.device_id && c.device_id !== 'community-import';
    const byParts = [];
    if (isNew) byParts.push('<span class="disp-pill">✨ NEW</span>');
    if (c.name) byParts.push(esc(t('by')(c.name)));
    $('d-by').innerHTML = byParts.join(' · ');
  } else {
    $('d-code').innerHTML = `<span class="pre">NG-</span>••••••••`;
    $('d-by').textContent = state.me.remaining === 0 && state.key ? t('allDone') : '';
  }
  if (state.lastCopied) {
    $('strip').classList.remove('hidden');
    $('strip-code').textContent = state.lastCopied.code;
  } else {
    $('strip').classList.add('hidden');
  }
  // nk-v21: last-tried + next-code strip above the code list.
  const ts = $('tried-strip');
  if (ts) {
    const next = state.queue[0];
    if (state.lastCopied && next && next.code !== state.lastCopied.code) {
      $('tried-last').textContent = state.lastCopied.code;
      $('tried-next').textContent = next.code;
      ts.classList.remove('hidden');
    } else {
      ts.classList.add('hidden');
    }
  }
}

function renderGrid() {
  const L = state.list;
  const grid = $('grid');
  if (!L.items.length) {
    grid.innerHTML = `<div class="empty">${L.loading ? '…' : esc(t('none'))}</div>`;
  } else {
    grid.innerHTML = L.items
      .map((c) => {
        const isUserAdded = c.device_id && c.device_id !== 'community-import';
        const badge = isUserAdded ? `<span class="chip-meta new">NEW</span>` : '';
        // nk-v21: per-row "Open in browser" globe — the plain https
        // Nusuk link (same as umrahcodes' globe button). It is a real
        // link, a sibling of the copy button (not nested inside it),
        // so tapping it opens the code in the browser instead of copying.
        const web = NUSUK_WEB_LINK(c.code);
        return `<div class="chip-wrap"><button type="button" class="chip${c.used ? ' used' : ''}" data-id="${esc(c.id)}" data-code="${esc(c.code)}" dir="ltr">
          <span><span class="pre">NG-</span>${esc(c.code.slice(3))}</span>
          <span class="chip-right">${badge}${c.used ? CHECK_ICON : COPY_ICON}</span>
        </button><a class="chip-globe" href="${esc(web)}" target="_blank" rel="noopener" title="${esc(t('openBrowser'))}" aria-label="${esc(t('openBrowser'))} ${esc(c.code)}">\u{1F310}</a></div>`;
      })
      .join('');
  }
  const names = { remaining: t('fRemaining'), new: t('fNew'), used: t('fUsed'), all: t('fAll') };
  $('count').textContent = L.items.length ? t('shown')(L.items.length, (names[L.filter] || '').toLowerCase()) : '';
  $('btn-more').classList.toggle('hidden', !L.hasMore);
}

// ---------- Static code list (client-side filtering) ----------
// Compact code form (codes.json) -> frontend code object.
function fromCompact(o) {
  return {
    id: o.i, code: o.c, rid: o.r,
    device_id: o.d || 'community-import',
    name: o.n || '', copies: o.p || 0,
    used: 0
  };
}

// Is this code the user's own key? Never shown in their queue/list.
function isOwnCode(c) {
  return !!state.key && String(c.code).toLowerCase() === String(state.key).toLowerCase();
}

// Sort helper: the mandatory first code comes first, then rid order.
function firstFirst(a, b) {
  const af = String(a.code) === FIRST_CODE ? 0 : 1;
  const bf = String(b.code) === FIRST_CODE ? 0 : 1;
  if (af !== bf) return af - bf;
  return (Number(a.rid) || 0) - (Number(b.rid) || 0);
}

// All codes this user has not used, mandatory first code first.
// Codes reported dead (badIds) are excluded for everyone — EXCEPT the
// mandatory first code: NG-0GjkSPjM must always be the first code a
// new user sees, even if two users reported it dead. The one-time
// rule still applies to it (a user who already used it never sees it
// again), and a user's own key is still never shown back to them.
function remainingCodes() {
  return state.codes.all
    .filter((c) => !state.codes.usedIds.has(c.id) && (!state.codes.badIds.has(c.id) || c.id === FIRST_CODE_ID) && !isOwnCode(c))
    .sort(firstFirst);
}

// Recompute the dispenser queue from the client-side list.
function refreshQueue() {
  state.queue = remainingCodes().slice(0, 40);
}

// Current list pool for the active filter + search, client-side.
// 'new' is rid descending; every other filter is rid ascending.
function listPool() {
  const { filter, q } = state.list;
  const needle = String(q || '').trim().toLowerCase().replace(/^ng-/, '');
  const used = state.codes.usedIds;
  let pool = state.codes.all;
  if (filter === 'used') pool = pool.filter((c) => used.has(c.id));
  // The mandatory first code is never excluded as dead (see
  // remainingCodes): a new user must always see NG-0GjkSPjM first.
  else if (filter === 'all') pool = pool.filter((c) => !state.codes.badIds.has(c.id) || c.id === FIRST_CODE_ID);
  else pool = pool.filter((c) => !used.has(c.id) && (!state.codes.badIds.has(c.id) || c.id === FIRST_CODE_ID) && !isOwnCode(c));
  if (needle) {
    pool = pool.filter((c) => {
      const code = String(c.code).toLowerCase();
      return code.includes(needle) || code.replace(/^ng-/, '').includes(needle);
    });
  }
  if (filter === 'new') return [...pool].sort((a, b) => b.rid - a.rid);
  if (filter === 'remaining') return [...pool].sort(firstFirst);
  return [...pool].sort((a, b) => a.rid - b.rid);
}

// ---------- Static code list: fast, multi-source, proactive ----------
// The code list is public data, so the page does not depend on one
// host for it. It tries, in order: this host's 17 KB head file (the
// first 400 codes — enough for the dispenser at once), the same head
// file on the two mirrors, then the full 618 KB list on each host.
// Each attempt has its own timeout, so a slow host is abandoned
// instead of hanging the page: slowness is treated as failure.
// Returns {data, isHead} or null when no source answered at all
// (then the caller falls back to the server queue/list endpoints).
const CODES_HOSTS = ['.', 'https://nusukkeys-cu9.pages.dev', 'https://nusukkeys-mirror.pages.dev', 'https://nusukkeys-backup.pages.dev', 'https://ausaimin10.github.io/nusukkeys-mirror', 'https://nusukkeys-mirror.netlify.app', 'https://nusukkeys-mirror.web.app', 'https://cdn.jsdelivr.net/gh/ausaimin10/nusukkeys-mirror@main'];
// The primary host holds the only database; static mirrors fetch their
// live visitor numbers from it (the API allows any origin).
const PRIMARY_ORIGIN = 'https://nusukkeys-cu9.pages.dev';
// Firebase Realtime DB presence (project nusukkeys-mirror): the
// realtime "active now" count. The browser writes its own timestamp
// here once a minute; the server counts the fresh entries. This is a
// separate service from Cloudflare, so it keeps working while the
// D1 write limit and the KV list quota are exhausted. The /presence
// node holds only a timestamp per visitor key — no personal data.
const FIREBASE_PRESENCE_URL = 'https://nusukkeys-mirror-default-rtdb.firebaseio.com/presence';
const FIREBASE_COUNTERS_URL = 'https://nusukkeys-mirror-default-rtdb.firebaseio.com/counters';
// Realtime totals, read straight from Firebase (no /api call needed):
// visitors_total = 55,000 + counters.visitors, used_total = 100,000
// + counters.copies. The counters are seeded from the last reliable
// server counts (D1: visitors 1,304, copies 14,686) and grow by atomic
// Firebase increments, so they move in real time even while the
// Cloudflare Function (405) and the D1 write limit are out.
async function loadFirebaseCounters() {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    const res = await fetch(FIREBASE_COUNTERS_URL + '.json', { signal: ctl.signal });
    clearTimeout(timer);
    if (!res.ok) return;
    const data = await res.json().catch(() => null);
    if (!data || typeof data !== 'object') return;
    if (!state.stats) state.stats = {};
    const v = Number(data.visitors) || 0;
    const c = Number(data.copies) || 0;
    // Take the max with the backend value, so a working backend can
    // only raise the totals, never lower them.
    state.stats.visitors_total = Math.max(Number(state.stats.visitors_total) || 0, HISTORICAL_VISITORS + v);
    state.stats.used_total = Math.max(Number(state.stats.used_total) || 0, HISTORICAL_COPIES + c);
    renderMetrics();
  } catch {}
}
// Atomically bump one Firebase counter by 1 (server-side increment,
// so concurrent visitors cannot lose a count). Fire-and-forget.
function bumpFirebaseCounter(name) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    fetch(FIREBASE_COUNTERS_URL + '/' + name + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ '.sv': { increment: 1 } }),
      signal: ctl.signal,
      keepalive: true,
    }).catch(() => {}).finally(() => clearTimeout(timer));
  } catch {}
}
async function fetchWithTimeout(url, ms) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { signal: ctl.signal }); }
  finally { clearTimeout(timer); }
}
async function tryCodesFile(host, file, ms) {
  try {
    const res = await fetchWithTimeout(host + '/' + file, ms);
    if (!res.ok) return null;
    const clone = res.clone();
    const data = await res.json();
    if (!data || !Array.isArray(data.codes)) return null;
    // Warm the service-worker cache with the same-origin copy, so the
    // site still opens with codes on a later visit even if this was
    // the very first visit (the worker may not have been controlling
    // the page yet when this fetch ran, so its own handler may never
    // have seen it). The key is relative so it works at a root and
    // under a subpath alike.
    if (host === '.' && 'caches' in window) {
      caches.open('nk-v37').then((c) => c.put(file, clone)).catch(() => {});
    }
    return data;
  } catch { return null; }
}
async function fetchCodesJson() {
  // Same-origin head first (the common case: one small request).
  // If it fails, try the other hosts' head files in parallel (one
  // 4s window, not one per host), then all hosts' full files in
  // parallel (one 8s window). Parallel on the failure path only, so
  // a healthy load never spams the mirrors.
  const selfHead = await tryCodesFile('', 'codes-head.json', 4000);
  if (selfHead) return { data: selfHead, isHead: true };
  const heads = await Promise.all(CODES_HOSTS.slice(1).map((h) => tryCodesFile(h, 'codes-head.json', 4000)));
  for (const data of heads) if (data) return { data, isHead: true };
  const fulls = await Promise.all(CODES_HOSTS.map((h) => tryCodesFile(h, 'codes.json', 8000)));
  for (const data of fulls) if (data) return { data, isHead: false };
  return null;
}
// Background upgrade: after the head file made the page usable, fetch
// the full list (same hosts, same order) so the code browser can
// search all 13,721 codes. Returns the full data or null.
async function fetchFullCodesJson() {
  const self = await tryCodesFile('', 'codes.json', 8000);
  if (self) return self;
  const fulls = await Promise.all(CODES_HOSTS.slice(1).map((h) => tryCodesFile(h, 'codes.json', 8000)));
  for (const data of fulls) if (data) return data;
  return null;
}

// Merge the static list with the session delta (codes shared after
// the seed). Returns true when the static list is available.
function applyCodes(data, delta) {
  if (!data || !Array.isArray(data.codes)) {
    state.codes.loaded = false;
    state.codes.from = 'server';
    return false;
  }
  const all = data.codes.map(fromCompact);
  const byId = new Map(all.map((c) => [c.id, c]));
  for (const d of delta || []) {
    const c = fromCompact(d);
    if (!byId.has(c.id)) { all.push(c); byId.set(c.id, c); }
  }
  all.sort((a, b) => a.rid - b.rid);
  state.codes.all = all;
  state.codes.byId = byId;
  state.codes.maxRid = typeof data.maxRid === 'number' ? data.maxRid : -1;
  state.codes.loaded = true;
  state.codes.from = 'static';
  return true;
}

// ---------- Data ----------
async function loadStats() {
  const d = await api('stats');
  if (d.ok) {
    state.me = d.me;
    // Preserve the Firebase realtime totals: they are the source of
    // truth while the Function/D1 is down, and may be HIGHER than the
    // backend's own numbers (the backend froze when its writes ran
    // out). Never let a stale backend answer lower the totals.
    const fbV = state.stats ? Number(state.stats.visitors_total) || 0 : 0;
    const fbC = state.stats ? Number(state.stats.used_total) || 0 : 0;
    state.stats = d.stats;
    if (fbV) state.stats.visitors_total = Math.max(Number(state.stats.visitors_total) || 0, fbV);
    if (fbC) state.stats.used_total = Math.max(Number(state.stats.used_total) || 0, fbC);
    renderAll();
  }
}

// ---------- Presence ("active now") ----------
// The online counter only stays real if every visitor keeps saying
// "I'm still here". The 60s stats refresh does that for visitors
// with a session — but a first-time visitor at the gate has no
// session yet, and a visitor in local mode (database unreachable)
// never reaches the stats endpoint at all. So presence is a
// separate, tiny, best-effort ping: it records last-seen only, never
// creates a user and never bumps any total (see the /api/ping
// endpoint). It runs from boot, for everyone, on every host.
function presenceKey() {
  if (state.key) return state.key;
  const saved = readCookie() || localStorage.getItem('mk_key');
  if (saved) return saved;
  // No identity yet: an ephemeral key for this visit only (kept in
  // sessionStorage, so a new visit is a new presence, never a new
  // "visitor" in the totals).
  try {
    let k = sessionStorage.getItem('mk_presence');
    if (!k) { k = 'a-' + randStr(12); sessionStorage.setItem('mk_presence', k); }
    return k;
  } catch { return 'a-' + randStr(12); }
}

async function pingPresence() {
  const key = presenceKey();
  // Realtime presence in Firebase (best-effort, never blocks the
  // /api/ping below): refresh this visitor's timestamp so the
  // server's "active now" count includes them even while the D1
  // write limit and the KV list quota are exhausted. A closed tab
  // simply stops refreshing, and its entry goes stale after 5 min.
  pingFirebasePresence(key);
  try {
    const d = await api('ping', { key });
    if (d && d.ok) return;
  } catch {}
  // Static mirror (no local API): ping the primary host instead, so
  // mirror visitors count as online too.
  try { await apiPrimary('ping', { key }); } catch {}
}

// Write this visitor's presence timestamp to Firebase Realtime DB.
// Fire-and-forget: a 5s timeout, and any failure is silently ignored
// (the /api/ping above is the fallback; the count just stays lower).
function pingFirebasePresence(key) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    fetch(FIREBASE_PRESENCE_URL + '/' + encodeURIComponent(key) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ t: Date.now() }),
      signal: ctl.signal,
      keepalive: true,
    }).catch(() => {}).finally(() => clearTimeout(timer));
  } catch {}
}

// Read the realtime "active now" count straight from Firebase and
// show it — without going through the site's own /api/stats at all.
// This is the part that makes the number real even while the
// Cloudflare Pages Function is not answering (it currently returns
// 405 for /api/* on every host, so loadStats never updates the
// count and the card would otherwise stay at the fallback 1). One
// GET, count the entries fresh within 5 minutes, take the highest
// of the Firebase count and whatever the backend last reported.
// Best-effort and silent on failure; runs every 60s with the ping.
async function loadFirebaseOnline() {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    const res = await fetch(FIREBASE_PRESENCE_URL + '.json', { signal: ctl.signal });
    clearTimeout(timer);
    if (!res.ok) return;
    const data = await res.json().catch(() => null);
    if (!data || typeof data !== 'object') return;
    const cutoff = Date.now() - 5 * 60 * 1000;
    let n = 0;
    for (const k of Object.keys(data)) {
      const e = data[k];
      if (e && typeof e.t === 'number' && e.t >= cutoff) n++;
    }
    if (!state.stats) state.stats = {};
    state.stats.visitors_online = Math.max(Number(state.stats.visitors_online) || 0, n);
    renderMetrics();
  } catch {}
}

let presenceTimer = null;
function ensurePresenceLoop() {
  if (presenceTimer) return;
  pingPresence();
  loadFirebaseOnline();
  loadFirebaseCounters();
  // Count this browser as a new visitor exactly once: the first time
  // it ever loads the site (localStorage flag). A reload or a return
  // visit does not count again. This is what makes the Real Visitors
  // total grow in real time while the Function is down.
  try {
    if (!localStorage.getItem('mk_counted_v1')) {
      localStorage.setItem('mk_counted_v1', '1');
      bumpFirebaseCounter('visitors');
    }
  } catch {}
  presenceTimer = setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    pingPresence();
    loadFirebaseOnline();
    loadFirebaseCounters();
    if (state.key) loadStats();
  }, 60000);
}

// Cross-origin call to the primary host's API, for pages served by a
// static mirror (which has no database of its own).
async function apiPrimary(path, payload = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 10000);
  try {
    const res = await fetch(PRIMARY_ORIGIN + '/api/' + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: state.key, fp: fingerprint(), ...payload }),
      signal: ctl.signal,
    });
    return await res.json();
  } catch { return { ok: false, error: 'network' }; }
  finally { clearTimeout(timer); }
}

let primaryStatsTimer = null;
// Local mode (static mirror, or the database briefly unreachable):
// register this visitor on the primary host so the "active now"
// number is real here too, and refresh the live numbers every 60s.
// Only state.stats is ever replaced — the local copy counts (which
// the server cannot see in this mode) are never overwritten.
async function startPrimaryStats() {
  if (primaryStatsTimer) return;
  const poll = async () => {
    if (document.visibilityState !== 'visible') return;
    if (!state.key) {
      const saved = readCookie() || localStorage.getItem('mk_key');
      const s = await apiPrimary('session', saved ? { key: saved } : { anon: true });
      if (s.ok && s.me && s.me.key) { persistKey(s.me.key); state.key = s.me.key; state.stats = s.stats; renderAll(); }
      return;
    }
    const d = await apiPrimary('stats', {});
    if (d.ok && d.stats) { state.stats = d.stats; renderAll(); }
  };
  await poll();
  primaryStatsTimer = setInterval(poll, 60000);
}

async function refillQueue() {
  // Static list: recompute locally, no database read.
  if (state.codes.loaded) { refreshQueue(); return; }
  // Server fallback (static list unavailable).
  const d = await api('queue');
  if (!d.ok) return;
  const have = new Set(state.queue.map((c) => c.id));
  state.queue.push(...d.codes.filter((c) => !have.has(c.id)));
}

function loadListLocal(reset = true) {
  const L = state.list;
  if (reset) { L.pool = listPool(); L.next = 0; L.hasMore = false; }
  const pool = L.pool || [];
  const page = pool.slice(L.next, L.next + 60);
  const used = state.codes.usedIds;
  const items = page.map((c) => ({ ...c, used: used.has(c.id) ? 1 : 0 }));
  L.items = reset ? items : L.items.concat(items);
  L.next += items.length;
  L.hasMore = L.next < pool.length;
  L.loading = false;
  renderGrid();
}

async function loadList(reset = true) {
  // Static list: paginate the client-side pool, no database read.
  if (state.codes.loaded) { loadListLocal(reset); return; }
  // Server fallback (static list unavailable).
  const L = state.list;
  if (L.loading && !reset) return;
  const seq = ++L.seq;
  if (reset) { L.items = []; L.next = 0; L.hasMore = false; }
  L.loading = true;
  if (reset) renderGrid();
  const d = await api('list', { filter: L.filter, q: L.q, after: L.next });
  if (seq !== L.seq) return;
  L.loading = false;
  if (d.ok) {
    L.items = reset ? d.codes : L.items.concat(d.codes);
    L.next = d.next;
    L.hasMore = d.hasMore;
  }
  renderGrid();
}

// ---------- Actions ----------
// The used set, remembered in this browser for hosts with no server.
// On the main site the server is authoritative and overwrites this set
// on every session; the saved copy is only a fallback, so a used code
// is never shown again after a reload or a move to another host.
const LOCAL_USED_KEY = 'mk_local_used_v1';
function loadLocalUsed() {
  try {
    const raw = localStorage.getItem(LOCAL_USED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}
function saveLocalUsed() {
  try { localStorage.setItem(LOCAL_USED_KEY, JSON.stringify([...state.codes.usedIds])); } catch {}
}
// Codes reported dead (badIds) are remembered in this browser too, so
// they stay excluded even while the database is unreachable and no
// session can return the list. Same pattern as the used set.
const LOCAL_BAD_KEY = 'mk_bad_codes_v1';
function loadLocalBad() {
  try {
    const raw = localStorage.getItem(LOCAL_BAD_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}
function saveLocalBad() {
  try { localStorage.setItem(LOCAL_BAD_KEY, JSON.stringify([...state.codes.badIds])); } catch {}
}
function markLocal(ids) {
  const set = new Set(ids);
  for (const id of set) state.codes.usedIds.add(id);
  saveLocalUsed();
  state.queue = state.queue.filter((c) => !set.has(c.id));
  state.list.items.forEach((c) => {
    if (set.has(c.id)) {
      c.used = 1;
      c.copies = Number(c.copies || 0) + 1;
    }
  });
  if (state.list.filter === 'remaining' || state.list.filter === 'new') {
    state.list.items = state.list.items.filter((c) => !set.has(c.id));
  }
  // Static list: rebuild the visible list from the refreshed pool so
  // the count stays full and "Load more" never resurfaces a used code,
  // and refresh the queue from the same client-side data.
  if (state.codes.loaded) {
    const L = state.list;
    const shown = L.items.length;
    L.pool = listPool();
    const used = state.codes.usedIds;
    L.items = L.pool.slice(0, shown).map((c) => ({ ...c, used: used.has(c.id) ? 1 : 0 }));
    L.next = L.items.length;
    L.hasMore = L.next < L.pool.length;
    refreshQueue();
  }
}

async function copyCode(c, toastMsg) {
  // Your own key is never issued back to you: copy the text only,
  // never record it as a used code.
  if (isOwnCode(c)) {
    if (await copyText(c.code)) toast(t('toastCopied')(c.code));
    else toast(c.code);
    return;
  }
  const ok = await copyText(c.code);
  if (!ok) { toast(c.code); return; }
  await recordCopy(c, toastMsg);
}

// Share bar: the five platform links share this page's URL with a
// short text. Facebook opens its sharer page for posting the link;
// the others use their normal link-sharing pages. Built in JS so the
// links follow the page's real URL (live, staging, or mirror).
function buildShareLinks() {
  const url = location.href.split('#')[0];
  const text = 'NusukKeys — 13,721 Nusuk referral codes. Copy one, get a key.';
  const u = encodeURIComponent(url);
  const tx = encodeURIComponent(text + ' ' + url);
  const set = (id, href) => { const el = $(id); if (el) el.href = href; };
  // Two surfaces share the same five links: the desktop share bar
  // (share-*) and the mobile share dialog (share-d-*).
  const links = {
    fb: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
    wa: 'https://wa.me/?text=' + tx,
    tg: 'https://t.me/share/url?url=' + u + '&text=' + encodeURIComponent(text),
    x: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + u,
    in: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
  };
  for (const [k, href] of Object.entries(links)) {
    set('share-' + k, href);
    set('share-d-' + k, href);
  }
}

// Records a copy once the clipboard write succeeded: toast, counts,
// local exclusion, server record, queue refill.
async function recordCopy(c, toastMsg) {
  toast(toastMsg ? toastMsg(c.code) : t('toastCopied')(c.code));
  $('d-code').classList.add('pop');
  setTimeout(() => $('d-code').classList.remove('pop'), 160);

  state.lastCopied = c;
  // Remember the copied code for this tab even across a reload, so
  // "Open in Nusuk" after a reload still opens the code the visitor
  // copied (not the next one) — a reload clears the in-memory
  // lastCopied, and without this the card would burn a second code.
  try { sessionStorage.setItem('mk_last_copied', c.id); } catch {}
  state.me.copied++;
  state.me.copied_today = (state.me.copied_today || 0) + 1;
  state.me.remaining = Math.max(0, state.me.remaining - 1);
  state.stats.used_today = (state.stats.used_today || 0) + 1;
  state.stats.used_total = (state.stats.used_total || 0) + 1;
  // Count this copy in the realtime total (Firebase), so Total Copies
  // grows in real time even while the Function is down. Atomic
  // increment — concurrent copies cannot lose a count.
  bumpFirebaseCounter('copies');
  markLocal([c.id]);
  renderAll();

  await api('copy', { id: c.id });
  // Static list: markLocal already refreshed the queue locally.
  // Server fallback: top the queue up from the server.
  if (!state.codes.loaded && state.queue.length < 8) refillQueue().then(renderAll);
}

// Deep link into the Nusuk app. services.nusuk.sa is a verified App Link
// (Android) and Universal Link (iOS) for the Nusuk app, and this is the
// same link format the app itself creates when a user shares a code:
// p=27 is the Free Umrah Challenge, id= is the code. The link itself
// is Nusuk's official referral format and a verified App Link /
// Universal Link (assetlinks.json lists com.moh.nusukapp with
// handle_all_urls; apple-app-site-association lists /app*). It must be
// opened by a REAL tap on a REAL link element in the page: the OS only
// hands the link to the app (no browser page, no store, no prompt)
// when the user taps a link directly. A synthetic click() on a
// JS-created temporary anchor does NOT fire the App Link — Chrome
// treats it as a script navigation, loads the URL in the browser, and
// Nusuk's page redirects to the Play Store even when the app is
// installed (that is the Play Store symptom). window.open() has the
// same problem.
// The plain https App Link alone still sent some Android users to the
// Play Store (a stored "open in browser" choice, or a failed App Link
// verification on that phone, makes Chrome load the page instead of
// handing it to the app). So on Android the link is now an intent://
// URL that names the Nusuk app package explicitly
// (com.moh.nusukapp) with the https referral URL as its
// browser_fallback_url: if the app is installed the intent opens it
// directly at the referral-code field; only if the app is truly not
// installed does Chrome fall back to the https page (which then sends
// the user to the Play Store to install it — the correct outcome).
// The intent:// URL is only the href of the real <a> card, never
// opened by script, so a genuine tap fires it without Chrome's
// "Allow" prompt (that prompt only appeared for window.open()).
// iOS and desktop keep the plain https Universal Link, which iOS
// Deep link: the Nusuk app reads the code from the referral URL's id
// parameter and fills the challenge field itself ("autopaste") — that
// is the app's own behaviour, so the website's job is only to get the
// link to the app reliably. Two URL forms exist:
//  - intent:// (names the Nusuk package explicitly) — the most direct
//    route, but it ONLY works in Chromium-based browsers on Android
//    (Chrome, Edge, Samsung Internet, Brave, Opera). It fails silently
//    in Firefox for Android and in in-app browsers (WhatsApp, Facebook,
//    Instagram, Telegram, WebView), where the tap does nothing or
//    errors — that is why the link sometimes worked and sometimes did
//    not: it depended on which browser the visitor used.
//  - plain https Universal Link — handled by the OS App Links system,
//    so it works in the most browsers (Firefox, in-app browsers, iOS,
//    desktop). If the app does not open, the browser loads the Nusuk
//    web page (which offers the Play Store) instead of failing.
// So: intent:// only where it is reliable (Chromium on Android),
// plain https everywhere else. The code is also copied to the
// clipboard first, so a manual paste still works if auto-fill fails.
const NUSUK_WEB_LINK = (code) => 'https://services.nusuk.sa/app/?p=27&id=' + encodeURIComponent(code);
const NUSUK_INTENT_LINK = (code) => {
  const web = NUSUK_WEB_LINK(code);
  return 'intent://services.nusuk.sa/app/?p=27&id=' + encodeURIComponent(code) +
    '#Intent;scheme=https;package=com.moh.nusukapp;S.browser_fallback_url=' +
    encodeURIComponent(web) + ';end';
};
const UA = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
const IS_ANDROID = /Android/i.test(UA);
const IS_INTENT_CAPABLE = IS_ANDROID
  && /Chrome/i.test(UA)
  && !/Firefox|FxiOS|FBAN|FBAV|WhatsApp|Instagram|Telegram|\bwv\b/i.test(UA);
// In-app browsers (WhatsApp, Facebook, Instagram, Telegram, TikTok,
// Line, WeChat) cannot fire a deep link to another app — the tap does
// nothing or errors. This is a common reason the "Open in Nusuk" link
// seems broken: the visitor opened the site from inside another app.
// Detect it and show a banner with an escape hatch: on Android, open
// this page in Chrome via an explicit intent; on iOS, copy the link so
// the visitor can paste it in Safari. (Pattern from the Nusuk Key
// Exchange Apps Script site, which shows the same banner + modal.)
function isInAppBrowser() {
  return /FBAN|FBAV|Instagram|Messenger|Line|MicroMessenger|WhatsApp|TikTok|Snapchat|Telegram/i.test(UA) || /\bwv\b/i.test(UA);
}
function showInAppBanner() {
  if (!isInAppBrowser()) return;
  const b = $('inapp-banner');
  if (!b) return;
  b.classList.remove('hidden');
  const btn = $('inapp-open');
  if (btn) {
    if (IS_ANDROID) {
      btn.textContent = t('inappOpenChrome');
      btn.addEventListener('click', () => {
        const clean = location.href.replace(/^https?:\/\//, '');
        location.href = 'intent://' + clean + '#Intent;scheme=https;package=com.android.chrome;end';
      });
    } else {
      btn.textContent = t('inappCopyLink');
      btn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(location.href); } catch {}
        toast(t('inappCopied'));
      });
    }
  }
  const close = $('inapp-close');
  if (close) close.addEventListener('click', () => b.classList.add('hidden'));
}
const NUSUK_DEEP_LINK = (code) => IS_INTENT_CAPABLE ? NUSUK_INTENT_LINK(code) : NUSUK_WEB_LINK(code);

// The code the visitor copied most recently in this tab: the
// in-memory one if set, else the one remembered across a reload in
// sessionStorage. Used by card 2 so Copy -> (reload) -> Open Nusuk
// still opens the copied code.
function lastCopiedCode() {
  if (state.lastCopied) return state.lastCopied;
  let id = null;
  try { id = sessionStorage.getItem('mk_last_copied'); } catch {}
  if (!id) return null;
  if (state.codes.loaded && state.codes.byId && state.codes.byId.has(id)) return state.codes.byId.get(id);
  return state.queue.find((x) => x.id === id) || null;
}

// Keep card 2's real link pointed at the code the visitor just copied
// (or the next code if nothing is copied yet), so a direct tap on the
// card opens the right code in the Nusuk app.
function updateNusukLink() {
  const a = $('nusuk-link');
  if (!a) return;
  const c = lastCopiedCode() || state.queue[0];
  if (c) a.href = NUSUK_DEEP_LINK(c.code);
  else a.removeAttribute('href');
}

// Card 2's tap: the browser follows the real link (that is what fires
// the App Link). This handler only makes sure the clipboard holds the
// code and the copy is recorded — it never navigates itself.
function onNusukLinkClick(e) {
  const c = lastCopiedCode() || state.queue[0];
  if (!c) { e.preventDefault(); return; }
  // Point the link at this exact code (it normally already is —
  // updateNusukLink keeps it current — but a tap must never open a
  // stale code).
  $('nusuk-link').href = NUSUK_DEEP_LINK(c.code);
  // If this is a code the visitor already copied (this page load or an
  // earlier one — the used set survives reloads), it is already
  // recorded (counter, used set) — open it again without recording a
  // second copy, or the counter and the used set would count one
  // entry as two codes.
  // Start the clipboard write while this page still has focus. The
  // write is started inside the click, so it keeps its user gesture;
  // the navigation happens after this handler returns.
  const alreadyRecorded = (state.lastCopied && state.lastCopied.id === c.id) || state.codes.usedIds.has(c.id);
  const clip = copyText(c.code);
  clip.then((ok) => {
    if (!ok) { toast(c.code); return; }
    if (alreadyRecorded) toast(t('toastNusuk')(c.code));
    else recordCopy(c, (code) => t('toastNusuk')(code));
  });
}

async function copyAlreadyUsedChip(chip) {
  if (await copyText(chip.dataset.code)) toast(t('toastCopied')(chip.dataset.code));
}

async function skip() {
  const c = state.queue.shift();
  if (!c) return;
  state.me.remaining = Math.max(0, state.me.remaining - 1);
  markLocal([c.id]);
  renderAll();
  await api('report', { id: c.id, reason: 'skipped' });
  if (!state.codes.loaded && state.queue.length < 8) refillQueue().then(renderAll);
}

async function reportLast(reason) {
  const c = state.lastCopied;
  if (!c) return;
  state.lastCopied = null;
  try { sessionStorage.removeItem('mk_last_copied'); } catch {}
  renderAll();
  await api('report', { id: c.id, reason });
  toast(reason === 'invalid' ? t('toastBad') : t('toastNoted'));
}

async function undoLast() {
  const c = state.lastCopied;
  if (!c) return;
  state.lastCopied = null;
  try { sessionStorage.removeItem('mk_last_copied'); } catch {}
  state.me.copied = Math.max(0, state.me.copied - 1);
  state.me.copied_today = Math.max(0, (state.me.copied_today || 1) - 1);
  state.me.remaining++;
  state.stats.used_today = Math.max(0, (state.stats.used_today || 1) - 1);
  state.stats.used_total = Math.max(0, (state.stats.used_total || 1) - 1);
  // The code is usable again: drop it from the used set and put it
  // back at the front of the queue.
  state.codes.usedIds.delete(c.id);
  saveLocalUsed();
  if (state.codes.loaded) {
    refreshQueue();
    const canonical = state.codes.byId.get(c.id) || c;
    state.queue = [canonical, ...state.queue.filter((x) => x.id !== c.id)];
  } else {
    state.queue.unshift(c);
  }
  await api('undo', { id: c.id });
  toast(t('toastUndo'));
  renderAll();
  if (state.list.filter !== 'remaining') loadList(true);
}

// ---------- Gate (first load & upgrade from guest) ----------
function showGate() {
  $('gate').classList.remove('hidden');
  setTimeout(() => $('gate-input').focus(), 50);
}
function hideGate() { $('gate').classList.add('hidden'); $('acct').classList.remove('hidden'); }

// ---------- Automatic failover ----------
// The browser is the load balancer on free hosting: no free provider
// reports its live load or quota to the page, so the only signal the
// page can act on is failure. When this host cannot serve any code at
// all (static list AND server fallback both failed, or the session
// call itself never reached the server), the page counts down 5
// seconds and moves the visitor to the next host in the chain
// automatically — no click needed. "Stay here" cancels the move.
// FAILOVER_CHAIN is in capacity order (verified free limits,
// 2026-11-06). A host is listed only once it is LIVE — a redirect
// to a dead address helps nobody. New hosts are inserted here, in
// capacity order, as each one is deployed and verified (Surge,
// Vercel, Render, GitLab Pages).
// The ?fo=host1,host2 marker records hosts already tried, so the
// chain always moves forward and can never loop back.
const FAILOVER_CHAIN = [
  'https://nusukkeys-cu9.pages.dev/',
  'https://nusukkeys-mirror.pages.dev/',
  'https://nusukkeys-backup.pages.dev/',
  'https://ausaimin10.github.io/nusukkeys-mirror/',
  'https://nusukkeys-mirror.netlify.app/',
  'https://nusukkeys-mirror.web.app/',
  'https://cdn.jsdelivr.net/gh/ausaimin10/nusukkeys-mirror@main/index.html'
];
function failoverTried() {
  try { return new Set((new URLSearchParams(location.search).get('fo') || '').split(',').filter(Boolean)); }
  catch (e) { return new Set(); }
}
function failoverTargets() {
  // Ordered candidates: first the host that last served this visitor
  // codes (if it is in the chain), then the chain in capacity order.
  // Hosts already tried (the ?fo= marker) and this host are skipped.
  const tried = failoverTried();
  const out = [];
  const push = (u) => {
    try {
      const host = new URL(u).hostname;
      if (host !== location.hostname && !tried.has(host) && !out.some((x) => new URL(x).hostname === host)) out.push(u);
    } catch (e) { /* skip a bad entry */ }
  };
  let lastGood = null;
  try { lastGood = localStorage.getItem('mk_last_good'); } catch {}
  if (lastGood) {
    const hit = FAILOVER_CHAIN.find((u) => { try { return new URL(u).hostname === lastGood; } catch (e) { return false; } });
    if (hit) push(hit);
  }
  FAILOVER_CHAIN.forEach(push);
  return out;
}
function failoverTarget() {
  const t = failoverTargets();
  return t.length ? t[0] : null;
}
// Before moving, check the target is actually alive: its head file
// must answer within 3s. A redirect to a dead host is worse than
// staying put — the visitor would land on an error page instead of
// this one. The probe is a no-cors fetch, so it only tests
// reachability and needs no CORS headers on the target.
async function probeHost(url) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3000);
    // The chain entry is a page URL (a root, a subpath, or a file URL
    // like the jsDelivr index.html): probe the code file next to it.
    const base = url.endsWith('/') ? url : url.slice(0, url.lastIndexOf('/') + 1);
    try { await fetch(base + 'codes-head.json', { mode: 'no-cors', signal: ctl.signal }); return true; }
    finally { clearTimeout(timer); }
  } catch { return false; }
}
async function probeAndRedirect() {
  const targets = failoverTargets();
  // Probe all candidates in parallel (one 3s window) and take the
  // first live one in priority order.
  const results = await Promise.all(targets.map((t) => probeHost(t)));
  for (let i = 0; i < targets.length; i++) {
    if (results[i]) {
      const target = targets[i];
      const tried = [...failoverTried(), location.hostname];
      location.replace(target + (target.includes('?') ? '&' : '?') + 'fo=' + tried.join(','));
      return;
    }
  }
  failoverTimer = null; // no live host: stay put, banner stays visible
}
function cleanFailoverMarker() {
  try {
    const p = new URLSearchParams(location.search);
    if (!p.has('fo')) return;
    p.delete('fo');
    const q = p.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
  } catch (e) { /* leave the URL alone */ }
}
let failoverTimer = null;
function startFailover() {
  if (failoverTimer) return; // already counting down
  // The key gate is a modal overlay: hide it, or the visitor could
  // never reach the banner's "Stay here" button.
  hideGate();
  $('failover').classList.remove('hidden');
  let n = 5;
  const tick = () => {
    if (n <= 0) { probeAndRedirect(); return; }
    const el = $('failover-count');
    if (el) el.textContent = t('failoverCount')(n);
    n -= 1;
    failoverTimer = setTimeout(tick, 1000);
  };
  tick();
}
function cancelFailover() {
  if (failoverTimer) { clearTimeout(failoverTimer); failoverTimer = null; }
  const el = $('failover-count');
  if (el) el.textContent = '';
}

async function startSession({ key, anon = false, share = false, prevKey = null }) {
  // Fetch the static code list in parallel with the session call, so
  // the first load is not slower than before.
  const codesPromise = fetchCodesJson();
  const d = await api('session', { key, anon, share, prevKey });
  if (!d.ok && d.error !== 'no_key') {
    // The server is unreachable or erroring, but the public code list
    // may still be available (service-worker cache, cross-origin
    // mirror). Serve codes locally as a guest instead of abandoning
    // the visitor: the dispenser, browser, copy/skip/undo all work
    // from the static list, with copies tracked only in this browser
    // for this visit (the server cannot record them while it is
    // unreachable). The saved key is NOT forgotten, so the next
    // online visit re-establishes identity. If no code list loads
    // either, the failover chain takes over as before.
    const first = await codesPromise;
    if (first && applyCodes(first.data, [])) {
      // Codes used on this device are remembered in this browser even
      // with no server (static hosts have no database), so the
      // one-time-per-user rule holds across reloads and host switches.
      const savedUsed = loadLocalUsed();
      state.key = null;
      // Remember the key the visitor just entered (or the saved one),
      // so the primary host can use the same identity for live stats.
      if (key) persistKey(key);
      state.me = { copied: savedUsed.length, copied_today: 0, remaining: Math.max(0, state.codes.all.length - savedUsed.length), total: state.codes.all.length, anon: !key, mine: key ? { code: key, copies: 0 } : null };
      state.stats = { ...state.stats, codes: first.data.total || state.codes.all.length };
      state.codes.usedIds = new Set(savedUsed);
      state.codes.badIds = new Set(loadLocalBad());
      state.queue = [];
      state.lastCopied = null;
      hideGate();
      renderAll();
      await Promise.all([refillQueue(), loadList(true)]);
      cancelFailover();
      cleanFailoverMarker();
      try { localStorage.setItem('mk_last_good', location.hostname); } catch {}
      // No database on this host: fetch the live visitor numbers from
      // the primary host instead, so "active now" is real here too.
      startPrimaryStats();
      if (first.isHead) {
        fetchFullCodesJson().then((full) => {
          if (!full) return;
          applyCodes(full, []);
          state.me.remaining = Math.max(0, state.codes.all.length - state.codes.usedIds.size);
          state.me.total = state.codes.all.length;
          refreshQueue();
          loadList(true);
          renderAll();
        });
      }
      renderAll();
      return { ok: true, offline: true, local: true, me: state.me, stats: state.stats };
    }
    startFailover();
    return d;
  }
  if (!d.ok) return d;
  persistKey(d.me.key);
  state.me = d.me;
  state.stats = d.stats;
  // Merge the server's used set with this browser's local used set:
  // when the database is unreachable the server cannot know the codes
  // this guest already used, so the local list is the only record and
  // replacing it would show already-used codes again.
  state.codes.usedIds = new Set([...(d.usedIds || []), ...loadLocalUsed()]);
  saveLocalUsed();
  state.codes.badIds = new Set(d.badIds || []);
  saveLocalBad();
  state.queue = [];
  state.lastCopied = null;
  hideGate();
  renderAll();
  const first = await codesPromise; // {data, isHead} or null
  applyCodes(first ? first.data : null, d.delta || []);
  await Promise.all([refillQueue(), loadList(true)]);
  // Failover: if neither the static list nor the server fallback
  // produced any code, move the visitor to the backup mirror
  // automatically (5s countdown, cancellable with "Stay here").
  const anyCodes = state.codes.loaded || state.queue.length > 0 || state.list.items.length > 0;
  $('failover').classList.toggle('hidden', anyCodes);
  if (anyCodes) {
    cancelFailover(); cleanFailoverMarker();
    // Remember the host that served codes — if it ever fails later,
    // the chain tries this host first.
    try { localStorage.setItem('mk_last_good', location.hostname); } catch {}
    // Background upgrade: the head file made the page usable at once;
    // now fetch the full list so the code browser can search every
    // code. The queue and grid refresh when it arrives.
    if (first && first.isHead) {
      fetchFullCodesJson().then((full) => {
        if (!full) return;
        applyCodes(full, d.delta || []);
        refreshQueue();
        loadList(true);
        renderAll();
      });
    }
  } else startFailover();
  renderAll();
  return d;
}

// ---------- Boot ----------
function bind() {
  // Mobile language dropdown: one button, seven options in a menu.
  const langBtn = $('btn-lang');
  const langMenu = $('lang-menu');
  const closeLangMenu = () => { if (langMenu) langMenu.classList.add('hidden'); if (langBtn) langBtn.setAttribute('aria-expanded', 'false'); };
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { applyLang(b.dataset.lang); closeLangMenu(); }));
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = langMenu.classList.toggle('hidden');
      langBtn.setAttribute('aria-expanded', String(!open));
    });
    document.addEventListener('click', (e) => { if (!langMenu.classList.contains('hidden') && !e.target.closest('.lang-drop')) closeLangMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLangMenu(); });
  }
  $('btn-copy').addEventListener('click', () => state.queue[0] && copyCode(state.queue[0]));
  // Instruction cards: 1 copies the current code (same as the main
  // button), 3 skips/reports the current code (same as Skip). Card 2
  // is a real link in the HTML (id nusuk-link) — the user taps it
  // directly, and the browser follows it; its handler below only
  // copies/records the code and never navigates.
  document.querySelectorAll('[data-step]').forEach((el) => {
    const act = () => {
      const step = el.dataset.step;
      if (step === 'copy') { if (state.queue[0]) copyCode(state.queue[0]); }
      else if (step === 'skip') { skip(); }
    };
    el.addEventListener('click', act);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  $('nusuk-link').addEventListener('click', onNusukLinkClick);
  $('btn-skip').addEventListener('click', skip);
  $('s-used').addEventListener('click', () => reportLast('already_used'));
  $('s-bad').addEventListener('click', () => reportLast('invalid'));
  $('s-undo').addEventListener('click', undoLast);
  $('failover-stay').addEventListener('click', cancelFailover);
  // Sponsor hosting dialog
  $('btn-sponsor').addEventListener('click', () => $('sponsor-dialog').classList.remove('hidden'));
  $('sponsor-close').addEventListener('click', () => $('sponsor-dialog').classList.add('hidden'));
  $('sponsor-dialog').addEventListener('click', (e) => { if (e.target === $('sponsor-dialog')) $('sponsor-dialog').classList.add('hidden'); });
  $('btn-share').addEventListener('click', () => { buildShareLinks(); $('share-dialog').classList.remove('hidden'); });
  $('share-close').addEventListener('click', () => $('share-dialog').classList.add('hidden'));
  $('share-dialog').addEventListener('click', (e) => { if (e.target === $('share-dialog')) $('share-dialog').classList.add('hidden'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { $('sponsor-dialog').classList.add('hidden'); $('share-dialog').classList.add('hidden'); } });
  $('btn-more').addEventListener('click', () => loadList(false));

  // Top horizontal guest warning button opens the Key Gate to let the user enter their NG- key
  $('guest-alert-btn').addEventListener('click', () => {
    $('gate-input').value = '';
    showGate();
  });

  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return;
    if (!$('gate').classList.contains('hidden')) return;
    e.preventDefault();
    if (state.queue[0]) copyCode(state.queue[0]);
  });

  $('grid').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const item = state.list.items.find((c) => c.id === chip.dataset.id);
    if (!item) return;
    if (item.used) return copyAlreadyUsedChip(chip);
    chip.classList.add('flash');
    copyCode(item);
  });

  $('filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    document.querySelectorAll('#filters button').forEach((x) => x.classList.toggle('active', x === b));
    state.list.filter = b.dataset.f;
    const cl = $('code-list'); if (cl) cl.open = true;
    loadList(true);
  });

  let timer;
  $('q').addEventListener('input', (e) => {
    const cl = $('code-list'); if (cl) cl.open = true;
    clearTimeout(timer);
    timer = setTimeout(() => { state.list.q = e.target.value.trim(); loadList(true); }, 250);
  });

  bindTools();
  // Nav and footer links that point at a collapsed section open it
  // first (a plain anchor scroll would land on a closed <details>).
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      if (target.tagName === 'DETAILS') { target.open = true; return; }
      // The target may sit inside a closed <details> — open that first.
      const d = target.closest('details');
      if (d) d.open = true;
      if (target.id === 'guide') {
        ['faq-section', 'guides-section'].forEach((id) => { const d = $(id); if (d) d.open = true; });
      }
    });
  });
  const cl = $('checklist-list');
  if (cl) cl.addEventListener('change', (e) => {
    const box = e.target.closest('input[data-check]');
    if (!box) return;
    const saved = loadChecklist();
    saved[box.dataset.check] = box.checked;
    saveChecklist(saved);
    updateChecklistProgress();
  });
  const clClear = $('checklist-clear');
  if (clClear) clClear.addEventListener('click', () => { saveChecklist({}); renderChecklist(); });
  const clPrint = $('checklist-print');
  if (clPrint) clPrint.addEventListener('click', () => window.print());
  $('acct').addEventListener('click', () => {
    $('gate-input').value = state.me.anon ? '' : (state.key || '');
    showGate();
  });

  $('gate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('gate-err');
    err.classList.add('hidden');
    const key = normalizeKey($('gate-input').value);
    if (!key) {
      err.textContent = $('gate-input').value.trim() ? t('err').invalid_code : t('err').empty;
      err.classList.remove('hidden');
      return;
    }
    const prevKey = state.me?.anon ? state.key : null;
    $('gate-go').disabled = true;
    // Entering with your own key always adds it to the pool (the
    // server adds it when missing); it is never shown back to you.
    const d = await startSession({ key, share: true, prevKey });
    $('gate-go').disabled = false;
    if (!d.ok) { err.textContent = t('err').server; err.classList.remove('hidden'); return; }
    toast(d.me.copied > 0 ? `${t('toastWelcome')} · ${fmt(d.me.copied)}` : t('toastWelcome'));
  });

  $('gate-anon').addEventListener('click', () => {
    if (state.key && state.me.anon) {
      hideGate();
      return;
    }
    startSession({ anon: true });
  });
}

async function boot() {
  bind();
  showInAppBanner();
  buildShareLinks();
  applyLang(state.lang);
  // nk-v22: on phones the 4-step banner starts collapsed (tap its
  // title to open it) so the Copy button stays on the first screen.
  const hb = $('how-banner');
  if (hb && window.innerWidth <= 720) hb.removeAttribute('open');
  // Presence starts here, for EVERY visitor — including first-time
  // visitors still at the gate (no key yet) and visitors in local
  // mode. Previously the 60s refresh was only set up after a saved
  // key existed, so a first-time guest was touched once at session
  // time and never again, and dropped out of "active now" after
  // 5 minutes even while still on the page.
  ensurePresenceLoop();
  // A full referral link to this site can carry the visitor's key
  // (?key=NG-xxxxxxxx or ?code=NG-xxxxxxxx, or a full Nusuk share
  // link in ?key=). Opening such a link must register the key
  // immediately — the visitor must NOT land on the gate and be told
  // they are "browsing without a key" when the link already gave it.
  // The parameter is removed from the address bar once read so it
  // does not linger or get re-shared by accident.
  let urlKey = null;
  try {
    const p = new URLSearchParams(location.search);
    const raw = p.get('key') || p.get('code') || '';
    urlKey = normalizeKey(raw);
    if (urlKey) {
      p.delete('key'); p.delete('code');
      const q = p.toString();
      history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
    }
  } catch {}
  const saved = urlKey || readCookie() || localStorage.getItem('mk_key');
  if (!saved) return showGate();
  state.key = saved;
  const d = await startSession({ key: saved });
  if (!d.ok && d.error !== 'network') { forgetKey(); showGate(); }
  // Refresh live stats immediately when the tab comes back into
  // view (the 60s loop in ensurePresenceLoop handles the periodic
  // refresh; 60s halves the recurring Function calls — the free tier
  // allows 100k/day — and the 'active now' window is 5 minutes, so
  // the number stays current).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    pingPresence();
    if (state.key) loadStats();
  });
}

boot();
