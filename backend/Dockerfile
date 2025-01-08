FROM python:3.12.4-slim-bullseye

# Declare environment variables for the database
ARG DATABASE_NAME
ARG DATABASE_USER
ARG DATABASE_PASSWORD
ARG DATABASE_HOST
ARG DATABASE_PORT

ENV DATABASE_NAME=${DATABASE_NAME}
ENV DATABASE_USER=${DATABASE_USER}
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
ENV DATABASE_HOST=${DATABASE_HOST}
ENV DATABASE_PORT=${DATABASE_PORT}

# Install system dependencies required for poetry and Django
RUN apt-get update && apt-get install -y \
  gcc \
  libpq-dev \
  postgresql-client \
  vim \
  ssh \
  autossh \
  inotify-tools \
  curl \
  autoconf \
  automake \
  make \
  pkg-config \
  git \
  libgl1-mesa-glx \
  libglib2.0-0 \
  libxkbcommon-x11-0 \
  libqt5gui5 \
  libqt5core5a \
  libqt5widgets5 \
  libxcb-xinerama0

# Set the working directory
WORKDIR /opt/app

# Copy poetry files and install dependencies
COPY ./backend/pyproject.toml ./backend/poetry.lock /opt/app/

# Install dependencies with Poetry
RUN pip install poetry==1.3.1 && \
  poetry config virtualenvs.create false && \
  poetry install --no-dev --no-root

# Copy the rest of your backend code into the container
COPY ./backend /opt/app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/

# Set environment variables
ENV LD_LIBRARY_PATH=/usr/local/lib/

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entrypoint
CMD ["/usr/local/bin/docker-entrypoint.sh"]
