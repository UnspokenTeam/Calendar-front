# Calendar Frontend

###### Frontend для приложения Calendar

 Этот проект представляет собой веб-приложение календаря, разработанное с использованием фронтенд технологий. Он позволяет пользователям управлять своими событиями, предоставляя удобный интерфейс для просмотра и управления расписанием.


https://github.com/UnspokenTeam/Calendar-front/assets/160483228/5b15ff46-a5ea-4706-b560-fcf4d5897eeb


## Возможности

- Создание, редактирование и удаление событий в календаре.
- Отображение событий в виде списка или на календарной сетке.
- Уведомления о предстоящих событиях.

## Запуск

### Переменные окружения
- `NEXTAUTH_SECRET` - секрет для NEXTAUTH
- `NEXTAUTH_URL` - ссылка на сайт проекта
- `NEXT_PUBLIC_API_URL` - ссылка на api проекта

Пример [.env.example](.env.example)

### Без docker
```shell
npm run build
npm run start
```

### C docker
```shell
docker build -t calendar-frontend .
docker run -d -p 5000:3000 calendar-frontend
```
## Стек технологий

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
