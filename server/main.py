from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import check_db
from config import get_settings


def start_application():
    app = FastAPI()
    check_db()
    return app


app = start_application()
settings = get_settings()
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"hello": "World"}
