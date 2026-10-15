# CURRENT TASK: ФАЗА 1 — Імпорт та тестування воркфлоу n8n (Backend & Інтеграції)

## 1. Контекст задачі
Реалізуємо зв'язку Telegram Mini App (TMA) + n8n + Google Sheets для квіз-калькулятора ремонту квартир.
У цій фазі n8n виступає повноцінним бекендом: приймає вебхук, розраховує кошторис у JS Code Node, записує лід у Google Таблицю, надсилає сповіщення адміну і клієнту, та повертає JSON-відповідь для Mini App.

## 2. Підготовлений файл воркфлоу
- **Шлях:** `n8n_workflows/quiz_calculator_workflow.json`
- **Ноди:**
  1. `Webhook TMA` (POST `/quiz-calculator`, очікує відповіді від Respond Node)
  2. `Розрахунок кошторису` (Code Node: формула за площею, тарифами, коефіцієнтом та допами)
  3. `Запис у Google Таблицю` (Google Sheets Node: додавання рядка)
  4. `Сповіщення Адміну` (Telegram Node: ID `8607080614`)
  5. `Чек клієнту в Telegram` (Telegram Node: ID з payload, `continueOnFail: true`)
  6. `Відповідь у TMA` (Respond to Webhook Node: повертає розраховану суму)

## 3. Чекліст ручного запуску в n8n Cloud
1. Відкрити **n8n Cloud** -> розділ **Workflows** -> натиснути **Add Workflow** -> меню три крапки -> **Import from File** (вибрати `n8n_workflows/quiz_calculator_workflow.json`).
2. Налаштувати креденшели:
   - У ноді **"Запис у Google Таблицю"**: створити/обрати `Google Sheets OAuth2 API` ("Sign in with Google").
   - У нодах **"Сповіщення Адміну"** та **"Чек клієнту"**: створити `Telegram API` креденшел і вставити токен:
     `8907636227:AAGDaNZltK_fxCuJUbVr2tKMMLqx74baL7c`
3. У ноді **"Webhook TMA"** скопіювати **Test URL**.
4. Натиснути в n8n **"Test step"** або **"Listen for test event"**.

## 4. Команда тестової верифікації (cURL)
Виконати в терміналі (замінивши `YOUR_N8N_TEST_WEBHOOK_URL` на отриманий URL):

```bash
curl -X POST "YOUR_N8N_TEST_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": 8607080614,
      "username": "andriy_bot_dev",
      "first_name": "Андрій"
    },
    "quiz": {
      "repair_type": "capital",
      "property_type": "secondary",
      "area_m2": 65,
      "addons": ["electric_plumbing", "materials_delivery"],
      "start_date": "найближчим часом"
    },
    "contact": {
      "name": "Андрій",
      "phone": "+380501234567"
    }
  }'
```

## 5. Очікуваний результат тесту
1. n8n підсвічує всі ноди зеленими галочками.
2. У Google Таблиці з'являється новий рядок з усіма полями та сумою: `439 250 грн`.
3. У Telegram бот надсилає повідомлення про новий лід адміну та клієнту.
4. cURL отримує JSON-відповідь: `{"success": true, "totalFormatted": "439 250 грн", ...}`.
