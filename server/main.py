from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from db.config import init_db

from user.api import user_router, auth_router
from projects.api import projects_router

init_db()
settings = get_settings()
app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(projects_router)


@app.get("/")
def home():
    return {"message": "Home"}
