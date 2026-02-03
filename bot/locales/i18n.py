from typing import Dict

STRINGS = {
    'uz': {
        'welcome': "Salom! Men guruh moderatori botman.",
        'warn_user': "⚠️ Ogohlantirish! {user}\nSabab: {reason}\nOgohlantirishlar: {count}/{limit}",
        'ban_user': "🚫 Foydalanuvchi {user} guruhdan chetlashtirildi.",
        'mute_user': "🔇 Foydalanuvchi {user} {duration} daqiqaga ovozsiz rejimga o'tkazildi.",
        'captcha_prompt': "👋 Salom {user}! Bot emassizligingizni tasdiqlang. Quyidagi tugmani bosing.",
        'captcha_btn': "Men odamman ✅",
        'error_no_permission': "❌ Sizda bu buyruqni ishlatish uchun huquq yo'q.",
        'link_detected': "Reklama havolalari taqiqlangan!",
        'forward_detected': "Uzatilgan xabarlar taqiqlangan!",
        'bad_word': "Haqoratli so'z ishlatmang!",
        'premium_only': "Bu funksiya faqat Premium guruhlar uchun! ✨",
        'slot_usage': "Sizning guruhlaringiz: {used}/{limit}.",
    },
    'ru': {
        'welcome': "Привет! Я бот-модератор группы.",
        'warn_user': "⚠️ Предупреждение! {user}\nПричина: {reason}\nПредупреждения: {count}/{limit}",
        'ban_user': "🚫 Пользователь {user} был заблокирован.",
        'mute_user': "🔇 Пользователь {user} заглушен на {duration} минут.",
        'captcha_prompt': "👋 Привет {user}! Подтвердите, что вы не робот. Нажмите кнопку ниже.",
        'captcha_btn': "Я человек ✅",
        'error_no_permission': "❌ У вас нет прав на использование этой команды.",
        'link_detected': "Рекламные ссылки запрещены!",
        'forward_detected': "Пересланные сообщения запрещены!",
        'bad_word': "Не используйте оскорбительные слова!",
        'premium_only': "Эта функция доступна только для Premium групп! ✨",
        'slot_usage': "Ваши группы: {used}/{limit}.",
    }
}

class LocalizationService:
    @staticmethod
    def get(lang: str, key: str, **kwargs) -> str:
        lang_pack = STRINGS.get(lang, STRINGS['uz']) # Default UZ
        text = lang_pack.get(key, key)
        if kwargs:
            return text.format(**kwargs)
        return text

# Global instance or usage via dependency injection preferred
# For simplicity, we can use a helper function in handlers
