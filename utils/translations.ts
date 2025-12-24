import { Course, Testimonial } from '../types';

export const translations = {
  ar: {
    common: {
      instituteNameLatin: 'Fos7a Taibah Institute',
      instituteNameArabic: 'معهد فصحى طيبة',
      instituteLegalLine: 'معهد فصحى طيبة هو وحدة أعمال تابعة لشركة BT Dima Khriza Group (المملكة العربية السعودية).',
      instituteAddress: 'المدينة المنورة، المملكة العربية السعودية',
      ownerCompany: 'شركة BT Dima Khriza Group',
      visaSupport: 'دعم التأشيرة: يوفر معهد FTL دعمًا كاملاً في التقديم على التأشيرة وإجراءاتها.',
      loading: 'جارٍ التحميل…',
      close: 'إغلاق',
      back: 'عودة',
      cancel: 'إلغاء',
      yes: 'نعم',
      no: 'لا',
      emptyValue: '—',
      currencySymbol: '$',
      languages: {
        ar: 'العربية',
        en: 'English',
        id: 'Bahasa Indonesia'
      }
    },
    nav: {
      home: 'الرئيسية',
      about: 'عن المعهد',
      methodology: 'منهجنا',
      teachers: 'هيئة التدريس',
      courses: 'الباقات',
      stories: 'القصص',
      contact: 'اتصل بنا',
      enroll: 'سجل الآن',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      studentPortal: 'بوابة الطالب',
      adminDashboard: 'لوحة الإدارة',
      language: 'اللغة',
      selected: 'محدد',
      portal: 'البوابة',
      admin: 'الإدارة',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
      authLoading: 'جارٍ التحميل…',
      cartLabel: 'سلة التسوق',
      cartTitle: 'سلة التسوق',
      openCart: 'فتح سلة التسوق',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      languages: {
        en: 'الإنجليزية',
        ar: 'العربية',
        id: 'الإندونيسية'
      }
    },
    footer: {
      instituteNameLatin: 'Fos7a Taibah Institute',
      instituteNameArabic: 'معهد فصحى طيبة',
      about: {
        title: 'عن المعهد',
        description: 'نقدم برامج عربية مكثفة تجمع بين الدراسة الأكاديمية والانغماس اليومي في بيئة المدينة.',
        legalLine: 'معهد فصحى طيبة جزء من شركة PT Dima Khriza Group Co.'
      },
      contact: {
        title: 'التواصل',
        emailLabel: 'البريد الإلكتروني',
        locationLabel: 'الموقع',
        locationValue: 'المدينة المنورة، المملكة العربية السعودية'
      },
      quickLinks: {
        title: 'روابط سريعة',
        home: 'الرئيسية',
        courses: 'الباقات',
        admission: 'التقديم',
        portal: 'البوابة',
        admin: 'الإدارة',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الاستخدام'
      },
      socials: {
        title: 'وسائل التواصل',
        linkLabel: 'تابعنا على {name}'
      },
      legalTitle: 'قانوني',
      contactTitle: 'التواصل',
      legalLinks: {
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الاستخدام',
        refunds: 'سياسة الاسترجاع',
        consent: 'موافقة جمع الوثائق',
        gdpr: 'إشعار GDPR'
      },
      legalPages: {
        terms: {
          title: 'شروط الاستخدام',
          sections: [
            {
              title: 'الموافقة',
              body: 'باستخدامك للموقع فإنك توافق على هذه الشروط وسياسة الخصوصية.'
            },
            {
              title: 'الخدمات',
              body: 'يوفر الموقع معلومات الدورات وخطوات التقديم وتجربة بوابة الطالب/الإدارة. بعض الميزات تجريبية فقط.'
            },
            {
              title: 'مسؤوليات المستخدم',
              body: 'يلزم تقديم معلومات صحيحة والحفاظ على سرية بيانات الدخول.'
            },
            {
              title: 'تحديد المسؤولية',
              body: 'الميزات التجريبية مقدمة كما هي. قد تتضمن شروط الإنتاج أحكامًا إضافية.'
            }
          ]
        },
        privacy: {
          title: 'سياسة الخصوصية',
          sections: [
            {
              title: 'ما الذي نجمعه',
              body: 'قد نجمع معلومات الاتصال وبيانات الطلب. وإذا قمت برفع صورة جواز السفر أو وثائق الهوية فسيتم جمعها لأغراض التسجيل ودعم التأشيرة.'
            },
            {
              title: 'كيف نستخدم البيانات',
              body: 'نستخدم بياناتك لمعالجة الطلبات والتواصل معك وإدارة التسجيل وتجهيز خطابات دعم التأشيرة عند الحاجة.'
            },
            {
              title: 'الاحتفاظ بالبيانات',
              body: 'في وضع العرض (Demo) تُحفظ البيانات داخل متصفحك فقط. في الإنتاج سيتم تحديد مدة الاحتفاظ ويمكنك طلب الحذف حسب الأنظمة.'
            },
            {
              title: 'حقوقك',
              body: 'يمكنك طلب الوصول أو التصحيح أو الحذف وفقًا للأنظمة المعمول بها.'
            }
          ]
        },
        refunds: {
          title: 'سياسة الاسترجاع',
          sections: [
            {
              title: 'أهلية الاسترجاع',
              body: 'تخضع الاسترجاعات لسياسة المعهد وتاريخ بدء الدورة والرسوم الإدارية.'
            },
            {
              title: 'طريقة الطلب',
              body: 'تواصل مع المعهد مرفقًا رقم الطالب ومرجع الدفع.'
            },
            {
              title: 'مدة المعالجة',
              body: 'تُراجع الطلبات خلال مدة معقولة وفقًا للسياسة.'
            }
          ]
        },
        cookie: {
          title: 'سياسة ملفات الارتباط',
          sections: [
            {
              title: 'ما هي ملفات الارتباط',
              body: 'ملفات الارتباط هي ملفات صغيرة تُخزن على جهازك لتحسين تجربة التصفح وتذكر تفضيلاتك.'
            },
            {
              title: 'كيف نستخدمها',
              body: 'نستخدمها لتشغيل الموقع وتحليل الاستخدام بشكل عام وتحسين الأداء.'
            },
            {
              title: 'خياراتك',
              body: 'يمكنك تعديل إعدادات المتصفح لتعطيل ملفات الارتباط، وقد يؤثر ذلك على بعض الميزات.'
            }
          ]
        },
        consent: {
          title: 'موافقة جمع الوثائق',
          sections: [
            {
              title: 'موافقة جمع الوثائق',
              body: 'إذا اخترت رفع صورة جواز السفر أو وثائق الهوية فإنك توافق على جمعها ومعالجتها لأغراض مراجعة الطلب ودعم التأشيرة.'
            },
            {
              title: 'تنبيه البيانات الحساسة',
              body: 'وثائق الهوية بيانات حساسة. يجب أن يقتصر الوصول عليها على الموظفين المخولين في بيئات الإنتاج.'
            }
          ]
        },
        gdpr: {
          title: 'إشعار GDPR',
          sections: [
            {
              title: 'إشعار GDPR',
              body: 'إذا كنت في الاتحاد الأوروبي/المنطقة الاقتصادية الأوروبية فقد تكون لك حقوق بموجب GDPR. في وضع العرض تُحفظ البيانات محليًا داخل متصفحك. في الإنتاج يجب تطبيق الأساس القانوني والاحتفاظ ومعالجة طلبات أصحاب البيانات.'
            },
            {
              title: 'جهة الاتصال',
              body: 'تواصل مع المعهد لطلبات GDPR.'
            }
          ]
        }
      },
      domainLabel: 'النطاق: {domain}',
      copyright: '© {year} {name}'
    },
    home: {
      hero: {
        location: 'مقرنا في المدينة المنورة',
        titleLine1: 'عش اللغة العربية',
        titleLine2: 'في رحاب مدينة المصطفى',
        description: 'نقدم نموذجًا تعليميًا فريدًا يجمع بين التميز الأكاديمي والمعايشة اليومية مع أهل المدينة. السكن، والإعاشة، والمواصلات مشمولة.',
        viewCourses: 'تصفح الباقات',
        aboutInstitute: 'منهجيتنا',
        quote: '"تعلموا العربية وعلموها الناس"'
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
        imageCaption: '"لغة القرآن هي المفتاح لفهم الإسلام."',
        imagePlaceholder: 'صورة توضيحية'
      },
      methodology: {
        title: 'منهجية التعليم الهجين',
        subtitle: 'نردم الفجوة بين النظرية الأكاديمية والتطبيق الواقعي عبر برنامج "عايش اللغة".',
        classroom: {
          title: 'المعيار الأكاديمي',
          desc: 'جلسات صباحية مكثفة تركز على النحو والصرف والبلاغة باستخدام مناهج معتمدة.'
        },
        community: {
          title: 'الانغماس المجتمعي',
          desc: 'تُخصص فترات ما بعد الظهر والمساء للفعاليات مع السكان المحليين وزيارة الأسواق لممارسة ما تعلمته.'
        },
        stats: {
          hours: '٢٢٠ ساعة أكاديمية',
          duration: '٦٠ يوماً / شهرين',
          activities: 'نشاطات يومية'
        }
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
      courses: {
        title: 'الباقات التعليمية',
        subtitle: 'جميع الباقات تشمل السكن، ٣ وجبات يوميًا، المواصلات، والرحلات الثقافية. اختر المسار الذي يناسب هدفك.',
        apply: 'قدّم',
        applyNow: 'قدّم الآن',
        full: 'مكتمل',
        courseFull: 'المقاعد ممتلئة',
        left: 'متبقية',
        leftLabel: 'متبقي',
        placementTest: 'اختبار المستوى',
        whatsapp: 'واتساب',
        whatsappMessage: 'السلام عليكم! أرغب في معرفة المزيد عن برامج العربية في فصحى طيبة.',
        register: 'سجل اهتمامك',
        details: 'تفاصيل الباقة',
        close: 'إغلاق التفاصيل',
        includes: 'الباقة الشاملة:',
        schedule: 'الجدول النموذجي:',
        priceOnRequest: 'تواصل للسعر',
        labels: {
          level: 'المستوى',
          duration: 'المدة',
          mode: 'النمط',
          focusAreas: 'محاور التركيز:',
          quickStatsAria: 'ملخص سريع للدورة',
          courseCardAria: 'بطاقة دورة {title}'
        },
        list: [
          {
            id: 'beginner',
            title: 'برنامج التأسيس',
            arabicTitle: 'Al-Ta\'sees',
            level: 'مبتدئ تمامًا',
            mode: 'حضوري بمعايشة كاملة',
            shortDescription: 'لمن يبدأ من الصفر. تعلم القراءة والكتابة والمحادثة الأساسية بثقة.',
            fullDescription: 'هذا البرنامج الشامل لمدة ٦٠ يومًا مصمم للطلاب الذين ليس لديهم معرفة سابقة. نبدأ من الحروف والصوتيات، وننتقل بسرعة إلى بناء الجمل. لن تتعلم من الكتب فحسب؛ بل ستمارس مفرداتك الجديدة في أسواق ومساجد المدينة.',
            duration: '٦٠ يومًا',
            hours: '٢٢٠ ساعة/شهر',
            price: 'تواصل للسعر',
            suitability: 'النوع ج: المبتدئون الراغبون في بداية صحيحة.',
            schedule: '٨:٠٠ ص - ١:٠٠ م (دروس) + مناشط مسائية',
            inclusions: ['سكن فاخر مشترك', '٣ وجبات يوميًا', 'نقل خاص', '{visaSupport}'],
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
            duration: '٦٠ يومًا',
            hours: '٢٢٠ ساعة/شهر',
            price: 'تواصل للسعر',
            suitability: 'النوع ب: طلاب العلم النظري الذين ينقصهم التطبيق.',
            schedule: '٨:٠٠ ص - ١:٠٠ م (نصوص متقدمة) + مجالس مسائية',
            inclusions: ['سكن فاخر مشترك', '٣ وجبات يوميًا', 'نقل خاص', '{visaSupport}'],
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
            duration: '٣٠ يومًا',
            hours: '١١٠ ساعة تعليمية',
            price: 'تواصل للسعر',
            suitability: 'النوع أ: رواد الأعمال والمهنيون.',
            schedule: 'ساعات مكثفة مرنة + فعاليات تعارف',
            inclusions: ['سكن مميز', '٣ وجبات يوميًا', 'نقل خاص', 'شبكة علاقات تجارية'],
            features: ['مصطلحات العقود', 'مهارات التفاوض', 'المراسلات المهنية', 'انغماس في السوق'],
            capacity: 15
          }
        ] as Course[]
      },
      faq: {
        title: 'أسئلة شائعة',
        items: [
          { q: 'هل توفرون تأشيرات طلابية؟', a: '{visaSupport}' },
          { q: 'هل أحتاج معرفة سابقة بالعربية؟', a: 'لبرنامج التأسيس لا يشترط ذلك. للبرامج الأخرى نجري تقييماً للمستوى قبل إتمام التسجيل.' }
        ]
      },
      contact: {
        title: 'احجز مقعدك',
        subtitle: 'المقاعد محدودة نظرًا للطبيعة المكثفة لبرنامج المعايشة. تواصل معنا لبدء إجراءات التقديم.',
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
        statusSuccess: 'شكرًا لتواصلك! تم إرسال النموذج بنجاح.',
        statusError: 'عذرًا! حدث خطأ. يرجى المحاولة مرة أخرى.',
        footer: '© 2024 معهد فصحى طيبة. المدينة المنورة. إحدى شركات مجموعة بي تي ديما خريزة.',
        socials: {
          instagram: 'إنستغرام',
          twitter: 'تويتر',
          facebook: 'فيسبوك'
        }
      },
      testimonials: {
        badge: 'أصوات الطلاب',
        title: 'قصص من',
        titleAccent: 'المدينة',
        subtitle: 'استمع إلى خريجينا الذين ساروا على طريق الفصاحة في مدينة المصطفى.',
        videoTitle: 'شاهد تجربة الطلاب',
        videoSubtitle: 'يوم من الحياة في فصحى طيبة',
        videoCaption: 'لقطات مصورة حصريًا في المدينة المنورة',
        quotePrefix: '«',
        quoteSuffix: '»',
        ctaTitle: 'هل أنت مستعد لكتابة قصتك؟',
        ctaSubtitle: 'انضم إلى الدفعة القادمة وعش اللغة في موطنها.',
        ctaButton: 'ابدأ التقديم',
        items: [
          {
            id: 1,
            name: 'إسماعيل إبراهيم',
            role: 'مهندس برمجيات',
            country: 'المملكة المتحدة',
            text: 'المعايشة في المدينة تجربة لا تشبه أي شيء آخر. دراسة النحو صباحًا والصلاة في المسجد النبوي عصرًا غيّرت قلبي ولساني.',
            rating: 5
          },
          {
            id: 2,
            name: 'عائشة يوسف',
            role: 'طالبة جامعية',
            country: 'ماليزيا',
            text: 'كنت أخاف التحدث رغم معرفتي بالقواعد. معلمو فصحى طيبة صبورون والبيئة تدفعك للكلام. أصبحت أتكلم بثقة الآن.',
            rating: 5
          },
          {
            id: 3,
            name: 'د. بلال خان',
            role: 'طبيب',
            country: 'الولايات المتحدة',
            text: 'برنامج العربية للأعمال كان مثاليًا لاحتياجاتي. لم يكن مجرد مفردات جافة؛ بل مواقف واقعية. السكن كان مريحًا وقريبًا من الحرم.',
            rating: 4
          }
        ] as Testimonial[]
      },
      courseAdvisor: {
        title: 'المستشار الأكاديمي',
        subtitle: 'دعنا نرشدك للمسار الصحيح',
        welcome: 'لضمان حصولك على أقصى استفادة من الـ ٦٠ يومًا في المدينة، دعنا نحدد وضعك الحالي.',
        startBtn: 'ابدأ التقييم',
        q1: 'هل تحتاج العربية بشكل أساسي للعمل أو التجارة؟',
        q2: 'هل يمكنك قراءة النصوص العربية ولكن تجد صعوبة في التحدث بطلاقة؟',
        yes: 'نعم',
        no: 'لا',
        recommendation: 'المسار المقترح لك:',
        restart: 'ابدأ من جديد',
        applyNow: 'قدّم الآن',
        openLabel: 'فتح المستشار الأكاديمي',
        closeLabel: 'إغلاق المستشار الأكاديمي'
      }
    },
    applicationForm: {
      title: 'طلب الالتحاق بالبرنامج',
      stepIndicator: 'الخطوة {step} من {total}',
      steps: {
        personal: 'شخصي',
        passport: 'جواز السفر',
        course: 'الدورة',
        review: 'المراجعة'
      },
      sections: {
        personalInfo: 'المعلومات الشخصية',
        travelDocument: 'وثيقة السفر',
        selectPath: 'اختر مسارك',
        reviewSubmit: 'مراجعة وإرسال'
      },
      fields: {
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        dob: 'تاريخ الميلاد',
        phone: 'رقم الهاتف',
        address: 'العنوان المنزلي',
        nationality: 'الجنسية',
        passportNumber: 'رقم جواز السفر',
        passportExpiry: 'تاريخ الانتهاء',
        visaRequirement: 'متطلبات التأشيرة',
        accommodationPreference: 'تفضيل السكن'
      },
      placeholders: {
        phone: '+1 234 567 890',
        address: 'الشارع، المدينة، الدولة، الرمز البريدي'
      },
      visaOptions: {
        needsVisa: 'أحتاج إلى تأشيرة طالب',
        hasVisa: 'لدي تأشيرة/إقامة سارية'
      },
      accommodation: {
        shared: {
          label: 'جناح مشترك',
          description: 'طالبان في الغرفة'
        },
        private: {
          label: 'جناح خاص',
          description: 'تطبق رسوم ترقية'
        }
      },
      review: {
        applicant: 'المتقدم',
        course: 'الدورة',
        passport: 'جواز السفر',
        visaRequest: 'طلب التأشيرة',
        accommodation: 'السكن',
        notSelected: 'غير محدد'
      },
      consents: {
        title: 'الموافقات المطلوبة',
        terms: 'أوافق على {action}.',
        privacy: 'أوافق على {action}.',
        document: 'أوافق على جمع ومعالجة مستندات جواز السفر/الهوية الخاصة بي لمراجعة الطلب ودعم التأشيرة. انظر {action}.',
        gdpr: 'إذا كنت في الاتحاد الأوروبي/المنطقة الاقتصادية الأوروبية، فأنا أقر بـ {action}.',
        termsLink: 'شروط الخدمة',
        privacyLink: 'سياسة الخصوصية',
        documentLink: 'موافقة المستندات',
        gdprLink: 'إشعار حماية البيانات (GDPR)'
      },
      declaration: 'بتقديم هذا الطلب، تقر بأن جميع المعلومات المقدمة صحيحة. وتوافق على مدونة سلوك المعهد أثناء إقامتك في المدينة المنورة.',
      buttons: {
        previous: 'السابق',
        next: 'الخطوة التالية',
        submit: 'إرسال الطلب',
        submitting: 'جارٍ الإرسال…'
      },
      common: {
        yes: 'نعم',
        no: 'لا'
      },
      validation: {
        dobRequired: 'يرجى إدخال تاريخ الميلاد.',
        phoneRequired: 'يرجى إدخال رقم الهاتف.',
        addressRequired: 'يرجى إدخال عنوان السكن.',
        nationalityRequired: 'يرجى إدخال الجنسية.',
        passportNumberRequired: 'يرجى إدخال رقم جواز السفر.',
        passportExpiryRequired: 'يرجى إدخال تاريخ انتهاء جواز السفر.',
        passportExpiryFuture: 'يجب أن يكون تاريخ انتهاء جواز السفر في المستقبل.',
        courseRequired: 'يرجى اختيار دورة.',
        consentsRequired: 'يرجى الموافقة على الشروط وسياسة الخصوصية وموافقة المستندات قبل الإرسال.',
        authRequired: 'يرجى تسجيل الدخول قبل إرسال الطلب.',
        submitFailed: 'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.'
      }
    },
    auth: {
      signupUnsupported: 'التسجيل غير متاح في هذا المتصفح. يرجى فتح الصفحة في كروم أو سفاري.',
      signupCta: 'افتح في كروم/سفاري',
      modal: {
        titles: {
          login: 'مرحبًا بعودتك',
          signup: 'انضم إلى المعهد',
          forgot: 'إعادة تعيين كلمة المرور'
        },
        subtitles: {
          login: 'ادخل إلى بوابة الطالب الخاصة بك',
          signup: 'ابدأ رحلتك مع العربية',
          forgot: 'أدخل بريدك الإلكتروني لتستلم رابط إعادة التعيين'
        },
        labels: {
          fullName: 'الاسم الكامل',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور'
        },
        placeholders: {
          fullName: 'مثال: عبدالله أحمد',
          email: 'name@example.com',
          password: '••••••••'
        },
        actions: {
          returnToLogin: 'العودة لتسجيل الدخول',
          close: 'إغلاق',
          forgotPassword: 'نسيت كلمة المرور؟',
          login: 'تسجيل الدخول',
          signup: 'إنشاء حساب',
          sendResetLink: 'إرسال رابط إعادة التعيين',
          backToLogin: 'العودة لتسجيل الدخول',
          showPassword: 'إظهار كلمة المرور',
          hidePassword: 'إخفاء كلمة المرور'
        },
        footer: {
          noAccount: 'لا تملك حسابًا؟',
          haveAccount: 'لديك حساب بالفعل؟',
          signUp: 'سجل الآن',
          signIn: 'تسجيل الدخول',
          cancel: 'إلغاء'
        },
        resetSentTitle: 'تحقق من بريدك',
        resetSentMessage: 'إذا كان هناك حساب للبريد {email} فقد أرسلنا رابط إعادة التعيين.',
        passwordStrength: {
          weak: 'ضعيفة',
          medium: 'متوسطة',
          strong: 'قوية'
        },
        validation: {
          nameMin: 'يجب ألا يقل الاسم عن 3 أحرف.',
          invalidEmail: 'يرجى إدخال بريد إلكتروني صالح.',
          passwordMin: 'يجب ألا تقل كلمة المرور عن 6 أحرف.',
          unexpected: 'حدث خطأ غير متوقع.'
        }
      },
      errors: {
        invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        emailNotConfirmed: 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.',
        weakPassword: 'كلمة المرور ضعيفة جدًا. اختر كلمة مرور أقوى.',
        passwordTooShort: 'يجب ألا تقل كلمة المرور عن 6 أحرف.',
        userAlreadyExists: 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.',
        userNotFound: 'لا يوجد حساب بهذا البريد الإلكتروني.',
        invalidEmail: 'عنوان البريد الإلكتروني غير صالح.',
        rateLimit: 'تم تجاوز حد المحاولات. يرجى المحاولة لاحقًا.',
        signupDisabled: 'التسجيل غير متاح حاليًا.',
        unexpected: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
      },
      page: {
        titleLogin: 'تسجيل الدخول',
        titleSignup: 'إنشاء حساب',
        toggleLogin: 'تسجيل الدخول',
        toggleSignup: 'إنشاء حساب',
        emailLabel: 'البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        forgotPassword: 'نسيت كلمة المرور؟',
        submitLogin: 'تسجيل الدخول',
        submitSignup: 'إنشاء حساب',
        infoConfirmEmail: 'تحقق من بريدك الإلكتروني ثم سجل الدخول.',
        validation: {
          emailRequired: 'البريد الإلكتروني مطلوب.',
          emailInvalid: 'أدخل بريدًا إلكترونيًا صالحًا.',
          passwordRequired: 'كلمة المرور مطلوبة.',
          passwordMin: 'يجب ألا تقل كلمة المرور عن 6 أحرف.'
        }
      },
      supabaseModal: {
        title: 'المصادقة',
        close: 'إغلاق'
      },
      forgotPassword: {
        title: 'نسيت كلمة المرور',
        subtitle: 'أدخل بريدك الإلكتروني وسنرسل رابط إعادة التعيين.',
        emailLabel: 'البريد الإلكتروني',
        submit: 'إرسال رابط إعادة التعيين',
        sending: 'جارٍ الإرسال…',
        resendIn: 'إعادة الإرسال خلال {seconds} ثانية',
        info: 'إذا كان هناك حساب لهذا البريد، فسوف تصلك رسالة إعادة التعيين.',
        errorRequired: 'يرجى إدخال بريدك الإلكتروني.',
        backHome: 'العودة للرئيسية'
      },
      updatePassword: {
        title: 'تحديث كلمة المرور',
        subtitle: 'عيّن كلمة مرور جديدة لحسابك.',
        verifying: 'جارٍ التحقق من رابط إعادة التعيين…',
        invalidLink: 'الرابط منتهي أو غير صالح.',
        requestNewLink: 'اطلب رابطًا جديدًا.',
        newPassword: 'كلمة مرور جديدة',
        confirmPassword: 'تأكيد كلمة المرور',
        submit: 'تحديث كلمة المرور',
        submitting: 'جارٍ التحديث…',
        backHome: 'العودة للرئيسية',
        success: 'تم تحديث كلمة المرور. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
        validation: {
          passwordMin: 'يجب ألا تقل كلمة المرور عن 6 أحرف.',
          passwordMismatch: 'كلمتا المرور غير متطابقتين.'
        }
      }
    },
    portal: {
      welcome: 'مرحبًا',
      studentId: 'رقم الطالب',
      status: 'الحالة',
      enrolled: 'مسجل',
      pendingPayment: 'بانتظار الدفع',
      dashboard: 'لوحة التحكم',
      documents: 'المستندات',
      visaLetter: 'خطاب التأشيرة',
      currentEnrollment: 'التسجيل الحالي',
      courseConfirmed: 'تم تأكيد البرنامج',
      courseConfirmedDesc: 'تم تسجيلك بنجاح. ستبدأ دروسك قريبًا. يرجى التأكد من جاهزية مستندات السفر.',
      actionRequired: 'إجراء مطلوب',
      actionRequiredDesc: 'يرجى إتمام دفع الرسوم لتأكيد مقعدك وإصدار خطاب التأشيرة.',
      mySchedule: 'جدولي',
      orientationDay: 'يوم التعريف',
      dailyClasses: 'الحصص اليومية',
      dailySchedule: 'الأحد-الخميس، ٨ ص - ١ م',
      uploadDocument: 'رفع مستند',
      uploaded: 'تم الرفع',
      approved: 'مقبول',
      pending: 'قيد المراجعة',
      rejected: 'مرفوض',
      noDocuments: 'لم يتم رفع مستندات بعد.',
      noDocumentsHint: 'يرجى رفع نسخة من جواز السفر.',
      visaLocked: 'إصدار التأشيرة مقفل. يرجى التأكد من التالي:',
      visaPaid: 'تم دفع رسوم الدورة كاملة',
      visaDocs: 'تم رفع جواز السفر والموافقة عليه',
      print: 'طباعة / تحميل PDF',
      fileUpload: {
        consentRequired: 'يلزم الموافقة على جمع المستندات قبل رفع جواز السفر.',
        invalidType: 'صيغة الملف غير مدعومة. المسموح: PDF أو صور JPG/JPEG/PNG/WEBP.',
        tooLarge: 'حجم الملف يتجاوز ١٠ ميغابايت. يرجى اختيار ملف أصغر.',
        uploading: 'جارٍ رفع المستند…',
        uploadSuccess: 'تم رفع المستند بنجاح.',
        uploadFailed: 'تعذر رفع المستند. حاول مرة أخرى.',
        listLoading: 'جارٍ تحميل المستندات…',
        listError: 'تعذر تحميل المستندات.',
        download: 'تنزيل',
        delete: 'حذف',
        deleteConfirm: 'هل تريد حذف "{name}"؟ لا يمكن التراجع عن ذلك.',
        downloadFailed: 'تعذر إنشاء رابط التنزيل.',
        deleteFailed: 'تعذر حذف المستند.',
        authRequired: 'يلزم تسجيل الدخول لرفع المستندات.'
      },
      documentMeta: {
        uploadedLabel: 'تم الرفع:'
      },
      inProgress: {
        title: 'الطلب قيد المعالجة',
        subtitle: 'نراجع طلبك حاليًا. بعد الموافقة ستتلقى رقم الطالب وكامل صلاحيات البوابة.',
        checklistTitle: 'قائمة المتابعة',
        steps: {
          documents: {
            label: 'المستندات',
            status: 'قيد المراجعة'
          },
          payment: {
            label: 'الدفع',
            status: 'بانتظار التأكيد'
          },
          approval: {
            label: 'موافقة الإدارة',
            status: 'قيد الانتظار'
          }
        },
        emailPrompt: 'هل تحتاج إلى تحديث أو لديك أسئلة؟ راسلنا على {email}.',
        contactEmail: 'admission.ftl@ptdima.sa',
        contactButton: 'تواصل مع القبول',
        backButton: 'العودة للرئيسية'
      },
      studentDashboard: {
        title: 'بوابة الطالب',
        subtitle: 'مرحبًا بعودتك. إليك سجل الطالب الخاص بك.',
        emptyTitle: 'لا توجد عناصر بعد',
        copyButton: 'نسخ رقم الطالب',
        copySuccess: 'تم نسخ رقم الطالب.',
        copyFailure: 'فشل النسخ. حدد رقم الطالب لنسخه.',
        copySelected: 'تم تحديد رقم الطالب. اضغط Ctrl+C للنسخ.',
        statusLine: 'الحالة: {status}',
        enrolledLine: 'مسجل: {date}',
        separator: '•',
        pendingStatus: 'قيد الانتظار',
        coursesTitle: 'دوراتي',
        coursesSubtitle: 'تسجيلاتك الحالية.',
        coursesEmpty: 'لا توجد دورات مسندة بعد. تحقق لاحقًا بعد تأكيد التسجيل.',
        scheduleTitle: 'الجدول',
        scheduleSubtitle: 'الحصص القادمة والمواعيد المهمة.',
        scheduleEmpty: 'سننشر جدولك بمجرد إسناد الحصص.',
        announcementsTitle: 'الإعلانات',
        announcementsSubtitle: 'تحديثات من المعهد.',
        announcementsEmpty: 'لا توجد إعلانات حاليًا. ستظهر التحديثات هنا أولًا.',
        profileTitle: 'الملف الشخصي',
        profileSubtitle: 'تفاصيل حسابك.',
        profileStatusLabel: 'الحالة',
        enrollmentDateLabel: 'تاريخ التسجيل',
        emptyValue: '—'
      },
      portalPage: {
        signInTitle: 'يرجى تسجيل الدخول',
        signInSubtitle: 'سجّل الدخول للوصول إلى بوابة الطالب.',
        backHome: 'العودة للرئيسية',
        loading: 'جارٍ تحميل البوابة…',
        loadingHint: 'يرجى الانتظار بينما نجهز بياناتك.',
        loadErrorTitle: 'تعذر تحميل سجل الطالب.',
        loadErrorBody: 'نواجه مشكلة في تحميل بياناتك.',
        retry: 'أعد المحاولة'
      },
      visaLetterDoc: {
        title: 'خطاب التأشيرة',
        dateLabel: 'التاريخ:',
        refLabel: 'المرجع:',
        refSuffix: 'VISA',
        defaultCourseTitle: 'برنامج العربية',
        blankValue: '________________',
        greeting: 'إلى قنصل التأشيرات/مسؤول الهجرة،',
        subject: 'الموضوع: تأكيد التسجيل ودعم التأشيرة',
        bodyIntro: 'نؤكد بموجب هذا الخطاب أن الطالب/ة {name} (رقم الطالب: {studentId})، من جنسية {nationality}، ويحمل جواز سفر رقم {passportNumber}، قد تم تسجيله وقبوله في برنامج {courseTitle} في معهد فصحى طيبة بالمدينة المنورة.',
        durationLine: 'تمتد مدة البرنامج من {startDate} إلى {endDate} ({courseDuration}).',
        tuitionIntro: 'يرجى العلم أن المعهد استلم رسوم البرنامج، والتي تشمل:',
        tuitionItems: {
          fees: 'رسوم الدراسة ({courseHours})',
          accommodation: 'السكن في المدينة (إن وُجد)',
          support: 'خدمات الدعم المذكورة ضمن الباقة'
        },
        requestLine: 'نرجو منح التأشيرة اللازمة لتسهيل سفر الطالب لأغراض تعليمية، ويتحمل المعهد كامل المسؤولية خلال فترة الدراسة وفق سياسات المعهد.',
        closing: 'وتفضلوا بقبول فائق الاحترام،',
        signatureLabel: 'التوقيع',
        admissionsOffice: 'مكتب القبول',
        officialSeal: 'الختم الرسمي',
        sealLocation: 'المدينة المنورة'
      }
    },
    admin: {
      statusLabels: {
        pending: 'قيد الانتظار',
        payment_pending: 'بانتظار الدفع',
        enrolled: 'مسجل',
        visa_issued: 'تم إصدار التأشيرة'
      },
      courseMeta: {
        notSelected: 'غير محدد',
        unknown: 'غير معروف'
      },
      accessPanel: {
        title: 'لوحة الوصول',
        adminTitle: 'الإدارة',
        signedInAs: 'مسجل الدخول باسم',
        notSignedIn: 'غير مسجل الدخول',
        checking: 'جارٍ التحقق…',
        adminLabel: 'إدارة',
        yes: 'نعم',
        no: 'لا',
        limitedAccess: 'الوصول للإدارة متاح للحسابات المعتمدة فقط.',
        backHome: 'العودة للرئيسية'
      },
      page: {
        dashboardTitle: 'لوحة التحكم',
        dashboardSubtitle: 'إدارة الطلاب والطلبات والدورات.',
        openTools: 'فتح أدوات الإدارة',
        loadingAdmin: 'جارٍ تحميل لوحة الإدارة…',
        checkingAccess: 'جارٍ التحقق من صلاحيات الإدارة…',
        accessRequired: 'يلزم امتلاك صلاحية الإدارة لعرض هذه اللوحة.'
      },
      notAuthorized: {
        title: 'غير مصرح',
        message: 'تحتاج إلى صلاحية الإدارة لعرض هذه الصفحة.',
        backHome: 'العودة للرئيسية'
      },
      dashboardTabs: {
        students: 'الطلاب',
        applications: 'الطلبات',
        courses: 'الدورات'
      },
      courseCard: {
        active: 'نشطة',
        full: 'مكتملة',
        capacity: 'السعة',
        adjustLimit: 'تعديل الحد',
        students: 'الطلاب',
        revenue: 'الإيراد المتوقع',
        revenueValue: '{amount} {currency}',
        recentEnrollees: 'الملتحقون مؤخرًا:',
        noStudents: 'لا يوجد طلاب بعد'
      },
      actions: {
        statusLabel: 'الحالة',
        updateStatusAria: 'تحديث الحالة لـ {name}',
        markPaid: 'وضع كمدفوع',
        markUnpaid: 'وضع كغير مدفوع',
        markUnpaidConfirm: 'هل تريد وضع {name} كغير مدفوع؟',
        confirmUnpaidPrompt: 'لتعيين {name} كغير مدفوع، اكتب "{phrase}".',
        confirmUnpaidPhrase: 'غير مدفوع',
        paymentAria: '{action} لـ {name}',
        pendingDocs: 'مستندات معلقة',
        paymentStatusLabel: 'حالة الدفع:',
        paymentStatusPaid: 'مدفوع',
        paymentStatusUnpaid: 'غير مدفوع',
        approve: 'قبول',
        reject: 'رفض',
        approveAria: 'اعتماد {doc} لـ {name}',
        rejectAria: 'رفض {doc} لـ {name}',
        rejectConfirm: 'رفض {doc}؟',
        confirmRejectPrompt: 'لرفض "{doc}"، اكتب "{phrase}".',
        confirmRejectPhrase: 'رفض',
        rejectReason: 'سبب الرفض (اختياري):',
        rejectedDefault: 'مرفوض'
      },
      adminTable: {
        titleApplications: 'الطلبات',
        emptyDefault: 'لا توجد سجلات.',
        emptyFiltered: 'لا توجد نتائج مطابقة للمرشحات.',
        totalRecords: '{count} سجل إجمالي',
        resultsCount: 'عرض {count} نتيجة',
        pluralSuffix: {
          one: '',
          many: ''
        },
        searchLabel: 'بحث',
        searchPlaceholder: 'ابحث بالاسم أو البريد أو الدورة',
        statusLabel: 'الحالة',
        levelLabel: 'المستوى',
        allStatuses: 'كل الحالات',
        allLevels: 'كل المستويات',
        clearFilters: 'مسح المرشحات',
        selectedFilters: 'المرشحات المحددة:',
        separator: ' · ',
        none: 'لا يوجد',
        searchFilter: 'بحث: "{value}"',
        statusFilter: 'الحالة: {value}',
        levelFilter: 'المستوى: {value}',
        headers: {
          student: 'الطالب',
          course: 'الدورة',
          level: 'المستوى',
          status: 'الحالة',
          updated: 'آخر تحديث',
          actions: 'الإجراءات'
        },
        pageLabel: 'الصفحة {current} من {total}',
        previous: 'السابق',
        next: 'التالي'
      },
      studentsPanel: {
        title: 'الطلاب',
        subtitle: 'إدارة سجلات الطلاب المخزنة في Supabase.',
        createUserId: 'معرف المستخدم الجديد (uuid)',
        createUserIdPlaceholder: 'مثال: 2f6a8f5e-0f0a-4ed1-9b51-4d36f26f81a0',
        cohortYear: 'سنة الدفعة (اختياري)',
        createStudent: 'إنشاء طالب',
        creating: 'جارٍ الإنشاء…',
        createMessage: 'تم إنشاء الطالب {id}.',
        errors: {
          emptyUserId: 'يرجى إدخال user_id لإنشاء سجل الطالب.',
          duplicate: 'الطالب موجود بالفعل لهذا user_id.',
          invalidUuid: 'معرف user_id غير صالح. يرجى إدخال UUID صحيح.',
          permission: 'لا توجد صلاحية. تحقق من سياسات RLS في public.students.'
        },
        recordsTitle: 'سجلات الطلاب',
        recordsSubtitle: 'عرض {filtered} من {total} سجل',
        searchLabel: 'ابحث برقم الطالب',
        searchPlaceholder: 'ابحث برقم الطالب',
        statusLabel: 'الحالة',
        loading: 'جارٍ تحميل الطلاب…',
        loadError: 'تعذر تحميل الطلاب: {error}',
        empty: 'لا توجد سجلات طلاب.',
        emptyFiltered: 'لا يوجد طلاب يطابقون المرشحات الحالية.',
        tableHeaders: {
          studentId: 'رقم الطالب',
          userId: 'معرف المستخدم',
          status: 'الحالة',
          enrolled: 'تاريخ التسجيل',
          actions: 'الإجراءات'
        },
        selectStatus: 'اختر الحالة',
        updateStatus: 'تحديث الحالة',
        saving: 'جارٍ الحفظ…',
        validationMissing: 'يرجى اختيار الحالة قبل الحفظ.',
        statusLabels: {
          enrolled: 'مسجل',
          inactive: 'غير نشط',
          graduated: 'متخرج'
        }
      },
      accessModal: {
        title: 'الإدارة',
        close: 'إغلاق',
        notAuthorizedTitle: 'غير مصرح',
        notAuthorizedMessage: 'تحتاج إلى صلاحية الإدارة لعرض هذه المنطقة.',
        backHome: 'العودة للرئيسية',
        loadingProfiles: 'جارٍ تحميل الملفات…',
        loadError: 'تعذر تحميل الملفات: {error}',
        retry: 'إعادة المحاولة',
        updateError: 'تعذر تحديث الدور لـ {label}: {error}',
        unknownError: 'خطأ غير معروف',
        confirmPromotePrompt: 'لترقية {label} إلى مسؤول، اكتب "{phrase}".',
        confirmPromotePhrase: 'ترقية',
        confirmDemotePrompt: 'لتخفيض {label} إلى طالب، اكتب "{phrase}".',
        confirmDemotePhrase: 'تخفيض',
        table: {
          email: 'البريد الإلكتروني',
          role: 'الدور',
          created: 'تاريخ الإنشاء',
          id: 'المعرّف',
          action: 'الإجراء',
          promote: 'ترقية إلى مسؤول',
          demote: 'تخفيض إلى طالب',
          updating: 'جارٍ التحديث…',
          selfRoleChange: 'لا يمكنك تغيير دورك',
          noProfiles: 'لا توجد ملفات.'
        }
      }
    },
    cart: {
      title: 'سلة التسوق',
      close: 'إغلاق السلة',
      successTitle: 'تم الدفع بنجاح!',
      successMessage: 'جزاك الله خيرًا، {name}. تم تأكيد تسجيلك في {course}.',
      studentIdLabel: 'رقم الطالب',
      goToPortal: 'الذهاب إلى بوابة الطالب',
      emptyTitle: 'سلة التسوق فارغة.',
      browseCourses: 'تصفح الدورات',
      studentLabel: 'الطالب',
      removeCourse: 'إزالة الدورة',
      removeCourseTitle: 'إزالة الدورة',
      packageIncludes: 'الباقة تشمل:',
      fallbackPrice: '$2,500.00',
      includesItems: {
        accommodation: 'إقامة لمدة ٦٠ يومًا',
        meals: '٣ وجبات يوميًا',
        transport: 'المواصلات المحلية',
        tuition: 'رسوم الدراسة'
      },
      totalDue: 'الإجمالي المستحق',
      processing: 'جارٍ معالجة الدفع…',
      proceedPayment: 'المتابعة للدفع',
      securePayment: 'دفع آمن مشفر عبر SSL'
    },
    errors: {
      generic: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      required: 'هذا الحقل مطلوب.',
      notAuthorized: 'غير مصرح',
      backHome: 'العودة للرئيسية'
    }
  },
  en: {
    common: {
      instituteNameLatin: 'Fos7a Taibah Institute',
      instituteNameArabic: 'معهد فصحى طيبة',
      instituteLegalLine: 'Fos7a Taibah Institute is a business unit of PT Dima Khriza Group Co. (Saudi Arabia).',
      instituteAddress: 'Madinah, Saudi Arabia',
      ownerCompany: 'PT Dima Khriza Group Co.',
      visaSupport: 'Visa support: FTL provides full support for the student’s visa application and processing.',
      loading: 'Loading…',
      close: 'Close',
      back: 'Back',
      cancel: 'Cancel',
      yes: 'Yes',
      no: 'No',
      emptyValue: '—',
      currencySymbol: '$',
      languages: {
        ar: 'العربية',
        en: 'English',
        id: 'Bahasa Indonesia'
      }
    },
    nav: {
      home: 'Home',
      about: 'About',
      methodology: 'Methodology',
      teachers: 'Teachers',
      courses: 'Courses',
      stories: 'Stories',
      contact: 'Contact',
      enroll: 'Enroll Now',
      login: 'Login',
      logout: 'Logout',
      studentPortal: 'Student Portal',
      adminDashboard: 'Admin Dashboard',
      language: 'Language',
      selected: 'Selected',
      portal: 'Portal',
      admin: 'Admin',
      signIn: 'Sign in',
      signOut: 'Sign out',
      authLoading: 'Loading…',
      cartLabel: 'Shopping cart',
      cartTitle: 'Shopping cart',
      openCart: 'Open shopping cart',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      languages: {
        en: 'English',
        ar: 'Arabic',
        id: 'Indonesian'
      }
    },
    footer: {
      instituteNameLatin: 'Fos7a Taibah Institute',
      instituteNameArabic: 'معهد فصحى طيبة',
      about: {
        title: 'About',
        description: 'Intensive Arabic programs that blend academic study with daily immersion in Madinah.',
        legalLine: 'FTL is part of PT Dima Khriza Group Co.'
      },
      contact: {
        title: 'Contact',
        emailLabel: 'Email',
        locationLabel: 'Location',
        locationValue: 'Madinah, Saudi Arabia'
      },
      quickLinks: {
        title: 'Quick links',
        home: 'Home',
        courses: 'Courses',
        admission: 'Admission',
        portal: 'Portal',
        admin: 'Admin',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },
      socials: {
        title: 'Social',
        linkLabel: 'Follow us on {name}'
      },
      legalTitle: 'Legal',
      contactTitle: 'Contact',
      legalLinks: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        refunds: 'Refund Policy',
        consent: 'Document Consent',
        gdpr: 'GDPR Notice'
      },
      legalPages: {
        terms: {
          title: 'Terms of Service',
          sections: [
            {
              title: 'Acceptance',
              body: 'By using this website you agree to these terms and the privacy policy.'
            },
            {
              title: 'Services',
              body: 'The platform provides course information, an application workflow, and a student/admin portal experience. Some features are demo-only.'
            },
            {
              title: 'User responsibilities',
              body: 'You must provide accurate information and keep your account credentials secure.'
            },
            {
              title: 'Limitation of liability',
              body: 'Demo features are provided as-is. Production terms may include additional legal provisions.'
            }
          ]
        },
        privacy: {
          title: 'Privacy Policy',
          sections: [
            {
              title: 'What we collect',
              body: 'We may collect your contact information and application details. If you upload passport scans or identity documents, they are collected for enrollment and visa-support purposes.'
            },
            {
              title: 'How we use data',
              body: 'We use your data to process applications, communicate with you, manage enrollment, and prepare visa-support documentation when applicable.'
            },
            {
              title: 'Data retention',
              body: 'In demo mode, data is stored in your browser only. In production, retention periods will be defined and you may request deletion where legally possible.'
            },
            {
              title: 'Your rights',
              body: 'You can request access, correction, or deletion of your data as permitted by applicable laws.'
            }
          ]
        },
        refunds: {
          title: 'Refund Policy',
          sections: [
            {
              title: 'Refund eligibility',
              body: 'Refunds depend on the institute policy, course start date, and administrative fees.'
            },
            {
              title: 'How to request',
              body: 'Contact the institute with your student ID and payment reference.'
            },
            {
              title: 'Processing time',
              body: 'Requests are reviewed within a reasonable time frame in accordance with policy.'
            }
          ]
        },
        cookie: {
          title: 'Cookie Policy',
          sections: [
            {
              title: 'What cookies are',
              body: 'Cookies are small files stored on your device to improve your browsing experience and remember preferences.'
            },
            {
              title: 'How we use them',
              body: 'We use cookies to run the site, understand general usage, and improve performance.'
            },
            {
              title: 'Your choices',
              body: 'You can update browser settings to disable cookies, which may affect certain features.'
            }
          ]
        },
        consent: {
          title: 'Document Collection Consent',
          sections: [
            {
              title: 'Consent to collect documents',
              body: 'If you choose to upload passport scans or identity documents, you consent to collection and processing for application review and visa-support purposes.'
            },
            {
              title: 'Sensitive data notice',
              body: 'Passport and identity documents are sensitive. Only authorized staff should access them in production systems.'
            }
          ]
        },
        gdpr: {
          title: 'GDPR Notice',
          sections: [
            {
              title: 'GDPR notice',
              body: 'If you are in the EU/EEA, you may have rights under GDPR. This demo stores data locally in your browser. Production deployments must implement lawful basis, retention, and data subject request handling.'
            },
            {
              title: 'Controller contact',
              body: 'Contact the institute for GDPR-related requests.'
            }
          ]
        }
      },
      domainLabel: 'Domain: {domain}',
      copyright: '© {year} {name}'
    },
    home: {
      hero: {
        location: 'Located in Al-Madinah Al-Munawwarah',
        titleLine1: 'Live the Arabic Language',
        titleLine2: 'In The City of The Prophet',
        description: 'Experience our unique hybrid learning model: Academic excellence combined with daily immersive activities in the local Madinah community. Housing, meals, and transport included.',
        viewCourses: 'View Packages',
        aboutInstitute: 'Our Method',
        quote: '"Learn Arabic and teach it to the people"'
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
        imageCaption: '"The language of the Quran is the key to understanding Islam."',
        imagePlaceholder: 'Image Placeholder'
      },
      methodology: {
        title: 'Our Hybrid Methodology',
        subtitle: "We bridge the gap between academic theory and real-world application through our 'Live the Language' program.",
        classroom: {
          title: 'Academic Standard',
          desc: 'Intensive morning sessions focusing on grammar (Nahw), morphology (Sarf), and rhetoric (Balagha) using proven curriculums.'
        },
        community: {
          title: 'Community Immersion',
          desc: 'Afternoons and evenings are dedicated to events with locals, market visits, and cultural activities to practice what you learned.'
        },
        stats: {
          hours: '220 Academic Hours',
          duration: '60 Days / 2 Months',
          activities: 'Daily Activities'
        }
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
      courses: {
        title: 'Educational Packages',
        subtitle: 'All packages include Accommodation, 3 Meals Daily, Transportation, and Cultural Excursions. Select the path that fits your goal.',
        apply: 'Apply',
        applyNow: 'Apply Now',
        full: 'Full',
        courseFull: 'Course Full',
        left: 'left',
        leftLabel: 'Left',
        placementTest: 'Placement test',
        whatsapp: 'WhatsApp',
        whatsappMessage: 'Salam! I would like to learn more about the Arabic courses at Fos7a Taibah.',
        register: 'Register Interest',
        details: 'View Details',
        close: 'Close Details',
        includes: 'All-Inclusive Package:',
        schedule: 'Typical Schedule:',
        priceOnRequest: 'Contact for Quote',
        labels: {
          level: 'Level',
          duration: 'Duration',
          mode: 'Mode',
          focusAreas: 'Focus Areas:',
          quickStatsAria: 'Course quick stats',
          courseCardAria: 'Course card for {title}'
        },
        list: [
          {
            id: 'beginner',
            title: "Al-Ta'sees (Foundation)",
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
            inclusions: ['Luxury Shared Housing', '3 Meals Daily', 'Private Transport', '{visaSupport}'],
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
            inclusions: ['Luxury Shared Housing', '3 Meals Daily', 'Private Transport', '{visaSupport}'],
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
        title: 'Frequently Asked Questions',
        items: [
          { q: 'Do you provide visa support?', a: '{visaSupport}' },
          { q: 'Do I need prior Arabic knowledge?', a: "For the Al-Ta'sees (Foundation) program, no prior knowledge is needed. For other tiers, we will assess your level before finalizing enrollment." }
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
        statusSuccess: 'Thanks for your submission!',
        statusError: 'Oops! Something went wrong. Please try again.',
        footer: '© 2024 Fos7a Taibah Institute. Madinah, KSA. Part of PT Dima Khriza Group Co.',
        socials: {
          instagram: 'Instagram',
          twitter: 'Twitter',
          facebook: 'Facebook'
        }
      },
      testimonials: {
        badge: 'Student Voices',
        title: 'Stories from',
        titleAccent: 'Madinah',
        subtitle: 'Hear from our alumni who have walked the path of eloquence in the City of the Prophet.',
        videoTitle: 'Watch Student Experience',
        videoSubtitle: 'A Day in the Life at Fos7a Taibah',
        videoCaption: 'Footage exclusively filmed in Madinah Al-Munawwarah',
        quotePrefix: '"',
        quoteSuffix: '"',
        ctaTitle: 'Ready to write your own story?',
        ctaSubtitle: 'Join our next cohort and experience the language where it was revealed.',
        ctaButton: 'Begin Application',
        items: [
          {
            id: 1,
            name: 'Ismail Ibrahim',
            role: 'Software Engineer',
            country: 'United Kingdom',
            text: "The immersion in Madinah is unlike anything else. Studying grammar in the morning and praying in the Prophet's Mosque in the afternoon transformed my heart and my tongue.",
            rating: 5
          },
          {
            id: 2,
            name: 'Aisha Yusuf',
            role: 'University Student',
            country: 'Malaysia',
            text: 'I was afraid of speaking even though I knew the rules. The teachers at Fos7a Taibah are patient and the environment forces you to speak. I can now converse confidently.',
            rating: 5
          },
          {
            id: 3,
            name: 'Dr. Bilal Khan',
            role: 'Medical Doctor',
            country: 'USA',
            text: "The Business Arabic course was perfect for my needs. It wasn't just dry vocabulary; it was real-world scenarios. The housing was comfortable and close to the Haram.",
            rating: 4
          }
        ] as Testimonial[]
      },
      courseAdvisor: {
        title: 'Course Advisor',
        subtitle: 'Let us guide you to the right path',
        welcome: "To ensure you get the most out of your 60 days in Madinah, let's identify your current status.",
        startBtn: 'Start Assessment',
        q1: 'Do you need Arabic primarily for business or professional work?',
        q2: 'Can you already read Arabic texts but struggle to speak naturally?',
        yes: 'Yes',
        no: 'No',
        recommendation: 'Your Recommended Path:',
        restart: 'Start Over',
        applyNow: 'Apply Now',
        openLabel: 'Open course advisor',
        closeLabel: 'Close course advisor'
      }
    },
    applicationForm: {
      title: 'Program Application',
      stepIndicator: 'Step {step} of {total}',
      steps: {
        personal: 'Personal',
        passport: 'Passport',
        course: 'Course',
        review: 'Review'
      },
      sections: {
        personalInfo: 'Personal Information',
        travelDocument: 'Travel Document',
        selectPath: 'Select Your Path',
        reviewSubmit: 'Review & Submit'
      },
      fields: {
        fullName: 'Full Name',
        email: 'Email',
        dob: 'Date of Birth',
        phone: 'Phone Number',
        address: 'Home Address',
        nationality: 'Nationality',
        passportNumber: 'Passport Number',
        passportExpiry: 'Expiry Date',
        visaRequirement: 'Visa Requirement',
        accommodationPreference: 'Accommodation Preference'
      },
      placeholders: {
        phone: '+1 234 567 890',
        address: 'Street, City, Country, Zip Code'
      },
      visaOptions: {
        needsVisa: 'I need a Student Visa',
        hasVisa: 'I have a valid Visa / Residency'
      },
      accommodation: {
        shared: {
          label: 'Shared Suite',
          description: '2 Students per room'
        },
        private: {
          label: 'Private Suite',
          description: 'Upgrade fee applies'
        }
      },
      review: {
        applicant: 'Applicant',
        course: 'Course',
        passport: 'Passport',
        visaRequest: 'Visa Request',
        accommodation: 'Accommodation',
        notSelected: 'Not Selected'
      },
      consents: {
        title: 'Required Consents',
        terms: 'I agree to the {action}.',
        privacy: 'I agree to the {action}.',
        document: 'I consent to collecting and processing my passport/identity documents for application review and visa support. See {action}.',
        gdpr: 'If I am in the EU/EEA, I acknowledge the {action}.',
        termsLink: 'Terms of Service',
        privacyLink: 'Privacy Policy',
        documentLink: 'Document Consent',
        gdprLink: 'GDPR Notice'
      },
      declaration: "By submitting this application, you declare that all information provided is accurate. You agree to the institute's code of conduct while residing in the Holy City of Madinah.",
      buttons: {
        previous: 'Previous',
        next: 'Next Step',
        submit: 'Submit Application',
        submitting: 'Submitting…'
      },
      common: {
        yes: 'Yes',
        no: 'No'
      },
      validation: {
        dobRequired: 'Please enter your date of birth.',
        phoneRequired: 'Please enter your phone number.',
        addressRequired: 'Please enter your home address.',
        nationalityRequired: 'Please enter your nationality.',
        passportNumberRequired: 'Please enter your passport number.',
        passportExpiryRequired: 'Please enter your passport expiry date.',
        passportExpiryFuture: 'Passport expiry date must be in the future.',
        courseRequired: 'Please select a course.',
        consentsRequired: 'Please accept Terms, Privacy Policy, and Document Consent before submitting.',
        authRequired: 'Please sign in before submitting your application.',
        submitFailed: 'We could not submit your application. Please try again.'
      }
    },
    auth: {
      signupUnsupported: "Signup isn't supported on this browser. Please open this page in Chrome or Safari.",
      signupCta: 'Open in Chrome/Safari',
      modal: {
        titles: {
          login: 'Welcome Back',
          signup: 'Join Institute',
          forgot: 'Reset Password'
        },
        subtitles: {
          login: 'Access your student portal',
          signup: 'Start your Arabic learning journey',
          forgot: 'Enter your email to receive a reset link'
        },
        labels: {
          fullName: 'Full Name',
          email: 'Email Address',
          password: 'Password'
        },
        placeholders: {
          fullName: 'e.g. Abdullah Smith',
          email: 'name@example.com',
          password: '••••••••'
        },
        actions: {
          returnToLogin: 'Return to login',
          close: 'Close',
          forgotPassword: 'Forgot Password?',
          login: 'Login',
          signup: 'Create Account',
          sendResetLink: 'Send Reset Link',
          backToLogin: 'Back to Login',
          showPassword: 'Show password',
          hidePassword: 'Hide password'
        },
        footer: {
          noAccount: "Don't have an account?",
          haveAccount: 'Already have an account?',
          signUp: 'Sign Up',
          signIn: 'Login',
          cancel: 'Cancel'
        },
        resetSentTitle: 'Check your inbox',
        resetSentMessage: 'If an account exists for {email}, we have sent a password reset link.',
        passwordStrength: {
          weak: 'Weak',
          medium: 'Medium',
          strong: 'Strong'
        },
        validation: {
          nameMin: 'Name must be at least 3 characters.',
          invalidEmail: 'Please enter a valid email address.',
          passwordMin: 'Password must be at least 6 characters.',
          unexpected: 'An unexpected error occurred.'
        }
      },
      errors: {
        invalidCredentials: 'The email or password is incorrect.',
        emailNotConfirmed: 'Please confirm your email before signing in.',
        weakPassword: 'Password is too weak. Choose a stronger password.',
        passwordTooShort: 'Password must be at least 6 characters.',
        userAlreadyExists: 'An account with this email already exists.',
        userNotFound: 'No account found for this email.',
        invalidEmail: 'The email address is invalid.',
        rateLimit: 'Too many attempts. Please try again later.',
        signupDisabled: 'Signups are currently disabled.',
        unexpected: 'Something went wrong. Please try again.'
      },
      page: {
        titleLogin: 'Sign in',
        titleSignup: 'Sign up',
        toggleLogin: 'Sign in',
        toggleSignup: 'Sign up',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        forgotPassword: 'Forgot password?',
        submitLogin: 'Sign in',
        submitSignup: 'Sign up',
        infoConfirmEmail: 'Check your email to confirm, then sign in.',
        validation: {
          emailRequired: 'Email is required',
          emailInvalid: 'Enter a valid email',
          passwordRequired: 'Password is required',
          passwordMin: 'Password must be at least 6 characters'
        }
      },
      supabaseModal: {
        title: 'Authentication',
        close: 'Close'
      },
      forgotPassword: {
        title: 'Forgot password',
        subtitle: 'Enter your email and we’ll send a password reset link.',
        emailLabel: 'Email',
        submit: 'Send reset link',
        sending: 'Sending…',
        resendIn: 'Resend in {seconds} seconds',
        info: 'If an account exists for this email, you will receive a reset link.',
        errorRequired: 'Please enter your email address.',
        backHome: 'Back to home'
      },
      updatePassword: {
        title: 'Update password',
        subtitle: 'Set a new password for your account.',
        verifying: 'Verifying reset link…',
        invalidLink: 'Link expired or invalid.',
        requestNewLink: 'Request a new reset link.',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
        submit: 'Update password',
        submitting: 'Updating…',
        backHome: 'Back to home',
        success: 'Password updated. You can now sign in with your new password.',
        validation: {
          passwordMin: 'Password must be at least 6 characters.',
          passwordMismatch: 'Passwords do not match.'
        }
      }
    },
    portal: {
      welcome: 'Welcome',
      studentId: 'Student ID',
      status: 'Status',
      enrolled: 'Enrolled',
      pendingPayment: 'Pending Payment',
      dashboard: 'Dashboard',
      documents: 'Documents',
      visaLetter: 'Visa Letter',
      currentEnrollment: 'Current Enrollment',
      courseConfirmed: 'Course Confirmed',
      courseConfirmedDesc: 'You are successfully enrolled. Your classes are scheduled to begin soon. Please ensure your travel documents are in order.',
      actionRequired: 'Action Required',
      actionRequiredDesc: 'Please complete your course payment to confirm your seat and generate your visa letter.',
      mySchedule: 'My Schedule',
      orientationDay: 'Orientation Day',
      dailyClasses: 'Daily Classes',
      dailySchedule: 'Sun-Thu, 8 AM - 1 PM',
      uploadDocument: 'Upload Document',
      uploaded: 'Uploaded',
      approved: 'Approved',
      pending: 'Pending Review',
      rejected: 'Rejected',
      noDocuments: 'No documents uploaded yet.',
      noDocumentsHint: 'Please upload a copy of your passport.',
      visaLocked: 'Visa generation is locked. Please ensure:',
      visaPaid: 'Course fee is fully paid',
      visaDocs: 'Passport document is uploaded and approved',
      print: 'Print / Download PDF',
      fileUpload: {
        consentRequired: 'You must consent to document collection before uploading passport documents.',
        invalidType: 'Unsupported file type. Allowed: PDF or JPG/JPEG/PNG/WEBP images.',
        tooLarge: 'File exceeds 10MB. Please choose a smaller file.',
        uploading: 'Uploading document…',
        uploadSuccess: 'Document uploaded successfully.',
        uploadFailed: 'Upload failed. Please try again.',
        listLoading: 'Loading documents…',
        listError: 'Unable to load documents.',
        download: 'Download',
        delete: 'Delete',
        deleteConfirm: 'Delete "{name}"? This cannot be undone.',
        downloadFailed: 'Could not create a download link.',
        deleteFailed: 'Could not delete the document.',
        authRequired: 'Please sign in to upload documents.'
      },
      documentMeta: {
        uploadedLabel: 'Uploaded:'
      },
      inProgress: {
        title: 'Application in progress',
        subtitle: "We're reviewing your application. Once approved, you'll receive a student ID and full portal access.",
        checklistTitle: 'Checklist',
        steps: {
          documents: {
            label: 'Documents',
            status: 'Pending review'
          },
          payment: {
            label: 'Payment',
            status: 'Awaiting confirmation'
          },
          approval: {
            label: 'Admin approval',
            status: 'Queued'
          }
        },
        emailPrompt: 'Need an update or have questions? Email {email}.',
        contactEmail: 'admission.ftl@ptdima.sa',
        contactButton: 'Contact admissions',
        backButton: 'Back to home'
      },
      studentDashboard: {
        title: 'Student Portal',
        subtitle: 'Welcome back. Here is your student record.',
        emptyTitle: 'Nothing here yet',
        copyButton: 'Copy Student ID',
        copySuccess: 'Student ID copied.',
        copyFailure: 'Copy failed. Select the ID to copy.',
        copySelected: 'Student ID selected. Press Ctrl+C to copy.',
        statusLine: 'Status: {status}',
        enrolledLine: 'Enrolled: {date}',
        separator: '•',
        pendingStatus: 'Pending',
        coursesTitle: 'My Courses',
        coursesSubtitle: 'Your current enrollments.',
        coursesEmpty: 'No courses assigned yet. Check back after enrollment is confirmed.',
        scheduleTitle: 'Schedule',
        scheduleSubtitle: 'Upcoming classes and key dates.',
        scheduleEmpty: "We'll post your schedule once classes are assigned.",
        announcementsTitle: 'Announcements',
        announcementsSubtitle: 'Updates from the institute.',
        announcementsEmpty: "No announcements right now. You'll see updates here first.",
        profileTitle: 'Profile',
        profileSubtitle: 'Your account details.',
        profileStatusLabel: 'Status',
        enrollmentDateLabel: 'Enrollment date',
        emptyValue: '—'
      },
      portalPage: {
        signInTitle: 'Please sign in',
        signInSubtitle: 'Sign in to access your student portal.',
        backHome: 'Back to home',
        loading: 'Loading portal…',
        loadingHint: 'This may take a few seconds.',
        loadErrorTitle: 'We couldn’t load your student record.',
        loadErrorBody: 'We ran into an issue loading your record.',
        retry: 'Try again'
      },
      visaLetterDoc: {
        title: 'Visa Letter',
        dateLabel: 'Date:',
        refLabel: 'Ref:',
        refSuffix: 'VISA',
        defaultCourseTitle: 'Arabic Program',
        blankValue: '________________',
        greeting: 'To The Visa Consul / Immigration Officer,',
        subject: 'Subject: Confirmation of Enrollment & Visa Support',
        bodyIntro: 'This letter confirms that {name} (Student ID: {studentId}), a national of {nationality}, holding Passport Number {passportNumber}, has been enrolled and accepted into the {courseTitle} at Fos7a Taibah Institute in Al-Madinah Al-Munawwarah.',
        durationLine: 'The course duration is from {startDate} to {endDate} ({courseDuration}).',
        tuitionIntro: 'Please note that the institute has received tuition payment for the course, which includes:',
        tuitionItems: {
          fees: 'Tuition Fees ({courseHours})',
          accommodation: 'Accommodation in Madinah (if selected)',
          support: 'Support services as described in the program package'
        },
        requestLine: "We kindly request you to grant the necessary visa to facilitate the student's travel for educational purposes. Fos7a Taibah Institute accepts full responsibility for the student during their study period within the scope of institute policies.",
        closing: 'Sincerely,',
        signatureLabel: 'Signature',
        admissionsOffice: 'Admissions Office',
        officialSeal: 'OFFICIAL SEAL',
        sealLocation: 'MADINAH'
      }
    },
    admin: {
      statusLabels: {
        pending: 'Pending',
        payment_pending: 'Payment pending',
        enrolled: 'Enrolled',
        visa_issued: 'Visa issued'
      },
      courseMeta: {
        notSelected: 'Not selected',
        unknown: 'Unknown'
      },
      accessPanel: {
        title: 'Access Panel',
        adminTitle: 'Admin',
        signedInAs: 'Signed in as',
        notSignedIn: 'Not signed in',
        checking: 'Checking…',
        adminLabel: 'Admin',
        yes: 'Yes',
        no: 'No',
        limitedAccess: 'Admin access is limited to approved accounts.',
        backHome: 'Back to home'
      },
      page: {
        dashboardTitle: 'Dashboard',
        dashboardSubtitle: 'Manage students, applications, and courses.',
        openTools: 'Open admin tools',
        loadingAdmin: 'Loading admin…',
        checkingAccess: 'Checking admin access…',
        accessRequired: 'Admin access is required to view this dashboard.'
      },
      notAuthorized: {
        title: 'Not authorized',
        message: 'You need admin access to view this page.',
        backHome: 'Go back home'
      },
      dashboardTabs: {
        students: 'Students',
        applications: 'Applications',
        courses: 'Courses'
      },
      courseCard: {
        active: 'Active',
        full: 'Full',
        capacity: 'Capacity',
        adjustLimit: 'Adjust Limit',
        students: 'Students',
        revenue: 'Est. Revenue',
        revenueValue: '{currency}{amount}',
        recentEnrollees: 'Recent Enrollees:',
        noStudents: 'No students yet'
      },
      actions: {
        statusLabel: 'Status',
        updateStatusAria: 'Update status for {name}',
        markPaid: 'Mark paid',
        markUnpaid: 'Mark unpaid',
        markUnpaidConfirm: 'Mark {name} as unpaid?',
        confirmUnpaidPrompt: 'To mark {name} as unpaid, type "{phrase}".',
        confirmUnpaidPhrase: 'UNPAID',
        paymentAria: '{action} for {name}',
        pendingDocs: 'Pending docs',
        paymentStatusLabel: 'Payment status:',
        paymentStatusPaid: 'Paid',
        paymentStatusUnpaid: 'Unpaid',
        approve: 'Approve',
        reject: 'Reject',
        approveAria: 'Approve {doc} for {name}',
        rejectAria: 'Reject {doc} for {name}',
        rejectConfirm: 'Reject {doc}?',
        confirmRejectPrompt: 'To reject "{doc}", type "{phrase}".',
        confirmRejectPhrase: 'REJECT',
        rejectReason: 'Rejection reason (optional):',
        rejectedDefault: 'Rejected'
      },
      adminTable: {
        titleApplications: 'Applications',
        emptyDefault: 'No records found.',
        emptyFiltered: 'No results match the current filters.',
        totalRecords: '{count} total records',
        resultsCount: 'Showing {count} result{plural}',
        pluralSuffix: {
          one: '',
          many: 's'
        },
        searchLabel: 'Search',
        searchPlaceholder: 'Search by name, email, course',
        statusLabel: 'Status',
        levelLabel: 'Level',
        allStatuses: 'All statuses',
        allLevels: 'All levels',
        clearFilters: 'Clear filters',
        selectedFilters: 'Selected filters:',
        separator: ' · ',
        none: 'None',
        searchFilter: 'Search: "{value}"',
        statusFilter: 'Status: {value}',
        levelFilter: 'Level: {value}',
        headers: {
          student: 'Student',
          course: 'Course',
          level: 'Level',
          status: 'Status',
          updated: 'Updated',
          actions: 'Actions'
        },
        pageLabel: 'Page {current} of {total}',
        previous: 'Previous',
        next: 'Next'
      },
      studentsPanel: {
        title: 'Students',
        subtitle: 'Manage student records stored in Supabase.',
        createUserId: 'New student user_id (uuid)',
        createUserIdPlaceholder: 'e.g. 2f6a8f5e-0f0a-4ed1-9b51-4d36f26f81a0',
        cohortYear: 'Cohort year (optional)',
        createStudent: 'Create student',
        creating: 'Creating…',
        createMessage: 'Created student {id}.',
        errors: {
          emptyUserId: 'Enter a user_id to create a student row.',
          duplicate: 'Student already exists for this user_id.',
          invalidUuid: 'Invalid user_id. Provide a valid UUID.',
          permission: 'Permission denied. Check RLS policies for public.students.'
        },
        recordsTitle: 'Student records',
        recordsSubtitle: 'Showing {filtered} of {total} records',
        searchLabel: 'Search by student_id',
        searchPlaceholder: 'Search by student_id',
        statusLabel: 'Status',
        loading: 'Loading students…',
        loadError: 'Failed to load students: {error}',
        empty: 'No student records found.',
        emptyFiltered: 'No students match the current filters.',
        tableHeaders: {
          studentId: 'Student ID',
          userId: 'User ID',
          status: 'Status',
          enrolled: 'Enrolled',
          actions: 'Actions'
        },
        selectStatus: 'Select status',
        updateStatus: 'Update status',
        saving: 'Saving…',
        validationMissing: 'Select a status before saving.',
        statusLabels: {
          enrolled: 'Enrolled',
          inactive: 'Inactive',
          graduated: 'Graduated'
        }
      },
      accessModal: {
        title: 'Admin',
        close: 'Close',
        notAuthorizedTitle: 'Not authorized',
        notAuthorizedMessage: 'You need admin access to view this area.',
        backHome: 'Go back home',
        loadingProfiles: 'Loading profiles…',
        loadError: 'Failed to load profiles: {error}',
        retry: 'Retry',
        updateError: 'Failed to update role for {label}: {error}',
        unknownError: 'Unknown error',
        confirmPromotePrompt: 'To promote {label} to admin, type "{phrase}".',
        confirmPromotePhrase: 'PROMOTE',
        confirmDemotePrompt: 'To demote {label} to student, type "{phrase}".',
        confirmDemotePhrase: 'DEMOTE',
        table: {
          email: 'Email',
          role: 'Role',
          created: 'Created',
          id: 'ID',
          action: 'Action',
          promote: 'Promote to admin',
          demote: 'Demote to student',
          updating: 'Updating…',
          selfRoleChange: 'You cannot change your own role',
          noProfiles: 'No profiles found.'
        }
      }
    },
    cart: {
      title: 'Your Cart',
      close: 'Close cart',
      successTitle: 'Payment Successful!',
      successMessage: 'JazakAllah Khair, {name}. Your enrollment for {course} has been confirmed.',
      studentIdLabel: 'Student ID',
      goToPortal: 'Go to Student Portal',
      emptyTitle: 'Your cart is empty.',
      browseCourses: 'Browse Courses',
      studentLabel: 'Student',
      removeCourse: 'Remove course from cart',
      removeCourseTitle: 'Remove course',
      packageIncludes: 'Package Includes:',
      fallbackPrice: '$2,500.00',
      includesItems: {
        accommodation: '60 Days Accommodation',
        meals: '3 Meals Daily',
        transport: 'Local Transportation',
        tuition: 'Tuition Fee'
      },
      totalDue: 'Total Due',
      processing: 'Processing Payment...',
      proceedPayment: 'Proceed to Payment',
      securePayment: 'Secure SSL Encrypted Payment'
    },
    errors: {
      generic: 'Something went wrong. Please try again.',
      required: 'This field is required.',
      notAuthorized: 'Not authorized',
      backHome: 'Back to home'
    }
  },
  id: {
    common: {
      instituteNameLatin: 'Fos7a Taibah Institute',
      instituteNameArabic: 'معهد فصحى طيبة',
      instituteLegalLine: 'Fos7a Taibah Institute adalah unit bisnis PT Dima Khriza Group Co. (Arab Saudi).',
      instituteAddress: 'Madinah, Arab Saudi',
      ownerCompany: 'PT Dima Khriza Group Co.',
      visaSupport: 'Dukungan visa: FTL menyediakan dukungan penuh untuk pengajuan dan pemrosesan visa pelajar.',
      loading: 'Memuat…',
      close: 'Tutup',
      back: 'Kembali',
      cancel: 'Batal',
      yes: 'Ya',
      no: 'Tidak',
      emptyValue: '—',
      currencySymbol: '$',
      languages: {
        ar: 'العربية',
        en: 'English',
        id: 'Bahasa Indonesia'
      }
    },
    nav: {
      home: 'Beranda',
      about: 'Tentang',
      methodology: 'Metodologi',
      teachers: 'Pengajar',
      courses: 'Paket',
      stories: 'Testimoni',
      contact: 'Kontak',
      enroll: 'Daftar Sekarang',
      login: 'Masuk',
      logout: 'Keluar',
      studentPortal: 'Portal Siswa',
      adminDashboard: 'Dasbor Admin',
      language: 'Bahasa',
      selected: 'Dipilih',
      portal: 'Portal',
      admin: 'Admin',
      signIn: 'Masuk',
      signOut: 'Keluar',
      authLoading: 'Memuat…',
      cartLabel: 'Keranjang belanja',
      cartTitle: 'Keranjang belanja',
      openCart: 'Buka keranjang belanja',
      openMenu: 'Buka menu',
      closeMenu: 'Tutup menu',
      languages: {
        en: 'Inggris',
        ar: 'Arab',
        id: 'Indonesia'
      }
    },
    footer: {
      instituteNameLatin: 'Fos7a Taibah Institute',
      instituteNameArabic: 'معهد فصحى طيبة',
      about: {
        title: 'Tentang',
        description: 'Program bahasa Arab intensif yang memadukan studi akademik dengan imersi harian di Madinah.',
        legalLine: 'FTL merupakan bagian dari PT Dima Khriza Group Co.'
      },
      contact: {
        title: 'Kontak',
        emailLabel: 'Email',
        locationLabel: 'Lokasi',
        locationValue: 'Madinah, Arab Saudi'
      },
      quickLinks: {
        title: 'Tautan cepat',
        home: 'Beranda',
        courses: 'Kursus',
        admission: 'Pendaftaran',
        portal: 'Portal',
        admin: 'Admin',
        privacy: 'Kebijakan Privasi',
        terms: 'Ketentuan Layanan'
      },
      socials: {
        title: 'Media sosial',
        linkLabel: 'Ikuti kami di {name}'
      },
      legalTitle: 'Legal',
      contactTitle: 'Kontak',
      legalLinks: {
        privacy: 'Kebijakan Privasi',
        terms: 'Ketentuan Layanan',
        refunds: 'Kebijakan Pengembalian',
        consent: 'Persetujuan Dokumen',
        gdpr: 'Pemberitahuan GDPR'
      },
      legalPages: {
        terms: {
          title: 'Ketentuan Layanan',
          sections: [
            {
              title: 'Persetujuan',
              body: 'Dengan menggunakan situs ini Anda menyetujui ketentuan ini dan kebijakan privasi.'
            },
            {
              title: 'Layanan',
              body: 'Platform ini menyediakan informasi kursus, alur pendaftaran, serta pengalaman portal siswa/admin. Beberapa fitur hanya demo.'
            },
            {
              title: 'Tanggung jawab pengguna',
              body: 'Anda harus memberikan informasi yang akurat dan menjaga kerahasiaan kredensial akun.'
            },
            {
              title: 'Batasan tanggung jawab',
              body: 'Fitur demo disediakan apa adanya. Ketentuan produksi dapat mencakup ketentuan tambahan.'
            }
          ]
        },
        privacy: {
          title: 'Kebijakan Privasi',
          sections: [
            {
              title: 'Data yang kami kumpulkan',
              body: 'Kami dapat mengumpulkan informasi kontak dan detail aplikasi. Jika Anda mengunggah paspor atau dokumen identitas, data tersebut dikumpulkan untuk keperluan pendaftaran dan dukungan visa.'
            },
            {
              title: 'Cara kami menggunakan data',
              body: 'Kami menggunakan data Anda untuk memproses aplikasi, berkomunikasi, mengelola pendaftaran, dan menyiapkan dokumen dukungan visa bila diperlukan.'
            },
            {
              title: 'Penyimpanan data',
              body: 'Dalam mode demo, data disimpan di browser Anda saja. Dalam produksi, periode penyimpanan akan ditetapkan dan Anda dapat meminta penghapusan jika diizinkan secara hukum.'
            },
            {
              title: 'Hak Anda',
              body: 'Anda dapat meminta akses, koreksi, atau penghapusan data sesuai peraturan yang berlaku.'
            }
          ]
        },
        refunds: {
          title: 'Kebijakan Pengembalian',
          sections: [
            {
              title: 'Kelayakan pengembalian',
              body: 'Pengembalian bergantung pada kebijakan institut, tanggal mulai kursus, dan biaya administrasi.'
            },
            {
              title: 'Cara mengajukan',
              body: 'Hubungi institut dengan menyertakan ID siswa dan referensi pembayaran.'
            },
            {
              title: 'Waktu pemrosesan',
              body: 'Permohonan ditinjau dalam waktu yang wajar sesuai kebijakan.'
            }
          ]
        },
        cookie: {
          title: 'Kebijakan Cookie',
          sections: [
            {
              title: 'Apa itu cookie',
              body: 'Cookie adalah file kecil yang disimpan di perangkat Anda untuk meningkatkan pengalaman dan menyimpan preferensi.'
            },
            {
              title: 'Cara kami menggunakannya',
              body: 'Kami menggunakan cookie untuk menjalankan situs, memahami penggunaan secara umum, dan meningkatkan performa.'
            },
            {
              title: 'Pilihan Anda',
              body: 'Anda dapat mengubah pengaturan browser untuk menonaktifkan cookie, yang dapat memengaruhi fitur tertentu.'
            }
          ]
        },
        consent: {
          title: 'Persetujuan Pengumpulan Dokumen',
          sections: [
            {
              title: 'Persetujuan pengumpulan dokumen',
              body: 'Jika Anda memilih mengunggah paspor atau dokumen identitas, Anda menyetujui pengumpulan dan pemrosesan untuk tinjauan aplikasi dan dukungan visa.'
            },
            {
              title: 'Pemberitahuan data sensitif',
              body: 'Paspor dan dokumen identitas bersifat sensitif. Hanya staf berwenang yang boleh mengaksesnya dalam sistem produksi.'
            }
          ]
        },
        gdpr: {
          title: 'Pemberitahuan GDPR',
          sections: [
            {
              title: 'Pemberitahuan GDPR',
              body: 'Jika Anda berada di UE/EEA, Anda mungkin memiliki hak berdasarkan GDPR. Demo ini menyimpan data secara lokal di browser Anda. Implementasi produksi harus memiliki dasar hukum, retensi, dan penanganan permintaan subjek data.'
            },
            {
              title: 'Kontak pengendali',
              body: 'Hubungi institut untuk permintaan terkait GDPR.'
            }
          ]
        }
      },
      domainLabel: 'Domain: {domain}',
      copyright: '© {year} {name}'
    },
    home: {
      hero: {
        location: 'Berlokasi di Al-Madinah Al-Munawwarah',
        titleLine1: 'Hiduplah dalam Bahasa Arab',
        titleLine2: 'Di Kota Nabi',
        description: 'Rasakan model pembelajaran hibrida unik kami: Keunggulan akademis dikombinasikan dengan aktivitas imersif harian di komunitas lokal Madinah. Akomodasi, makan, dan transportasi sudah termasuk.',
        viewCourses: 'Lihat Paket',
        aboutInstitute: 'Metode Kami',
        quote: '"Pelajarilah bahasa Arab dan ajarkanlah kepada manusia"'
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
        imageCaption: '"Bahasa Al-Quran adalah kunci untuk memahami Islam."',
        imagePlaceholder: 'Tempat gambar'
      },
      methodology: {
        title: 'Metodologi Hibrida Kami',
        subtitle: "Kami menjembatani kesenjangan antara teori akademis dan aplikasi dunia nyata melalui program 'Hidupkan Bahasa'.",
        classroom: {
          title: 'Standar Akademik',
          desc: 'Sesi pagi intensif yang berfokus pada tata bahasa (Nahwu), morfologi (Saraf), dan retorika (Balagha).'
        },
        community: {
          title: 'Imersi Komunitas',
          desc: 'Siang dan malam didedikasikan untuk acara dengan penduduk setempat dan kunjungan pasar untuk mempraktikkan apa yang Anda pelajari.'
        },
        stats: {
          hours: '220 Jam Akademik',
          duration: '60 Hari / 2 Bulan',
          activities: 'Aktivitas Harian'
        }
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
      courses: {
        title: 'Paket Pendidikan',
        subtitle: 'Semua paket termasuk Akomodasi, 3 Makan Sehari, Transportasi, dan Wisata Budaya. Pilih jalur yang sesuai dengan tujuan Anda.',
        apply: 'Daftar',
        applyNow: 'Daftar Sekarang',
        full: 'Penuh',
        courseFull: 'Kelas Penuh',
        left: 'tersisa',
        leftLabel: 'Tersisa',
        placementTest: 'Tes penempatan',
        whatsapp: 'WhatsApp',
        whatsappMessage: 'Salam! Saya ingin mengetahui lebih lanjut tentang kursus bahasa Arab di Fos7a Taibah.',
        register: 'Daftar Minat',
        details: 'Lihat Detail',
        close: 'Tutup Detail',
        includes: 'Paket All-Inclusive:',
        schedule: 'Jadwal Tipikal:',
        priceOnRequest: 'Hubungi Kami',
        labels: {
          level: 'Tingkat',
          duration: 'Durasi',
          mode: 'Mode',
          focusAreas: 'Fokus Utama:',
          quickStatsAria: 'Ringkasan kursus',
          courseCardAria: 'Kartu kursus {title}'
        },
        list: [
          {
            id: 'beginner',
            title: "Al-Ta'sees (Yayasan)",
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
            inclusions: ['Perumahan Bersama Mewah', '3 Makan Sehari', 'Transportasi Pribadi', '{visaSupport}'],
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
            inclusions: ['Perumahan Bersama Mewah', '3 Makan Sehari', 'Transportasi Pribadi', '{visaSupport}'],
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
        title: 'Pertanyaan Umum',
        items: [
          { q: 'Apakah Anda menyediakan visa pelajar?', a: '{visaSupport}' },
          { q: 'Apakah saya perlu kemampuan bahasa Arab dasar?', a: "Untuk program Al-Ta'sees (Yayasan), tidak diperlukan pengetahuan sebelumnya. Untuk tingkatan lain, kami akan menilai level Anda." }
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
        statusSuccess: 'Terima kasih atas pengiriman Anda!',
        statusError: 'Ups! Terjadi kesalahan. Silakan coba lagi.',
        footer: '© 2024 Institut Fos7a Taibah. Madinah, KSA. Bagian dari PT Dima Khriza Group Co.',
        socials: {
          instagram: 'Instagram',
          twitter: 'Twitter',
          facebook: 'Facebook'
        }
      },
      testimonials: {
        badge: 'Suara Siswa',
        title: 'Kisah dari',
        titleAccent: 'Madinah',
        subtitle: 'Dengarkan kisah alumni yang menapaki jalan kefasihan di Kota Nabi.',
        videoTitle: 'Tonton Pengalaman Siswa',
        videoSubtitle: 'Sehari bersama Fos7a Taibah',
        videoCaption: 'Rekaman eksklusif di Madinah Al-Munawwarah',
        quotePrefix: '"',
        quoteSuffix: '"',
        ctaTitle: 'Siap menulis kisahmu sendiri?',
        ctaSubtitle: 'Bergabunglah dengan angkatan berikutnya dan rasakan bahasa di tempat ia diturunkan.',
        ctaButton: 'Mulai Pendaftaran',
        items: [
          {
            id: 1,
            name: 'Ismail Ibrahim',
            role: 'Insinyur Perangkat Lunak',
            country: 'Inggris',
            text: 'Imersi di Madinah tidak tertandingi. Belajar tata bahasa di pagi hari dan shalat di Masjid Nabawi sore hari mengubah hati dan lisan saya.',
            rating: 5
          },
          {
            id: 2,
            name: 'Aisha Yusuf',
            role: 'Mahasiswa',
            country: 'Malaysia',
            text: 'Saya takut berbicara meski sudah tahu kaidah. Para pengajar di Fos7a Taibah sabar dan lingkungan memaksa Anda berbicara. Kini saya bisa berbicara dengan percaya diri.',
            rating: 5
          },
          {
            id: 3,
            name: 'Dr. Bilal Khan',
            role: 'Dokter',
            country: 'AS',
            text: 'Program Bahasa Arab Bisnis sangat cocok untuk kebutuhan saya. Bukan sekadar kosakata kering, tetapi skenario nyata. Akomodasinya nyaman dan dekat dengan Haram.',
            rating: 4
          }
        ] as Testimonial[]
      },
      courseAdvisor: {
        title: 'Penasihat Kursus',
        subtitle: 'Biarkan kami memandu Anda ke jalan yang benar',
        welcome: 'Untuk memastikan Anda mendapatkan hasil maksimal dari 60 hari Anda di Madinah, mari identifikasi status Anda saat ini.',
        startBtn: 'Mulai Penilaian',
        q1: 'Apakah Anda membutuhkan bahasa Arab terutama untuk bisnis atau pekerjaan profesional?',
        q2: 'Bisakah Anda membaca teks bahasa Arab tetapi kesulitan berbicara secara alami?',
        yes: 'Ya',
        no: 'Tidak',
        recommendation: 'Jalur yang Direkomendasikan untuk Anda:',
        restart: 'Mulai Lagi',
        applyNow: 'Daftar Sekarang',
        openLabel: 'Buka penasihat kursus',
        closeLabel: 'Tutup penasihat kursus'
      }
    },
    applicationForm: {
      title: 'Formulir Pendaftaran Program',
      stepIndicator: 'Langkah {step} dari {total}',
      steps: {
        personal: 'Data Diri',
        passport: 'Paspor',
        course: 'Kelas',
        review: 'Tinjau'
      },
      sections: {
        personalInfo: 'Informasi Pribadi',
        travelDocument: 'Dokumen Perjalanan',
        selectPath: 'Pilih Jalur Anda',
        reviewSubmit: 'Tinjau & Kirim'
      },
      fields: {
        fullName: 'Nama Lengkap',
        email: 'Email',
        dob: 'Tanggal Lahir',
        phone: 'Nomor Telepon',
        address: 'Alamat Rumah',
        nationality: 'Kewarganegaraan',
        passportNumber: 'Nomor Paspor',
        passportExpiry: 'Tanggal Kedaluwarsa',
        visaRequirement: 'Kebutuhan Visa',
        accommodationPreference: 'Pilihan Akomodasi'
      },
      placeholders: {
        phone: '+1 234 567 890',
        address: 'Jalan, Kota, Negara, Kode Pos'
      },
      visaOptions: {
        needsVisa: 'Saya membutuhkan visa pelajar',
        hasVisa: 'Saya memiliki visa/izin tinggal yang masih berlaku'
      },
      accommodation: {
        shared: {
          label: 'Suite Bersama',
          description: '2 siswa per kamar'
        },
        private: {
          label: 'Suite Pribadi',
          description: 'Biaya upgrade berlaku'
        }
      },
      review: {
        applicant: 'Pendaftar',
        course: 'Kelas',
        passport: 'Paspor',
        visaRequest: 'Permintaan Visa',
        accommodation: 'Akomodasi',
        notSelected: 'Belum dipilih'
      },
      consents: {
        title: 'Persetujuan Wajib',
        terms: 'Saya menyetujui {action}.',
        privacy: 'Saya menyetujui {action}.',
        document: 'Saya menyetujui pengumpulan dan pemrosesan dokumen paspor/identitas untuk peninjauan pendaftaran dan dukungan visa. Lihat {action}.',
        gdpr: 'Jika saya berada di UE/EEA, saya mengakui {action}.',
        termsLink: 'Ketentuan Layanan',
        privacyLink: 'Kebijakan Privasi',
        documentLink: 'Persetujuan Dokumen',
        gdprLink: 'Pemberitahuan GDPR'
      },
      declaration: 'Dengan mengirimkan formulir ini, Anda menyatakan bahwa semua informasi yang diberikan benar. Anda setuju pada kode etik institusi selama tinggal di Kota Suci Madinah.',
      buttons: {
        previous: 'Sebelumnya',
        next: 'Langkah Berikutnya',
        submit: 'Kirim Pendaftaran',
        submitting: 'Mengirim…'
      },
      common: {
        yes: 'Ya',
        no: 'Tidak'
      },
      validation: {
        dobRequired: 'Harap masukkan tanggal lahir.',
        phoneRequired: 'Harap masukkan nomor telepon.',
        addressRequired: 'Harap masukkan alamat rumah.',
        nationalityRequired: 'Harap masukkan kewarganegaraan.',
        passportNumberRequired: 'Harap masukkan nomor paspor.',
        passportExpiryRequired: 'Harap masukkan tanggal kedaluwarsa paspor.',
        passportExpiryFuture: 'Tanggal kedaluwarsa paspor harus di masa depan.',
        courseRequired: 'Harap pilih kelas.',
        consentsRequired: 'Harap menyetujui Ketentuan, Kebijakan Privasi, dan Persetujuan Dokumen sebelum mengirim.',
        authRequired: 'Harap masuk sebelum mengirim pendaftaran.',
        submitFailed: 'Pendaftaran tidak dapat dikirim. Silakan coba lagi.'
      }
    },
    auth: {
      signupUnsupported: 'Pendaftaran tidak didukung di browser ini. Silakan buka halaman ini di Chrome atau Safari.',
      signupCta: 'Buka di Chrome/Safari',
      modal: {
        titles: {
          login: 'Selamat datang kembali',
          signup: 'Bergabung dengan Institut',
          forgot: 'Reset Password'
        },
        subtitles: {
          login: 'Akses portal siswa Anda',
          signup: 'Mulai perjalanan belajar bahasa Arab',
          forgot: 'Masukkan email untuk menerima tautan reset'
        },
        labels: {
          fullName: 'Nama Lengkap',
          email: 'Alamat Email',
          password: 'Kata Sandi'
        },
        placeholders: {
          fullName: 'contoh: Abdullah Smith',
          email: 'name@example.com',
          password: '••••••••'
        },
        actions: {
          returnToLogin: 'Kembali ke login',
          close: 'Tutup',
          forgotPassword: 'Lupa kata sandi?',
          login: 'Masuk',
          signup: 'Buat Akun',
          sendResetLink: 'Kirim Tautan Reset',
          backToLogin: 'Kembali ke Login',
          showPassword: 'Tampilkan kata sandi',
          hidePassword: 'Sembunyikan kata sandi'
        },
        footer: {
          noAccount: 'Belum punya akun?',
          haveAccount: 'Sudah punya akun?',
          signUp: 'Daftar',
          signIn: 'Masuk',
          cancel: 'Batal'
        },
        resetSentTitle: 'Periksa kotak masuk Anda',
        resetSentMessage: 'Jika ada akun untuk {email}, kami telah mengirim tautan reset kata sandi.',
        passwordStrength: {
          weak: 'Lemah',
          medium: 'Sedang',
          strong: 'Kuat'
        },
        validation: {
          nameMin: 'Nama minimal 3 karakter.',
          invalidEmail: 'Silakan masukkan email yang valid.',
          passwordMin: 'Kata sandi minimal 6 karakter.',
          unexpected: 'Terjadi kesalahan tak terduga.'
        }
      },
      errors: {
        invalidCredentials: 'Email atau kata sandi salah.',
        emailNotConfirmed: 'Harap konfirmasi email Anda sebelum masuk.',
        weakPassword: 'Kata sandi terlalu lemah. Gunakan kata sandi yang lebih kuat.',
        passwordTooShort: 'Kata sandi minimal 6 karakter.',
        userAlreadyExists: 'Akun dengan email ini sudah terdaftar.',
        userNotFound: 'Tidak ditemukan akun untuk email ini.',
        invalidEmail: 'Alamat email tidak valid.',
        rateLimit: 'Terlalu banyak percobaan. Coba lagi nanti.',
        signupDisabled: 'Pendaftaran saat ini dinonaktifkan.',
        unexpected: 'Terjadi kesalahan. Silakan coba lagi.'
      },
      page: {
        titleLogin: 'Masuk',
        titleSignup: 'Daftar',
        toggleLogin: 'Masuk',
        toggleSignup: 'Daftar',
        emailLabel: 'Email',
        passwordLabel: 'Kata Sandi',
        forgotPassword: 'Lupa kata sandi?',
        submitLogin: 'Masuk',
        submitSignup: 'Daftar',
        infoConfirmEmail: 'Periksa email Anda untuk konfirmasi, lalu masuk.',
        validation: {
          emailRequired: 'Email wajib diisi',
          emailInvalid: 'Masukkan email yang valid',
          passwordRequired: 'Kata sandi wajib diisi',
          passwordMin: 'Kata sandi minimal 6 karakter'
        }
      },
      supabaseModal: {
        title: 'Autentikasi',
        close: 'Tutup'
      },
      forgotPassword: {
        title: 'Lupa kata sandi',
        subtitle: 'Masukkan email Anda dan kami akan mengirim tautan reset.',
        emailLabel: 'Email',
        submit: 'Kirim tautan reset',
        sending: 'Mengirim…',
        resendIn: 'Kirim ulang dalam {seconds} detik',
        info: 'Jika akun untuk email ini ada, Anda akan menerima tautan reset.',
        errorRequired: 'Silakan masukkan alamat email Anda.',
        backHome: 'Kembali ke beranda'
      },
      updatePassword: {
        title: 'Perbarui kata sandi',
        subtitle: 'Tetapkan kata sandi baru untuk akun Anda.',
        verifying: 'Memverifikasi tautan reset…',
        invalidLink: 'Tautan kedaluwarsa atau tidak valid.',
        requestNewLink: 'Minta tautan reset baru.',
        newPassword: 'Kata sandi baru',
        confirmPassword: 'Konfirmasi kata sandi',
        submit: 'Perbarui kata sandi',
        submitting: 'Memperbarui…',
        backHome: 'Kembali ke beranda',
        success: 'Kata sandi diperbarui. Anda sekarang dapat masuk dengan kata sandi baru.',
        validation: {
          passwordMin: 'Kata sandi minimal 6 karakter.',
          passwordMismatch: 'Kata sandi tidak cocok.'
        }
      }
    },
    portal: {
      welcome: 'Selamat datang',
      studentId: 'ID Siswa',
      status: 'Status',
      enrolled: 'Terdaftar',
      pendingPayment: 'Menunggu Pembayaran',
      dashboard: 'Dasbor',
      documents: 'Dokumen',
      visaLetter: 'Surat Visa',
      currentEnrollment: 'Pendaftaran Saat Ini',
      courseConfirmed: 'Kursus Dikonfirmasi',
      courseConfirmedDesc: 'Anda berhasil terdaftar. Kelas Anda akan segera dimulai. Pastikan dokumen perjalanan Anda siap.',
      actionRequired: 'Tindakan Diperlukan',
      actionRequiredDesc: 'Mohon selesaikan pembayaran kursus untuk mengamankan kursi Anda dan menghasilkan surat visa.',
      mySchedule: 'Jadwal Saya',
      orientationDay: 'Hari Orientasi',
      dailyClasses: 'Kelas Harian',
      dailySchedule: 'Min-Kam, 08.00 - 13.00',
      uploadDocument: 'Unggah Dokumen',
      uploaded: 'Diunggah',
      approved: 'Disetujui',
      pending: 'Menunggu Tinjauan',
      rejected: 'Ditolak',
      noDocuments: 'Belum ada dokumen yang diunggah.',
      noDocumentsHint: 'Silakan unggah salinan paspor Anda.',
      visaLocked: 'Pembuatan visa terkunci. Mohon pastikan:',
      visaPaid: 'Biaya kursus telah dibayar penuh',
      visaDocs: 'Dokumen paspor diunggah dan disetujui',
      print: 'Cetak / Unduh PDF',
      fileUpload: {
        consentRequired: 'Anda harus menyetujui pengumpulan dokumen sebelum mengunggah paspor.',
        invalidType: 'Tipe file tidak didukung. Yang diizinkan: PDF atau gambar JPG/JPEG/PNG/WEBP.',
        tooLarge: 'Ukuran file melebihi 10MB. Pilih file yang lebih kecil.',
        uploading: 'Mengunggah dokumen…',
        uploadSuccess: 'Dokumen berhasil diunggah.',
        uploadFailed: 'Gagal mengunggah. Silakan coba lagi.',
        listLoading: 'Memuat dokumen…',
        listError: 'Tidak dapat memuat dokumen.',
        download: 'Unduh',
        delete: 'Hapus',
        deleteConfirm: 'Hapus "{name}"? Tindakan ini tidak bisa dibatalkan.',
        downloadFailed: 'Tidak dapat membuat tautan unduhan.',
        deleteFailed: 'Tidak dapat menghapus dokumen.',
        authRequired: 'Silakan masuk untuk mengunggah dokumen.'
      },
      documentMeta: {
        uploadedLabel: 'Diunggah:'
      },
      inProgress: {
        title: 'Aplikasi sedang diproses',
        subtitle: 'Kami sedang meninjau aplikasi Anda. Setelah disetujui, Anda akan menerima ID siswa dan akses penuh ke portal.',
        checklistTitle: 'Daftar periksa',
        steps: {
          documents: {
            label: 'Dokumen',
            status: 'Sedang ditinjau'
          },
          payment: {
            label: 'Pembayaran',
            status: 'Menunggu konfirmasi'
          },
          approval: {
            label: 'Persetujuan admin',
            status: 'Dalam antrean'
          }
        },
        emailPrompt: 'Perlu pembaruan atau punya pertanyaan? Email {email}.',
        contactEmail: 'admission.ftl@ptdima.sa',
        contactButton: 'Hubungi admisi',
        backButton: 'Kembali ke beranda'
      },
      studentDashboard: {
        title: 'Portal Siswa',
        subtitle: 'Selamat datang kembali. Berikut catatan siswa Anda.',
        emptyTitle: 'Belum ada data',
        copyButton: 'Salin ID Siswa',
        copySuccess: 'ID siswa disalin.',
        copyFailure: 'Gagal menyalin. Pilih ID untuk menyalin.',
        copySelected: 'ID siswa dipilih. Tekan Ctrl+C untuk menyalin.',
        statusLine: 'Status: {status}',
        enrolledLine: 'Terdaftar: {date}',
        separator: '•',
        pendingStatus: 'Menunggu',
        coursesTitle: 'Kursus Saya',
        coursesSubtitle: 'Pendaftaran Anda saat ini.',
        coursesEmpty: 'Belum ada kursus yang ditetapkan. Periksa kembali setelah pendaftaran dikonfirmasi.',
        scheduleTitle: 'Jadwal',
        scheduleSubtitle: 'Kelas mendatang dan tanggal penting.',
        scheduleEmpty: 'Kami akan memposting jadwal Anda setelah kelas ditetapkan.',
        announcementsTitle: 'Pengumuman',
        announcementsSubtitle: 'Pembaruan dari institusi.',
        announcementsEmpty: 'Belum ada pengumuman saat ini. Anda akan melihat pembaruan di sini terlebih dahulu.',
        profileTitle: 'Profil',
        profileSubtitle: 'Detail akun Anda.',
        profileStatusLabel: 'Status',
        enrollmentDateLabel: 'Tanggal pendaftaran',
        emptyValue: '—'
      },
      portalPage: {
        signInTitle: 'Silakan masuk',
        signInSubtitle: 'Masuk untuk mengakses portal siswa Anda.',
        backHome: 'Kembali ke beranda',
        loading: 'Memuat portal…',
        loadingHint: 'Ini mungkin memerlukan beberapa detik.',
        loadErrorTitle: 'Kami tidak dapat memuat catatan siswa Anda.',
        loadErrorBody: 'Terjadi masalah saat memuat data Anda.',
        retry: 'Coba lagi'
      },
      visaLetterDoc: {
        title: 'Surat Visa',
        dateLabel: 'Tanggal:',
        refLabel: 'Referensi:',
        refSuffix: 'VISA',
        defaultCourseTitle: 'Program Bahasa Arab',
        blankValue: '________________',
        greeting: 'Kepada Konsul Visa / Petugas Imigrasi,',
        subject: 'Subjek: Konfirmasi Pendaftaran & Dukungan Visa',
        bodyIntro: 'Surat ini menegaskan bahwa {name} (ID siswa: {studentId}), berkewarganegaraan {nationality}, dengan nomor paspor {passportNumber}, telah terdaftar dan diterima pada program {courseTitle} di Fos7a Taibah Institute di Al-Madinah Al-Munawwarah.',
        durationLine: 'Durasi program dari {startDate} hingga {endDate} ({courseDuration}).',
        tuitionIntro: 'Harap diketahui bahwa institusi telah menerima pembayaran biaya program, yang mencakup:',
        tuitionItems: {
          fees: 'Biaya pendidikan ({courseHours})',
          accommodation: 'Akomodasi di Madinah (jika dipilih)',
          support: 'Layanan dukungan sesuai paket program'
        },
        requestLine: 'Kami memohon agar visa yang diperlukan diberikan untuk memfasilitasi perjalanan pendidikan siswa. Fos7a Taibah Institute bertanggung jawab penuh atas siswa selama masa studi sesuai kebijakan institusi.',
        closing: 'Hormat kami,',
        signatureLabel: 'Tanda tangan',
        admissionsOffice: 'Kantor admisi',
        officialSeal: 'CAP RESMI',
        sealLocation: 'MADINAH'
      }
    },
    admin: {
      statusLabels: {
        pending: 'Menunggu',
        payment_pending: 'Menunggu pembayaran',
        enrolled: 'Terdaftar',
        visa_issued: 'Visa diterbitkan'
      },
      courseMeta: {
        notSelected: 'Belum dipilih',
        unknown: 'Tidak diketahui'
      },
      accessPanel: {
        title: 'Panel Akses',
        adminTitle: 'Admin',
        signedInAs: 'Masuk sebagai',
        notSignedIn: 'Belum masuk',
        checking: 'Memeriksa…',
        adminLabel: 'Admin',
        yes: 'Ya',
        no: 'Tidak',
        limitedAccess: 'Akses admin terbatas untuk akun yang disetujui.',
        backHome: 'Kembali ke beranda'
      },
      page: {
        dashboardTitle: 'Dasbor',
        dashboardSubtitle: 'Kelola siswa, aplikasi, dan kursus.',
        openTools: 'Buka alat admin',
        loadingAdmin: 'Memuat admin…',
        checkingAccess: 'Memeriksa akses admin…',
        accessRequired: 'Akses admin diperlukan untuk melihat dasbor ini.'
      },
      notAuthorized: {
        title: 'Tidak diizinkan',
        message: 'Anda memerlukan akses admin untuk melihat halaman ini.',
        backHome: 'Kembali ke beranda'
      },
      dashboardTabs: {
        students: 'Siswa',
        applications: 'Aplikasi',
        courses: 'Kursus'
      },
      courseCard: {
        active: 'Aktif',
        full: 'Penuh',
        capacity: 'Kapasitas',
        adjustLimit: 'Atur batas',
        students: 'Siswa',
        revenue: 'Perkiraan Pendapatan',
        revenueValue: '{currency}{amount}',
        recentEnrollees: 'Pendaftar terbaru:',
        noStudents: 'Belum ada siswa'
      },
      actions: {
        statusLabel: 'Status',
        updateStatusAria: 'Perbarui status untuk {name}',
        markPaid: 'Tandai dibayar',
        markUnpaid: 'Tandai belum dibayar',
        markUnpaidConfirm: 'Tandai {name} sebagai belum dibayar?',
        confirmUnpaidPrompt: 'Untuk menandai {name} belum dibayar, ketik "{phrase}".',
        confirmUnpaidPhrase: 'BELUM DIBAYAR',
        paymentAria: '{action} untuk {name}',
        pendingDocs: 'Dokumen tertunda',
        paymentStatusLabel: 'Status pembayaran:',
        paymentStatusPaid: 'Sudah dibayar',
        paymentStatusUnpaid: 'Belum dibayar',
        approve: 'Setujui',
        reject: 'Tolak',
        approveAria: 'Setujui {doc} untuk {name}',
        rejectAria: 'Tolak {doc} untuk {name}',
        rejectConfirm: 'Tolak {doc}?',
        confirmRejectPrompt: 'Untuk menolak "{doc}", ketik "{phrase}".',
        confirmRejectPhrase: 'TOLAK',
        rejectReason: 'Alasan penolakan (opsional):',
        rejectedDefault: 'Ditolak'
      },
      adminTable: {
        titleApplications: 'Aplikasi',
        emptyDefault: 'Tidak ada data.',
        emptyFiltered: 'Tidak ada hasil yang sesuai dengan filter saat ini.',
        totalRecords: '{count} total data',
        resultsCount: 'Menampilkan {count} hasil',
        pluralSuffix: {
          one: '',
          many: ''
        },
        searchLabel: 'Cari',
        searchPlaceholder: 'Cari berdasarkan nama, email, kursus',
        statusLabel: 'Status',
        levelLabel: 'Tingkat',
        allStatuses: 'Semua status',
        allLevels: 'Semua tingkat',
        clearFilters: 'Hapus filter',
        selectedFilters: 'Filter terpilih:',
        separator: ' · ',
        none: 'Tidak ada',
        searchFilter: 'Cari: "{value}"',
        statusFilter: 'Status: {value}',
        levelFilter: 'Tingkat: {value}',
        headers: {
          student: 'Siswa',
          course: 'Kursus',
          level: 'Tingkat',
          status: 'Status',
          updated: 'Diperbarui',
          actions: 'Tindakan'
        },
        pageLabel: 'Halaman {current} dari {total}',
        previous: 'Sebelumnya',
        next: 'Berikutnya'
      },
      studentsPanel: {
        title: 'Siswa',
        subtitle: 'Kelola data siswa yang tersimpan di Supabase.',
        createUserId: 'user_id siswa baru (uuid)',
        createUserIdPlaceholder: 'contoh: 2f6a8f5e-0f0a-4ed1-9b51-4d36f26f81a0',
        cohortYear: 'Tahun angkatan (opsional)',
        createStudent: 'Buat siswa',
        creating: 'Membuat…',
        createMessage: 'Berhasil membuat siswa {id}.',
        errors: {
          emptyUserId: 'Masukkan user_id untuk membuat data siswa.',
          duplicate: 'Siswa sudah ada untuk user_id ini.',
          invalidUuid: 'user_id tidak valid. Masukkan UUID yang benar.',
          permission: 'Izin ditolak. Periksa kebijakan RLS untuk public.students.'
        },
        recordsTitle: 'Data siswa',
        recordsSubtitle: 'Menampilkan {filtered} dari {total} data',
        searchLabel: 'Cari berdasarkan student_id',
        searchPlaceholder: 'Cari berdasarkan student_id',
        statusLabel: 'Status',
        loading: 'Memuat data siswa…',
        loadError: 'Gagal memuat siswa: {error}',
        empty: 'Tidak ada data siswa.',
        emptyFiltered: 'Tidak ada siswa yang sesuai dengan filter saat ini.',
        tableHeaders: {
          studentId: 'ID Siswa',
          userId: 'User ID',
          status: 'Status',
          enrolled: 'Terdaftar',
          actions: 'Tindakan'
        },
        selectStatus: 'Pilih status',
        updateStatus: 'Perbarui status',
        saving: 'Menyimpan…',
        validationMissing: 'Pilih status sebelum menyimpan.',
        statusLabels: {
          enrolled: 'Terdaftar',
          inactive: 'Tidak aktif',
          graduated: 'Lulus'
        }
      },
      accessModal: {
        title: 'Admin',
        close: 'Tutup',
        notAuthorizedTitle: 'Tidak diizinkan',
        notAuthorizedMessage: 'Anda memerlukan akses admin untuk melihat area ini.',
        backHome: 'Kembali ke beranda',
        loadingProfiles: 'Memuat profil…',
        loadError: 'Gagal memuat profil: {error}',
        retry: 'Coba lagi',
        updateError: 'Gagal memperbarui peran untuk {label}: {error}',
        unknownError: 'Kesalahan tidak diketahui',
        confirmPromotePrompt: 'Untuk mempromosikan {label} menjadi admin, ketik "{phrase}".',
        confirmPromotePhrase: 'PROMOSIKAN',
        confirmDemotePrompt: 'Untuk menurunkan {label} menjadi siswa, ketik "{phrase}".',
        confirmDemotePhrase: 'TURUNKAN',
        table: {
          email: 'Email',
          role: 'Peran',
          created: 'Dibuat',
          id: 'ID',
          action: 'Tindakan',
          promote: 'Promosikan ke admin',
          demote: 'Turunkan ke siswa',
          updating: 'Memperbarui…',
          selfRoleChange: 'Anda tidak dapat mengubah peran sendiri',
          noProfiles: 'Tidak ada profil.'
        }
      }
    },
    cart: {
      title: 'Keranjang Anda',
      close: 'Tutup keranjang',
      successTitle: 'Pembayaran Berhasil!',
      successMessage: 'JazakAllah Khair, {name}. Pendaftaran Anda untuk {course} telah dikonfirmasi.',
      studentIdLabel: 'ID Siswa',
      goToPortal: 'Masuk ke Portal Siswa',
      emptyTitle: 'Keranjang Anda kosong.',
      browseCourses: 'Lihat Kursus',
      studentLabel: 'Siswa',
      removeCourse: 'Hapus kursus dari keranjang',
      removeCourseTitle: 'Hapus kursus',
      packageIncludes: 'Paket Termasuk:',
      fallbackPrice: '$2,500.00',
      includesItems: {
        accommodation: 'Akomodasi 60 Hari',
        meals: '3 Makan Sehari',
        transport: 'Transportasi Lokal',
        tuition: 'Biaya Pendidikan'
      },
      totalDue: 'Total Tagihan',
      processing: 'Memproses Pembayaran...',
      proceedPayment: 'Lanjut ke Pembayaran',
      securePayment: 'Pembayaran aman dengan enkripsi SSL'
    },
    errors: {
      generic: 'Terjadi kesalahan. Silakan coba lagi.',
      required: 'Kolom ini wajib diisi.',
      notAuthorized: 'Tidak diizinkan',
      backHome: 'Kembali ke beranda'
    }
  }
};
