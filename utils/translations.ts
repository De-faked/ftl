import { Course } from '../types';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      methodology: 'Methodology',
      teachers: 'Teachers',
      courses: 'Courses',
      contact: 'Contact',
      enroll: 'Enroll Now'
    },
    hero: {
      location: 'Located in Al-Madinah Al-Munawwarah',
      titleLine1: 'Live the Arabic Language',
      titleLine2: 'In The City of The Prophet',
      description: 'Experience our unique hybrid learning model: Academic excellence combined with daily immersive activities in the local Madinah community. Housing, meals, and transport included.',
      viewCourses: 'View Packages',
      aboutInstitute: 'Our Method',
      quote: '"Learn Arabic and teach it to the people"'
    },
    teachers: {
      badge: 'Faculty',
      title: 'Meet the Instructors Guiding You',
      subtitle: 'A balanced team of native instructors, curriculum designers, and immersion mentors to keep you practicing in and out of class.',
      experienceLabel: '{years}+ yrs',
      list: [
        {
          initials: 'AA',
          name: 'Ust. AbdulAziz Al-Harbi',
          role: 'Lead Curriculum Coach',
          experience: '12',
          focus: 'Classical grammar & Tajweed alignment',
          bio: 'Madinah-born instructor specializing in Nahw, Sarf, and correct Makharij. He keeps the foundation precise so your speech flows naturally.',
          type: 'curriculum'
        },
        {
          initials: 'MN',
          name: 'Maryam An-Najdi',
          role: 'Immersion Mentor',
          experience: '8',
          focus: 'Daily practice with locals & markets',
          bio: 'Guides students through community visits, volunteering days, and bazaar conversations to translate theory into confident speaking.',
          type: 'immersion'
        },
        {
          initials: 'SH',
          name: 'Shaykh Hamzah',
          role: 'Delivery & Rhetoric Lead',
          experience: '10',
          focus: 'Public speaking & professional tone',
          bio: 'Trains students on Khutbah-style delivery, formal correspondence, and business etiquette for professional Arabic settings.',
          type: 'delivery'
        }
      ]
    },
    about: {
      titleLine1: 'More Than Just',
      titleLine2: 'A Classroom',
      description: 'Fos7a Taibah Institute offers a holistic educational experience. We believe language is lived, not just memorized. By integrating you into the fabric of Madinah society through events, volunteering, and local gatherings, we ensure your tongue adapts to the natural flow of Arabic.',
      locationTitle: 'Heart of Madinah',
      locationDesc: 'Study and live within the spiritual embrace of the Sanctuary.',
      teachersTitle: 'Native Guides',
      teachersDesc: 'Our instructors are not just teachers, but cultural bridges.',
      curriculumTitle: 'Hybrid Learning',
      curriculumDesc: 'Standard classes + Real-world community immersion.',
      communityTitle: 'All-Inclusive',
      communityDesc: 'We handle your housing, meals, and transport so you focus on learning.',
      imageCaption: '"The language of the Quran is the key to understanding Islam."'
    },
    methodology: {
      title: "Our Hybrid Methodology",
      subtitle: "We bridge the gap between academic theory and real-world application through our 'Live the Language' program.",
      classroom: {
        title: "Academic Standard",
        desc: "Intensive morning sessions focusing on grammar (Nahw), morphology (Sarf), and rhetoric (Balagha) using proven curriculums."
      },
      community: {
        title: "Community Immersion",
        desc: "Afternoons and evenings are dedicated to events with locals, market visits, and cultural activities to practice what you learned."
      },
      stats: {
        hours: "220 Academic Hours",
        duration: "60 Days / 2 Months",
        activities: "Daily Activities"
      }
    },
    courses: {
      title: 'Educational Packages',
      subtitle: 'All packages include Accommodation, 3 Meals Daily, Transportation, and Cultural Excursions. Select the path that fits your goal.',
      register: 'Register Interest',
      details: 'View Details',
      close: 'Close Details',
      includes: 'All-Inclusive Package:',
      schedule: 'Typical Schedule:',
      list: [
        {
          id: 'beginner',
          title: 'Al-Ta\'sees (Foundation)',
          arabicTitle: 'برنامج التأسيس',
          level: 'Absolute Beginner',
          mode: 'On-campus Immersion',
          shortDescription: 'For those starting from zero. Learn to read, write, and speak basic Arabic with confidence.',
          fullDescription: 'This comprehensive 60-day program is designed for students with zero to little prior knowledge. We start from the alphabet and phonetics, moving quickly into constructing sentences. You will not just learn from books; you will practice your new vocabulary in the local shops and masjids of Madinah.',
          duration: '60 Days',
          hours: '220 Hours/Month',
          price: 'Contact for Quote',
          suitability: 'Type C: Absolute Beginners who want a correct start.',
          schedule: '8:00 AM - 1:00 PM (Class) + Evening Activities',
          inclusions: ['Luxury Shared Housing', '3 Meals Daily', 'Private Transport', 'Visa Support'],
          features: ['Alphabet & Phonics Mastery', 'Basic Daily Conversation', 'Writing Skills', 'Introduction to Grammar'],
          capacity: 30
        },
        {
          id: 'immersion',
          title: 'Al-Itqan (Fluency)',
          arabicTitle: 'برنامج الإتقان',
          level: 'Intermediate/Advanced',
          mode: 'Residential Immersion',
          shortDescription: 'For students who know the basics but struggle with speaking or have "broken" Arabic.',
          fullDescription: 'Designed for Type B students who have studied grammar but lack fluency or practice odd phrasing. We focus on "un-learning" mistakes and "re-learning" natural Arabic expression. Heavy emphasis on rhetorical styles and deep immersion with locals to polish your tongue.',
          duration: '60 Days',
          hours: '220 Hours/Month',
          price: 'Contact for Quote',
          suitability: 'Type B: Students with theoretical knowledge but lack practice.',
          schedule: '8:00 AM - 1:00 PM (Advanced Text) + Evening Majlis',
          inclusions: ['Luxury Shared Housing', '3 Meals Daily', 'Private Transport', 'Visa Support'],
          features: ['Correction of Phrasing', 'Advanced Rhetoric (Balagha)', 'Public Speaking', 'Deep Cultural Immersion'],
          capacity: 25
        },
        {
          id: 'business',
          title: 'At-Tijarah (Business)',
          arabicTitle: 'لغة الأعمال',
          level: 'Professional',
          mode: 'Hybrid Executive',
          shortDescription: 'Specialized curriculum for professionals needing Arabic for trade, negotiation, and diplomacy.',
          fullDescription: 'A targeted program for Type A students focused on the marketplace. While covering the essentials, the vocabulary and scenarios focus on contracts, negotiations, religious tourism management, and professional correspondence.',
          duration: '30 Days',
          hours: '110 Learning Hours',
          price: 'Contact for Quote',
          suitability: 'Type A: Entrepreneurs and professionals.',
          schedule: 'Flexible Intensive Hours + Networking Events',
          inclusions: ['Premium Housing', '3 Meals Daily', 'Private Transport', 'Business Networking'],
          features: ['Contract Terminology', 'Negotiation Skills', 'Professional Correspondence', 'Marketplace Immersion'],
          capacity: 15
        }
      ] as Course[]
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [
            { q: "Do you provide student visas?", a: "Yes, once enrolled and tuition is paid, we issue an official acceptance letter and ministry authorization number to apply for a short-term educational visa." },
            { q: "Is housing gender-segregated?", a: "Absolutely. In accordance with the values of Al-Madinah, we have completely separate housing complexes and campuses for male and female students." },
            { q: "Can I bring my family?", a: "Our standard packages are for individual students. Family accommodation can be arranged upon special request but will incur additional costs." },
            { q: "Do I need prior Arabic knowledge?", a: "For the Al-Ta'sees (Foundation) program, no prior knowledge is needed. For other tiers, we will assess your level before finalizing enrollment." }
        ]
    },
    contact: {
      title: 'Secure Your Seat',
      subtitle: 'Spaces are limited due to the intensive nature of our immersion program. Contact us to start your application.',
      call: 'Call Us',
      email: 'Email Us',
      visit: 'Visit Us',
      address: 'Qurban Road, Near Al-Masjid An-Nabawi, Madinah, Saudi Arabia',
      formTitle: 'Application Inquiry',
      firstName: 'First Name',
      lastName: 'Last Name',
      emailLabel: 'Email',
      messageLabel: 'Tell us about your current level',
      sendBtn: 'Submit Application',
      footer: '© 2024 Fos7a Taibah Institute. Madinah, KSA. Part of BT Dima Khriza Group Co.'
    },
    quiz: {
      title: "Course Advisor",
      subtitle: "Let us guide you to the right path",
      welcome: "To ensure you get the most out of your 60 days in Madinah, let's identify your current status.",
      startBtn: "Start Assessment",
      q1: "Do you need Arabic primarily for business or professional work?",
      q2: "Can you already read Arabic texts but struggle to speak naturally?",
      yes: "Yes",
      no: "No",
      recommendation: "Your Recommended Path:",
      restart: "Start Over"
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عن المعهد',
      methodology: 'منهجنا',
      teachers: 'هيئة التدريس',
      courses: 'الباقات',
      contact: 'اتصل بنا',
      enroll: 'سجل الآن'
    },
    hero: {
      location: 'مقرنا في المدينة المنورة',
      titleLine1: 'عش اللغة العربية',
      titleLine2: 'في رحاب مدينة المصطفى',
      description: 'نقدم نموذجاً تعليمياً فريداً يجمع بين التميز الأكاديمي والمعايشة اليومية مع أهل المدينة. السكن، والإعاشة، والمواصلات مشمولة.',
      viewCourses: 'تصفح الباقات',
      aboutInstitute: 'منهجيتنا',
      quote: '"تعلموا العربية وعلموها الناس"'
    },
    teachers: {
      badge: 'معلمونا',
      title: 'تعرف على الفريق الذي سيرافقك',
      subtitle: 'مزيج متوازن من معلمين موطنين، ومصممي مناهج، ومشرفي انغماس لضمان ممارستك داخل الصف وخارجه.',
      experienceLabel: '{years}+ سنة',
      list: [
        {
          initials: 'AA',
          name: 'أ. عبدالعزيز الحربي',
          role: 'مدرب المناهج الرئيسي',
          experience: '12',
          focus: 'النحو والصرف وضبط التجويد',
          bio: 'معلم من أهل المدينة متخصص في النحو والصرف ومخارج الحروف. يرسخ الأساس بدقة ليجري لسانك بسلاسة.',
          type: 'curriculum'
        },
        {
          initials: 'MN',
          name: 'مريم النجدي',
          role: 'مشرفة الانغماس',
          experience: '8',
          focus: 'ممارسة يومية مع أهل المدينة والأسواق',
          bio: 'تصحب الطلاب في الزيارات المجتمعية وأيام التطوع وأحاديث الأسواق لتحويل النظرية إلى ثقة في الحديث.',
          type: 'immersion'
        },
        {
          initials: 'SH',
          name: 'الشيخ حمزة',
          role: 'مسؤول الإلقاء والبلاغة',
          experience: '10',
          focus: 'الخطابة والنبرة المهنية',
          bio: 'يدرب الطلاب على أسلوب الخطب، والمراسلات الرسمية، وآداب الأعمال للظهور بمظهر مهني في العربية.',
          type: 'delivery'
        }
      ]
    },
    about: {
      titleLine1: 'أكثر من مجرد',
      titleLine2: 'قاعة دراسية',
      description: 'معهد فصحى طيبة يقدم تجربة تعليمية شمولية. نؤمن أن اللغة تُعاش ولا تُحفظ فقط. من خلال دمجك في نسيج المجتمع المدني عبر الفعاليات والزيارات، نضمن انطلاق لسانك بالفصحى بسلاسة.',
      locationTitle: 'قلب المدينة',
      locationDesc: 'ادرس وعش في جوار الحرم النبوي الشريف.',
      teachersTitle: 'موجهون لا معلمون',
      teachersDesc: 'مدرسونا هم جسور ثقافية لربطك باللغة.',
      curriculumTitle: 'تعليم هجين',
      curriculumDesc: 'دروس منهجية + انغماس مجتمعي واقعي.',
      communityTitle: 'شامل الخدمات',
      communityDesc: 'نتكفل بالسكن والإعاشة والمواصلات لتتفرغ للعلم.',
      imageCaption: '"لغة القرآن هي المفتاح لفهم الإسلام."'
    },
    methodology: {
      title: "منهجية التعليم الهجين",
      subtitle: "نردم الفجوة بين النظرية الأكاديمية والتطبيق الواقعي عبر برنامج 'عايش اللغة'.",
      classroom: {
        title: "المعيار الأكاديمي",
        desc: "جلسات صباحية مكثفة تركز على النحو والصرف والبلاغة باستخدام مناهج معتمدة."
      },
      community: {
        title: "الانغماس المجتمعي",
        desc: "تُخصص فترات ما بعد الظهر والمساء للفعاليات مع السكان المحليين وزيارة الأسواق لممارسة ما تعلمته."
      },
      stats: {
        hours: "٢٢٠ ساعة أكاديمية",
        duration: "٦٠ يوماً / شهرين",
        activities: "نشاطات يومية"
      }
    },
    courses: {
      title: 'الباقات التعليمية',
      subtitle: 'جميع الباقات تشمل السكن، ٣ وجبات يومياً، المواصلات، والرحلات الثقافية. اختر المسار الذي يناسب هدفك.',
      register: 'سجل اهتمامك',
      details: 'تفاصيل الباقة',
      close: 'إغلاق التفاصيل',
      includes: 'الباقة الشاملة:',
      schedule: 'الجدول النموذجي:',
      list: [
        {
          id: 'beginner',
          title: 'برنامج التأسيس',
          arabicTitle: 'Al-Ta\'sees',
          level: 'مبتدئ تماماً',
          mode: 'حضوري بمعايشة كاملة',
          shortDescription: 'لمن يبدأ من الصفر. تعلم القراءة والكتابة والمحادثة الأساسية بثقة.',
          fullDescription: 'هذا البرنامج الشامل لمدة ٦٠ يوماً مصمم للطلاب الذين ليس لديهم معرفة سابقة. نبدأ من الحروف والصوتيات، وننتقل بسرعة إلى بناء الجمل. لن تتعلم من الكتب فحسب؛ بل ستمارس مفرداتك الجديدة في أسواق ومساجد المدينة.',
          duration: '٦٠ يوماً',
          hours: '٢٢٠ ساعة/شهر',
          price: 'تواصل للسعر',
          suitability: 'النوع ج: المبتدئون الراغبون في بداية صحيحة.',
          schedule: '٨:٠٠ ص - ١:٠٠ م (دروس) + مناشط مسائية',
          inclusions: ['سكن فاخر مشترك', '٣ وجبات يومياً', 'نقل خاص', 'دعم التأشيرة'],
          features: ['إتقان الحروف والصوتيات', 'محادثات يومية أساسية', 'مهارات الكتابة', 'مقدمة في النحو'],
          capacity: 30
        },
        {
          id: 'immersion',
          title: 'برنامج الإتقان',
          arabicTitle: 'Al-Itqan',
          level: 'متوسط/متقدم',
          mode: 'سكني مكثف',
          shortDescription: 'للطلاب الذين يعرفون الأساسيات ولكن يعانون من ركاكة في الحديث أو قلة الممارسة.',
          fullDescription: 'مصمم للطلاب (النوع ب) الذين درسوا النحو ولكن يفتقدون الطلاقة. نركز على "تصحيح" الأخطاء الشائعة و "إعادة تعلم" التعبير العربي الفصيح. تركيز كبير على الأساليب البلاغية والانغماس العميق مع السكان المحليين لصقل اللسان.',
          duration: '٦٠ يوماً',
          hours: '٢٢٠ ساعة/شهر',
          price: 'تواصل للسعر',
          suitability: 'النوع ب: طلاب العلم النظري الذين ينقصهم التطبيق.',
          schedule: '٨:٠٠ ص - ١:٠٠ م (نصوص متقدمة) + مجالس مسائية',
          inclusions: ['سكن فاخر مشترك', '٣ وجبات يومياً', 'نقل خاص', 'دعم التأشيرة'],
          features: ['تصحيح التراكيب', 'البلاغة المتقدمة', 'الخطابة', 'انغماس ثقافي عميق'],
          capacity: 25
        },
        {
          id: 'business',
          title: 'لغة الأعمال',
          arabicTitle: 'At-Tijarah',
          level: 'مهني',
          mode: 'هجيني للمديرين',
          shortDescription: 'منهج متخصص للمهنيين الذين يحتاجون العربية للتجارة والتفاوض والدبلوماسية.',
          fullDescription: 'برنامج موجه للطلاب (النوع أ) الذين يركزون على سوق العمل. بينما نغطي الأساسيات، تركز المفردات والسيناريوهات على العقود، والمفاوضات، وإدارة السياحة الدينية، والمراسلات المهنية.',
          duration: '٣٠ يوماً',
          hours: '١١٠ ساعة تعليمية',
          price: 'تواصل للسعر',
          suitability: 'النوع أ: رواد الأعمال والمهنيون.',
          schedule: 'ساعات مكثفة مرنة + فعاليات تعارف',
          inclusions: ['سكن مميز', '٣ وجبات يومياً', 'نقل خاص', 'شبكة علاقات تجارية'],
          features: ['مصطلحات العقود', 'مهارات التفاوض', 'المراسلات المهنية', 'انغماس في السوق'],
          capacity: 15
        }
      ] as Course[]
    },
    faq: {
        title: "أسئلة شائعة",
        items: [
            { q: "هل توفرون تأشيرات طلابية؟", a: "نعم، بمجرد التسجيل ودفع الرسوم، نصدر خطاب قبول رسمي ورقم تفويض من الوزارة للتقديم على تأشيرة تعليمية قصيرة المدى." },
            { q: "هل السكن منفصل؟", a: "بالتأكيد. التزاماً بقيم المدينة المنورة، لدينا مجمعات سكنية ودراسية منفصلة تماماً للرجال وللنساء." },
            { q: "هل يمكنني إحضار عائلتي؟", a: "باقاتنا القياسية مصممة للأفراد. يمكن ترتيب سكن عائلي بطلب خاص وتكلفة إضافية." },
            { q: "هل أحتاج معرفة سابقة بالعربية؟", a: "لبرنامج التأسيس لا يشترط ذلك. للبرامج الأخرى نجري تقييماً للمستوى قبل إتمام التسجيل." }
        ]
    },
    contact: {
      title: 'احجز مقعدك',
      subtitle: 'المقاعد محدودة نظراً للطبيعة المكثفة لبرنامج المعايشة. تواصل معنا لبدء إجراءات التقديم.',
      call: 'اتصل بنا',
      email: 'راسلنا',
      visit: 'زرنا',
      address: 'شارع قربان، بالقرب من المسجد النبوي، المدينة المنورة',
      formTitle: 'استفسار عن التقديم',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      emailLabel: 'البريد الإلكتروني',
      messageLabel: 'حدثنا عن مستواك الحالي',
      sendBtn: 'إرسال الطلب',
      footer: '© 2024 معهد فصحى طيبة. المدينة المنورة. إحدى شركات مجموعة بي تي ديما خريزة.',
    },
    quiz: {
      title: "المستشار الأكاديمي",
      subtitle: "دعنا نرشدك للمسار الصحيح",
      welcome: "لضمان حصولك على أقصى استفادة من الـ ٦٠ يوماً في المدينة، دعنا نحدد وضعك الحالي.",
      startBtn: "ابدأ التقييم",
      q1: "هل تحتاج العربية بشكل أساسي للعمل أو التجارة؟",
      q2: "هل يمكنك قراءة النصوص العربية ولكن تجد صعوبة في التحدث بطلاقة؟",
      yes: "نعم",
      no: "لا",
      recommendation: "المسار المقترح لك:",
      restart: "ابدأ من جديد"
    }
  },
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      methodology: 'Metodologi',
      teachers: 'Pengajar',
      courses: 'Paket',
      contact: 'Kontak',
      enroll: 'Daftar Sekarang'
    },
    hero: {
      location: 'Berlokasi di Al-Madinah Al-Munawwarah',
      titleLine1: 'Hiduplah dalam Bahasa Arab',
      titleLine2: 'Di Kota Nabi',
      description: 'Rasakan model pembelajaran hibrida unik kami: Keunggulan akademis dikombinasikan dengan aktivitas imersif harian di komunitas lokal Madinah. Akomodasi, makan, dan transportasi sudah termasuk.',
      viewCourses: 'Lihat Paket',
      aboutInstitute: 'Metode Kami',
      quote: '"Pelajarilah bahasa Arab dan ajarkanlah kepada manusia"'
    },
    teachers: {
      badge: 'Pengajar',
      title: 'Temui Para Instruktur Anda',
      subtitle: 'Tim seimbang antara penutur asli, perancang kurikulum, dan mentor imersi agar Anda terus berlatih di dalam dan di luar kelas.',
      experienceLabel: '{years}+ thn',
      list: [
        {
          initials: 'AA',
          name: 'Ust. AbdulAziz Al-Harbi',
          role: 'Pelatih Kurikulum Utama',
          experience: '12',
          focus: 'Tata bahasa klasik & kesesuaian Tajwid',
          bio: 'Putra Madinah yang ahli Nahwu, Sharaf, dan makhraj huruf. Menjaga fondasi presisi agar lisan Anda mengalir alami.',
          type: 'curriculum'
        },
        {
          initials: 'MN',
          name: 'Maryam An-Najdi',
          role: 'Mentor Imersi',
          experience: '8',
          focus: 'Latihan harian dengan warga & pasar',
          bio: 'Mendampingi siswa dalam kunjungan komunitas, hari-hari relawan, dan percakapan di bazar untuk mengubah teori menjadi kelancaran.',
          type: 'immersion'
        },
        {
          initials: 'SH',
          name: 'Syekh Hamzah',
          role: 'Pemimpin Retorika & Penyampaian',
          experience: '10',
          focus: 'Public speaking & nada profesional',
          bio: 'Melatih gaya khutbah, korespondensi resmi, dan etika bisnis agar Anda tampil profesional dalam bahasa Arab.',
          type: 'delivery'
        }
      ]
    },
    about: {
      titleLine1: 'Lebih Dari Sekadar',
      titleLine2: 'Ruang Kelas',
      description: 'Institut Fos7a Taibah menawarkan pengalaman pendidikan holistik. Kami percaya bahasa itu dijalani, bukan hanya dihafal. Dengan mengintegrasikan Anda ke dalam masyarakat Madinah melalui acara dan pertemuan lokal, kami memastikan lidah Anda beradaptasi dengan aliran alami bahasa Arab.',
      locationTitle: 'Jantung Madinah',
      locationDesc: 'Belajar dan tinggal dalam pelukan spiritual Tanah Haram.',
      teachersTitle: 'Pemandu Asli',
      teachersDesc: 'Instruktur kami bukan hanya guru, tetapi jembatan budaya.',
      curriculumTitle: 'Pembelajaran Hibrida',
      curriculumDesc: 'Kelas standar + Interaksi komunitas dunia nyata.',
      communityTitle: 'Semua Termasuk',
      communityDesc: 'Kami menangani akomodasi, makan, dan transportasi Anda.',
      imageCaption: '"Bahasa Al-Quran adalah kunci untuk memahami Islam."'
    },
    methodology: {
      title: "Metodologi Hibrida Kami",
      subtitle: "Kami menjembatani kesenjangan antara teori akademis dan aplikasi dunia nyata melalui program 'Hidupkan Bahasa'.",
      classroom: {
        title: "Standar Akademik",
        desc: "Sesi pagi intensif yang berfokus pada tata bahasa (Nahwu), morfologi (Saraf), dan retorika (Balagha)."
      },
      community: {
        title: "Imersi Komunitas",
        desc: "Siang dan malam didedikasikan untuk acara dengan penduduk setempat dan kunjungan pasar untuk mempraktikkan apa yang Anda pelajari."
      },
      stats: {
        hours: "220 Jam Akademik",
        duration: "60 Hari / 2 Bulan",
        activities: "Aktivitas Harian"
      }
    },
    courses: {
      title: 'Paket Pendidikan',
      subtitle: 'Semua paket termasuk Akomodasi, 3 Makan Sehari, Transportasi, dan Wisata Budaya. Pilih jalur yang sesuai dengan tujuan Anda.',
      register: 'Daftar Minat',
      details: 'Lihat Detail',
      close: 'Tutup Detail',
      includes: 'Paket All-Inclusive:',
      schedule: 'Jadwal Tipikal:',
      list: [
        {
          id: 'beginner',
          title: 'Al-Ta\'sees (Yayasan)',
          arabicTitle: 'برنامج التأسيس',
          level: 'Pemula Mutlak',
          mode: 'Tatap muka berasrama',
          shortDescription: 'Bagi mereka yang mulai dari nol. Belajar membaca, menulis, dan berbicara bahasa Arab dasar dengan percaya diri.',
          fullDescription: 'Program 60 hari yang komprehensif ini dirancang untuk siswa dengan sedikit atau tanpa pengetahuan sebelumnya. Kami mulai dari alfabet dan fonetik, bergerak cepat ke pembentukan kalimat. Anda tidak hanya akan belajar dari buku; Anda akan mempraktikkan kosakata baru Anda di toko-toko lokal dan masjid-masjid Madinah.',
          duration: '60 Hari',
          hours: '220 Jam/Bulan',
          price: 'Hubungi Kami',
          suitability: 'Tipe C: Pemula mutlak yang menginginkan awal yang benar.',
          schedule: '08:00 - 13:00 (Kelas) + Aktivitas Sore',
          inclusions: ['Perumahan Bersama Mewah', '3 Makan Sehari', 'Transportasi Pribadi', 'Dukungan Visa'],
          features: ['Penguasaan Alfabet & Fonetik', 'Percakapan Harian Dasar', 'Keterampilan Menulis', 'Pengantar Tata Bahasa'],
          capacity: 30
        },
        {
          id: 'immersion',
          title: 'Al-Itqan (Kefasihan)',
          arabicTitle: 'برنامج الإتقان',
          level: 'Menengah/Lanjutan',
          mode: 'Imersi tinggal di kampus',
          shortDescription: 'Untuk siswa yang tahu dasar-dasarnya tetapi kesulitan berbicara atau memiliki bahasa Arab yang "kaku".',
          fullDescription: 'Dirancang untuk siswa (Tipe B) yang telah belajar tata bahasa tetapi kurang lancar. Kami fokus pada "mempelajari kembali" ekspresi bahasa Arab yang alami. Penekanan berat pada gaya retorika dan pencelupan mendalam dengan penduduk setempat.',
          duration: '60 Hari',
          hours: '220 Jam/Bulan',
          price: 'Hubungi Kami',
          suitability: 'Tipe B: Siswa dengan pengetahuan teoritis tetapi kurang praktik.',
          schedule: '08:00 - 13:00 (Teks Lanjutan) + Majelis Malam',
          inclusions: ['Perumahan Bersama Mewah', '3 Makan Sehari', 'Transportasi Pribadi', 'Dukungan Visa'],
          features: ['Koreksi Frasa', 'Retorika Lanjutan (Balagha)', 'Berbicara di Depan Umum', 'Imersi Budaya Mendalam'],
          capacity: 25
        },
        {
          id: 'business',
          title: 'At-Tijarah (Bisnis)',
          arabicTitle: 'لغة الأعمال',
          level: 'Profesional',
          mode: 'Hibrida untuk eksekutif',
          shortDescription: 'Kurikulum khusus untuk profesional yang membutuhkan bahasa Arab untuk perdagangan, negosiasi, dan diplomasi.',
          fullDescription: 'Program yang ditargetkan untuk siswa (Tipe A) yang berfokus pada pasar. Sambil mencakup hal-hal penting, kosakata dan skenario berfokus pada kontrak, negosiasi, manajemen pariwisata religius, dan korespondensi profesional.',
          duration: '30 Hari',
          hours: '110 Jam Pembelajaran',
          price: 'Hubungi Kami',
          suitability: 'Tipe A: Pengusaha dan profesional.',
          schedule: 'Jam Intensif Fleksibel + Acara Jejaring',
          inclusions: ['Perumahan Premium', '3 Makan Sehari', 'Transportasi Pribadi', 'Jejaring Bisnis'],
          features: ['Terminologi Kontrak', 'Keterampilan Negosiasi', 'Korespondensi Profesional', 'Imersi Pasar'],
          capacity: 15
        }
      ] as Course[]
    },
    faq: {
        title: "Pertanyaan Umum",
        items: [
            { q: "Apakah Anda menyediakan visa pelajar?", a: "Ya, setelah terdaftar dan uang sekolah dibayar, kami mengeluarkan surat penerimaan resmi untuk pengajuan visa pendidikan jangka pendek." },
            { q: "Apakah perumahan dipisah?", a: "Tentu saja. Sesuai dengan nilai-nilai Al-Madinah, kami memiliki kompleks perumahan dan kampus yang sepenuhnya terpisah untuk siswa putra dan putri." },
            { q: "Bisakah saya membawa keluarga?", a: "Paket standar kami adalah untuk siswa perorangan. Akomodasi keluarga dapat diatur berdasarkan permintaan khusus dengan biaya tambahan." },
            { q: "Apakah saya perlu kemampuan bahasa Arab dasar?", a: "Untuk program Al-Ta'sees (Yayasan), tidak diperlukan pengetahuan sebelumnya. Untuk tingkatan lain, kami akan menilai level Anda." }
        ]
    },
    contact: {
      title: 'Amankan Kursi Anda',
      subtitle: 'Tempat terbatas karena sifat intensif dari program imersi kami. Hubungi kami untuk memulai aplikasi Anda.',
      call: 'Hubungi Kami',
      email: 'Email Kami',
      visit: 'Kunjungi Kami',
      address: 'Jalan Qurban, Dekat Masjid Nabawi, Madinah, Arab Saudi',
      formTitle: 'Pertanyaan Aplikasi',
      firstName: 'Nama Depan',
      lastName: 'Nama Belakang',
      emailLabel: 'Email',
      messageLabel: 'Ceritakan tentang level Anda saat ini',
      sendBtn: 'Kirim Aplikasi',
      footer: '© 2024 Institut Fos7a Taibah. Madinah, KSA. Bagian dari BT Dima Khriza Group Co.'
    },
    quiz: {
      title: "Penasihat Kursus",
      subtitle: "Biarkan kami memandu Anda ke jalan yang benar",
      welcome: "Untuk memastikan Anda mendapatkan hasil maksimal dari 60 hari Anda di Madinah, mari identifikasi status Anda saat ini.",
      startBtn: "Mulai Penilaian",
      q1: "Apakah Anda membutuhkan bahasa Arab terutama untuk bisnis atau pekerjaan profesional?",
      q2: "Bisakah Anda membaca teks bahasa Arab tetapi kesulitan berbicara secara alami?",
      yes: "Ya",
      no: "Tidak",
      recommendation: "Jalur yang Direkomendasikan untuk Anda:",
      restart: "Mulai Lagi"
    }
  }
};