# Furniture Store — Fullstack Application

## Полнофункциональное fullstack-приложение интернет-магазина мебели. Реализованы каталог товаров, категории, корзина, избранное, оформление заказов, аутентификация пользователей и панель администратора.

https://github.com/user-attachments/assets/f023ea0f-051b-4ef5-ae6b-bd5b4df001ce

## Стек технологий

### Backend

- FastAPI
- SQLAlchemy
- JWT (access / refresh tokens)
- Интеграция YooKassa

### Frontend

- React
- React Router
- Context API
- Fetch API

## Авторизация и защита роутов

**JWT-токены** для аутентификации и авторизации пользователей.

- **Access токен**:

  - Хранится в `localStorage`
  - Используется для доступа к защищённым роутам
  - Срок жизни короткий

- **Refresh токен**:
  - Хранится в HttpOnly cookie (недоступен через JavaScript)
  - Используется для получения нового access токена при его истечении
  - Срок жизни длинный

https://github.com/user-attachments/assets/d497652c-7527-4b4f-a10d-6d72dc4dfdaa

## Категории

https://github.com/user-attachments/assets/0488bc22-7f7d-46a8-8633-eb64f9e55f8c

## Добавление и удаление из избранного

https://github.com/user-attachments/assets/df530f1c-9519-4d7e-ad9b-c5b6cf3465d6

## Страница товара и корзина

- Переключение изображений
- Последние товары из той же категории
- Добавление в корзину

https://github.com/user-attachments/assets/73ffa3be-ca95-4302-8284-08d1ee1f89cc

## Создание заказа

- Создание заказа через корзину
- Оплата производится через интеграцию с юкасса
- Все заказы видны в личном кабинете

https://github.com/user-attachments/assets/6f7802c2-9024-4561-b5b6-199163815c3f

## Панель администратора

- Запросы защищены middleware`ом на бэкенде
- Страницы защищены внешне на фронтенде
- Админ может удалять, добавлять, изменять категории и продукты, а так же просматривать заказы

https://github.com/user-attachments/assets/a7851662-0948-4d91-b6e4-c19b9eb34a33
