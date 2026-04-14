# Funkidz

Plateforme de reservation et gestion d animations pour enfants.

## Prerequis

- Docker
- Node.js 18+
- Python 3.11+

## Installation rapide

```bash
cp .env.example .env
docker-compose up --build
```

## Acces

- Frontend: http://localhost
- Backend API: http://localhost/api/
- Django Admin: http://localhost/django-admin/

## Commandes utiles

- Creer un superuser:
  ```bash
  docker-compose exec backend python manage.py createsuperuser
  ```
- Lancer les tests backend:
  ```bash
  docker-compose exec backend python manage.py test
  ```
- Lancer les tests frontend:
  ```bash
  cd frontend && npm run test
  ```

## Variables d environnement

- `SECRET_KEY`: cle secrete Django.
- `DEBUG`: active le mode debug (`True`/`False`).
- `ALLOWED_HOSTS`: liste des hotes autorises par Django.
- `DATABASE_URL`: URL complete de connexion Postgres.
- `DB_NAME`: nom de la base de donnees.
- `DB_USER`: utilisateur base de donnees.
- `DB_PASSWORD`: mot de passe base de donnees.
- `DB_HOST`: host base de donnees.
- `DB_PORT`: port base de donnees.
- `FRONTEND_URL`: URL frontend utilisee pour redirections/liens.
- `CORS_ALLOWED_ORIGINS`: origines autorisees en CORS.
- `ADMIN_REGISTRATION_KEY`: cle requise pour creer un compte admin via l inscription publique.
- `STRIPE_PUBLIC_KEY`: cle publique Stripe.
- `STRIPE_SECRET_KEY`: cle secrete Stripe.
- `STRIPE_WEBHOOK_SECRET`: secret de signature des webhooks Stripe.
- `EMAIL_HOST`: serveur SMTP.
- `EMAIL_PORT`: port SMTP.
- `EMAIL_HOST_USER`: compte SMTP.
- `EMAIL_HOST_PASSWORD`: mot de passe SMTP.
- `DEFAULT_FROM_EMAIL`: expediteur des e-mails applicatifs.
- `MEDIA_ROOT`: dossier de stockage des medias.
- `MEDIA_URL`: URL publique des medias.
- `REDIS_URL`: URL Redis (cache/Celery).
