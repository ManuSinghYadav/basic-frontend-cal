from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions

from db.postgres import verify_and_setup_infrastructure, add_transaction, display_live_db
from config.settings import settings


# Clerk auth ------
clerk_sdk = Clerk(bearer_auth=settings.clerk_secret_key)

def verify_clerk_token(request: Request):
    request_state = clerk_sdk.authenticate_request(
        request,
        AuthenticateRequestOptions(),
    )

    if not request_state.is_signed_in:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return request_state.payload  # contains user info, e.g. sub = user_id

# ------


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


class AddRequest(BaseModel):
    number: float

@app.post("/add")
def add_number(data: AddRequest, auth=Depends(verify_clerk_token),):
    # print(auth)
    # print("User id:", auth["sub"])
    # print(data.number)

    verify_and_setup_infrastructure()
    add_transaction(auth["sub"], data.number)
    display_live_db(auth["sub"])

    return {
        "result": data.number + 1
    }

@app.get("/history")
def get_history(auth=Depends(verify_clerk_token),):
    return display_live_db(auth["sub"])
