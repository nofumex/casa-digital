# Инструкция по обновлению на VPS

## Файлы, которые нужно обновить на сервере:

### 1. API Endpoints (критично для работы админ-панели):
```
app/api/admin/update-pricing/route.ts
app/api/admin/update-home/route.ts
app/api/admin/update-about/route.ts
app/api/admin/update-blog/route.ts
app/api/admin/update-cases/route.ts
app/api/admin/update-contacts/route.ts
app/api/admin/update-faq/route.ts
app/api/admin/update-policies/route.ts
app/api/admin/update-services/route.ts
```

### 2. Страница Pricing (для отображения актуальных данных):
```
app/(site)/pricing/page.tsx
```

### 3. Опционально (не критично, но полезно):
```
.gitignore
README.md
```

## Команды для обновления на VPS:

### Вариант 1: Через git pull (рекомендуется)

```bash
# Перейти в директорию проекта
cd /path/to/casa-digital

# Получить последние изменения
git pull origin main

# Пересобрать проект
npm run build

# Перезапустить приложение
pm2 restart casa-digital
# или если используете другой способ:
# systemctl restart casa-digital
# или просто перезапустите процесс Node.js
```

### Вариант 2: Ручное обновление файлов

Если git pull не работает, скопируйте эти файлы вручную:

```bash
# 1. Обновить все API endpoints
# Скопируйте содержимое из GitHub:
# https://github.com/nofumex/casa-digital/tree/main/app/api/admin

# 2. Обновить страницу pricing
# Скопируйте файл:
# https://github.com/nofumex/casa-digital/blob/main/app/(site)/pricing/page.tsx

# 3. Пересобрать и перезапустить
npm run build
pm2 restart casa-digital
```

## Проверка прав на запись

Убедитесь, что у приложения есть права на запись в `public/cms/`:

```bash
chmod -R 755 public/cms/
# или
chown -R www-data:www-data public/cms/
# или если используете другого пользователя:
chown -R node:node public/cms/
```

## Проверка после обновления

1. Откройте админ-панель: `https://casadigital.ru/admin`
2. Попробуйте сохранить изменения в Pricing
3. Проверьте, что на странице `/pricing` отображаются новые данные
4. Проверьте логи приложения: `pm2 logs casa-digital`

## Если что-то не работает:

1. Проверьте логи: `pm2 logs casa-digital --lines 50`
2. Убедитесь, что переменные окружения установлены
3. Проверьте права на запись: `ls -la public/cms/`
4. Перезапустите приложение: `pm2 restart casa-digital`

