from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

def _send_html_email(subject, template_name, context, recipient_list):
    html_message = render_to_string(template_name, context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        recipient_list,
        html_message=html_message,
        fail_silently=False,
    )

def send_booking_received(booking):
    subject = f"Réservation reçue — #{booking.booking_number}"
    context = {'booking': booking}
    _send_html_email(subject, 'emails/booking_received.html', context, [booking.user.email])

def send_booking_confirmed(booking):
    subject = f"Réservation confirmée — #{booking.booking_number}"
    context = {'booking': booking}
    _send_html_email(subject, 'emails/booking_confirmed.html', context, [booking.user.email])

def send_payment_receipt(booking, payment):
    subject = f"Reçu de paiement — #{booking.booking_number}"
    context = {'booking': booking, 'payment': payment}
    _send_html_email(subject, 'emails/payment_receipt.html', context, [booking.user.email])

def send_payment_failed(booking):
    subject = f"Échec du paiement — #{booking.booking_number}"
    context = {'booking': booking}
    _send_html_email(subject, 'emails/payment_failed.html', context, [booking.user.email])

def send_assignment_notification(assignment):
    subject = f"Nouvelle mission — #{assignment.booking.booking_number}"
    context = {'assignment': assignment}
    # assignment.animateur is a Profile, linked to user
    _send_html_email(subject, 'emails/assignment_notification.html', context, [assignment.animateur.user.email])

def send_assignment_response(assignment):
    status = "acceptée" if assignment.status == 'ACCEPTED' else "refusée"
    subject = f"Mission {status} — #{assignment.booking.booking_number}"
    context = {'assignment': assignment}
    # Send to admin email (could be a setting or all admins)
    # Using a placeholder or settings.ADMIN_EMAIL if it exists
    admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@funkidz.com')
    _send_html_email(subject, 'emails/assignment_response.html', context, [admin_email])
