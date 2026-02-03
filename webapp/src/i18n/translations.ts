export type Language = 'uz' | 'ru';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    confirm: string;
    back: string;
    next: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    enabled: string;
    disabled: string;
    on: string;
    off: string;
    all: string;
    none: string;
    search: string;
    filter: string;
    export: string;
    import: string;
  };

  // Navigation
  nav: {
    dashboard: string;
    groups: string;
    logs: string;
    subscription: string;
    settings: string;
    help: string;
    logout: string;
    adminPanel: string;
    unknownGroup: string;
    allGroups: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    overview: string;
    totalSlots: string;
    usedSlots: string;
    freeSlots: string;
    premiumGroups: string;
    freeGroups: string;
    recentActivity: string;
    quickActions: string;
    bindGroup: string;
    viewLogs: string;
    upgradeSlots: string;
  };

  // Groups
  groups: {
    title: string;
    description: string;
    myGroups: string;
    availableGroups: string;
    boundGroups: string;
    unboundGroups: string;
    groupName: string;
    members: string;
    status: string;
    statusFree: string;
    statusPremium: string;
    bind: string;
    unbind: string;
    configure: string;
    noGroups: string;
    noFreeSlots: string;
    bindConfirm: string;
    unbindConfirm: string;
    adsEnabled: string;
    adsDisabled: string;
  };

  // Group Settings
  settings: {
    title: string;
    moderation: string;
    forbiddenWords: string;
    antiSpam: string;
    captcha: string;
    botBehavior: string;
    
    // Moderation
    deleteLinks: string;
    deleteMentions: string;
    deleteForwarded: string;
    mediaLimits: string;
    photos: string;
    videos: string;
    stickers: string;
    gifs: string;
    
    // Forbidden Words
    wordList: string;
    addWord: string;
    importWords: string;
    exportWords: string;
    categories: string;
    swear: string;
    scam: string;
    crypto: string;
    custom: string;
    caseInsensitive: string;
    
    // Anti-Spam
    floodControl: string;
    messagesPerInterval: string;
    intervalSeconds: string;
    duplicateDetection: string;
    warnSystem: string;
    warnLimit: string;
    actionOnLimit: string;
    mute: string;
    kick: string;
    
    // Captcha
    enableCaptcha: string;
    captchaType: string;
    buttonCaptcha: string;
    mathCaptcha: string;
    timeout: string;
    timeoutSeconds: string;
    failAction: string;
    newUserReadOnly: string;
    readOnlyDuration: string;
    
    // Bot Behavior
    silentMode: string;
    verboseMode: string;
    botLanguage: string;
    // Descriptions
    moderationDesc: string;
    forbiddenWordsDesc: string;
    antiSpamDesc: string;
    captchaDesc: string;
    botBehaviorDesc: string;
    silentModeDesc: string;
    noForbiddenWords: string;
    groupNotFound: string;
  };

  // Logs
  logs: {
    title: string;
    description: string;
    recentLogs: string;
    filterByReason: string;
    link: string;
    spam: string;
    forbiddenWord: string;
    captchaFail: string;
    noLogs: string;
    user: string;
    action: string;
    reason: string;
    time: string;
    captchaFailRate: string;
    topOffenders: string;
  };

  // Subscription
  subscription: {
    title: string;
    currentPlan: string;
    expiresOn: string;
    slots: string;
    upgrade: string;
    addSlots: string;
    plans: string;
    basic: string;
    pro: string;
    enterprise: string;
    perMonth: string;
    features: string;
    selectPlan: string;
    paymentMethod: string;
    renewsOn: string;
    current: string;
    // Plan features
    groupSlots: string;
    basicModeration: string;
    captchaVerification: string;
    emailSupport: string;
    advancedAntiSpam: string;
    customForbiddenWords: string;
    prioritySupport: string;
    analyticsDashboard: string;
    unlimitedForbiddenWords: string;
    customCaptchaBranding: string;
    apiAccess: string;
    dedicatedSupport: string;
    customIntegrations: string;
    cardExpires: string;
  };

  // Errors & Confirmations
  messages: {
    bindSuccess: string;
    unbindSuccess: string;
    settingsSaved: string;
    noSlotsAvailable: string;
    confirmUnbind: string;
    confirmDelete: string;
    wordAdded: string;
    wordRemoved: string;
    importSuccess: string;
    exportSuccess: string;
  };
}

