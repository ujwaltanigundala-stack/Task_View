from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.init import init

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

init(app)

@app.get("/")
def home():
    return "Started...."