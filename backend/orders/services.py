from decimal import Decimal
from django.db import transaction
from users.models import User
from menu.models import MenuItem
from .models import Order, OrderItem
from notifications.email_service import (
    send_order_email,
    send_order_status_email,
    send_order_invoice_email,
)


@transaction.atomic
def place_order(user_id, table_number, items, payment_id=None):
    user = User.objects.filter(pk=user_id).first()
    if not user:
        raise ValueError("User not found")
    order = Order.objects.create(
        user=user,
        table_number=table_number,
        status="Pending",
        total_amount=Decimal("0"),
        payment_id=payment_id,
    )
    total = Decimal("0")
    created = []
    for req in items or []:
        mid = req.get("menuItemId")
        qty = int(req.get("quantity", 0))
        if not mid:
            continue
        if qty <= 0:
            raise ValueError("Quantity must be greater than 0")
        menu = MenuItem.objects.filter(pk=mid).first()
        if not menu:
            continue
        line = menu.price * qty
        created.append(
            OrderItem.objects.create(
                order=order,
                menu_item_id=menu.id,
                menu_item_name=menu.name,
                menu_item_price=menu.price,
                quantity=qty,
                line_total=line,
            )
        )
        total += line
    order.total_amount = total
    order.save(update_fields=["total_amount"])
    send_order_email(order)
    return order


def update_status(order_id, new_status):
    order = (
        Order.objects.select_related("user")
        .prefetch_related("items")
        .filter(pk=order_id)
        .first()
    )
    if not order:
        raise ValueError("Order not found")
    order.status = new_status
    order.save(update_fields=["status"])
    send_order_status_email(order)
    return order


def attach_payment(order_id, payment_id):
    order = Order.objects.filter(pk=order_id).first()
    if not order:
        raise ValueError("Order not found")
    order.payment_id = payment_id
    order.save(update_fields=["payment_id"])
    send_order_invoice_email(order)
    return order
