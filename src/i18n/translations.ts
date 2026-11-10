export type Language = 'en' | 'om' | 'am';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'om', label: 'Afaan Oromoo', nativeLabel: 'Afaan Oromoo', flag: '🌳' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', flag: '🇪🇹' },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.about': 'About',
    'nav.basins': 'Study Basins',
    'nav.simulator': 'GIS Simulator',
    'nav.publications': 'Publications',
    'nav.gallery': 'Gallery',
    'nav.experience': 'Leadership & Research',
    'nav.admin': 'Admin',
    'nav.cms': 'CMS',
    'nav.askAI': 'Ask Research AI',
    'nav.contact': 'Get in Touch',
    'nav.language': 'Language',

    // Hero
    'hero.badge': 'DIRECTOR OF ICT & SENIOR GIS RESEARCHER · IQQO',
    'hero.defaultTitle': 'GIS & Remote Sensing Researcher | Director, ICT Directorate',
    'hero.tagline': 'Enterprise ICT & Applied Geospatial Science',
    'hero.downloadCV': 'Download Full Academic CV',
    'hero.exploreResearch': 'Explore Research',
    'hero.kpi1Value': '15+',
    'hero.kpi1Label': 'Years of ICT Leadership',
    'hero.kpi1Sub': 'Enterprise Infrastructure & Geospatial',
    'hero.kpi2Value': '15+',
    'hero.kpi2Label': 'Peer-Reviewed Publications',
    'hero.kpi2Sub': 'Rainwater, Agroforestry & Soils',
    'hero.kpi3Value': '6',
    'hero.kpi3Label': 'Regional Basins Modeled',
    'hero.kpi3Sub': 'Arsi, Genale-Dawa, Bale, Weyib & Rift',

    // About
    'about.badge': 'BIOGRAPHY & INSTITUTIONAL MANDATE',
    'about.title': 'Pioneering Spatial Computing & Digital Agronomy in Oromia',
    'about.h1': 'Institutional Transformation',
    'about.h1Desc': '15+ years formulating ICT policy, IT governance, and high-performance server network infrastructure.',
    'about.h2': 'AHP & Remote Sensing',
    'about.h2Desc': 'Multi-criteria spatial decision models identifying critical rainwater reservoirs and regional recharge corridors.',
    'about.h3Badge': '03. Machine Learning & GeoAI',
    'about.h3Title': 'Predictive Spatial Modeling',
    'about.h3Desc': 'Satellite computer vision, deep spatial analytics, and AI-driven soil-climate decision matrices.',

    // Publications
    'pub.badge': 'PEER-REVIEWED LITERATURE & THESES',
    'pub.title': '15+ Peer-Reviewed Publications',
    'pub.subtitle': 'Rainwater, Agroforestry & Soils',
    'pub.desc': 'Open citation access, methodology documentation, and verified academic repository exports.',
    'pub.searchPlaceholder': 'Filter by title, study area, or methodology...',
    'pub.allFilter': 'All Publications',
    'pub.exportBibtex': 'Export BibTeX (.bib)',
    'pub.exportRis': 'Export RIS (.ris)',
    'pub.copyCitation': 'Copy Citation',
    'pub.copied': 'Copied!',
    'pub.downloadBib': 'Download .BIB',
    'pub.downloadRis': 'Download .RIS',
    'pub.empty': 'No publications found matching your criteria.',

    // Basins
    'basin.badge': 'SPATIAL DECISION SUPPORT SYSTEM',
    'basin.title': 'Regional Watersheds & Catchment Basins',
    'basin.desc': 'Interactive GIS exploration of Getachew Haile’s published hydrological, hydrogeological, and agroforestry study regions across Ethiopia.',

    // Simulator
    'sim.badge': 'ANALYTIC HIERARCHY PROCESS',
    'sim.title': 'Interactive GIS Multi-Criteria Simulator',
    'sim.desc': 'Adjust pairwise decision weights to simulate land suitability reclassification in real time.',

    // Gallery
    'gal.badge': 'FIELDWORK & LEADERSHIP DOCUMENTATION',
    'gal.title': 'Research & Field Demonstration Gallery',
    'gal.desc': 'Photographic documentation of tef fertilizer trials, satellite lab analysis, and institutional ICT leadership.',

    // Experience
    'exp.badge': 'TRACK RECORD & CREDENTIALS',
    'exp.title': 'Leadership, Research & Education',

    // Contact
    'contact.badge': 'COLLABORATION & INQUIRIES',
    'contact.title': 'Initiate Research Collaboration',
    'contact.desc': 'Reach out for joint research grants, geospatial consultations, keynote talks, or institutional ICT development.',
    'contact.send': 'Send Direct Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Inquiry received. Getachew Haile will respond directly to your email.',

    // Admin
    'admin.portal': 'Administrative CMS Portal',
    'admin.liveSync': 'Firestore Cloud Realtime Sync Active',
    'admin.unlocked': 'Admin privileges active: All content editable in-page.',
  },

  om: {
    // Nav
    'nav.about': "Waa'ee",
    'nav.basins': 'Sululoota Qorannoo',
    'nav.simulator': 'Simileetara GIS',
    'nav.publications': 'Maxxansoota',
    'nav.gallery': 'Kuusaa Suuraa',
    'nav.experience': 'Hogganummaa & Qorannoo',
    'nav.admin': 'Bulchiinsa',
    'nav.cms': 'CMS',
    'nav.askAI': 'AI Qorannoo Gaafadhu',
    'nav.contact': 'Nu Qunnamtaa',
    'nav.language': 'Afaan',

    // Hero
    'hero.badge': 'DAAYIREKTEERA ICT & QORATAA OLAANAA GIS · IQQO',
    'hero.defaultTitle': 'Qorataa GIS & Remoot Seensiingii | Daayirekteera Daayirektoreetii ICT',
    'hero.tagline': 'Hogganummaa ICT fi Saayinsii Ji\'oospeeshiyaalaa Qonnaaf',
    'hero.downloadCV': 'CV Guutuu Buufadhaa (PDF)',
    'hero.exploreResearch': 'Qorannoo Daawwadhaa',
    'hero.kpi1Value': '15+',
    'hero.kpi1Label': 'Waggoota Hoggana ICT',
    'hero.kpi1Sub': 'Bu\'uuraalee Dhaabbataa & Ji\'oospeeshiyaalii',
    'hero.kpi2Value': '15+',
    'hero.kpi2Label': 'Maxxansoota Qorataman',
    'hero.kpi2Sub': 'Bishaan Roobaa, Bosona-Qonnaa & Biyyoo',
    'hero.kpi3Value': '6',
    'hero.kpi3Label': 'Sululoota Naannichaa Moodeelaman',
    'hero.kpi3Sub': 'Arsii, Gannaalee-Daawaa, Baale, Wayib & Qilee',

    // About
    'about.badge': 'SEENAADHA FI ERGAMA DHAABBATA',
    'about.title': 'Kompuyitera Ji\'oospeeshiyaalaa fi Qonna Dijitaalaa Oromiyaa Keessatti',
    'about.h1': 'Jijjiirama Dhaabbataa',
    'about.h1Desc': 'Imaammata ICT, bulchiinsa odeeffannoo fi bu\'uuraalee saarvara diriirsuu waggoota 15+ oliif.',
    'about.h2': 'AHP fi Remoot Seensiingii',
    'about.h2Desc': 'Moodeelota murtii fiispasii bishaan roobaa fi lafa jala bishaanii adda baasuu.',
    'about.h3Badge': '03. Barumsa Maashinii & GeoAI',
    'about.h3Title': 'Moodeela Tilmaama Lafaa',
    'about.h3Desc': 'Kompiitara viizyinii saatalaayitii, xiinxala bal\'aa lafaa fi murtii haala qilleensaa-biyyoo AI tiin deeggarame.',

    // Publications
    'pub.badge': 'BARREEFFAMOOTA QORANNOO FI TEESISII MSC',
    'pub.title': '15+ Maxxansoota Qorataman',
    'pub.subtitle': 'Bishaan Roobaa, Bosona-Qonnaa & Biyyoo',
    'pub.desc': 'Waraqaalee qorannoo saayinsii, meethodoolojii fi koodii wabiilee BibTeX / RIS bilisaan fudhadhaa.',
    'pub.searchPlaceholder': 'Mata-duree, bakka qorannoo, ykn meethodoolojiin barbaadi...',
    'pub.allFilter': 'Maxxansoota Hundumaa',
    'pub.exportBibtex': 'BibTeX (.bib) Buufadhu',
    'pub.exportRis': 'RIS (.ris) Buufadhu',
    'pub.copyCitation': 'Wabii Garagalchi',
    'pub.copied': 'Garagalfameera!',
    'pub.downloadBib': '.BIB Buufadhu',
    'pub.downloadRis': '.RIS Buufadhu',
    'pub.empty': 'Maxxansi barbaaddan hin argamne.',

    // Basins
    'basin.badge': 'SIRNA DEEGGARSA MURTII LAFAA',
    'basin.title': 'Sululoota Naannolee fi Qorannoowwan Bishaan Kuusuu',
    'basin.desc': 'Sululoota qorannoo Getachew Haile qoratee fi maxxanse kanaan daawwadhaa.',

    // Simulator
    'sim.badge': 'ADEEMSA HIERAAKII XIINXALAA (AHP)',
    'sim.title': 'Simileetara GIS Murtii Heedduu',
    'sim.desc': 'Ulfaatina murtii geeddaruun mijattummaa lafaa battalumatti daawwadhaa.',

    // Gallery
    'gal.badge': 'RAGAALEE HOJII DIRREE FI HOGGANUMMAA',
    'gal.title': 'Kuusaa Suuraalee Dirree fi Qorannoo',
    'gal.desc': 'Suuraalee yaalii xaa\'oo xaafii, laabii saatalaayitii fi hogganummaa ICT IQQO.',

    // Experience
    'exp.badge': 'MUUXANNOO FI BARNOOTA',
    'exp.title': 'Hogganummaa, Qorannoo fi Barnoota',

    // Contact
    'contact.badge': 'WALITTI DHUFEENYA FI QORANNOO WALIIN',
    'contact.title': 'Qorannoo Waliin Hojjechuu Eegalaa',
    'contact.desc': 'Pirojektoota qorannoo, gorsa GIS, ykn misooma ICT irratti Getachew Haile qunnamaa.',
    'contact.send': 'Ergaa Ergaa',
    'contact.sending': 'Ergamaa jira...',
    'contact.success': 'Ergaan keessan dhiyaateera. Getachew Haile iimeeliidhaan isiniif deebisa.',

    // Admin
    'admin.portal': 'Giddu-gala Bulchiinsa Qabiyyee (CMS)',
    'admin.liveSync': 'Walsimsiisa Firestore Moobaayilaa & Kompiitaraa Hojjataa Jira',
    'admin.unlocked': 'Mirgi bulchiinsaa banameera: Fuula kana irratti qabiyyee hundumaa gulaaluu dandeessu.',
  },

  am: {
    // Nav
    'nav.about': 'ስለ እኔ',
    'nav.basins': 'የጥናት ተፋሰሶች',
    'nav.simulator': 'የጂአይኤስ ሲሙሌተር',
    'nav.publications': 'ህትመቶች',
    'nav.gallery': 'የፎቶ ማዕከል',
    'nav.experience': 'አመራር እና ምርምር',
    'nav.admin': 'አስተዳዳሪ',
    'nav.cms': 'ሲኤምኤስ',
    'nav.askAI': 'የምርምር AI ጠይቅ',
    'nav.contact': 'ያግኙን',
    'nav.language': 'ቋንቋ',

    // Hero
    'hero.badge': 'የኢንፎርሜሽን ኮሙኒኬሽን ቴክኖሎጂ ዳይሬክተር እና ከፍተኛ የጂአይኤስ ተመራማሪ · IQQO',
    'hero.defaultTitle': 'የጂአይኤስ እና የርቀት ዳሰሳ ተመራማሪ | የኢንፎርሜሽን ኮሙኒኬሽን ቴክኖሎጂ ዳይሬክቶሬት ዳይሬክተር',
    'hero.tagline': 'የኢንተርፕራይዝ አይሲቲ እና የተግባራዊ ጂኦስፓሻል ሳይንስ ለግብርና',
    'hero.downloadCV': 'ሙሉ የትምህርት ሲቪ ያውርዱ (PDF)',
    'hero.exploreResearch': 'ምርምሮችን ይመልከቱ',
    'hero.kpi1Value': '15+',
    'hero.kpi1Label': 'የአመራር ዓመታት',
    'hero.kpi1Sub': 'የመሰረተ ልማት እና ጂኦስፓሻል አመራር',
    'hero.kpi2Value': '15+',
    'hero.kpi2Label': 'የተገመገሙ የምርምር ጽሁፎች',
    'hero.kpi2Sub': 'የዝናብ ውሃ አሰባሰብ፣ አግሮፎረስትሪ እና አፈር',
    'hero.kpi3Value': '6',
    'hero.kpi3Label': 'የተጠኑ የክልሉ ተፋሰሶች',
    'hero.kpi3Sub': 'አርሲ፣ ገናሌ-ዳዋ፣ ባሌ፣ ወይብ እና ስምጥ ሸለቆ',

    // About
    'about.badge': 'የህይወት ታሪክ እና የተቋም ተልዕኮ',
    'about.title': 'በኦሮሚያ የጂኦስፓሻል ሳይንስ እና የዲጂታል ግብርና ፈር ቀዳጅ ጥናት',
    'about.h1': 'የተቋም ትራንስፎርሜሽን',
    'about.h1Desc': 'ለ15+ ዓመታት የአይሲቲ ፖሊሲ፣ የውሂብ አስተዳደር እና የሰርቨር ኔትወርክ መሰረተ ልማት አመራር።',
    'about.h2': 'የኤኤችፒ እና የርቀት ዳሰሳ',
    'about.h2Desc': 'የዝናብ ውሃ ማጠራቀሚያ እና የከርሰ ምድር ውሃ መገኛ ዞኖችን የሚለዩ የቦታ ውሳኔ ሰጪ ሞዴሎች።',
    'about.h3Badge': '03. የማሽን መማሪያ እና ጂኦ-ኤአይ',
    'about.h3Title': 'የትንበያ የቦታ ሞዴሊንግ',
    'about.h3Desc': 'የሳተላይት ምስል ትንተና፣ የጠለቀ የቦታ ዳሰሳ እና በኤአይ የተደገፈ የአፈርና የአየር ንብረት ውሳኔ ሰጪ ማትሪክስ።',

    // Publications
    'pub.badge': 'የተገመገሙ የጥናት ጽሑፎች እና የኤምኤስሲ ተሲስ',
    'pub.title': '15+ የተገመገሙ የምርምር ጽሁፎች',
    'pub.subtitle': 'የዝናብ ውሃ አሰባሰብ፣ አግሮፎረስትሪ እና አፈር',
    'pub.desc': 'የሳይንሳዊ ምርምር ጽሑፎች፣ የጥናት ስልቶች እና የBibTeX / RIS ጥቅሶች ማውረጃ።',
    'pub.searchPlaceholder': 'በርዕስ፣ በቦታ ወይም በጥናት ስልት ይፈልጉ...',
    'pub.allFilter': 'ሁሉም ህትመቶች',
    'pub.exportBibtex': 'BibTeX (.bib) አውርድ',
    'pub.exportRis': 'RIS (.ris) አውርድ',
    'pub.copyCitation': 'ጥቅስ ኮፒ አድርግ',
    'pub.copied': 'ኮፒ ተደርጓል!',
    'pub.downloadBib': '.BIB ፋይል አውርድ',
    'pub.downloadRis': '.RIS ፋይል አውርድ',
    'pub.empty': 'የተፈለገው ጽሑፍ አልተገኘም።',

    // Basins
    'basin.badge': 'የቦታ ውሳኔ ሰጪ ድጋፍ ስርዓት',
    'basin.title': 'ተግባራዊ የተፋሰሶች እና የውሃ አካላት መመልከቻ',
    'basin.desc': 'በጌታቸው ኃይሌ የታተሙ የተፋሰስ፣ የከርሰ ምድር ውሃ እና የአግሮፎረስትሪ ጥናት አካባቢዎችን ያስሱ።',

    // Simulator
    'sim.badge': 'የትንታኔ ቅደም ተከተል ሂደት (AHP)',
    'sim.title': 'የጂአይኤስ ባለብዙ መስፈርት ሲሙሌተር',
    'sim.desc': 'የመስፈርት ክብደቶችን በማስተካከል የመሬት ተስማሚነትን በቅጽበት ይገምግሙ።',

    // Gallery
    'gal.badge': 'የመስክ እና የአመራር ፎቶ ማህደር',
    'gal.title': 'የመስክ ምርምር እና የአመራር ፎቶ ማዕከል',
    'gal.desc': 'የጤፍ ማዳበሪያ ሙከራዎች፣ የሳተላይት ላቦራቶሪ ትንተና እና የአይሲቲ አመራር ፎቶዎች።',

    // Experience
    'exp.badge': 'የስራ ልምድ እና ምስክር ወረቀቶች',
    'exp.title': 'አመራር፣ ምርምር እና ትምህርት',

    // Contact
    'contact.badge': 'ትብብር እና ጥያቄዎች',
    'contact.title': 'የምርምር ትብብር ይጀምሩ',
    'contact.desc': 'ለጥናት ፕሮጀክቶች፣ ለጂአይኤስ ማማከር ወይም ለአይሲቲ ልማት ከጌታቸው ኃይሌ ጋር ይገናኙ።',
    'contact.send': 'መልዕክት ይላኩ',
    'contact.sending': 'በመላክ ላይ...',
    'contact.success': 'መልዕክትዎ ደርሷል። ጌታቸው ኃይሌ በኢሜይልዎ ምላሽ ይሰጥዎታል።',

    // Admin
    'admin.portal': 'የይዘት አስተዳዳሪ ፖርታል (CMS)',
    'admin.liveSync': 'የፋየርቤዝ ቀጥታ ማመሳሰል በስራ ላይ ነው',
    'admin.unlocked': 'የአስተዳዳሪ ፈቃድ ነቅቷል፡ ማንኛውንም ይዘት በገጹ ላይ በቀጥታ ማረም ይችላሉ።',
  },
};
