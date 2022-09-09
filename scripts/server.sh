#!/bin/bash

set -e
cd server

echo "Activating virtual environment"
source venv/bin/activate

echo "Running backend..."
uvicorn main:app --reload
