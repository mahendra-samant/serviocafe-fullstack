# ServioCafe Django Backend


## Implemented API compatibility

- `/api/users/register`
- `/api/users/login`
- `/api/users`
- `/api/users/{id}`
- `/api/users/role/{role}`
- `/api/users/{id}/password`
- `/api/admin/add-user`
- `/api/admin/staff`
- `/api/menu/all`
- `/api/menu/add`
- `/api/menu/update/{id}`
- `/api/menu/{id}`
- `/api/orders`
- `/api/orders/user/{userId}`
- `/api/orders/{orderId}/status`
- `/api/tables`, `/api/tables/all`, `/api/tables/available`
- `/api/tables/add`, `/api/tables/{id}`, `/api/tables/{id}/status`
- `/api/bookings/book`, `/api/bookings/{id}`, `/api/bookings/all`, `/api/bookings/user/{userId}`, `/api/bookings/table/{tableNumber}`
- `/api/bookings/tables/available`
- `/api/feedback/add`, `/api/feedback/all`, `/api/feedback/user/{userId}`, `/api/feedback/order/{orderId}`
- `/api/reports/add`, `/api/reports/all`
- `/api/payment/success`
- `/api/chat`

## Setup

1. Create PostgreSQL database `coffee_platform_db`.
2. Copy `.env.example` to `.env`.
3. Put your PostgreSQL password in `.env`.
4. Create/activate a Python virtual environment.
5. Install: `pip install -r requirements.txt`.
6. Run `python manage.py migrate`.
7. Create an admin: `python manage.py createsuperuser`.
8. Start: `python manage.py runserver 8080`.

## Gmail SMTP

Use a Gmail App Password in `EMAIL_HOST_PASSWORD`; do not put a normal Gmail password or API key in source code.

## Gemini

Set `GEMINI_API_KEY` in `.env` if the chat feature is needed. The frontend endpoint remains `/api/chat`.

## Media

Uploaded menu images are stored in `media/menu/` and served during development from `/media/`.

## Important migration note

The old Spring application used MySQL. This project uses PostgreSQL. The old Spring secrets are deliberately not copied into this project. Configure your own `.env` values.
