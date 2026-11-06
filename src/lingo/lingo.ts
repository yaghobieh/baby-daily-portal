import { createLingo } from '@forgedevstack/lingo';

export const lingo = createLingo({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: ['en', 'he', 'ru', 'es'],
  cache: true,
  storageKey: 'babydaily_portal_locale',
  source: {
    type: 'local',
    translations: {
      en: {
        nav: {
          features: 'Features',
          docs: 'Docs',
          changelog: 'Changelog',
          privacy: 'Privacy',
          terms: 'Terms',
          askAi: 'Ask AI',
          install: 'Install',
          forgeEcosystem: 'Part of Forge Stack',
        },
        docs: {
          badge: "Official Documentation",
          title: "BabyDaily User Guide & Documentation",
          subtitle: "Comprehensive reference for all routine tracking modules, phone clock alarms, family synchronization, and pediatric reports.",
          quickNav: "Quick Navigation",
          helpTitle: "Have a question not covered here?",
          helpDesc: "Our AI parenting assistant in the bottom corner is ready 24/7 to answer anything about feeding routines, sleep logs, or app features.",
        },
        hero: {
          badge: 'Designed with love for modern parents & caregivers',
          title: 'Parenting Made Simple, Calm & Beautiful',
          subtitle:
            'The all-in-one daily routine tracker for your baby. Seamlessly log feeding, sleep, diaper changes, and medications with instant family sync and real phone clock alarms.',
          pills: {
            clock: 'Next Meal Clock Alarms',
            sync: 'Multi-Parent Live Sync',
            privacy: '100% Ad-Free & Private',
          },
          babyStatus: {
            name: 'Liam Woke Up',
            desc: 'Slept 1h 45m • Woken 12:45',
          },
        },
        stats: {
          languages: { value: '4 Languages', label: 'English, עברית, Español, Русский' },
          free: { value: '100% Free', label: 'Zero ads, pure parenting focus' },
          speed: { value: '< 2 Seconds', label: 'Fast quick-log actions' },
          sync: { value: 'Instant Sync', label: 'Multi-parent real-time updates' },
        },
        features: {
          heading: 'Everything your baby needs, without the noise',
          subheading:
            'Built with pediatric guidelines, soft pastel aesthetics, and instant actions to keep your focus on your little one.',
          feeding: {
            badge: 'Feeding',
            title: 'Breast, Bottle & Solids',
            desc: 'Left and right nursing stopwatch timers, precise bottle volumes in ml/oz, and solid meal logs with reaction notes.',
          },
          sleep: {
            badge: 'Sleep',
            title: 'Live Sleep Ticker & Wake-Up',
            desc: 'One-tap sleep tracking with prominent live duration ticker and quick wake-up notifications to family members.',
          },
          alarm: {
            badge: 'Smart Reminders',
            title: 'Phone Clock Alarms for Meals',
            desc: 'Real phone clock alarms and smart reminder countdowns for upcoming feeds, naps, and medications.',
          },
          diaper: {
            badge: 'Care',
            title: 'Diaper & Wellness Log',
            desc: 'Track wet, dirty, and mixed diapers. Log temperatures, medication doses, vitamin D, and growth milestones.',
          },
          sharing: {
            badge: 'Care Team',
            title: 'Multi-Caregiver Family Sync',
            desc: 'Invite parents, grandparents, and nannies by email. Real-time updates so everyone stays in sync with zero friction.',
          },
          privacy: {
            badge: 'Privacy',
            title: 'Private & Secure',
            desc: 'Encrypted in transit, no advertising trackers, and easy swipe-to-delete for full control over your private baby data.',
          },
        },
        preview: {
          heading: 'Simple, Intuitive & Calming',
          subheading: 'Designed to be easy to use with one hand at 3:00 AM.',
          screen1: { title: 'Daily Timeline', subtitle: 'Swipe-to-delete entries' },
          screen2: { title: 'Feeding & Bottles', subtitle: 'Breast timer & volumes' },
          screen3: { title: 'Sleep & Diapers', subtitle: 'Real-time sleep ticker' },
          screen4: { title: 'Caregiver Sharing', subtitle: 'Direct email invites' },
        },
        aiBanner: {
          badge: 'BabyDaily AI Assistant',
          title: 'Have questions about routine tracking or alarms?',
          desc: 'Ask our intelligent AI assistant about how to set phone clock alarms for feedings, invite family members, or manage baby routines.',
          button: 'Ask BabyDaily AI',
        },
        cta: {
          title: 'Ready for calmer, simpler days?',
          subtitle:
            'Download BabyDaily today. Track routine milestones with zero stress and real-time family peace of mind.',
        },
        privacy: {
          backToHome: 'Back to Home',
        },
        footer: {
          tagline: 'Parenting Made Simple, Calm & Beautiful',
          copyright: '© 2026 BabyDaily. All rights reserved.',
          madeBy: 'Made by Forge and John Yaghobieh',
        },
      },
      he: {
        nav: {
          features: 'תכונות',
          docs: 'מדריכים ותיעוד',
          changelog: 'גרסאות',
          privacy: 'פרטיות',
          terms: 'תנאי שימוש',
          askAi: 'שאל את ה-AI',
          install: 'התקנה',
          forgeEcosystem: 'חלק מ-Forge Stack',
        },
        docs: {
          badge: "תיעוד ומדריכים רשמיים",
          title: "מדריך למשתמש ותיעוד BabyDaily",
          subtitle: "מדריך מקיף לכל מודולי מעקב השגרה, שעוני מעורר לתזונה, סנכרון משפחתי ודוחות לרופא.",
          quickNav: "ניווט מהיר",
          helpTitle: "יש לכם שאלה שלא מופיעה כאן?",
          helpDesc: "עוזר ההורות החכם שלנו בפינה התחתונה זמין 24/7 כדי לענות על כל שאלה בנושאי זמני האכלה, שעות שינה או תכונות האפליקציה.",
        },
        hero: {
          badge: 'מעוצב באהבה להורים ולמטפלים מודרניים',
          title: 'הורות פשוטה, רגועה ויפהפייה',
          subtitle:
            'יומן השגרה היומי המקיף לתינוקך. רישום הנקה, בקבוקים, שינה, חיתולים ותרופות עם סנכרון משפחתי מיידי ושעון מעורר אמיתי בנייד.',
          pills: {
            clock: 'שעון מעורר לארוחה הבאה',
            sync: 'סנכרון הורים ומשפחה בזמן אמת',
            privacy: '100% ללא פרסומות ופרטי',
          },
          babyStatus: {
            name: 'ליאם התעורר/ה',
            desc: 'ישן/ה 1 שעה 45 דק׳ • התעורר/ה ב-12:45',
          },
        },
        stats: {
          languages: { value: '4 שפות', label: 'English, עברית, Español, Русский' },
          free: { value: '100% חינם', label: 'ללא פרסומות, התמקדות בהורות' },
          speed: { value: '< 2 שניות', label: 'רישום מהיר במיוחד' },
          sync: { value: 'סנכרון מיידי', label: 'עדכון משפחתי חי' },
        },
        features: {
          heading: 'כל מה שהתינוק שלך צריך, בלי רעשי רקע',
          subheading:
            'נבנה לפי הנחיות רופאי ילדים, עיצוב פסטלי עדין ופעולות מהירות כדי שתתרכזו בקטנטנים.',
          feeding: {
            badge: 'הזנה',
            title: 'הנקה, בקבוק ומוצקים',
            desc: 'טיימר הנקה צד ימין/שמאל, כמויות מדויקות במ״ל, ורישום טעימות ואוכל מוצק עם תגובות.',
          },
          sleep: {
            badge: 'שינה',
            title: 'מונה שינה חי והתעוררות',
            desc: 'מעקב שינה בלחיצה אחת עם שעון זמן פעיל והודעת התעוררות מיידית לבני המשפחה.',
          },
          alarm: {
            badge: 'תזכורות חכמות',
            title: 'שעון מעורר בנייד לארוחות',
            desc: 'שעון מעורר אמיתי במכשיר הטלפון ותזכורות חכמות להאכלה הבאה ולתרופות.',
          },
          diaper: {
            badge: 'טיפול שוטף',
            title: 'חיתולים ומעקב בריאות',
            desc: 'רישום חיתול רטוב, מלוכלך ומשולב. מדידת חום, מנות תרופה, ויטמין D ומדדי גדילה.',
          },
          sharing: {
            badge: 'צוות הטיפול',
            title: 'סנכרון מלא לכל המשפחה',
            desc: 'הזמנת הורים, סבים ובייביסיטר באימייל. עדכונים בזמן אמת בלי שום מאמץ.',
          },
          privacy: {
            badge: 'פרטיות ובטיחות',
            title: 'פרטי ומאובטח לחלוטין',
            desc: 'הצפנה מלאה, ללא עוקבי פרסומות, ומחיקה מיידית בהחלקה לשליטה מלאה בנתונים.',
          },
        },
        preview: {
          heading: 'פשוט, אינטואיטיבי ומרגיע',
          subheading: 'מעוצב לשימוש קל ביד אחת ב-3:00 לפנות בוקר.',
          screen1: { title: 'יומן שגרת היום', subtitle: 'החלקה למחיקה ונעיצה' },
          screen2: { title: 'הזנה ובקבוקים', subtitle: 'טיימר הנקה ומדידת מ״ל' },
          screen3: { title: 'שינה וחיתולים', subtitle: 'מונה שינה פעיל בזמן אמת' },
          screen4: { title: 'שיתוף מטפלים', subtitle: 'הזמנות ישירות באימייל' },
        },
        aiBanner: {
          badge: 'עוזר AI של בייבי דיילי',
          title: 'יש לך שאלות על מעקב שגרה או שעונים מעוררים?',
          desc: 'שאלו את עוזר ה-AI החכם שלנו כיצד להגדיר שעון מעורר לארוחות, להזמין בני משפחה או לנהל את שגרת היום.',
          button: 'שאלו את ה-AI',
        },
        cta: {
          title: 'מוכנים לימים רגועים ופשוטים יותר?',
          subtitle:
            'הורידו את בייבי דיילי עוד היום. עקבו אחר אבני הדרך בשלווה ובשקט נפשי משפחתי בזמן אמת.',
        },
        privacy: {
          backToHome: 'חזרה לדף הבית',
        },
        footer: {
          tagline: 'הורות פשוטה, רגועה ויפהפייה',
          copyright: '© 2026 BabyDaily. כל הזכויות שמורות.',
          madeBy: 'פותח על ידי Forge ו-John Yaghobieh',
        },
      },
      ru: {
        nav: {
          features: 'Возможности',
          docs: 'Документация',
          changelog: 'История версий',
          privacy: 'Конфиденциальность',
          terms: 'Условия',
          askAi: 'Спросить AI',
          install: 'Установить',
          forgeEcosystem: 'Часть Forge Stack',
        },
        docs: {
          badge: "Официальная документация",
          title: "Руководство пользователя и документация BabyDaily",
          subtitle: "Полное руководство по всем модулям отслеживания, будильникам для кормлений, семейной синхронизации и педиатрическим отчетам.",
          quickNav: "Быстрая навигация",
          helpTitle: "Остались вопросы?",
          helpDesc: "Наш ИИ-помощник в нижнем углу доступен 24/7 и ответит на любые вопросы о кормлении, сне или функциях приложения.",
        },
        hero: {
          badge: 'Создано с любовью для современных родителей',
          title: 'Родительство просто, спокойно и красиво',
          subtitle:
            'Единый дневник режима малыша: кормления, сон, подгузники и лекарства с мгновенной семейной синхронизацией и настоящими будильниками.',
          pills: {
            clock: 'Будильник для следующего кормления',
            sync: 'Синхронизация между родителями',
            privacy: '100% Без рекламы и конфиденциально',
          },
          babyStatus: {
            name: 'Лиам проснулся',
            desc: 'Спал 1ч 45м • Проснулся в 12:45',
          },
        },
        stats: {
          languages: { value: '4 Языка', label: 'English, עברית, Español, Русский' },
          free: { value: '100% Бесплатно', label: 'Без рекламы, забота о детях' },
          speed: { value: '< 2 Секунд', label: 'Быстрая запись в одно касание' },
          sync: { value: 'Мгновенный синк', label: 'Обновления для всей семьи' },
        },
        features: {
          heading: 'Всё, что нужно малышу, без лишнего шума',
          subheading:
            'Создано по рекомендациям педиатров, в мягких пастельных тонах и с мгновенным вводом.',
          feeding: {
            badge: 'Кормление',
            title: 'Грудь, бутылочка и прикорм',
            desc: 'Секундомер для левой/правой груди, точный объём в мл и запись прикорма с реакциями.',
          },
          sleep: {
            badge: 'Сон',
            title: 'Живой таймер сна и пробуждение',
            desc: 'Учёт сна в одно касание с крупным таймером и оповещением родных при пробуждении.',
          },
          alarm: {
            badge: 'Умные напоминания',
            title: 'Будильники в телефоне для кормлений',
            desc: 'Настоящие системные будильники в часах телефона и таймеры до следующего приёма пищи.',
          },
          diaper: {
            badge: 'Уход',
            title: 'Подгузники и самочувствие',
            desc: 'Учёт мокрых и грязных смен, температуры, витамина D, лекарств и параметров роста.',
          },
          sharing: {
            badge: 'Семья',
            title: 'Синхронизация для всей семьи',
            desc: 'Приглашайте маму, папу, бабушек и няню по Email. Все данные синхронны в реальном времени.',
          },
          privacy: {
            badge: 'Приватность',
            title: 'Безопасно и конфиденциально',
            desc: 'Шифрование данных, отсутствие рекламы и удаление записей простым свайпом.',
          },
        },
        preview: {
          heading: 'Просто, интуитивно и спокойно',
          subheading: 'Удобно пользоваться одной рукой в 3 часа ночи.',
          screen1: { title: 'Дневник режима', subtitle: 'Свайп для удаления и закрепления' },
          screen2: { title: 'Кормление и бутылочки', subtitle: 'Таймер груди и объёмы мл' },
          screen3: { title: 'Сон и подгузники', subtitle: 'Таймер сна в реальном времени' },
          screen4: { title: 'Семейный доступ', subtitle: 'Прямые приглашения по Email' },
        },
        aiBanner: {
          badge: 'AI-помощник BabyDaily',
          title: 'Вопросы по ведению режима или будильникам?',
          desc: 'Задайте вопрос нашему умному AI-помощнику о настройке будильников, приглашении семьи или режиме малыша.',
          button: 'Спросить BabyDaily AI',
        },
        cta: {
          title: 'Готовы к более спокойным и простым дням?',
          subtitle:
            'Скачайте BabyDaily сегодня. Отслеживайте важные этапы без стресса с мгновенным семейным спокойствием.',
        },
        privacy: {
          backToHome: 'Вернуться на главную',
        },
        footer: {
          tagline: 'Родительство просто, спокойно и красиво',
          copyright: '© 2026 BabyDaily. Все права защищены.',
          madeBy: 'Создано Forge и John Yaghobieh',
        },
      },
      es: {
        nav: {
          features: 'Características',
          docs: 'Documentación',
          changelog: 'Historial',
          privacy: 'Privacidad',
          terms: 'Términos',
          askAi: 'Preguntar a la IA',
          install: 'Instalar',
          forgeEcosystem: 'Parte de Forge Stack',
        },
        docs: {
          badge: "Documentación oficial",
          title: "Guía del usuario y documentación de BabyDaily",
          subtitle: "Referencia completa de módulos de rutina, alarmas de reloj, sincronización familiar e informes pediátricos.",
          quickNav: "Navegación rápida",
          helpTitle: "¿Tienes alguna pregunta no cubierta aquí?",
          helpDesc: "Nuestro asistente de IA en la esquina inferior está listo 24/7 para responder sobre rutinas de alimentación, sueño o funciones.",
        },
        hero: {
          badge: 'Diseñado con amor para padres y cuidadores',
          title: 'Crianza simple, tranquila y hermosa',
          subtitle:
            'El registro diario todo en uno para tu bebé. Registra lactancia, sueño, pañales y medicamentos con sincronización familiar y alarmas en el reloj del teléfono.',
          pills: {
            clock: 'Alarmas de reloj para comidas',
            sync: 'Sincronización familiar en vivo',
            privacy: '100% Sin anuncios y privado',
          },
          babyStatus: {
            name: 'Liam despertó',
            desc: 'Durmió 1h 45m • Despertó 12:45',
          },
        },
        stats: {
          languages: { value: '4 Idiomas', label: 'English, עברית, Español, Русский' },
          free: { value: '100% Gratis', label: 'Sin anuncios, enfoque en tu bebé' },
          speed: { value: '< 2 Segundos', label: 'Registro rápido con un toque' },
          sync: { value: 'Sync instantáneo', label: 'Actualizaciones familiares en vivo' },
        },
        features: {
          heading: 'Todo lo que tu bebé necesita, sin complicaciones',
          subheading:
            'Diseñado según pautas pediátricas, estética pastel suave y acciones rápidas para cuidar a tu pequeño.',
          feeding: {
            badge: 'Alimentación',
            title: 'Pecho, biberón y sólidos',
            desc: 'Cronómetro para pecho izquierdo/derecho, volumen exacto en ml y registro de sólidos con notas.',
          },
          sleep: {
            badge: 'Sueño',
            title: 'Temporizador de sueño en vivo',
            desc: 'Seguimiento con un toque, reloj de duración en tiempo real y alerta instantánea al despertar.',
          },
          alarm: {
            badge: 'Recordatorios',
            title: 'Alarmas de reloj para comidas',
            desc: 'Alarmas reales en la app de reloj del teléfono y cuentas regresivas inteligentes para tomas.',
          },
          diaper: {
            badge: 'Cuidado',
            title: 'Pañales y bienestar',
            desc: 'Control de pañales mojados y sucios. Temperatura, dosis de medicinas, vitamina D y crecimiento.',
          },
          sharing: {
            badge: 'Equipo familiar',
            title: 'Sincronización entre cuidadores',
            desc: 'Invita a padres, abuelos y niñeras por correo electrónico. Todos al día sin esfuerzo.',
          },
          privacy: {
            badge: 'Privacidad',
            title: 'Privado y seguro',
            desc: 'Cifrado de extremo a extremo, sin rastreadores y eliminación rápida deslizando para control total.',
          },
        },
        preview: {
          heading: 'Simple, intuitivo y tranquilizador',
          subheading: 'Diseñado para usarse con una sola mano a las 3:00 AM.',
          screen1: { title: 'Cronología diaria', subtitle: 'Deslizar para eliminar o fijar' },
          screen2: { title: 'Alimentación y biberones', subtitle: 'Temporizador de pecho y ml' },
          screen3: { title: 'Sueño y pañales', subtitle: 'Contador de sueño en vivo' },
          screen4: { title: 'Compartir con cuidadores', subtitle: 'Invitaciones directas por email' },
        },
        aiBanner: {
          badge: 'Asistente de IA BabyDaily',
          title: '¿Tienes preguntas sobre rutinas o alarmas?',
          desc: 'Pregunta a nuestro asistente de IA cómo programar alarmas de comida, invitar familiares o gestionar rutinas.',
          button: 'Preguntar a BabyDaily AI',
        },
        cta: {
          title: '¿Listos para días más tranquilos y sencillos?',
          subtitle:
            'Descarga BabyDaily hoy. Sigue cada hito sin estrés y con total tranquilidad familiar en tiempo real.',
        },
        privacy: {
          backToHome: 'Volver al inicio',
        },
        footer: {
          tagline: 'Crianza simple, tranquila y hermosa',
          copyright: '© 2026 BabyDaily. Todos los derechos reservados.',
          madeBy: 'Creado por Forge y John Yaghobieh',
        },
      },
    },
  },
});
