from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AddRequest(BaseModel):
    number: float


@app.post("/add")
def add_number(data: AddRequest):
    return {
        "result": data.number + 1
    }