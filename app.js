// NusukKeys frontend. Identity = the user's own Nusuk key, stored in the `mk_key` cookie
// (mirrored to localStorage). Displays real visitor stats and newly added code stats,
// and a top warning bar whenever a user is browsing without entering their own key.

const I18N = {
  en: {
    dir: 'ltr',
    guestWarnText: 'You are browsing without your Nusuk key — enter your key so your used & remaining codes stay saved across devices.',
    guestWarnBtn: 'Enter My Key →',
    mVisitorsLabel: 'Real Visitors',
    mCopiesLabel: 'Code Copy Times',
    mAddedLabel: 'Newly Added Codes',
    heroTitle: 'referral codes. Copy one, get a key.',
    heroSub: "Tap once to copy, paste it in the Nusuk app. We remember what you've used, so you never see the same code twice.",
    nextCode: 'Your next code', copyNext: 'Copy & show next', skip: 'Skip',
    copied: 'Copied', alreadyUsed: 'Already used', invalid: "Doesn't work", undo: 'Undo',
    s1t: 'Copy a code', s1d: 'Use the big button or tap any code below.',
    s2t: 'Open in Nusuk app', s2d: 'Start the challenge in the Nusuk app first, then tap here — the code should already be filled in. If not, just paste it.',
    s3t: 'Not accepted? Next.', s3d: "Mark it and we'll never show it again.",
    search: 'Search codes…', fRemaining: 'Remaining', fNew: 'Newly Added', fUsed: 'Used', fAll: 'All', more: 'Load more',
    addTitle: 'Have another code to share?', shareBtn: 'Share',
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
    gateHint: 'Find it in Nusuk: Start the challenge → Share → copy the code that starts with NG-.',
    by: (n) => (n ? `shared by ${n}` : ''),
    activeNow: (n) => `${n} active now`,
    copiedToday: (n) => `${n} copied today`,
    addedSub: (today, latest) => (latest ? `Latest: ${latest} (+${today} today)` : `${today} added today`),
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
      empty: 'Please paste a code first.', invalid_code: 'That does not look like a Nusuk key. It is NG- followed by 8 characters.',
      duplicate: 'That code is already shared.', device_limit: 'You have reached the sharing limit.',
      name_link: 'Names cannot contain links.', name_number: 'Names cannot contain phone numbers.', server: 'Something went wrong. Try again.'
    }
  },
  bn: {
    dir: 'ltr',
    guestWarnText: 'আপনি এখনো আপনার নিজের নুসুক কী দেননি — আপনার ব্যবহৃত ও বাকি কোডের হিসাব যেকোনো ডিভাইসে সেভ রাখতে আপনার কী দিন।',
    guestWarnBtn: 'আমার কী দিন →',
    mVisitorsLabel: 'মোট ভিজিটর',
    mCopiesLabel: 'কোড কপি সংখ্যা',
    mAddedLabel: 'নতুন যুক্ত কোড',
    heroTitle: 'টি রেফারেল কোড। কপি করুন, কী পান।',
    heroSub: 'একবার ট্যাপ করে কপি করুন, নুসুক অ্যাপে পেস্ট করুন। কোনটা ব্যবহার করেছেন আমরা মনে রাখি, তাই একই কোড দ্বিতীয়বার দেখবেন না।',
    nextCode: 'আপনার পরের কোড', copyNext: 'কপি করুন ও পরেরটা দেখুন', skip: 'স্কিপ',
    copied: 'কপি হয়েছে', alreadyUsed: 'আগে ব্যবহৃত', invalid: 'কাজ করছে না', undo: 'আনডু',
    s1t: 'কোড কপি করুন', s1d: 'বড় বাটন বা নিচের যেকোনো কোডে ট্যাপ করুন।',
    s2t: 'নুসুক অ্যাপে খুলুন', s2d: 'প্রথমে নুসুক অ্যাপে চ্যালেঞ্জ শুরু করুন, তারপর এখানে চাপ দিন — কোড সাধারণত আগেই পূরণ করা থাকে। না থাকলে শুধু পেস্ট করুন।',
    s3t: 'কাজ না করলে পরেরটা', s3d: 'মার্ক করুন, আর কখনো দেখাব না।',
    search: 'কোড খুঁজুন…', fRemaining: 'বাকি', fNew: 'নতুন যুক্ত', fUsed: 'ব্যবহৃত', fAll: 'সব', more: 'আরও দেখুন',
    addTitle: 'আরেকটি কোড শেয়ার করবেন?', shareBtn: 'শেয়ার',
    shareMsg: 'Please share this for the benefit of the Ummah.',
    shareTitle: 'NusukKeys শেয়ার করুন',
    shareClose: 'বন্ধ করুন',
    sponsorTitle: 'হোস্টিং স্পনসর করুন',
    sponsorLine1: 'আপনার অবদান সরাসরি এই ওয়েবসাইটের প্রধান হোস্টিং সার্ভার আপগ্রেডের কাজে যাবে।',
    sponsorLine2: 'একটি ছোট অবদান, উম্মাহর জন্য স্থায়ী উপকার।',
    sponsorBtn: 'হোস্টিং স্পনসর করুন',
    sponsorNote: 'এই সাইটটি এখন বিনামূল্যের হোস্টিংয়ে চলে। মূল সার্ভারের জন্য পেইড প্ল্যান মাসে প্রায় $৫ থেকে শুরু হয় এবং সীমা বাড়ায়। প্রতিটি অবদান শুধু সেই আপগ্রেডের কাজেই যাবে।',
    sponsorEmail: 'স্পনসর করতে ইমেইল করুন',
    sponsorClose: 'বন্ধ করুন',
    sponsorHint: 'অবদান সম্পূর্ণ স্বেচ্ছায়। এই সাইটে কোনো পেমেন্ট তথ্য নেওয়া হয় না।',
    failoverMsg: '\u098f\u0987 \u09b8\u09be\u0987\u099f\u099f\u09bf \u0995\u09cb\u09a1\u09c7\u09b0 \u09a4\u09be\u09b2\u09bf\u0995\u09be \u09b2\u09cb\u09a1 \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u09a8\u09bf. \u09ac\u09cd\u09af\u0995\u09be\u09aa \u09ae\u09bf\u09b0\u09b0 \u09ac\u09cd\u09af\u09b9\u09be\u09b0 \u0995\u09b0\u09c1\u09a8 \u2014 \u09b8\u09c7\u0996\u09be\u09a8\u09c7 \u0995\u09cb\u09a1 \u09b6\u09c1\u09a7\u09c1 \u0993\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09bf\u09a4 \u09a5\u09be\u0995\u09ac\u09c7.',
    failoverCount: (n) => `ব্যাকআপ মিররে যাওয়া হচ্ছে ${n} সেকেন্ডের মধ্যে…`,
    failoverStay: 'এখানেই থাকুন',
    gateShareNote: 'আপনার কোডও পুলে যোগ হবে, যেন অন্যরা ব্যবহার করতে পারে। এটি আর কখনো আপনাকে দেখানো হবে না।',
    foot: 'স্বাধীন কমিউনিটি টুল। নুসুক বা হজ ও উমরাহ মন্ত্রণালয়ের সাথে সম্পর্কিত নয়। আমরা কখনো লগইন চাই না।',
    gateTitle: 'আপনার নুসুক কী দিন',
    gateSub: 'এটিই এখানে আপনার ব্যক্তিগত আইডি। কোন কোড আপনি ব্যবহার করেছেন তা যেকোনো ডিভাইসে মনে রাখতে এটি ব্যবহার হয়। কুকিতে সেভ থাকে, তাই একবারই দিতে হবে।',
    gateGo: 'এগিয়ে যান', gateAnon: 'আমার এখনো কী নেই',
    gateHint: 'নুসুকে পাবেন: Start the challenge → Share → NG- দিয়ে শুরু কোডটি কপি করুন।',
    by: (n) => (n ? `শেয়ার করেছেন ${n}` : ''),
    activeNow: (n) => `${n} জন এখন সক্রিয়`,
    copiedToday: (n) => `আজ ${n} বার কপি`,
    addedSub: (today, latest) => (latest ? `সর্বশেষ: ${latest} (আজ +${today})` : `আজ +${today}টি যুক্ত`),
    stats: (c, r, mine) =>
      `কপি করেছেন <b>${c}</b> · বাকি <b>${r}</b>` +
      (mine ? ` · আপনার কোড (${mine.code}) কপি হয়েছে <b>${mine.copies} বার</b>` : ''),
    shown: (n) => `${n}${n >= 60 ? '+' : ''}টি দেখানো হচ্ছে`,
    none: 'এখানে কিছু নেই।', allDone: 'সব কোড ব্যবহার হয়ে গেছে। পরে আবার দেখুন!',
    toastCopied: (c) => `${c} কপি হয়েছে। নুসুকে পেস্ট করুন`,
    toastNusuk: (c) => `নুসুক অ্যাপ খুলছে — ${c} কপি হয়েছে, প্রয়োজনে সেখানে পেস্ট করুন`,
    toastNoted: 'ঠিক আছে, পরেরটা!', toastBad: 'ধন্যবাদ, রিপোর্ট হয়েছে', toastUndo: 'আনডু হয়েছে',
    toastShared: 'আপনার কোড পুলে যোগ হয়েছে', toastWelcome: 'স্বাগতম',
    err: {
      empty: 'আগে একটি কোড পেস্ট করুন।', invalid_code: 'এটি নুসুক কী মনে হচ্ছে না। NG- এর পরে ৮টি অক্ষর থাকতে হবে।',
      duplicate: 'এই কোড আগেই শেয়ার হয়েছে।', device_limit: 'শেয়ারের সীমা শেষ।',
      name_link: 'নামে লিংক দেওয়া যাবে না।', name_number: 'নামে ফোন নম্বর দেওয়া যাবে না।', server: 'সমস্যা হয়েছে, আবার চেষ্টা করুন।'
    }
  },
  ar: {
    dir: 'rtl',
    guestWarnText: 'أنت تتصفح بدون مفتاح نسك الخاص بك — أدخل مفتاحك لحفظ سجل الأكواد المستخدمة والمتبقية عبر جميع أجهزتك.',
    guestWarnBtn: 'أدخل مفتاحي ←',
    mVisitorsLabel: 'الزوار الفعليون',
    mCopiesLabel: 'مرات نسخ الكود',
    mAddedLabel: 'أكواد أُضيفت حديثًا',
    heroTitle: 'كود إحالة. انسخ كودًا واحصل على مفتاح.',
    heroSub: 'اضغط مرة واحدة للنسخ ثم الصقه في تطبيق نسك. نتذكر ما استخدمته فلا يظهر لك الكود نفسه مرتين.',
    nextCode: 'كودك التالي', copyNext: 'انسخ واعرض التالي', skip: 'تخطي',
    copied: 'تم النسخ', alreadyUsed: 'مستخدم سابقًا', invalid: 'لا يعمل', undo: 'تراجع',
    s1t: 'انسخ كودًا', s1d: 'استخدم الزر الكبير أو اضغط أي كود بالأسفل.',
    s2t: 'افتح في تطبيق نسك', s2d: 'ابدأ التحدي في تطبيق نسك أولاً، ثم اضغط هنا — من المفترض أن يكون الكود مملوءًا بالفعل. إن لم يكن، الصقه فقط.',
    s3t: 'لم يُقبل؟ التالي.', s3d: 'علّمه ولن نعرضه لك مجددًا.',
    search: 'ابحث عن كود…', fRemaining: 'المتبقي', fNew: 'المضاف حديثًا', fUsed: 'المستخدم', fAll: 'الكل', more: 'عرض المزيد',
    addTitle: 'لديك كود آخر للمشاركة؟', shareBtn: 'مشاركة',
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
    gateHint: 'تجده في نسك: ابدأ التحدي ← مشاركة ← انسخ الكود الذي يبدأ بـ NG-.',
    by: (n) => (n ? `شاركه ${n}` : ''),
    activeNow: (n) => `${n} متصل الآن`,
    copiedToday: (n) => `${n} نُسخ اليوم`,
    addedSub: (today, latest) => (latest ? `الأحدث: ${latest} (+${today} اليوم)` : `+${today} أُضيف اليوم`),
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
      empty: 'الصق كودًا أولًا.', invalid_code: 'لا يبدو مفتاح نسك. هو NG- يليه 8 أحرف.',
      duplicate: 'هذا الكود مُشارك بالفعل.', device_limit: 'وصلت إلى حد المشاركة.',
      name_link: 'لا يمكن أن يحتوي الاسم على روابط.', name_number: 'لا يمكن أن يحتوي الاسم على أرقام هواتف.', server: 'حدث خطأ، حاول مرة أخرى.'
    }
  },
  ur: {
    dir: 'rtl',
    guestWarnText: 'آپ اپنی نسک کی کے بغیر براؤز کر رہے ہیں — اپنی کی درج کریں تاکہ آپ کے استعمال شدہ اور باقی کوڈز تمام آلات پر محفوظ رہیں۔',
    guestWarnBtn: 'میری کی درج کریں →',
    mVisitorsLabel: 'اصل وزٹرز',
    mCopiesLabel: 'کوڈ کاپی کی تعداد',
    mAddedLabel: 'نئے شامل شدہ کوڈز',
    heroTitle: 'ریفرل کوڈز۔ ایک کاپی کریں، ایک کی حاصل کریں۔',
    heroSub: 'ایک بار ٹیپ کر کے کاپی کریں، نسک ایپ میں پیسٹ کریں۔ ہم یاد رکھتے ہیں کہ آپ نے کیا استعمال کیا، اس لیے آپ کو وہی کوڈ دوبارہ کبھی نہیں دکھایا جائے گا۔',
    nextCode: 'آپ کا اگلا کوڈ',
    copyNext: 'کاپی کریں اور اگلا دکھائیں',
    skip: 'چھوڑیں',
    copied: 'کاپی ہو گیا',
    alreadyUsed: 'پہلے سے استعمال شدہ',
    invalid: 'کام نہیں کرتا',
    undo: 'واپس کریں',
    s1t: 'ایک کوڈ کاپی کریں',
    s1d: 'بڑا بٹن استعمال کریں یا نیچے کسی بھی کوڈ پر ٹیپ کریں۔',
    s2t: 'نسک ایپ میں کھولیں',
    s2d: 'پہلے نسک ایپ میں چیلنج شروع کریں، پھر یہاں ٹیپ کریں — کوڈ پہلے سے بھرا ہونا چاہیے۔ اگر نہیں، تو بس پیسٹ کریں۔',
    s3t: 'قبول نہیں ہوا؟ اگلا۔',
    s3d: 'اسے نشان زد کریں اور ہم اسے دوبارہ کبھی نہیں دکھائیں گے۔',
    search: 'کوڈز تلاش کریں…',
    fRemaining: 'باقی',
    fNew: 'نئے شامل شدہ',
    fUsed: 'استعمال شدہ',
    fAll: 'سب',
    more: 'مزید لوڈ کریں',
    addTitle: 'کوئی اور کوڈ شیئر کرنا ہے؟',
    shareBtn: 'شیئر کریں',
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
    gateHint: 'نسک میں تلاش کریں: چیلنج شروع کریں → شیئر کریں → وہ کوڈ کاپی کریں جو NG- سے شروع ہوتا ہے۔',
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
    err: { empty: 'براہ کرم پہلے ایک کوڈ پیسٹ کریں۔', invalid_code: 'یہ نسک کی جیسی نہیں لگتی۔ یہ NG- کے بعد 8 حروف ہوتی ہے۔', duplicate: 'یہ کوڈ پہلے سے شیئر کیا گیا ہے۔', device_limit: 'آپ شیئر کرنے کی حد تک پہنچ گئے ہیں۔', name_link: 'ناموں میں لنکس نہیں ہو سکتے۔', name_number: 'ناموں میں فون نمبر نہیں ہو سکتے۔', server: 'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔' },
  },
  id: {
    dir: 'ltr',
    guestWarnText: 'Anda menjelajah tanpa kunci Nusuk — masukkan kunci Anda agar kode yang sudah dipakai dan tersisa tetap tersimpan di semua perangkat.',
    guestWarnBtn: 'Masukkan Kunci Saya →',
    mVisitorsLabel: 'Pengunjung Asli',
    mCopiesLabel: 'Jumlah Salinan Kode',
    mAddedLabel: 'Kode Baru Ditambahkan',
    heroTitle: 'kode referral. Salin satu, dapatkan satu kunci.',
    heroSub: 'Ketuk sekali untuk menyalin, tempel di aplikasi Nusuk. Kami mengingat yang sudah Anda pakai, jadi Anda tidak akan pernah melihat kode yang sama dua kali.',
    nextCode: 'Kode Anda berikutnya',
    copyNext: 'Salin & tampilkan berikutnya',
    skip: 'Lewati',
    copied: 'Tersalin',
    alreadyUsed: 'Sudah dipakai',
    invalid: 'Tidak berfungsi',
    undo: 'Urungkan',
    s1t: 'Salin sebuah kode',
    s1d: 'Gunakan tombol besar atau ketuk kode apa pun di bawah.',
    s2t: 'Buka di aplikasi Nusuk',
    s2d: 'Mulai tantangan di aplikasi Nusuk dulu, lalu ketuk di sini — kodenya seharusnya sudah terisi. Jika belum, tempel saja.',
    s3t: 'Tidak diterima? Berikutnya.',
    s3d: 'Tandai, dan kami tidak akan pernah menampilkannya lagi.',
    search: 'Cari kode…',
    fRemaining: 'Tersisa',
    fNew: 'Baru Ditambahkan',
    fUsed: 'Dipakai',
    fAll: 'Semua',
    more: 'Muat lebih banyak',
    addTitle: 'Punya kode lain untuk dibagikan?',
    shareBtn: 'Bagikan',
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
    gateHint: 'Temukan di Nusuk: Mulai tantangan → Bagikan → salin kode yang diawali NG-.',
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
    err: { empty: 'Tempel sebuah kode dulu.', invalid_code: 'Itu tidak tampak seperti kunci Nusuk. Formatnya NG- diikuti 8 karakter.', duplicate: 'Kode itu sudah dibagikan.', device_limit: 'Anda telah mencapai batas berbagi.', name_link: 'Nama tidak boleh berisi tautan.', name_number: 'Nama tidak boleh berisi nomor telepon.', server: 'Terjadi kesalahan. Coba lagi.' },
  },
  tr: {
    dir: 'ltr',
    guestWarnText: 'Nusuk anahtarınız olmadan geziniyorsunuz — kullandığınız ve kalan kodların tüm cihazlarda kayıtlı kalması için anahtarınızı girin.',
    guestWarnBtn: 'Anahtarımı Gir →',
    mVisitorsLabel: 'Gerçek Ziyaretçiler',
    mCopiesLabel: 'Kod Kopyalama Sayısı',
    mAddedLabel: 'Yeni Eklenen Kodlar',
    heroTitle: 'yönlendirme kodları. Birini kopyalayın, bir anahtar kazanın.',
    heroSub: 'Kopyalamak için bir kez dokunun, Nusuk uygulamasına yapıştırın. Neyi kullandığınızı hatırlıyoruz, böylece aynı kodu iki kez görmezsiniz.',
    nextCode: 'Sonraki kodunuz',
    copyNext: 'Kopyala ve sonrakini göster',
    skip: 'Atla',
    copied: 'Kopyalandı',
    alreadyUsed: 'Zaten kullanılmış',
    invalid: 'Çalışmıyor',
    undo: 'Geri al',
    s1t: 'Bir kod kopyalayın',
    s1d: 'Büyük düğmeyi kullanın veya aşağıdaki herhangi bir koda dokunun.',
    s2t: 'Nusuk uygulamasında açın',
    s2d: 'Önce Nusuk uygulamasında meydan okumayı başlatın, sonra buraya dokunun — kod zaten doldurulmuş olmalı. Değilse, yapıştırın.',
    s3t: 'Kabul edilmedi mi? Sonraki.',
    s3d: 'İşaretleyin, bir daha asla göstermeyelim.',
    search: 'Kod arayın…',
    fRemaining: 'Kalan',
    fNew: 'Yeni Eklenen',
    fUsed: 'Kullanılan',
    fAll: 'Tümü',
    more: 'Daha fazla yükle',
    addTitle: 'Paylaşacak başka kodunuz var mı?',
    shareBtn: 'Paylaş',
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
    gateHint: 'Nusuk\'ta bulun: Meydan okumayı başlat → Paylaş → NG- ile başlayan kodu kopyalayın.',
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
    err: { empty: 'Önce bir kod yapıştırın.', invalid_code: 'Bu bir Nusuk anahtarına benzemiyor. NG- ve ardından 8 karakter olmalı.', duplicate: 'Bu kod zaten paylaşılmış.', device_limit: 'Paylaşım sınırına ulaştınız.', name_link: 'Adlar bağlantı içeremez.', name_number: 'Adlar telefon numarası içeremez.', server: 'Bir şeyler yanlış gitti. Tekrar deneyin.' },
  },
  hi: {
    dir: 'ltr',
    guestWarnText: 'आप अपनी नुसुक कुंजी के बिना ब्राउज़ कर रहे हैं — अपनी कुंजी दर्ज करें ताकि आपके उपयोग किए गए और शेष कोड सभी उपकरणों पर सहेजे रहें।',
    guestWarnBtn: 'मेरी कुंजी दर्ज करें →',
    mVisitorsLabel: 'वास्तविक आगंतुक',
    mCopiesLabel: 'कोड कॉपी की संख्या',
    mAddedLabel: 'नए जोड़े गए कोड',
    heroTitle: 'रेफ़रल कोड। एक कॉपी करें, एक कुंजी पाएं।',
    heroSub: 'कॉपी करने के लिए एक बार टैप करें, नुसुक ऐप में पेस्ट करें। हम याद रखते हैं कि आपने क्या उपयोग किया है, इसलिए आप वही कोड दोबारा कभी नहीं देखेंगे।',
    nextCode: 'आपका अगला कोड',
    copyNext: 'कॉपी करें और अगला दिखाएं',
    skip: 'छोड़ें',
    copied: 'कॉपी हो गया',
    alreadyUsed: 'पहले से उपयोग किया गया',
    invalid: 'काम नहीं करता',
    undo: 'वापस लें',
    s1t: 'एक कोड कॉपी करें',
    s1d: 'बड़े बटन का उपयोग करें या नीचे किसी भी कोड पर टैप करें।',
    s2t: 'नुसुक ऐप में खोलें',
    s2d: 'पहले नुसुक ऐप में चुनौती शुरू करें, फिर यहाँ टैप करें — कोड पहले से भरा होना चाहिए। यदि नहीं, तो बस पेस्ट करें।',
    s3t: 'स्वीकार नहीं हुआ? अगला।',
    s3d: 'इसे चिह्नित करें और हम इसे फिर कभी नहीं दिखाएंगे।',
    search: 'कोड खोजें…',
    fRemaining: 'शेष',
    fNew: 'नए जोड़े गए',
    fUsed: 'उपयोग किए गए',
    fAll: 'सभी',
    more: 'और लोड करें',
    addTitle: 'साझा करने के लिए कोई और कोड है?',
    shareBtn: 'साझा करें',
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
    gateHint: 'नुसुक में खोजें: चुनौती शुरू करें → साझा करें → NG- से शुरू होने वाला कोड कॉपी करें।',
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
    err: { empty: 'कृपया पहले एक कोड पेस्ट करें।', invalid_code: 'यह नुसुक कुंजी जैसी नहीं लगती। यह NG- के बाद 8 वर्ण होती है।', duplicate: 'वह कोड पहले से साझा किया गया है।', device_limit: 'आप साझा करने की सीमा तक पहुँच गए हैं।', name_link: 'नामों में लिंक नहीं हो सकते।', name_number: 'नामों में फ़ोन नंबर नहीं हो सकते।', server: 'कुछ गलत हो गया। पुनः प्रयास करें।' },
  },

};

