from fastapi import APIRouter, Header
from models.schemas import SigninSchema, SignupSchema, UsersSchema
import httpx

router = APIRouter(prefix="/authservice")

SPRING_URL="http://localhost:8001/"

@router.post("/signup")
async def signup(U: SignupSchema):
    async with httpx.AsyncClient() as client:
        response=await client.post(
            SPRING_URL+ "user/signup",
            json=U.model_dump()
        )
        return response.json()

@router.post("/signin")
async def signin(U: SigninSchema):
    async with httpx.AsyncClient() as client:
        response=await client.post(
            SPRING_URL+ "user/signin",
            # Support both old and updated Spring payload keys.
            json={"email": U.email, "username": U.email, "password": U.password},
        )
        return response.json()


@router.get("/uinfo")
async def uinfo(Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "user/uinfo",
            headers = {"Token": Token}
        )
    return response.json() 

@router.get("/profile")
async def profile(Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "user/profile",
            headers = {"Token": Token}
        )
    return response.json()

@router.get("/getallusers/{PAGE}/{SIZE}")
async def profile(PAGE: int, SIZE: int, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPRING_URL}user/getallusers/{PAGE}/{SIZE}",
            headers = {"Token": Token}
        )
    return response.json()

@router.get("/getuser/{ID}")
async def profile(ID: int, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SPRING_URL}user/getuser/{ID}",
            headers = {"Token": Token}
        )
    return response.json()

@router.post("/saveuser")
async def signin(U: UsersSchema, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPRING_URL + "user/saveuser",
            json=U.model_dump(),
            headers = {"Token": Token}
        )
    return response.json()

@router.put("/updateuser/{ID}")
async def signin(ID: int, U: UsersSchema, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.put(
            SPRING_URL + f"user/updateuser/{ID}",
            json=U.model_dump(),
            headers = {"Token": Token}
        )
    return response.json()

@router.delete("/deleteuser/{ID}")
async def signin(ID: int, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            SPRING_URL + f"user/deleteuser/{ID}",
            headers = {"Token": Token}
        )
    return response.json()