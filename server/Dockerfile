FROM python:3.9-slim-bullseye

ARG HOME_DIR=/app
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

COPY ./requirements/local.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . ${HOME_DIR}

EXPOSE ${PORT}

CMD alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port ${PORT}
