# Миграция с Vite на Next.js

## Выполненные изменения

### 1. Конфигурация проекта

- ✅ Заменен Vite на Next.js 15 (App Router)
- ✅ Обновлен `package.json` с новыми скриптами
- ✅ Создан `next.config.mjs` с настройками для SCSS, SVG, и API proxy
- ✅ Обновлен `tsconfig.json` для Next.js

### 2. Структура проекта

- ✅ Создана структура `src/app/` (App Router)
- ✅ Перенесены все страницы в соответствующие директории
- ✅ Создан корневой `layout.tsx` и `providers.tsx`

### 3. Роутинг

**Старая структура (React Router):**

```
/                    -> Home
/settings/*          -> Settings
/wheel               -> Wheel
/history             -> History
/help                -> Help
/statistic           -> Statistic
/stopwatch           -> Stopwatch
/requests            -> Requests
/logout              -> Logout
/chatWheel/:channel  -> Chat Wheel
/twitch/redirect     -> Twitch Auth
/da/redirect         -> DA Auth
/aukus/redirect      -> Aukus Auth
```

**Новая структура (Next.js App Router):**

```
src/app/page.tsx                      -> Home (/)
src/app/settings/[[...slug]]/page.tsx -> Settings (/settings/*)
src/app/wheel/page.tsx                -> Wheel (/wheel)
src/app/history/page.tsx              -> History (/history)
src/app/help/page.tsx                 -> Help (/help)
src/app/statistic/page.tsx            -> Statistic (/statistic)
src/app/stopwatch/page.tsx            -> Stopwatch (/stopwatch)
src/app/requests/page.tsx             -> Requests (/requests)
src/app/logout/page.tsx               -> Logout (/logout)
src/app/chatWheel/[channel]/page.tsx  -> Chat Wheel (/chatWheel/:channel)
src/app/twitch/redirect/page.tsx      -> Twitch Auth
src/app/da/redirect/page.tsx          -> DA Auth
src/app/aukus/redirect/page.tsx       -> Aukus Auth
```

### 4. Изменения в коде

#### Замены API:

- `import.meta.env.MODE` → `process.env.NODE_ENV`
- `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`
- `useLocation()` (react-router) → `usePathname()` (next/navigation)
- `useNavigate()` → `useRouter()` (next/navigation)
- `<Link to={}>` → `<Link href={}>` (next/link)
- `<Navigate to={}>` → `redirect()` или `router.push()`

#### Client Components:

Все компоненты, использующие:

- React hooks (useState, useEffect, etc.)
- Browser APIs (window, document, localStorage, etc.)
- Event listeners
- Redux hooks (useSelector, useDispatch)

Должны иметь `'use client'` в начале файла.

### 5. Redux

- ✅ Перенесен store в `src/app/providers.tsx` как Client Component
- ✅ Middleware сохранены (sortSlots, saveSlots)
- ✅ Обработка `window.onbeforeunload` адаптирована для SSR

### 6. Стили

- ✅ SCSS работает из коробки
- ✅ Mantine настроен через providers
- ✅ MUI (Material-UI) настроен через ThemeWrapper

### 7. i18n

- ✅ i18next работает на клиенте
- ✅ Заменены environment variables

## Как запустить

### Установка зависимостей:

```bash
yarn install
# или
npm install
```

### Запуск dev-сервера:

```bash
yarn dev
# или
npm run dev
```

Приложение будет доступно на http://localhost:3000

### Сборка для production:

```bash
yarn build
yarn start
```

## Environment Variables

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DOCS_BASE_URL=/docs
```

## Что осталось сделать

### Критично:

1. **Проверить все компоненты на использование browser APIs без проверок**

   - Найти использование `window`, `document`, `localStorage` без проверки `typeof window !== 'undefined'`
   - Добавить `'use client'` где необходимо

2. **Тестирование всех страниц и функционала**

   - Аукцион
   - Колесо фортуны
   - Интеграции (Twitch, DA, DonatePay)
   - Настройки
   - История
   - Статистика

3. **API прокси**
   - Настроено через `next.config.mjs` rewrites
   - Проверить работу всех API endpoints

### Опционально:

1. **SEO оптимизация**

   - Добавить метаданные для каждой страницы
   - Настроить `robots.txt` и `sitemap.xml`

2. **Performance**

   - Использовать `next/image` вместо `<img>`
   - Настроить code splitting
   - Проверить bundle size

3. **Документация VitePress**
   - Оставлена отдельно, можно запускать через `yarn docs:dev`

## Известные проблемы

### 1. React Router → Next.js Navigation

Некоторые компоненты могут использовать:

- `useLocation()` - заменить на `usePathname()`, `useSearchParams()`
- `useNavigate()` - заменить на `useRouter()` из `next/navigation`
- `<Navigate />` - заменить на `redirect()` или `router.push()`

### 2. Client-only код

Компоненты, использующие browser APIs, должны:

```tsx
'use client';

import { useEffect } from 'react';

export default function MyComponent() {
  useEffect(() => {
    // Безопасно использовать window здесь
    if (typeof window !== 'undefined') {
      // ...
    }
  }, []);
}
```

### 3. Import paths

Все импорты с алиасами (@components, @utils, etc.) настроены в `tsconfig.json` и должны работать.

## Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

## Команды

```bash
# Разработка
yarn dev

# Сборка
yarn build

# Запуск production
yarn start

# Линтинг
yarn lint

# Проверка типов
yarn type-check

# Документация (VitePress)
yarn docs:dev
yarn docs:build
```
