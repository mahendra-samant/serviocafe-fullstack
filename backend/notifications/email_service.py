from pathlib import Path
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor

_pool = ThreadPoolExecutor(max_workers=4)


def _send(to, subject, html, attachments=None):
    if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD or not to:
        return
    try:
        msg = EmailMultiAlternatives(subject, "", settings.DEFAULT_FROM_EMAIL, [to])
        msg.attach_alternative(html, "text/html")
        for name, data, mime in attachments or []:
            msg.attach(name, data, mime)
        msg.send(fail_silently=True)
    except Exception:
        pass


def async_send(*args, **kwargs):
    _pool.submit(_send, *args, **kwargs)


def template(name, context):
    p = settings.BASE_DIR / "templates" / name
    if p.exists():
        return (
            p.read_text(encoding="utf-8")
            .replace("{{name}}", str(context.get("name", "")))
            .replace("{{totalAmount}}", str(context.get("totalAmount", "")))
            .replace("{{items}}", str(context.get("items", "")))
            .replace("{{tableNumber}}", str(context.get("tableNumber", "")))
            .replace("{{bookingTime}}", str(context.get("bookingTime", "")))
            .replace("{{people}}", str(context.get("people", "")))
            .replace("{{status}}", str(context.get("status", "")))
            .replace("{{role}}", str(context.get("role", "")))
            .replace("{{email}}", str(context.get("email", "")))
            .replace("{{password}}", str(context.get("password", "")))
        )
    return "<p>Hello " + str(context.get("name", "")) + "</p>"


def send_registration_email(user):
    async_send(
        user.email,
        "Welcome to ServioCafe!",
        template("registration.html", {"name": user.name}),
    )


def send_staff_welcome_email(user, password):
    async_send(
        user.email,
        "Your Account Access – " + user.role,
        template(
            "staff_welcome.html",
            {
                "name": user.name,
                "role": user.role,
                "email": user.email,
                "password": password,
            },
        ),
    )


def send_order_email(order):
    items = "".join(
        f"<li>{i.menu_item_name} (x{i.quantity}) - ₹{i.line_total}</li>"
        for i in order.items.all()
    )
    async_send(
        order.user.email,
        "Your Coffee Order Confirmation",
        template(
            "order_placed.html",
            {
                "name": order.user.name,
                "totalAmount": order.total_amount,
                "items": items,
            },
        ),
    )


def send_booking_email(booking):
    async_send(
        booking.user.email,
        "Table Booking Confirmation",
        template(
            "table-booking.html",
            {
                "name": booking.user.name,
                "tableNumber": booking.table.table_number,
                "bookingTime": booking.booking_time,
                "people": booking.number_of_people,
            },
        ),
    )


def send_order_status_email(order):
    items = "".join(
        f"<tr><td>{i.menu_item_name}</td><td>{i.quantity}</td><td>₹{i.line_total}</td></tr>"
        for i in order.items.all()
    )
    async_send(
        order.user.email,
        "Your Order Status Updated",
        template(
            "order_status.html",
            {"name": order.user.name, "status": order.status, "items": items},
        ),
    )


def invoice_pdf(order):
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4)
    styles = getSampleStyleSheet()
    story = [
        Paragraph(f"Coffee Bean - Invoice #{order.id}", styles["Title"]),
        Paragraph(f"Customer: {order.user.name}", styles["Normal"]),
    ]
    data = [["Item", "Qty", "Price", "Total"]]
    for i in order.items.all():
        data.append(
            [
                i.menu_item_name,
                str(i.quantity),
                f"₹{i.menu_item_price}",
                f"₹{i.line_total}",
            ]
        )
    data.append(["", "", "Total", f"₹{order.total_amount}"])
    t = Table(data)
    t.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ]
        )
    )
    story.append(t)
    doc.build(story)
    return buf.getvalue()


def send_order_invoice_email(order):
    html = f"<h2>Payment Confirmation & Invoice – Order #{order.id}</h2><p>Hello {order.user.name}, your payment was successful.</p><p>Total: ₹{order.total_amount}</p>"
    async_send(
        order.user.email,
        "☕ Payment Confirmation & Invoice – Order #" + str(order.id),
        html,
        [(f"Invoice_{order.id}.pdf", invoice_pdf(order), "application/pdf")],
    )
