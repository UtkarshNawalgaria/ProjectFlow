#!/bin/bash

set -e
cd server

echo "Activating virtual environment"
source venv/bin/activate

echo "Apply Migrations"
alembic upgrade head

echo "Running backend..."
uvicorn main:app --reload --host 0.0.0.0
