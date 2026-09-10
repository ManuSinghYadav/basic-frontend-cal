from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db.postgres import verify_and_setup_infrastructure, add_transaction, display_live_db


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AddRequest(BaseModel):
    number: float
    name: str
    userid: str

@app.post("/add")
def add_number(data: AddRequest):
    # print(data.name)
    print(data.userid)
    print(data.number)

    verify_and_setup_infrastructure()
    add_transaction(data.userid, data.name, data.number)
    display_live_db(data.userid)

    return {
        "result": data.number + 1
    }

@app.get("/history")
def get_history(user_id: str):
    return display_live_db(user_id)
