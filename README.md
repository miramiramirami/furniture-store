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
