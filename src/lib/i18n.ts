export type Locale = 'ku' | 'ar' | 'en';

export type Direction = 'rtl' | 'ltr';

export function getDirection(locale: Locale): Direction {
  return locale === 'en' ? 'ltr' : 'rtl';
}

export function getFontFamily(locale: Locale): string {
  return locale === 'en' ? "'Geist', sans-serif" : "'Noto Sans Arabic', sans-serif";
}

export const translations = {
  ku: {
    // Header / Nav
    'nav.createButton': 'دروستی بکە',
    'nav.cardMaker': 'ئامێری دروستکردنی کارت',

    // Landing page
    'landing.badge': '✦ بەخۆڕایی — بەبێ تۆمارکردن',
    'landing.heroTitle': 'کارتی بزنسی ئامادەکە',
    'landing.heroSubtitle': 'لە چەند چرکەیەکدا',
    'landing.heroDesc': 'کارتی بزنسی پیشەیی بۆ خۆت ئامادەبکە — بەکوردی، عەرەبی، یان ئینگلیزی. پی‌دی‌ئێف دابەزێنە، بەبێ هیچ تۆمارکردنێک.',
    'landing.ctaButton': '🎨 دروستی بکە — بەخۆڕایی',
    'landing.ctaSubtext': 'هیچ تۆمارکردنێک پێویست نییە',
    'landing.templatesTitle': 'چوار شێوازی جیاواز',
    'landing.templatesDesc': 'شێوازێک هەڵبژێرە کە لە خۆت نوێنەرایەتی بکات',
    'landing.feature1Title': 'سێ زمان',
    'landing.feature1Desc': 'کوردی، عەرەبی، ئینگلیزی — هەموو لەگەڵ پشتگیری چەپ‌بەراستەوە و ڕاست‌بەچەپەوە',
    'landing.feature1Icon': '🌐',
    'landing.feature2Title': 'خێرا و ئاسان',
    'landing.feature2Desc': 'زانیاریت داخڵ بکە، پێشبینی زیندوو ببینە، PIF دابەزێنە — هەمووی لەسەر وێب',
    'landing.feature2Icon': '⚡',
    'landing.feature3Title': 'چوار شێواز',
    'landing.feature3Desc': 'مۆدێرن، کلاسیک، بۆڵد، مینیمال — شێوازێک هەڵبژێرە کە لە پیشەی خۆت نوێنەرایەتی بکات',
    'landing.feature3Icon': '🎨',
    'landing.ctaBottomTitle': 'ئەمڕۆ کارتەکەت ئامادەبکە',
    'landing.ctaBottomDesc': 'بەخۆڕایی — بەبێ تۆمارکردن — PIF دابەزێنە',
    'landing.ctaBottomButton': 'دروستی بکە — ئیستا',
    'landing.footerText': '© 2026 kart.krd — دروستکراوە لە کوردستان 🏔️',

    // Template names
    'template.modern': 'مۆدێرن',
    'template.classic': 'کلاسیک',
    'template.bold': 'بۆڵد',
    'template.minimal': 'مینیمال',

    // Editor page
    'editor.enterInfo': 'زانیاریەکانت داخڵ بکە',
    'editor.clear': 'پاککردنەوە',
    'editor.livePreview': 'پێشبینی زیندوو',
    'editor.front': 'پێشەوە',
    'editor.back': 'پشتەوە',
    'editor.downloadPdf': '⬇ PDF دابەزێنە',
    'editor.downloadPdfFree': '⬇ PDF دابەزێنە — بەخۆڕایی',
    'editor.downloaded': '✓ دابەزیندرا',
    'editor.downloading': '⏳ چاوەڕێبکە...',
    'editor.wait': 'چاوەڕێبکە...',
    'editor.watermarkNote': 'تێبینی: "kart.krd" بە وتەی بچووک لە خوارەوە زیاد دەکرێت',
    'editor.pdfError': 'PDF دروستکردن سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە.',
    'editor.loading': 'چاوەڕێبکە...',
    'editor.tabEdit': 'دەستکاری',
    'editor.tabPreview': 'پێشبینی',

    // Card form
    'form.cardLanguage': 'زمانی کارت',
    'form.personalInfo': 'زانیاری کەسی',
    'form.contactInfo': 'زانیاری پەیوەندی',
    'form.newFeatures': 'تایبەتمەندیەکانی نوێ',
    'form.socialMedia': 'میدیای کۆمەڵایەتی (ئیختیاری)',
    'form.socialToggle': 'میدیای کۆمەڵایەتی',
    'form.fullName': 'ناوی تەواو',
    'form.jobTitle': 'پیشە',
    'form.company': 'ناوی کۆمپانیا',
    'form.phone': 'ژمارەی مۆبایل',
    'form.email': 'ئیمەیل',
    'form.website': 'وێبسایت',
    'form.address': 'ناونیشان',
    'form.namePlaceholder': 'ناوی تەواو',
    'form.titlePlaceholder': 'بەڕێوەبەر، دیزاینەر، ...',
    'form.companyPlaceholder': 'ناوی کۆمپانیا (ئیختیاری)',
    'form.phonePlaceholder': '+964 750 000 0000',
    'form.emailPlaceholder': 'name@example.com',
    'form.websitePlaceholder': 'www.example.com',
    'form.addressPlaceholder': 'شار، کوی، ...',
    'form.qrCode': 'QR کۆد',
    'form.logo': 'لۆگۆ',
    'form.removeLogo': 'سڕینەوە',
    'form.fileTooLarge': 'پەڕگەکە گەورەترە لە 2MB. تکایە پەڕگەیەکی بچووکتر هەڵبژێرە.',
    'form.facebook': 'فەیسبووک',
    'form.instagram': 'ئینستاگرام',
    'form.linkedin': 'لینکدین',
    'form.twitter': 'ئێکس / تویتەر',
    'form.selectTemplate': 'شێواز هەڵبژێرە',
    'form.facebookPlaceholder': 'facebook.com/ناوی بەکارهێنەر',
    'form.instagramPlaceholder': '@ناوی بەکارهێنەر',
    'form.linkedinPlaceholder': 'linkedin.com/in/ناوی بەکارهێنەر',
    'form.twitterPlaceholder': '@ناوی بەکارهێنەر',

    // Accessibility
    'alt.logo': 'لۆگۆ',
    'alt.qrCode': 'QR کۆد',
    'alt.logoPreview': 'پێشبینی لۆگۆ',

    // Preview fallbacks
    'preview.name': 'ئەحمەد عەلی',
    'preview.title': 'بەڕێوەبەر',

    // Validation
    'validation.nameRequired': 'ناو پێویستە',
    'validation.emailInvalid': 'فۆرماتی ئیمەیل هەڵەیە',
    'validation.phoneInvalid': 'تەنها ژمارە، +، - ڕێگەپێدراوە',

    // Card language names (for the card language selector)
    'cardLang.ku': 'کوردی',
    'cardLang.ar': 'عەرەبی',
    'cardLang.en': 'English',
  },
  ar: {
    // Header / Nav
    'nav.createButton': 'أنشئ الآن',
    'nav.cardMaker': 'أداة إنشاء البطاقات',

    // Landing page
    'landing.badge': '✦ مجاني — بدون تسجيل',
    'landing.heroTitle': 'بطاقة أعمال جاهزة',
    'landing.heroSubtitle': 'في ثوانٍ معدودة',
    'landing.heroDesc': 'أنشئ بطاقة أعمال احترافية — بالكردية أو العربية أو الإنجليزية. حمّل PDF فوراً، بدون أي تسجيل.',
    'landing.ctaButton': '🎨 أنشئ مجاناً',
    'landing.ctaSubtext': 'لا حاجة للتسجيل',
    'landing.templatesTitle': 'أربعة أنماط مختلفة',
    'landing.templatesDesc': 'اختر نمطاً يمثّل مهنتك',
    'landing.feature1Title': 'ثلاث لغات',
    'landing.feature1Desc': 'الكردية والعربية والإنجليزية — مع دعم كامل للنصوص من اليمين واليسار',
    'landing.feature1Icon': '🌐',
    'landing.feature2Title': 'سريع وسهل',
    'landing.feature2Desc': 'أدخل بياناتك، شاهد المعاينة الحية، حمّل PDF — كل شيء على الويب',
    'landing.feature2Icon': '⚡',
    'landing.feature3Title': 'أربعة أنماط',
    'landing.feature3Desc': 'حديث، كلاسيكي، عريض، بسيط — اختر النمط الذي يمثّل مهنتك',
    'landing.feature3Icon': '🎨',
    'landing.ctaBottomTitle': 'أنشئ بطاقتك اليوم',
    'landing.ctaBottomDesc': 'مجاني — بدون تسجيل — حمّل PDF',
    'landing.ctaBottomButton': 'أنشئ الآن',
    'landing.footerText': '© 2026 kart.krd — صُنع في كردستان 🏔️',

    // Template names
    'template.modern': 'حديث',
    'template.classic': 'كلاسيكي',
    'template.bold': 'عريض',
    'template.minimal': 'بسيط',

    // Editor page
    'editor.enterInfo': 'أدخل بياناتك',
    'editor.clear': 'مسح',
    'editor.livePreview': 'معاينة حية',
    'editor.front': 'الأمام',
    'editor.back': 'الخلف',
    'editor.downloadPdf': '⬇ تحميل PDF',
    'editor.downloadPdfFree': '⬇ تحميل PDF — مجاناً',
    'editor.downloaded': '✓ تم التحميل',
    'editor.downloading': '⏳ انتظر...',
    'editor.wait': 'انتظر...',
    'editor.watermarkNote': 'ملاحظة: يُضاف "kart.krd" بخط صغير في الأسفل',
    'editor.pdfError': 'فشل إنشاء PDF. يرجى المحاولة مرة أخرى.',
    'editor.loading': 'انتظر...',
    'editor.tabEdit': 'تحرير',
    'editor.tabPreview': 'معاينة',

    // Card form
    'form.cardLanguage': 'لغة البطاقة',
    'form.personalInfo': 'المعلومات الشخصية',
    'form.contactInfo': 'معلومات الاتصال',
    'form.newFeatures': 'ميزات جديدة',
    'form.socialMedia': 'وسائل التواصل (اختياري)',
    'form.socialToggle': 'وسائل التواصل',
    'form.fullName': 'الاسم الكامل',
    'form.jobTitle': 'المسمى الوظيفي',
    'form.company': 'اسم الشركة',
    'form.phone': 'رقم الهاتف',
    'form.email': 'البريد الإلكتروني',
    'form.website': 'الموقع الإلكتروني',
    'form.address': 'العنوان',
    'form.namePlaceholder': 'الاسم الكامل',
    'form.titlePlaceholder': 'مدير، مصمم، ...',
    'form.companyPlaceholder': 'اسم الشركة (اختياري)',
    'form.phonePlaceholder': '+964 750 000 0000',
    'form.emailPlaceholder': 'name@example.com',
    'form.websitePlaceholder': 'www.example.com',
    'form.addressPlaceholder': 'المدينة، الحي، ...',
    'form.qrCode': 'رمز QR',
    'form.logo': 'الشعار',
    'form.removeLogo': 'إزالة',
    'form.fileTooLarge': 'الملف أكبر من 2MB. يرجى اختيار ملف أصغر.',
    'form.facebook': 'فيسبوك',
    'form.instagram': 'إنستاغرام',
    'form.linkedin': 'لينكدإن',
    'form.twitter': 'إكس / تويتر',
    'form.selectTemplate': 'اختر النمط',
    'form.facebookPlaceholder': 'facebook.com/اسم المستخدم',
    'form.instagramPlaceholder': '@اسم المستخدم',
    'form.linkedinPlaceholder': 'linkedin.com/in/اسم المستخدم',
    'form.twitterPlaceholder': '@اسم المستخدم',

    // Accessibility
    'alt.logo': 'الشعار',
    'alt.qrCode': 'رمز QR',
    'alt.logoPreview': 'معاينة الشعار',

    // Preview fallbacks
    'preview.name': 'أحمد علي',
    'preview.title': 'مدير',

    // Validation
    'validation.nameRequired': 'الاسم مطلوب',
    'validation.emailInvalid': 'صيغة البريد الإلكتروني غير صحيحة',
    'validation.phoneInvalid': 'مسموح فقط بالأرقام و + و -',

    // Card language names
    'cardLang.ku': 'الكردية',
    'cardLang.ar': 'العربية',
    'cardLang.en': 'English',
  },
  en: {
    // Header / Nav
    'nav.createButton': 'Create',
    'nav.cardMaker': 'Card Maker',

    // Landing page
    'landing.badge': '✦ Free — No Registration Required',
    'landing.heroTitle': 'Create Professional',
    'landing.heroSubtitle': 'Business Cards in Seconds',
    'landing.heroDesc': 'Generate professional business cards in Kurdish, Arabic, or English. Download as PDF instantly, no account required.',
    'landing.ctaButton': '🎨 Create Free Card',
    'landing.ctaSubtext': 'No registration required',
    'landing.templatesTitle': 'Four Different Styles',
    'landing.templatesDesc': 'Choose a template that represents your profession',
    'landing.feature1Title': '3 Languages',
    'landing.feature1Desc': 'Kurdish, Arabic, English — all with full RTL and LTR text support',
    'landing.feature1Icon': '🌐',
    'landing.feature2Title': 'Fast & Easy',
    'landing.feature2Desc': 'Enter your details, see live preview, download PDF — all in your browser',
    'landing.feature2Icon': '⚡',
    'landing.feature3Title': '4 Templates',
    'landing.feature3Desc': 'Modern, Classic, Bold, Minimal — choose a style that represents your profession',
    'landing.feature3Icon': '🎨',
    'landing.ctaBottomTitle': 'Create Your Card Today',
    'landing.ctaBottomDesc': 'Free — No Registration — Download PDF',
    'landing.ctaBottomButton': 'Create Now',
    'landing.footerText': '© 2026 kart.krd — Made in Kurdistan 🏔️',

    // Template names
    'template.modern': 'Modern',
    'template.classic': 'Classic',
    'template.bold': 'Bold',
    'template.minimal': 'Minimal',

    // Editor page
    'editor.enterInfo': 'Enter Your Information',
    'editor.clear': 'Clear',
    'editor.livePreview': 'Live Preview',
    'editor.front': 'Front',
    'editor.back': 'Back',
    'editor.downloadPdf': '⬇ Download PDF',
    'editor.downloadPdfFree': '⬇ Download PDF — Free',
    'editor.downloaded': '✓ Downloaded',
    'editor.downloading': '⏳ Please wait...',
    'editor.wait': 'Please wait...',
    'editor.watermarkNote': 'Note: "kart.krd" is added in small text at the bottom',
    'editor.pdfError': 'PDF generation failed. Please try again.',
    'editor.loading': 'Loading...',
    'editor.tabEdit': 'Edit',
    'editor.tabPreview': 'Preview',

    // Card form
    'form.cardLanguage': 'Card Language',
    'form.personalInfo': 'Personal Information',
    'form.contactInfo': 'Contact Information',
    'form.newFeatures': 'New Features',
    'form.socialMedia': 'Social Media (Optional)',
    'form.socialToggle': 'Social Media',
    'form.fullName': 'Full Name',
    'form.jobTitle': 'Job Title',
    'form.company': 'Company Name',
    'form.phone': 'Phone Number',
    'form.email': 'Email',
    'form.website': 'Website',
    'form.address': 'Address',
    'form.namePlaceholder': 'Full Name',
    'form.titlePlaceholder': 'Manager, Designer, ...',
    'form.companyPlaceholder': 'Company Name (Optional)',
    'form.phonePlaceholder': '+964 750 000 0000',
    'form.emailPlaceholder': 'name@example.com',
    'form.websitePlaceholder': 'www.example.com',
    'form.addressPlaceholder': 'City, Area, ...',
    'form.qrCode': 'QR Code',
    'form.logo': 'Logo',
    'form.removeLogo': 'Remove',
    'form.fileTooLarge': 'File is larger than 2MB. Please choose a smaller file.',
    'form.facebook': 'Facebook',
    'form.instagram': 'Instagram',
    'form.linkedin': 'LinkedIn',
    'form.twitter': 'X / Twitter',
    'form.selectTemplate': 'Choose Template',
    'form.facebookPlaceholder': 'facebook.com/username',
    'form.instagramPlaceholder': '@username',
    'form.linkedinPlaceholder': 'linkedin.com/in/username',
    'form.twitterPlaceholder': '@username',

    // Accessibility
    'alt.logo': 'Logo',
    'alt.qrCode': 'QR Code',
    'alt.logoPreview': 'Logo preview',

    // Preview fallbacks
    'preview.name': 'Ahmed Ali',
    'preview.title': 'Manager',

    // Validation
    'validation.nameRequired': 'Name is required',
    'validation.emailInvalid': 'Invalid email format',
    'validation.phoneInvalid': 'Only numbers, +, - are allowed',

    // Card language names
    'cardLang.ku': 'کوردی',
    'cardLang.ar': 'عربی',
    'cardLang.en': 'English',
  },
} as const;

export type TranslationKey = keyof typeof translations['ku'];
