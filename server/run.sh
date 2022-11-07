#!/bin/bash

echo "Applying Migrations"
alembic upgrade head

echo "Start FastAPI server"
uvicorn main:app --host 0.0.0.0
