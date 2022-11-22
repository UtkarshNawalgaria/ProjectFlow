FROM python:3.9-slim-bullseye

ARG HOME_DIR=/opt/app
ARG PORT

WORKDIR ${HOME_DIR}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV ENVIRONMENT dev
ENV TESTING 0


# Install required system dependencies
RUN apt-get update && apt-get install --no-install-recommends -y \
  # psycopg2 dependencies
  libpq-dev \
  # Translations dependencies
  gettext \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /opt/app/requirements.txt
COPY . ${HOME_DIR}

RUN python -m venv /opt/venv

RUN /opt/venv/bin/python -m pip install --upgrade pip
RUN /opt/venv/bin/pip install -r requirements.txt
RUN chmod +x /opt/app/entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT bash /opt/app/entrypoint.sh
