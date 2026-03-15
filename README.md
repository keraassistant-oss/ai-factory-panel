# AI Factory Panel

Веб-панель для управления AI-разработкой проектов.

## Стек

- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **ORM:** Prisma
- **БД:** PostgreSQL
- **Auth:** NextAuth.js
- **Язык:** TypeScript

## Воронка разработки

```
INTAKE → DECOMPOSITION → DESIGN → ARCHITECTURE → DEV → QA → DELIVERY
```

## Установка и запуск

### 1. Клонирование

```bash
git clone https://github.com/keraassistant-oss/ai-factory-panel.git
cd ai-factory-panel
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск PostgreSQL

```bash
docker-compose up -d
```

### 4. Настройка переменных окружения

```bash
cp .env.example .env
# Или используйте существующий .env
```

### 5. Миграции базы данных

```bash
npx prisma migrate dev --name init
```

### 6. Запуск dev-сервера

```bash
npm run dev
```

Откройте http://localhost:3000

## Данные для входа

- **Email:** `admin@factory.ai`
- **Password:** `admin123`

## Структура проекта

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── login/             # Страница входа
│   ├── projects/          # Страницы проектов
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # Главная (список проектов)
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   ├── artifacts.tsx     # Компонент артефактов
│   ├── header.tsx        # Шапка
│   ├── pipeline.tsx      # Визуальная воронка
│   └── stage-actions.tsx # Действия с этапами
├── lib/                   # Утилиты
│   ├── prisma.ts         # Prisma клиент
│   └── types.ts          # TypeScript типы
├── prisma/
│   └── schema.prisma     # Схема БД
└── docker-compose.yml    # PostgreSQL контейнер
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для production |
| `npm run start` | Запуск production-сервера |
| `npx prisma studio` | Открыть Prisma Studio |
| `npx prisma migrate dev` | Применить миграции |

## Лицензия

MIT