// Mandatory first code: every new user is shown this code first.
// It already exists in the repository (id nk-12256) — reused, never
// duplicated. Once a user copies/reports it, the one-time-per-user
// rule hides it from them like any other code.
const FIRST_CODE = 'NG-0GjkSPjM';
const FIRST_CODE_ID = 'nk-12256';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Number(n || 0).toLocaleString('en');
const COPY_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const state = {
  lang: localStorage.getItem('mk_lang') || 'en',
  key: null,
  me: { copied: 0, copied_today: 0, remaining: 0, total: 0, anon: false, mine: null },
  stats: {
    codes: 0,
    used_today: 0,
    used_total: 0,
    visitors_online: 1,
    visitors_total: 1,
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
  document.querySelectorAll('[data-i18n]').forEach((el) => { if (d[el.dataset.i18n]) el.textContent = d[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = d[el.dataset.i18nPh] || ''; });
  renderAll();
}

// ---------- Rendering ----------
function renderAll() {
  renderGuestWarning();
  renderMetrics();
  renderDispenser();
  renderGrid();
  updateNusukLink();
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
  // Show the true counts from the server (no minimum fudge: a real
  // 0 is honest, and the backend now counts every visitor even while
  // D1 reads are exhausted, so these are accurate, not placeholders).
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
        return `<button type="button" class="chip${c.used ? ' used' : ''}" data-id="${esc(c.id)}" data-code="${esc(c.code)}" dir="ltr">
          <span><span class="pre">NG-</span>${esc(c.code.slice(3))}</span>
          <span class="chip-right">${badge}${c.used ? CHECK_ICON : COPY_ICON}</span>
        </button>`;
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
      caches.open('nk-v14').then((c) => c.put(file, clone)).catch(() => {});
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
  if (d.ok) { state.me = d.me; state.stats = d.stats; renderAll(); }
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
// handles natively. The code is also copied to the clipboard first,
// in case the app still needs a manual paste.
const NUSUK_WEB_LINK = (code) => 'https://services.nusuk.sa/app/?p=27&id=' + encodeURIComponent(code);
const NUSUK_INTENT_LINK = (code) => {
  const web = NUSUK_WEB_LINK(code);
  return 'intent://services.nusuk.sa/app/?p=27&id=' + encodeURIComponent(code) +
    '#Intent;scheme=https;package=com.moh.nusukapp;S.browser_fallback_url=' +
    encodeURIComponent(web) + ';end';
};
const IS_ANDROID = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
const NUSUK_DEEP_LINK = (code) => IS_ANDROID ? NUSUK_INTENT_LINK(code) : NUSUK_WEB_LINK(code);

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
      state.me = { copied: savedUsed.length, copied_today: 0, remaining: Math.max(0, state.codes.all.length - savedUsed.length), total: state.codes.all.length, anon: true, mine: null };
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
  state.codes.usedIds = new Set(d.usedIds || []);
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
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
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
    loadList(true);
  });

  let timer;
  $('q').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.list.q = e.target.value.trim(); loadList(true); }, 250);
  });

  $('share-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('share-err');
    err.classList.add('hidden');
    const d = await api('share', { code: $('share-input').value });
    if (!d.ok) { err.textContent = t('err')[d.error] || t('err').server; err.classList.remove('hidden'); return; }
    $('share-input').value = '';
    toast(t('toastShared'));
    // Add the shared code to the client-side list so it appears at once.
    if (d.code && state.codes.loaded && !state.codes.byId.has(d.code.id)) {
      const c = {
        id: d.code.id, code: d.code.code, rid: d.code.rid,
        device_id: d.code.device_id || 'community-import',
        name: d.code.name || '', copies: 0, used: 0
      };
      state.codes.all.push(c);
      state.codes.byId.set(c.id, c);
      state.codes.all.sort((a, b) => a.rid - b.rid);
      refreshQueue();
    }
    await loadStats();
    if (state.list.filter === 'new') loadList(true);
  });

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
  buildShareLinks();
  applyLang(state.lang);
  const saved = readCookie() || localStorage.getItem('mk_key');
  if (!saved) return showGate();
  state.key = saved;
  const d = await startSession({ key: saved });
  if (!d.ok && d.error !== 'network') { forgetKey(); showGate(); }
  // Periodically refresh real visitor & copy stats every 60s, and
  // immediately when the tab comes back into view. 60s (not 30s)
  // halves the recurring Function calls — the free tier allows
  // 100k/day — and the 'active now' window is 2 minutes, so the
  // number stays current.
  setInterval(() => {
    if (document.visibilityState === 'visible' && state.key) loadStats();
  }, 60000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.key) loadStats();
  });
}

boot();
