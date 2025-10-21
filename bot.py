import logging
import json
from telegram import Update, WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    ConversationHandler,
    filters,
)

# --- НАСТРОЙКИ ---
BOT_TOKEN = "8060994531:AAHISQsaPDKIJvPKzV4nIgng5uBK090bfa8"
# !!! ВАЖНО: Замените на URL вашего веб-приложения (должен быть HTTPS)
WEB_APP_URL = 'https://your-webapp-url.com' 
# !!! ВАЖНО: Замените на ваш числовой Chat ID для получения уведомлений
ADMIN_CHAT_ID = 1184828261 
TG_USERNAME = "@fryj1"

# Настройка логирования для отладки
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# Определяем состояния для диалога
FLAVOR, EFFECT = range(2)

# --- Функции диалога ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Начинает диалог при команде /start."""
    user = update.effective_user
    await update.message.reply_html(
        f"Здравствуйте, {user.mention_html()}! 👋\n\n"
        "Я помогу вам подобрать идеальный китайский чай. "
        "Давайте начнем с простого вопроса, чтобы лучше понять ваши предпочтения.",
    )
    
    reply_keyboard = [["Фруктовый/Цветочный", "Древесный/Ореховый"]]
    await update.message.reply_text(
        "Какой вкус вы предпочитаете?",
        reply_markup=ReplyKeyboardMarkup(
            reply_keyboard, one_time_keyboard=True, resize_keyboard=True, input_field_placeholder="Выберите вкус"
        ),
    )
    return FLAVOR

async def flavor(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Обрабатывает выбор вкуса и задает следующий вопрос."""
    user_choice = update.message.text
    context.user_data['flavor'] = user_choice
    
    reply_keyboard = [["Бодрость и энергия", "Расслабление и покой"]]
    await update.message.reply_text(
        "Отлично! А какого эффекта вы ждете от чая?",
        reply_markup=ReplyKeyboardMarkup(
            reply_keyboard, one_time_keyboard=True, resize_keyboard=True, input_field_placeholder="Выберите эффект"
        ),
    )
    return EFFECT

async def recommend_and_show_shop(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Дает рекомендацию и предлагает открыть магазин."""
    flavor_choice = context.user_data.get('flavor')
    effect_choice = update.message.text

    recommendation = ""
    if "Фруктовый" in flavor_choice and "Бодрость" in effect_choice:
        recommendation = "Вам отлично подойдут наши Шен Пуэры! У них яркий вкус и они прекрасно тонизируют."
    elif "Древесный" in flavor_choice and "Расслабление" in effect_choice:
        recommendation = "Рекомендую обратить внимание на выдержанные Шу Пуэры. Их глубокий вкус и согревающий эффект — то, что нужно для спокойного вечера."
    else:
        recommendation = "У нас большой выбор, и я уверен, вы найдете что-то по душе!"

    await update.message.reply_text(
        f"Спасибо за ответы!\n\n{recommendation}\n\n"
        "Вы можете посмотреть весь ассортимент, изучить подробности и оформить заказ в нашей удобной чайной лавке. "
        "Просто нажмите на кнопку ниже 👇"
    )

    # Создаем кнопку для открытия Web App
    keyboard = [[KeyboardButton("KūnchayShop", web_app=WebAppInfo(url=WEB_APP_URL))]]
    await update.message.reply_text(
        "Нажмите, чтобы открыть магазин:",
        reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    )
    
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Отменяет диалог."""
    await update.message.reply_text("Хорошо, если передумаете, просто напишите /start.")
    return ConversationHandler.END


# --- Обработка данных из Web App ---

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обрабатывает данные, полученные от Web App."""
    try:
        data = json.loads(update.effective_message.web_app_data.data)
        user = update.effective_user
        
        # Формируем красивое сообщение о заказе
        order_items_text = ""
        for item in data['items']:
            order_items_text += f"   - {item['name']} (Арт: {item['id']})\n"
            order_items_text += f"     Количество: {item['quantity']} шт.\n"
            order_items_text += f"     Цена: {item['price']:,} ₽\n\n".replace(',', ' ')

        total_price_formatted = f"{data['totalPrice']:,}".replace(',', ' ')
        
        # Информация о пользователе
        user_info = (
            f"👤 <b>Покупатель:</b> {user.full_name}\n"
            f"   - ID: {user.id}\n"
            f"   - Username: @{user.username if user.username else 'не указан'}"
        )
        
        # Сообщение для администратора
        message_to_admin = (
            f"🎉 <b>Новый заказ!</b> 🎉\n\n"
            f"{user_info}\n\n"
            f"📦 <b>Состав заказа:</b>\n"
            f"{order_items_text}"
            f"💰 <b>Итоговая сумма: {total_price_formatted} ₽</b>\n\n"
            f"Пожалуйста, свяжитесь с клиентом для подтверждения."
        )

        # Отправляем уведомление администратору
        await context.bot.send_message(chat_id=ADMIN_CHAT_ID, text=message_to_admin, parse_mode='HTML')
        
        # Сообщение благодарности для клиента
        await update.message.reply_text(
            "Спасибо за ваш заказ! Мы получили его и скоро свяжемся с вами для уточнения деталей. "
            f"Если у вас есть вопросы, вы можете написать нашему менеджеру: {TG_USERNAME}"
        )

    except Exception as e:
        logger.error(f"Ошибка обработки данных из WebApp: {e}")
        await context.bot.send_message(chat_id=ADMIN_CHAT_ID, text=f"Произошла ошибка при обработке заказа: {e}")
        await update.message.reply_text("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз или свяжитесь с нами.")


# --- Основная функция ---

def main() -> None:
    """Запускает бота."""
    application = Application.builder().token(BOT_TOKEN).build()

    # Создаем ConversationHandler для опроса
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            FLAVOR: [MessageHandler(filters.Regex("^(Фруктовый/Цветочный|Древесный/Ореховый)$"), flavor)],
            EFFECT: [MessageHandler(filters.Regex("^(Бодрость и энергия|Расслабление и покой)$"), recommend_and_show_shop)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    application.add_handler(conv_handler)
    
    # Добавляем обработчик для данных из Web App
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
    
    # Запуск бота
    application.run_polling()

if __name__ == "__main__":
    main()