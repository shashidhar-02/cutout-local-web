import { LanguageCode } from './types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  privacyPill: string;
  announcement: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  noAccount: string;
  noUpload: string;
  noSubscription: string;
  noWatermark: string;
  singleImageTab: string;
  batchQueueTab: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  browseBtn: string;
  pasteHint: string;
  trySample: string;
  loadingModel: string;
  processingImage: string;
  modelReady: string;
  downloadBtn: string;
  uploadNewBtn: string;
  batchQueue: string;
  processAll: string;
  downloadZip: string;
  transparent: string;
  solidColor: string;
  customPhoto: string;
  autoCrop: string;
  qualityMode: string;
  fast: string;
  balanced: string;
  quality: string;
  smartPresets: string;
  originalLabel: string;
  cutoutLabel: string;
  menuHome: string;
  menuHowItWorks: string;
  menuPrivacy: string;
  menuBatch: string;
  menuTools: string;
  specializedTools: string;
  generalRemover: string;
  transparentMaker: string;
  ecommerceProducts: string;
  profilePassports: string;
  backgroundReplacement: string;
  blurEffect: string;
  uploadBackground: string;
  cropPadding: string;
  exportSettings: string;
  whyInBrowserTitle: string;
  whyInBrowserSubtitle: string;
  cloudServicesTitle: string;
  cloudPoint1: string;
  cloudPoint2: string;
  cloudPoint3: string;
  cloudPoint4: string;
  localArchitectureTitle: string;
  localPoint1: string;
  localPoint2: string;
  localPoint3: string;
  localPoint4: string;
  workflowsTitle: string;
  workflowsSubtitle: string;
  workflowProductTitle: string;
  workflowProductDesc: string;
  workflowProfileTitle: string;
  workflowProfileDesc: string;
  workflowStickersTitle: string;
  workflowStickersDesc: string;
  workflowMarketplaceTitle: string;
  workflowMarketplaceDesc: string;
  workflowPresentationsTitle: string;
  workflowPresentationsDesc: string;
  workflowPersonalTitle: string;
  workflowPersonalDesc: string;
  footerDescription: string;
  transparency: string;
  openSource: string;
  benchmarks: string;
  securityPolicy: string;
  contributing: string;
  reportIssue: string;
  modelLicenses: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'Cutout',
    tagline: 'Remove backgrounds. Keep your photos private.',
    privacyPill: 'Images Never Leave Your Device',
    announcement: '🔒 100% On-Device AI • WebGPU Accelerated • No Uploads, No Account, No Watermark',
    heroTitle: 'Remove backgrounds.',
    heroTitleHighlight: 'Keep your photos private.',
    heroSubtitle:
      'Cutout is a free, open-source background-removal tool that runs AI directly in your browser. No accounts, no subscriptions, no watermarks, and zero server uploads.',
    noAccount: 'No Account',
    noUpload: 'No Upload',
    noSubscription: 'No Subscription',
    noWatermark: 'No Watermark',
    singleImageTab: 'Single Photo',
    batchQueueTab: 'Batch Queue',
    dropzoneTitle: 'Choose an image or drag & drop',
    dropzoneSubtitle: 'Supports PNG, JPG, WebP • Paste anytime with Ctrl+V',
    browseBtn: 'Browse Image',
    pasteHint: 'Paste image from clipboard',
    trySample: 'Or try a sample:',
    loadingModel: 'Downloading AI model',
    processingImage: 'Segmenting background locally...',
    modelReady: 'AI Model Ready (Local)',
    downloadBtn: 'Download',
    uploadNewBtn: 'Upload New Photo',
    batchQueue: 'Batch Processing Queue',
    processAll: 'Process All',
    downloadZip: 'Download All (.ZIP)',
    transparent: 'Transparent',
    solidColor: 'Solid Color',
    customPhoto: 'Custom Photo',
    autoCrop: 'Auto Crop',
    qualityMode: 'Quality Mode',
    fast: 'Fast',
    balanced: 'Balanced',
    quality: 'High Quality',
    smartPresets: 'Smart Presets',
    originalLabel: 'Original',
    cutoutLabel: 'Cutout',
    menuHome: 'Home',
    menuHowItWorks: 'How It Works',
    menuPrivacy: 'Privacy Architecture',
    menuBatch: 'Batch Mode',
    menuTools: 'Tools & Presets',
    specializedTools: 'Specialized Tools',
    generalRemover: 'General Remover',
    transparentMaker: 'Transparent PNG Maker',
    ecommerceProducts: 'E-commerce Products',
    profilePassports: 'Profile & Passports',
    backgroundReplacement: 'Background Replacement',
    blurEffect: 'Background Blur',
    uploadBackground: 'Upload Custom Background',
    cropPadding: 'Crop Padding',
    exportSettings: 'Export Settings',
    whyInBrowserTitle: 'Why In-Browser AI Changes Everything',
    whyInBrowserSubtitle:
      'Most background-removal websites upload your pictures to remote cloud servers. Cutout operates on an entirely client-side privacy architecture.',
    cloudServicesTitle: 'Traditional Cloud Services',
    cloudPoint1: 'Uploads your photos to cloud servers and databases',
    cloudPoint2: 'Requires account sign-up and email tracking',
    cloudPoint3: 'Limited free credits and monthly recurring subscriptions',
    cloudPoint4: 'Places watermarks or restricts download resolution',
    localArchitectureTitle: 'Cutout Local-First Architecture',
    localPoint1: 'Image never leaves your device: 100% on-device inference',
    localPoint2: 'No accounts, logins, or tracking cookies required',
    localPoint3: 'Unlimited conversions with zero watermarks forever',
    localPoint4: 'Full WebGPU acceleration with WASM fallback & offline mode',
    workflowsTitle: 'Built for Every Workflow',
    workflowsSubtitle: 'High-resolution transparency extraction tuned for products, portraits, and media.',
    workflowProductTitle: 'Product Photography',
    workflowProductDesc: 'Clean white background cutouts for e-commerce listings.',
    workflowProfileTitle: 'Profile Pictures',
    workflowProfileDesc: 'Polished avatars for LinkedIn, Twitter, and portfolios.',
    workflowStickersTitle: 'Social Media & Stickers',
    workflowStickersDesc: 'Create sticker cutouts and transparent overlays instantly.',
    workflowMarketplaceTitle: 'Marketplace Assets',
    workflowMarketplaceDesc: 'Batch process eBay, Amazon, and Shopify catalog items.',
    workflowPresentationsTitle: 'Presentations & Slides',
    workflowPresentationsDesc: 'Insert transparent elements seamlessly into Keynote or Slides.',
    workflowPersonalTitle: 'Personal Photos',
    workflowPersonalDesc: 'Edit family and travel memories without privacy exposure.',
    footerDescription:
      'A free, open-source AI background remover that runs 100% locally in your browser. No server uploads, no accounts, no credit limits, and no watermarks.',
    transparency: 'Transparency',
    openSource: 'Open Source',
    benchmarks: 'Hardware Benchmarks',
    securityPolicy: 'Security Policy',
    contributing: 'Contributing Guide',
    reportIssue: 'Report an Issue',
    modelLicenses: 'Model Licenses & Limits',
  },
  hi: {
    appName: 'Cutout',
    tagline: 'फ़ोटो बैकग्राउंड हटाएं। अपनी फ़ोटो निजी रखें।',
    privacyPill: 'फ़ोटो कभी भी आपके डिवाइस से बाहर नहीं जाती',
    announcement: '🔒 100% ऑन-डिवाइस AI • WebGPU त्वरित • कोई अपलोड नहीं, कोई खाता नहीं, कोई वॉटरमार्क नहीं',
    heroTitle: 'फ़ोटो बैकग्राउंड हटाएं।',
    heroTitleHighlight: 'अपनी तस्वीरें निजी रखें।',
    heroSubtitle:
      'कटआउट एक मुफ़्त, ओपन-सोर्स टूल है जो सीधे आपके ब्राउज़र में AI चलाता है। बिना किसी खाते, सदस्यता, वॉटरमार्क या सर्वर अपलोड के।',
    noAccount: 'कोई खाता नहीं',
    noUpload: 'कोई अपलोड नहीं',
    noSubscription: 'कोई सदस्यता नहीं',
    noWatermark: 'कोई वॉटरमार्क नहीं',
    singleImageTab: 'एकल फ़ोटो',
    batchQueueTab: 'एक साथ कई फ़ोटो',
    dropzoneTitle: 'फ़ोटो चुनें या यहाँ खींचकर छोड़ें',
    dropzoneSubtitle: 'PNG, JPG, WebP समर्थित • Ctrl+V से कभी भी पेस्ट करें',
    browseBtn: 'फ़ोटो चुनें',
    pasteHint: 'क्लिपबोर्ड से फ़ोटो पेस्ट करें',
    trySample: 'या नमूना आज़माएँ:',
    loadingModel: 'AI मॉडल डाउनलोड हो रहा है',
    processingImage: 'डिवाइस पर बैकग्राउंड हटाया जा रहा है...',
    modelReady: 'AI मॉडल तैयार (स्थानीय)',
    downloadBtn: 'डाउनलोड करें',
    uploadNewBtn: 'नई फ़ोटो चुनें',
    batchQueue: 'एक साथ कई फ़ोटो (बैच)',
    processAll: 'सभी प्रोसेस करें',
    downloadZip: 'सभी डाउनलोड करें (.ZIP)',
    transparent: 'पारदर्शी',
    solidColor: 'ठोस रंग',
    customPhoto: 'कस्टम फ़ोटो',
    autoCrop: 'स्वतः क्रॉप',
    qualityMode: 'गुणवत्ता मोड',
    fast: 'तेज़',
    balanced: 'संतुलित',
    quality: 'उच्च गुणवत्ता',
    smartPresets: 'स्मार्ट प्रीसेट',
    originalLabel: 'मूल',
    cutoutLabel: 'कटआउट',
    menuHome: 'होम',
    menuHowItWorks: 'यह कैसे काम करता है',
    menuPrivacy: 'गोपनीयता नीति',
    menuBatch: 'बैच मोड',
    menuTools: 'टूल्स व प्रीसेट',
    specializedTools: 'विशिष्ट टूल्स',
    generalRemover: 'सामान्य रिमूवर',
    transparentMaker: 'पारदर्शी PNG मेकर',
    ecommerceProducts: 'ई-कॉमर्स उत्पाद',
    profilePassports: 'प्रोफ़ाइल व पासपोर्ट',
    backgroundReplacement: 'बैकग्राउंड बदलें',
    blurEffect: 'धुंधला प्रभाव (ब्लर)',
    uploadBackground: 'कस्टम बैकग्राउंड अपलोड करें',
    cropPadding: 'क्रॉप पैडिंग',
    exportSettings: 'एक्सपोर्ट सेटिंग्स',
    whyInBrowserTitle: 'ब्राउज़र-आधारित AI सब कुछ क्यों बदल देता है',
    whyInBrowserSubtitle:
      'अधिकांश वेबसाइटें आपकी तस्वीरों को रिमोट क्लाउड सर्वर पर अपलोड करती हैं। कटआउट पूरी तरह से डिवाइस पर काम करता है।',
    cloudServicesTitle: 'पारंपरिक क्लाउड सेवाएँ',
    cloudPoint1: 'आपकी तस्वीरों को क्लाउड सर्वर और डेटाबेस पर अपलोड करता है',
    cloudPoint2: 'अकाउंट साइन-अप और ईमेल ट्रैकिंग अनिवार्य',
    cloudPoint3: 'सीमित मुफ़्त क्रेडिट और मासिक सदस्यता शुल्क',
    cloudPoint4: 'वॉटरमार्क लगाता है या डाउनलोड रिज़ॉल्यूशन घटाता है',
    localArchitectureTitle: 'कटआउट स्थानीय वास्तुकला',
    localPoint1: 'फ़ोटो कभी भी आपके डिवाइस से बाहर नहीं जाती: 100% ऑन-डिवाइस AI',
    localPoint2: 'कोई खाता, लॉगिन या ट्रैकिंग कुकीज़ नहीं',
    localPoint3: 'असीमित कन्वर्शन और बिना किसी वॉटरमार्क के हमेशा मुफ़्त',
    localPoint4: 'पूर्ण WebGPU त्वरण, WASM फ़ॉलबैक और ऑफ़लाइन मोड',
    workflowsTitle: 'हर काम के लिए उपयुक्त',
    workflowsSubtitle: 'उत्पादों, पोर्ट्रेट और मीडिया के लिए उच्च-रिज़ॉल्यूशन पारदर्शिता निष्कर्षण।',
    workflowProductTitle: 'उत्पाद फ़ोटोग्राफ़ी',
    workflowProductDesc: 'ई-कॉमर्स लिस्टिंग के लिए साफ़ सफ़ेद बैकग्राउंड।',
    workflowProfileTitle: 'प्रोफ़ाइल फ़ोटो',
    workflowProfileDesc: 'लिंक्डइन, ट्विटर और पोर्टफोलियो के लिए पेशेवर अवतार।',
    workflowStickersTitle: 'सोशल मीडिया व स्टिकर',
    workflowStickersDesc: 'तुरंत स्टिकर कटआउट और पारदर्शी ओवरले बनाएँ।',
    workflowMarketplaceTitle: 'मार्केटप्लेस लिस्टिंग',
    workflowMarketplaceDesc: 'अमेज़न, फ्लिपकार्ट और ईबे उत्पादों को एक साथ बैच में प्रोसेस करें।',
    workflowPresentationsTitle: 'प्रस्तुतीकरण व स्लाइड्स',
    workflowPresentationsDesc: 'स्लाइड्स में पारदर्शी तस्वीरें आसानी से जोड़ें।',
    workflowPersonalTitle: 'व्यक्तिगत फ़ोटो',
    workflowPersonalDesc: 'गोपनीयता के जोखिम के बिना पारिवारिक और यात्रा की फ़ोटो संपादित करें।',
    footerDescription:
      'एक मुफ़्त, ओपन-सोर्स AI बैकग्राउंड रिमूवर जो 100% आपके ब्राउज़र में चलता है। कोई सर्वर अपलोड नहीं, कोई खाता नहीं, कोई क्रेडिट सीमा नहीं और कोई वॉटरमार्क नहीं।',
    transparency: 'पारदर्शिता',
    openSource: 'ओपन सोर्स',
    benchmarks: 'हार्डवेयर बेंचमार्क',
    securityPolicy: 'सुरक्षा नीति',
    contributing: 'योगदान मार्गदर्शिका',
    reportIssue: 'समस्या की रिपोर्ट करें',
    modelLicenses: 'मॉडल लाइसेंस और सीमाएं',
  },
  te: {
    appName: 'Cutout',
    tagline: 'బ్యాక్‌గ్రౌండ్ తొలగించండి. మీ ఫోటోలు గోప్యంగా ఉంచండి.',
    privacyPill: 'ఫోటోలు ఎప్పటికీ మీ పరికరం దాటవు',
    announcement: '🔒 100% ఆన్-డివైస్ AI • WebGPU యాక్సిలరేషన్ • అప్‌లోడ్ లేదు, ఖాతా లేదు, వాటర్‌మార్క్ లేదు',
    heroTitle: 'బ్యాక్‌గ్రౌండ్ తొలగించండి.',
    heroTitleHighlight: 'మీ ఫోటోలను సురక్షితంగా ఉంచండి.',
    heroSubtitle:
      'కటౌట్ ఉచిత మరియు ఓపెన్ సోర్స్ సాధనం. AI నేరుగా మీ బ్రౌజర్‌లో రన్ అవుతుంది. సర్వర్‌కు ఫోటోలు పంపకుండా సులభంగా వాడండి.',
    noAccount: 'ఖాతా అవసరం లేదు',
    noUpload: 'అప్‌లోడ్ లేదు',
    noSubscription: 'సభ్యత్వం లేదు',
    noWatermark: 'వాటర్‌మార్క్ లేదు',
    singleImageTab: 'ఒకే ఫోటో',
    batchQueueTab: 'బ్యాచ్ ప్రాసెసింగ్',
    dropzoneTitle: 'ఫోటోను ఎంచుకోండి లేదా లాగి వదలండి',
    dropzoneSubtitle: 'PNG, JPG, WebP మద్దతు • Ctrl+V తో నేరుగా అతికించండి',
    browseBtn: 'ఫోటో ఎంచుకోండి',
    pasteHint: 'క్లిప్‌బోర్డ్ నుండి అతికించండి',
    trySample: 'లేదా నమూనా చూడండి:',
    loadingModel: 'AI మోడల్ డౌన్‌లోడ్ అవుతోంది',
    processingImage: 'పరికరంపైనే బ్యాక్‌గ్రౌండ్ తొలగింపు జరుగుతోంది...',
    modelReady: 'AI మోడల్ సిద్ధంగా ఉంది (స్థానికం)',
    downloadBtn: 'డౌన్‌లోడ్',
    uploadNewBtn: 'కొత్త ఫోటో ఎంచుకోండి',
    batchQueue: 'బ్యాచ్ ప్రాసెసింగ్ జాబితా',
    processAll: 'అన్నీ ప్రాసెస్ చేయండి',
    downloadZip: 'అన్నీ డౌన్‌లోడ్ చేయండి (.ZIP)',
    transparent: 'పారదర్శకం',
    solidColor: 'ఘన రంగు',
    customPhoto: 'కస్టమ్ ఫోటో',
    autoCrop: 'ఆటో క్రాప్',
    qualityMode: 'నాణ్యత మోడ్',
    fast: 'వేగవంతం',
    balanced: 'సమతుల్యం',
    quality: 'అధిక నాణ్యత',
    smartPresets: 'స్మార్ట్ ప్రీసెట్లు',
    originalLabel: 'అసలైనది',
    cutoutLabel: 'కటౌట్',
    menuHome: 'హోమ్',
    menuHowItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    menuPrivacy: 'గోప్యతా విధానం',
    menuBatch: 'బ్యాచ్ మోడ్',
    menuTools: 'సాధనాలు & ప్రీసెట్లు',
    specializedTools: 'ప్రత్యేక ఉపకరణాలు',
    generalRemover: 'సాధారణ రిమూవర్',
    transparentMaker: 'పారదర్శక PNG మేకర్',
    ecommerceProducts: 'ఇ-కామర్స్ ఉత్పత్తులు',
    profilePassports: 'ప్రొఫైల్ & పాస్‌పోర్ట్',
    backgroundReplacement: 'బ్యాక్‌గ్రౌండ్ మార్పు',
    blurEffect: 'బ్లర్ ఎఫెక్ట్',
    uploadBackground: 'కస్టమ్ ఫోటోను అప్‌లోడ్ చేయండి',
    cropPadding: 'క్రాప్ ప్యాడింగ్',
    exportSettings: 'ఎక్స్‌పోర్ట్ సెట్టింగ్‌లు',
    whyInBrowserTitle: 'బ్రౌజర్‌లోనే AI పనిచేయడం వల్ల ప్రయోజనాలు',
    whyInBrowserSubtitle:
      'చాలా వెబ్‌సైట్‌లు మీ ఫోటోలను క్లౌడ్ సర్వర్‌లకు అప్‌లోడ్ చేస్తాయి. కటౌట్ పూర్తిగా మీ పరికరంలోనే పనిచేస్తుంది.',
    cloudServicesTitle: 'సాంప్రదాయ క్లౌడ్ సేవలు',
    cloudPoint1: 'మీ ఫోటోలను సర్వర్‌లు మరియు డేటాబేస్‌లలోకి అప్‌లోడ్ చేస్తాయి',
    cloudPoint2: 'ఖాతా నమోదు మరియు ఈమెయిల్ ట్రాకింగ్ తప్పనిసరి',
    cloudPoint3: 'పరిమిత క్రెడిట్‌లు మరియు నెలవారీ రుసుములు',
    cloudPoint4: 'వాటర్‌మార్క్‌లు ఉంచడం లేదా నాణ్యత తగ్గించడం',
    localArchitectureTitle: 'కటౌట్ గోప్యతా ఆర్కిటెక్చర్',
    localPoint1: 'ఫోటో ఎప్పటికీ మీ పరికరం దాటదు: 100% పరికరంలోనే ప్రాసెసింగ్',
    localPoint2: 'ఖాతా లేదా లాగిన్ అవసరం లేదు',
    localPoint3: 'అపరిమిత వినియోగం మరియు ఎలాంటి వాటర్‌మార్క్ లేదు',
    localPoint4: 'పూర్తి WebGPU యాక్సిలరేషన్ మరియు ఆఫ్‌లైన్ సపోర్ట్',
    workflowsTitle: 'అన్ని అవసరాలకు సరిపోయేలా రూపొందించబడింది',
    workflowsSubtitle: 'ఉత్పత్తులు, పోర్ట్రెయిట్‌లు మరియు ప్రెజెంటేషన్ల కోసం అత్యుత్తమ పారదర్శకత.',
    workflowProductTitle: 'ఉత్పత్తి ఫోటోగ్రఫీ',
    workflowProductDesc: 'ఇ-కామర్స్ కోసం శుభ్రమైన తెలుపు బ్యాక్‌గ్రౌండ్.',
    workflowProfileTitle: 'ప్రొఫైల్ చిత్రాలు',
    workflowProfileDesc: 'లింక్డ్ఇన్ మరియు సోషల్ మీడియా కోసం ఆకర్షణీయమైన అవతార్లు.',
    workflowStickersTitle: 'స్టిక్కర్లు & సోషల్ మీడియా',
    workflowStickersDesc: 'క్షణాల్లో స్టిక్కర్ కటౌట్‌లను సులభంగా తయారు చేయండి.',
    workflowMarketplaceTitle: 'మార్కెట్‌ప్లేస్ ఉత్పత్తులు',
    workflowMarketplaceDesc: 'అమెజాన్ మరియు ఇతర స్టోర్ల కోసం బల్క్ ప్రాసెసింగ్.',
    workflowPresentationsTitle: 'ప్రెజెంటేషన్లు & స్లైడ్‌లు',
    workflowPresentationsDesc: 'పారదర్శక చిత్రాలను స్లైడ్లలో సులభంగా చేర్చండి.',
    workflowPersonalTitle: 'వ్యక్తిగత ఫోటోలు',
    workflowPersonalDesc: 'గోప్యతకు భంగం కలగకుండా ఫోటోలను సవరించండి.',
    footerDescription:
      '100% మీ బ్రౌజర్‌లోనే పనిచేసే ఉచిత, ఓపెన్-సోర్స్ AI బ్యాక్‌గ్రౌండ్ రిమూవర్. సర్వర్ అప్‌లోడ్‌లు, ఖాతాలు లేదా వాటర్‌మార్క్‌లు లేవు.',
    transparency: 'పారదర్శకత',
    openSource: 'ఓపెన్ సోర్స్',
    benchmarks: 'హార్డ్‌వేర్ బెంచ్‌మార్క్‌లు',
    securityPolicy: 'భద్రతా విధానం',
    contributing: 'సహకార మార్గదర్శి',
    reportIssue: 'సమస్యను నివేదించండి',
    modelLicenses: 'మోడల్ లైసెన్స్‌లు & పరిమితులు',
  },
};