export const translations: Record<Language, Translations> = {
  uz: {
    common: {
      save: "Saqlash",
      cancel: "Bekor qilish",
      delete: "O'chirish",
      edit: "Tahrirlash",
      add: "Qo'shish",
      remove: "Olib tashlash",
      confirm: "Tasdiqlash",
      back: "Orqaga",
      next: "Keyingi",
      loading: "Yuklanmoqda...",
      error: "Xatolik",
      success: "Muvaffaqiyatli",
      warning: "Ogohlantirish",
      enabled: "Yoqilgan",
      disabled: "O'chirilgan",
      on: "Yoq",
      off: "O'ch",
      all: "Hammasi",
      none: "Hech biri",
      search: "Qidirish",
      filter: "Filtrlash",
      export: "Eksport",
      import: "Import",
    },
    nav: {
      dashboard: "Boshqaruv paneli",
      groups: "Guruhlar",
      logs: "Jurnallar",
      subscription: "Obuna",
      settings: "Sozlamalar",
      help: "Yordam",
      logout: "Chiqish",
      adminPanel: "Admin Panel",
      unknownGroup: "Noma'lum guruh",
      allGroups: "Barcha guruhlar",
    },
    dashboard: {
      title: "Boshqaruv paneli",
      welcome: "Xush kelibsiz",
      overview: "Umumiy ko'rinish",
      totalSlots: "Jami slotlar",
      usedSlots: "Ishlatilgan",
      freeSlots: "Bo'sh slotlar",
      premiumGroups: "Premium guruhlar",
      freeGroups: "Bepul guruhlar",
      recentActivity: "So'nggi faoliyat",
      quickActions: "Tezkor harakatlar",
      bindGroup: "Guruh ulash",
      viewLogs: "Jurnallarni ko'rish",
      upgradeSlots: "Slot qo'shish",
    },
    groups: {
      title: "Guruhlar",
      description: "Bot administratori bo'lgan barcha guruhlarni boshqaring",
      myGroups: "Mening guruhlarim",
      availableGroups: "Mavjud guruhlar",
      boundGroups: "Ulangan guruhlar",
      unboundGroups: "Ulanmagan guruhlar",
      groupName: "Guruh nomi",
      members: "A'zolar",
      status: "Holat",
      statusFree: "BEPUL",
      statusPremium: "PREMIUM",
      bind: "Ulash",
      unbind: "Uzish",
      configure: "Sozlash",
      noGroups: "Guruhlar topilmadi",
      noFreeSlots: "Bo'sh slot mavjud emas",
      bindConfirm: "Ushbu guruhni premium slotga ulashni xohlaysizmi?",
      unbindConfirm: "Ushbu guruhni uzishni xohlaysizmi? Reklamalar yoqiladi.",
      adsEnabled: "Reklamalar yoqilgan",
      adsDisabled: "Reklamalar o'chirilgan",
    },
    settings: {
      title: "Guruh sozlamalari",
      moderation: "Moderatsiya",
      forbiddenWords: "Taqiqlangan so'zlar",
      antiSpam: "Anti-spam",
      captcha: "Captcha",
      botBehavior: "Bot xatti-harakati",
      deleteLinks: "Havolalarni o'chirish",
      deleteMentions: "@eslovlarni o'chirish",
      deleteForwarded: "Yo'naltirilgan xabarlarni o'chirish",
      mediaLimits: "Media cheklovlari",
      photos: "Rasmlar",
      videos: "Videolar",
      stickers: "Stikerlar",
      gifs: "GIF-lar",
      wordList: "So'zlar ro'yxati",
      addWord: "So'z qo'shish",
      importWords: "So'zlarni import qilish",
      exportWords: "So'zlarni eksport qilish",
      categories: "Kategoriyalar",
      swear: "So'kinish",
      scam: "Firibgarlik",
      crypto: "Kripto",
      custom: "Maxsus",
      caseInsensitive: "Katta-kichik harfni e'tiborsiz qoldirish",
      floodControl: "Flood nazorati",
      messagesPerInterval: "Intervaldagi xabarlar soni",
      intervalSeconds: "Interval (soniya)",
      duplicateDetection: "Dublikat aniqlash",
      warnSystem: "Ogohlantirish tizimi",
      warnLimit: "Ogohlantirish limiti",
      actionOnLimit: "Limitdagi harakat",
      mute: "Ovozni o'chirish",
      kick: "Chiqarish",
      enableCaptcha: "Captcha-ni yoqish",
      captchaType: "Captcha turi",
      buttonCaptcha: "Tugma captcha",
      mathCaptcha: "Matematik captcha",
      timeout: "Vaqt chegarasi",
      timeoutSeconds: "Vaqt chegarasi (soniya)",
      failAction: "Muvaffaqiyatsizlik harakati",
      newUserReadOnly: "Yangi foydalanuvchi faqat o'qish rejimi",
      readOnlyDuration: "Faqat o'qish davomiyligi",
      silentMode: "Sokin rejim",
      verboseMode: "Batafsil rejim",
      botLanguage: "Bot tili",
      moderationDesc: "Avtomatik kontent moderatsiyasi qoidalarini sozlang",
      forbiddenWordsDesc: "Avtomatik o'chiriladigan so'z va iboralarni boshqaring",
      antiSpamDesc: "Flood nazorati va spam aniqlashni sozlang",
      captchaDesc: "Yangi foydalanuvchi tekshiruvini sozlang",
      botBehaviorDesc: "Botning guruhda qanday javob berishini sozlang",
      silentModeDesc: "Bot harakatlar bajarayotganda xabar yubormaydi",
      noForbiddenWords: "Taqiqlangan so'zlar sozlanmagan",
      groupNotFound: "Guruh topilmadi",
    },
    logs: {
      title: "Moderatsiya jurnallari",
      description: "Bot tomonidan bajarilgan barcha moderatsiya harakatlarini ko'ring",
      recentLogs: "So'nggi jurnallar",
      filterByReason: "Sababga ko'ra filtrlash",
      link: "Havola",
      spam: "Spam",
      forbiddenWord: "Taqiqlangan so'z",
      captchaFail: "Captcha muvaffaqiyatsiz",
      noLogs: "Jurnal yozuvlari topilmadi",
      user: "Foydalanuvchi",
      action: "Harakat",
      reason: "Sabab",
      time: "Vaqt",
      captchaFailRate: "Captcha muvaffaqiyatsizlik darajasi",
      topOffenders: "Eng ko'p qoidabuzarlar",
    },
    subscription: {
      title: "Obuna boshqaruvi",
      currentPlan: "Joriy reja",
      expiresOn: "Tugash sanasi",
      slots: "Slotlar",
      upgrade: "Yangilash",
      addSlots: "Slot qo'shish",
      plans: "Rejalar",
      basic: "Asosiy",
      pro: "Pro",
      enterprise: "Korxona",
      perMonth: "/oy",
      features: "Xususiyatlar",
      selectPlan: "Reja tanlash",
      paymentMethod: "To'lov usuli",
      renewsOn: "Yangilanish sanasi",
      current: "Joriy",
      groupSlots: "guruh slotlari",
      basicModeration: "Asosiy moderatsiya",
      captchaVerification: "Captcha tekshiruvi",
      emailSupport: "Email yordam",
      advancedAntiSpam: "Kengaytirilgan anti-spam",
      customForbiddenWords: "Maxsus taqiqlangan so'zlar",
      prioritySupport: "Ustuvor yordam",
      analyticsDashboard: "Analitika paneli",
      unlimitedForbiddenWords: "Cheksiz taqiqlangan so'zlar",
      customCaptchaBranding: "Maxsus captcha brendingi",
      apiAccess: "API kirish huquqi",
      dedicatedSupport: "Maxsus yordam",
      customIntegrations: "Maxsus integratsiyalar",
      cardExpires: "Amal qilish muddati",
    },
    messages: {
      bindSuccess: "Guruh muvaffaqiyatli ulandi",
      unbindSuccess: "Guruh muvaffaqiyatli uzildi",
      settingsSaved: "Sozlamalar saqlandi",
      noSlotsAvailable: "Bo'sh slot mavjud emas. Iltimos, obunangizni yangilang.",
      confirmUnbind: "Haqiqatan ham ushbu guruhni uzmoqchimisiz?",
      confirmDelete: "Haqiqatan ham o'chirmoqchimisiz?",
      wordAdded: "So'z qo'shildi",
      wordRemoved: "So'z olib tashlandi",
      importSuccess: "Import muvaffaqiyatli",
      exportSuccess: "Eksport muvaffaqiyatli",
    },
  },
  ru: {
    common: {
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      add: "Добавить",
      remove: "Убрать",
      confirm: "Подтвердить",
      back: "Назад",
      next: "Далее",
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
      warning: "Предупреждение",
      enabled: "Включено",
      disabled: "Отключено",
      on: "Вкл",
      off: "Выкл",
      all: "Все",
      none: "Ничего",
      search: "Поиск",
      filter: "Фильтр",
      export: "Экспорт",
      import: "Импорт",
    },
    nav: {
      dashboard: "Панель управления",
      groups: "Группы",
      logs: "Журналы",
      subscription: "Подписка",
      settings: "Настройки",
      help: "Помощь",
      logout: "Выход",
      adminPanel: "Панель админа",
      unknownGroup: "Неизвестная группа",
      allGroups: "Все группы",
    },
    dashboard: {
      title: "Панель управления",
      welcome: "Добро пожаловать",
      overview: "Обзор",
      totalSlots: "Всего слотов",
      usedSlots: "Использовано",
      freeSlots: "Свободно",
      premiumGroups: "Премиум группы",
      freeGroups: "Бесплатные группы",
      recentActivity: "Последняя активность",
      quickActions: "Быстрые действия",
      bindGroup: "Привязать группу",
      viewLogs: "Просмотр журналов",
      upgradeSlots: "Добавить слоты",
    },
    groups: {
      title: "Группы",
      description: "Управляйте всеми группами, где бот является администратором",
      myGroups: "Мои группы",
      availableGroups: "Доступные группы",
      boundGroups: "Привязанные группы",
      unboundGroups: "Непривязанные группы",
      groupName: "Название группы",
      members: "Участники",
      status: "Статус",
      statusFree: "БЕСПЛАТНО",
      statusPremium: "ПРЕМИУМ",
      bind: "Привязать",
      unbind: "Отвязать",
      configure: "Настроить",
      noGroups: "Группы не найдены",
      noFreeSlots: "Нет свободных слотов",
      bindConfirm: "Хотите привязать эту группу к премиум слоту?",
      unbindConfirm: "Хотите отвязать эту группу? Реклама будет включена.",
      adsEnabled: "Реклама включена",
      adsDisabled: "Реклама отключена",
    },
    settings: {
      title: "Настройки группы",
      moderation: "Модерация",
      forbiddenWords: "Запрещённые слова",
      antiSpam: "Антиспам",
      captcha: "Капча",
      botBehavior: "Поведение бота",
      deleteLinks: "Удалять ссылки",
      deleteMentions: "Удалять @упоминания",
      deleteForwarded: "Удалять пересланные",
      mediaLimits: "Ограничения медиа",
      photos: "Фото",
      videos: "Видео",
      stickers: "Стикеры",
      gifs: "GIF",
      wordList: "Список слов",
      addWord: "Добавить слово",
      importWords: "Импорт слов",
      exportWords: "Экспорт слов",
      categories: "Категории",
      swear: "Мат",
      scam: "Мошенничество",
      crypto: "Крипто",
      custom: "Другое",
      caseInsensitive: "Без учёта регистра",
      floodControl: "Контроль флуда",
      messagesPerInterval: "Сообщений за интервал",
      intervalSeconds: "Интервал (секунды)",
      duplicateDetection: "Обнаружение дубликатов",
      warnSystem: "Система предупреждений",
      warnLimit: "Лимит предупреждений",
      actionOnLimit: "Действие при лимите",
      mute: "Заглушить",
      kick: "Кикнуть",
      enableCaptcha: "Включить капчу",
      captchaType: "Тип капчи",
      buttonCaptcha: "Кнопка",
      mathCaptcha: "Математическая",
      timeout: "Таймаут",
      timeoutSeconds: "Таймаут (секунды)",
      failAction: "Действие при неудаче",
      newUserReadOnly: "Только чтение для новых",
      readOnlyDuration: "Длительность только чтения",
      silentMode: "Тихий режим",
      verboseMode: "Подробный режим",
      botLanguage: "Язык бота",
      moderationDesc: "Настройте правила автоматической модерации контента",
      forbiddenWordsDesc: "Управляйте словами и фразами для автоудаления",
      antiSpamDesc: "Настройте контроль флуда и обнаружение спама",
      captchaDesc: "Настройте проверку новых пользователей",
      botBehaviorDesc: "Настройте поведение бота в группе",
      silentModeDesc: "Бот не будет отправлять сообщения при действиях",
      noForbiddenWords: "Запрещённые слова не настроены",
      groupNotFound: "Группа не найдена",
    },
    logs: {
      title: "Журналы модерации",
      description: "Просмотр всех действий модерации, выполненных ботом",
      recentLogs: "Последние записи",
      filterByReason: "Фильтр по причине",
      link: "Ссылка",
      spam: "Спам",
      forbiddenWord: "Запрещённое слово",
      captchaFail: "Неудачная капча",
      noLogs: "Записи не найдены",
      user: "Пользователь",
      action: "Действие",
      reason: "Причина",
      time: "Время",
      captchaFailRate: "Процент неудач капчи",
      topOffenders: "Топ нарушителей",
    },
    subscription: {
      title: "Управление подпиской",
      currentPlan: "Текущий план",
      expiresOn: "Истекает",
      slots: "Слоты",
      upgrade: "Улучшить",
      addSlots: "Добавить слоты",
      plans: "Планы",
      basic: "Базовый",
      pro: "Про",
      enterprise: "Бизнес",
      perMonth: "/мес",
      features: "Возможности",
      selectPlan: "Выбрать план",
      paymentMethod: "Способ оплаты",
      renewsOn: "Продление",
      current: "Текущий",
      groupSlots: "слотов групп",
      basicModeration: "Базовая модерация",
      captchaVerification: "Проверка капчей",
      emailSupport: "Поддержка по email",
      advancedAntiSpam: "Расширенный антиспам",
      customForbiddenWords: "Свои запрещённые слова",
      prioritySupport: "Приоритетная поддержка",
      analyticsDashboard: "Панель аналитики",
      unlimitedForbiddenWords: "Безлимит запрещённых слов",
      customCaptchaBranding: "Брендинг капчи",
      apiAccess: "Доступ к API",
      dedicatedSupport: "Выделенная поддержка",
      customIntegrations: "Кастомные интеграции",
      cardExpires: "Срок действия",
    },
    messages: {
      bindSuccess: "Группа успешно привязана",
      unbindSuccess: "Группа успешно отвязана",
      settingsSaved: "Настройки сохранены",
      noSlotsAvailable: "Нет свободных слотов. Пожалуйста, улучшите подписку.",
      confirmUnbind: "Вы уверены, что хотите отвязать эту группу?",
      confirmDelete: "Вы уверены, что хотите удалить?",
      wordAdded: "Слово добавлено",
      wordRemoved: "Слово удалено",
      importSuccess: "Импорт успешен",
      exportSuccess: "Экспорт успешен",
    },
  },
};
