# Crypto Dashboard

A responsive cryptocurrency market dashboard built with React, TypeScript, Vite,
Tailwind CSS, Axios, and Recharts. Market data comes from the public CoinGecko
API through the included read-only API proxy.

## Возможности

- Топ-10 криптовалют по рыночной капитализации
- Глобальная капитализация рынка, объём торгов и доминирование Bitcoin
- Адаптивная таблица рынка и мобильная навигация
- Страницы деталей монет с семидневным графиком
- Watchlist с сохранением в `localStorage`
- Отдельные состояния загрузки, ошибок и повторной попытки
- Короткое кеширование ответов API proxy для снижения нагрузки на CoinGecko

## Локальный запуск

Требования: Node.js 20 и npm.

```bash
npm install
npm run dev
```

Команда `npm run dev` запускает frontend на
`http://localhost:5173` и API proxy на `http://localhost:8080`.

Для отдельных процессов доступны:

```bash
npm run build
npm run preview
npm run start
npm run typecheck
```

`npm run start` запускает собранный API proxy. Frontend использует `/api/market`
в режиме разработки через proxy Vite.

## Деплой на Vercel

Frontend можно развернуть как Vite-приложение:

1. Создайте проект Vercel из этого репозитория.
2. Укажите Node.js 20.
3. Используйте команду сборки `npm run build:frontend`.
4. Укажите output directory `dist`.
5. Разверните API proxy отдельно как Node.js-сервис и настройте reverse proxy
   для `/api/*` на этот сервис.

Для локального запуска API на другом адресе можно добавить
`VITE_API_BASE_URL` и обновить frontend-конфигурацию под этот публичный URL.
Без этой переменной frontend использует same-origin путь `/api/market`.

## Источник данных

Данные предоставляются [CoinGecko](https://www.coingecko.com/en/api).
Доступность публичного API и его лимиты могут меняться, а цены могут
отображаться с задержкой.