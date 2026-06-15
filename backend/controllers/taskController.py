from fastapi import APIRouter, Header
from models.schemas import TaskSchema
import httpx

router = APIRouter(prefix="/taskservice")

SPRING_URL = "http://localhost:8001/"

@router.post("/addtask")
async def add_task(T: TaskSchema, Token: str = Header(...)):

    spring_payload = {
        "title": T.taskname,
        "description": T.description,
        "deadline": T.date,
        "email": T.email,
        "priority": "0",
        "status": str(T.status or 0)
    }

    async with httpx.AsyncClient() as client:

        # Log incoming Token and forwarded payload for debugging
        print(f"[PROXY] Forwarding addtask. Token={{}}".format(Token))
        print(f"[PROXY] Payload={{}}".format(spring_payload))

        response = await client.post(
            SPRING_URL + "task/addtask",
            json = spring_payload,
            headers = {"Token": Token}
        )

    return response.json()


@router.get("/getalltasks")
async def get_all_tasks(Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            SPRING_URL + "task/getalltasks",
            headers = {"Token": Token}
        )

    return response.json()


@router.get("/gettask/{id}")
async def get_task(id: int, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            SPRING_URL + f"task/gettask/{id}",
            headers = {"Token": Token}
        )

    return response.json()

@router.get("/getmytasks/{email}")
async def get_my_tasks(email: str, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            SPRING_URL + f"task/getmytasks/{email}",
            headers = {"Token": Token}
        )

    return response.json()

@router.get("/getusers")
async def get_users(Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            SPRING_URL + "task/getusers",
            headers = {"Token": Token}
        )

    return response.json()


@router.put("/updatetask/{id}")
async def update_task(id: int, T: TaskSchema, Token: str = Header(...)):

    spring_payload = {
        "title": T.taskname,
        "description": T.description,
        "deadline": T.date,
        "email": T.email,
        "priority": "0",
        "status": str(T.status or 0)
    }

    async with httpx.AsyncClient() as client:

        response = await client.put(
            SPRING_URL + f"task/updatetask/{id}",
            json = spring_payload,
            headers = {"Token": Token}
        )

    return response.json()


@router.delete("/deletetask/{id}")
async def delete_task(id: int, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.delete(
            SPRING_URL + f"task/deletetask/{id}",
            headers = {"Token": Token}
        )

    return response.json()
