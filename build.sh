#!/bin/bash
# Exit on any error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Ensure gunicorn is explicitly installed (just in case)
pip install gunicorn==21.2.0

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput
