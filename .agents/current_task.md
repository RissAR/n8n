# CURRENT TASK: КРОК 1 — Фундамент стабільності (Anti-Cache & Hardening First)

## 1. Мета задачі
Ліквідувати ризики «білого екрана» та агресивного кешування Telegram Webview на iOS/Android/Desktop. Гарантувати, що будь-яка правка коду одразу потрапляє до користувача, чанки файлів мають унікальні хеші, а додаток надійно захищений від зуму та небажаних жестів браузера.

---

## 2. Перелік завдань та файлів для модифікації

### 1) Оновлення `index.html` (Anti-Cache мета-теги та захист Viewport)
- **Файл:** `index.html`
- **Вимоги:**
  - Додати HTTP-заголовки заборони кешування в `<head>`:
    ```html
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    ```
  - Налаштувати жорсткий мобільний `viewport`, адаптований під Telegram WebApp (запобігає подвійному тапу, випадковому зумуванню та враховує «чубчик» на iPhone):
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    ```

### 2) Налаштування хешування бандла у `vite.config.ts`
- **Файл:** `vite.config.ts`
- **Вимоги:**
  - Додати конфігурацію `build.rollupOptions.output` із примусовим хешуванням чанків:
    ```typescript
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
    ```
  - Зберегти налаштування `server: { host: true, port: 5173, allowedHosts: true }`.

### 3) Створення файлу версіонування `src/constants/version.ts`
- **Файл:** `src/constants/version.ts`
- **Вимоги:**
  - Експортувати константу версії:
    ```typescript
    export const APP_VERSION = '1.0.0';
    ```
  - У `src/main.tsx` при ініціалізації виводити версію у консоль: `console.log('🚀 TMA Quiz Version:', APP_VERSION);`.

### 4) Відмовостійкість у `src/utils/telegram.ts`
- **Файл:** `src/utils/telegram.ts`
- **Вимоги:**
  - Перевірити всі методи взаємодії з `window.Telegram.WebApp`. Якщо додаток відкрито у звичайному браузері (поза Telegram), методи `HapticFeedback`, `setHeaderColor`, `BackButton` тощо мають безпечно ігноруватися або логуватися через optional chaining (`?.`), не викликаючи падіння застосунку (Uncaught TypeError).

---

## 3. Критерії приймання та перевірка (Verification)
1. Команда `npm run build` проходить без помилок компіляції та генерує хешовані файли у папку `dist/assets/`.
2. Додаток запускається локально (`npm run dev`) без помилок у консолі браузера.
3. Усі зміни мають бути атомарними — не зачіпати логіку кроків квізу та стилі карток.

---

## 4. Фіксація змін
Після виконання та верифікації надати звіт та команду:
`git add . && git commit -m "feat(hardening): apply anti-cache headers, chunk hashing and viewport protection" && git push origin main`
