#!/bin/bash

SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-"utkarsh.n3@olivecloud.in"}
APP_PORT=${PORT:-8000}
ENV_MODE=${ENV_MODE:-production}

cd /opt/app/

echo "running all migrations"
/opt/venv/bin/python manage.py collectstatic --noinput
/opt/venv/bin/python manage.py migrate

echo "Running django server in $ENV_MODE mode"

if [ $ENV_MODE == "local" ]; then
    /opt/venv/bin/python manage.py runserver 0.0.0.0:$APP_PORT
else
    /opt/venv/bin/gunicorn --worker-tmp-dir /dev/shm --access-logfile=- config.wsgi --bind 0.0.0.0:$APP_PORT
fi
