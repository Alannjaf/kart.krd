export type Locale = 'ku' | 'ar' | 'en';

export type Direction = 'rtl' | 'ltr';

export function getDirection(locale: Locale): Direction {
  return locale === 'en' ? 'ltr' : 'rtl';
}

export function getFontFamily(locale: Locale): string {
  return locale === 'en' ? "var(--font-geist), sans-serif" : "var(--font-noto-arabic), sans-serif";
}

export const translations = {
  ku: {
    // Header / Nav
    'nav.createButton': 'کارتەکەت بچێنە',
    'nav.cardMaker': 'دروستکەری کارتی بزنس',

    // Landing page
    'landing.badge': '✦ بەخۆڕایی',
    'landing.heroTitle': 'کارتی بزنسیت ئامادەبکە',
    'landing.heroSubtitle': 'لە چەند چرکەیەکدا',
    'landing.heroDesc': 'کارتی بزنسی پیشەیی بۆ خۆت دروست بکە — بەکوردی، عەرەبی، یان ئینگلیزی. PDF دابەزێنە، بەبێ هیچ تۆمارکردنێک.',
    'landing.ctaButton': '🎨 ئیستا دروستی بکە — بەخۆڕایی',
    'landing.ctaSubtext': 'بەخۆڕایی — خۆتۆمار بکە',
    'landing.templatesTitle': 'هەشت شێوازی جیاواز',
    'landing.feature1Title': 'سێ زمان',
    'landing.feature1Desc': 'کوردی، عەرەبی، ئینگلیزی — هەموو لەگەڵ پشتگیری چەپبەراستەوە و ڕاستبەچەپەوە',
    'landing.feature2Title': 'خێرا و ئاسان',
    'landing.feature2Desc': 'زانیاریت داخڵ بکە، پێشبینی زیندوو ببینە، PDF دابەزێنە — هەمووی لەسەر وێب',
    'landing.feature3Title': 'هەشت شێواز',
    'landing.feature3Desc': 'نوێ، کلاسیک، بەهێز، سادە، شۆخ، داهێنانە، فەرمی، ڕەنگاوڕەنگ — شێوازێک هەڵبژێرە کە لە پیشەی خۆت نوێنەرایەتی بکات',
    'landing.ctaBottomTitle': 'ئەمڕۆ کارتەکەت ئامادەبکە',
    'landing.ctaBottomDesc': 'بەخۆڕایی — بەبێ تۆمارکردن — PDF دابەزێنە',
    'landing.ctaBottomButton': 'ئیستا دروستی بکە',
    'landing.footerText': '© 2026 kart.krd — دروستکراوە لە کوردستان 🏔️',

    // Template names
    'template.modern': 'نوێ',
    'template.classic': 'کلاسیک',
    'template.bold': 'بەهێز',
    'template.minimal': 'سادە',
    'template.elegant': 'شۆخ',
    'template.creative': 'داهێنانە',
    'template.corporate': 'فەرمی',
    'template.gradient': 'ڕەنگاوڕەنگ',

    // Editor page
    'editor.enterInfo': 'زانیاریەکانت بنووسە',
    'editor.clear': 'سڕینەوە',
    'editor.livePreview': 'پێشبینی زیندوو',
    'editor.front': 'پێشەوە',
    'editor.back': 'پشتەوە',
    'editor.cardSide': 'لای کارت',
    'editor.downloadPdf': '⬇ PDF دابەزێنە',
    'editor.downloadPdfFree': '⬇ PDF دابەزێنە — بەخۆڕایی',
    'editor.downloaded': '✓ دابەزیندرا',
    'editor.downloading': '⏳ چاوەڕێبکە...',
    'editor.wait': 'چاوەڕێبکە...',
    'editor.watermarkNote': 'تێبینی: نووسەی بچووکی "kart.krd" لە خوارەوەی کارت زیاد دەکرێت',
    'editor.pdfError': 'دروستکردنی PDF سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە.',
    'editor.clearConfirm': 'دڵنیایت لە سڕینەوەی هەموو زانیاریەکان؟',
    'editor.loading': 'چاوەڕێبکە...',
    'editor.tabEdit': 'دەستکاری',
    'editor.tabPreview': 'پێشبینی',

    // Card form
    'form.cardLanguage': 'زمانی کارت',
    'form.personalInfo': 'زانیاری کەسی',
    'form.contactInfo': 'زانیاری پەیوەندی',
    'form.newFeatures': 'تایبەتمەندیە نوێکان',
    'form.socialToggle': 'میدیای کۆمەڵایەتی',
    'form.fullName': 'ناوی تەواو',
    'form.jobTitle': 'بوار یان پیشە',
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
    'form.removeLogo': 'لابردن',
    'form.fileTooLarge': 'پەڕگەکە گەورەتر لە 2MB ە. تکایە پەڕگەیەکی بچووکتر هەڵبژێرە.',
    'form.logoWarning': 'لۆگۆ پاش نوێکردنەوەی لاپەڕە نامێنێتەوە.',
    'form.facebook': 'فەیسبووک',
    'form.instagram': 'ئینستاگرام',
    'form.linkedin': 'لینکدین',
    'form.twitter': 'ئێکس / تویتەر',
    'form.selectTemplate': 'شێواز هەڵبژێرە',
    'form.facebookPlaceholder': 'facebook.com/ناوەکەت',
    'form.instagramPlaceholder': '@ناوەکەت',
    'form.linkedinPlaceholder': 'linkedin.com/in/ناوەکەت',
    'form.twitterPlaceholder': '@ناوەکەت',

    // Accessibility
    'alt.logo': 'لۆگۆ',
    'alt.qrCode': 'QR کۆد',
    'alt.logoPreview': 'پێشبینی لۆگۆ',

    // Preview fallbacks
    'preview.name': 'ئەحمەد عەلی',
    'preview.title': 'بەڕێوەبەر',

    // Validation
    'validation.nameRequired': 'ناو پێویستە',
    'validation.emailInvalid': 'ئیمەیلەکە هەڵەیە',
    'validation.phoneInvalid': 'تەنها ژمارە، +، و - ڕێگەپێدراوە',

    // Card language names (for the card language selector)
    'cardLang.ku': 'کوردی',
    'cardLang.ar': 'عەرەبی',
    'cardLang.en': 'English',

    // Auth
    'auth.signIn': 'چوونەژوورەوە',
    'auth.signOut': 'چوونەدەرەوە',
    'auth.account': 'هەژمار',

    // Cards (save/load)
    'cards.save': 'پاشەکەوتکردن',
    'cards.saving': 'پاشەکەوت دەکرێت...',
    'cards.saved': 'پاشەکەوت کرا',
    'cards.saveError': 'پاشەکەوتکردن سەرکەوتوو نەبوو',
    'cards.myCards': 'کارتەکانم',
    'cards.noCards': 'هیچ کارتێکت نیە',
    'cards.signInToSave': 'بچۆ ژوورەوە بۆ پاشەکەوتکردن',
    'cards.deleteConfirm': 'دڵنیایت لە سڕینەوەی ئەم کارتە؟',
    'cards.newCard': 'کارتی نوێ',
    'cards.cardName': 'ناوی کارت',

    // Profile page
    'profile.views': 'بینین',
    'profile.downloadVCard': 'داگرتنی پەیوەندی',
    'profile.share': 'هاوبەشکردن',
    'profile.copied': 'لینک کۆپی کرا',
    'profile.shareTitle': 'کارتی بزنسی',
    'profile.notFound': 'کارت نەدۆزرایەوە',
    'profile.notFoundDesc': 'ئەم کارتە بوونی نیە یان لابراوە.',
    'profile.backHome': 'گەڕانەوە بۆ سەرەکی',
    'profile.madeWith': 'دروستکراوە لەگەڵ',
  },
  ar: {
    // Header / Nav
    'nav.createButton': 'أنشئ الآن',
    'nav.cardMaker': 'أداة إنشاء البطاقات',

    // Landing page
    'landing.badge': '✦ مجاني',
    'landing.heroTitle': 'بطاقة أعمال جاهزة',
    'landing.heroSubtitle': 'في ثوانٍ معدودة',
    'landing.heroDesc': 'أنشئ بطاقة أعمال احترافية — بالكردية أو العربية أو الإنجليزية. حمّل PDF فوراً، بدون أي تسجيل.',
    'landing.ctaButton': '🎨 أنشئ مجاناً',
    'landing.ctaSubtext': 'مجاني — سجّل الآن',
    'landing.templatesTitle': 'ثمانية أنماط مختلفة',
    'landing.feature1Title': 'ثلاث لغات',
    'landing.feature1Desc': 'الكردية والعربية والإنجليزية — مع دعم كامل للنصوص من اليمين واليسار',
    'landing.feature2Title': 'سريع وسهل',
    'landing.feature2Desc': 'أدخل بياناتك، شاهد المعاينة الحية، حمّل PDF — كل شيء على الويب',
    'landing.feature3Title': 'ثمانية أنماط',
    'landing.feature3Desc': 'حديث، كلاسيكي، عريض، بسيط، أنيق، إبداعي، مؤسسي، متدرج — اختر النمط الذي يمثّل مهنتك',
    'landing.ctaBottomTitle': 'أنشئ بطاقتك اليوم',
    'landing.ctaBottomDesc': 'مجاني — بدون تسجيل — حمّل PDF',
    'landing.ctaBottomButton': 'أنشئ الآن',
    'landing.footerText': '© 2026 kart.krd — صُنع في كردستان 🏔️',

    // Template names
    'template.modern': 'حديث',
    'template.classic': 'كلاسيكي',
    'template.bold': 'عريض',
    'template.minimal': 'بسيط',
    'template.elegant': 'أنيق',
    'template.creative': 'إبداعي',
    'template.corporate': 'مؤسسي',
    'template.gradient': 'متدرج',

    // Editor page
    'editor.enterInfo': 'أدخل بياناتك',
    'editor.clear': 'مسح',
    'editor.livePreview': 'معاينة حية',
    'editor.front': 'الأمام',
    'editor.back': 'الخلف',
    'editor.cardSide': 'جهة البطاقة',
    'editor.downloadPdf': '⬇ تحميل PDF',
    'editor.downloadPdfFree': '⬇ تحميل PDF — مجاناً',
    'editor.downloaded': '✓ تم التحميل',
    'editor.downloading': '⏳ انتظر...',
    'editor.wait': 'انتظر...',
    'editor.watermarkNote': 'ملاحظة: يُضاف "kart.krd" بخط صغير في الأسفل',
    'editor.pdfError': 'فشل إنشاء PDF. يرجى المحاولة مرة أخرى.',
    'editor.clearConfirm': 'هل أنت متأكد من مسح جميع البيانات؟',
    'editor.loading': 'انتظر...',
    'editor.tabEdit': 'تحرير',
    'editor.tabPreview': 'معاينة',

    // Card form
    'form.cardLanguage': 'لغة البطاقة',
    'form.personalInfo': 'المعلومات الشخصية',
    'form.contactInfo': 'معلومات الاتصال',
    'form.newFeatures': 'ميزات جديدة',
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
    'form.logoWarning': 'لن يتم حفظ الشعار بعد إعادة تحميل الصفحة.',
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

    // Auth
    'auth.signIn': 'تسجيل الدخول',
    'auth.signOut': 'تسجيل الخروج',
    'auth.account': 'الحساب',

    // Cards (save/load)
    'cards.save': 'حفظ',
    'cards.saving': 'جارٍ الحفظ...',
    'cards.saved': 'تم الحفظ',
    'cards.saveError': 'فشل الحفظ',
    'cards.myCards': 'بطاقاتي',
    'cards.noCards': 'لا توجد بطاقات',
    'cards.signInToSave': 'سجّل الدخول للحفظ',
    'cards.deleteConfirm': 'هل أنت متأكد من حذف هذه البطاقة؟',
    'cards.newCard': 'بطاقة جديدة',
    'cards.cardName': 'اسم البطاقة',

    // Profile page
    'profile.views': 'مشاهدة',
    'profile.downloadVCard': 'تحميل جهة الاتصال',
    'profile.share': 'مشاركة',
    'profile.copied': 'تم نسخ الرابط',
    'profile.shareTitle': 'بطاقة أعمال',
    'profile.notFound': 'البطاقة غير موجودة',
    'profile.notFoundDesc': 'هذه البطاقة غير موجودة أو تم حذفها.',
    'profile.backHome': 'العودة للرئيسية',
    'profile.madeWith': 'صُنع بواسطة',
  },
  en: {
    // Header / Nav
    'nav.createButton': 'Create',
    'nav.cardMaker': 'Card Maker',

    // Landing page
    'landing.badge': '✦ Free',
    'landing.heroTitle': 'Create Professional',
    'landing.heroSubtitle': 'Business Cards in Seconds',
    'landing.heroDesc': 'Generate professional business cards in Kurdish, Arabic, or English. Download as PDF instantly, no account required.',
    'landing.ctaButton': '🎨 Create Free Card',
    'landing.ctaSubtext': 'Free — Sign up to get started',
    'landing.templatesTitle': 'Eight Different Styles',
    'landing.feature1Title': '3 Languages',
    'landing.feature1Desc': 'Kurdish, Arabic, English — all with full RTL and LTR text support',
    'landing.feature2Title': 'Fast & Easy',
    'landing.feature2Desc': 'Enter your details, see live preview, download PDF — all in your browser',
    'landing.feature3Title': '8 Templates',
    'landing.feature3Desc': 'Modern, Classic, Bold, Minimal, Elegant, Creative, Corporate, Gradient — choose a style that represents your profession',
    'landing.ctaBottomTitle': 'Create Your Card Today',
    'landing.ctaBottomDesc': 'Free — No Registration — Download PDF',
    'landing.ctaBottomButton': 'Create Now',
    'landing.footerText': '© 2026 kart.krd — Made in Kurdistan 🏔️',

    // Template names
    'template.modern': 'Modern',
    'template.classic': 'Classic',
    'template.bold': 'Bold',
    'template.minimal': 'Minimal',
    'template.elegant': 'Elegant',
    'template.creative': 'Creative',
    'template.corporate': 'Corporate',
    'template.gradient': 'Gradient',

    // Editor page
    'editor.enterInfo': 'Enter Your Information',
    'editor.clear': 'Clear',
    'editor.livePreview': 'Live Preview',
    'editor.front': 'Front',
    'editor.back': 'Back',
    'editor.cardSide': 'Card side',
    'editor.downloadPdf': '⬇ Download PDF',
    'editor.downloadPdfFree': '⬇ Download PDF — Free',
    'editor.downloaded': '✓ Downloaded',
    'editor.downloading': '⏳ Please wait...',
    'editor.wait': 'Please wait...',
    'editor.watermarkNote': 'Note: "kart.krd" is added in small text at the bottom',
    'editor.pdfError': 'PDF generation failed. Please try again.',
    'editor.clearConfirm': 'Are you sure you want to clear all data?',
    'editor.loading': 'Loading...',
    'editor.tabEdit': 'Edit',
    'editor.tabPreview': 'Preview',

    // Card form
    'form.cardLanguage': 'Card Language',
    'form.personalInfo': 'Personal Information',
    'form.contactInfo': 'Contact Information',
    'form.newFeatures': 'New Features',
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
    'form.logoWarning': 'Logo will not persist after page reload.',
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
    'cardLang.ar': 'العربية',
    'cardLang.en': 'English',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'auth.account': 'Account',

    // Cards (save/load)
    'cards.save': 'Save',
    'cards.saving': 'Saving...',
    'cards.saved': 'Saved',
    'cards.saveError': 'Save failed',
    'cards.myCards': 'My Cards',
    'cards.noCards': 'No saved cards',
    'cards.signInToSave': 'Sign in to save',
    'cards.deleteConfirm': 'Are you sure you want to delete this card?',
    'cards.newCard': 'New Card',
    'cards.cardName': 'Card Name',

    // Profile page
    'profile.views': 'views',
    'profile.downloadVCard': 'Download Contact',
    'profile.share': 'Share',
    'profile.copied': 'Link copied',
    'profile.shareTitle': 'Business Card',
    'profile.notFound': 'Card not found',
    'profile.notFoundDesc': 'This card does not exist or has been removed.',
    'profile.backHome': 'Back to home',
    'profile.madeWith': 'Made with',
  },
} as const;

export type TranslationKey = keyof typeof translations['ku'];
