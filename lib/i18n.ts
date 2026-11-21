import { LanguageCode } from './types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  privacyPill: string;
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
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'Cutout',
    tagline: 'Remove backgrounds. Keep your photos private.',
    privacyPill: 'Images Never Leave Your Device',
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
  },
  hi: {
    appName: 'Cutout',
    tagline: 'फ़ोटो बैकग्राउंड हटाएं। अपनी फ़ोटो निजी रखें।',
    privacyPill: 'फ़ोटो कभी भी आपके डिवाइस से बाहर नहीं जाती',
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
  },
  te: {
    appName: 'Cutout',
    tagline: 'బ్యాక్‌గ్రౌండ్ తొలగించండి. మీ ఫోటోలు గోప్యంగా ఉంచండి.',
    privacyPill: 'ఫోటోలు ఎప్పటికీ మీ పరికరం దాటవు',
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
  },
};
