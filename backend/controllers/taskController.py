from fastapi import APIRouter, Header
from models.schemas import TaskSchema
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/taskservice")

TASKSERVICE_URL = os.getenv("TASKSERVICE_URL", "http://localhost:8002/")
SPRING_URL = "http://localhost:8001/"

@router.post("/addtask")
async def add_task(T: TaskSchema, Token: str = Header(...)):

    payload = {
        "title": T.taskname,
        "description": T.description,
        "deadline": T.date,
        "assignedto": T.userid,
        "priority": 0,
        "status": T.status or 0
    }

    async with httpx.AsyncClient() as client:

        # Log incoming Token and forwarded payload for debugging
        print(f"[PROXY] Forwarding addtask. Token={{}}".format(Token))
        print(f"[PROXY] Payload={{}}".format(payload))

        response = await client.post(
            TASKSERVICE_URL + "task/createtask",
            json=payload,
            headers={"Token": Token}
        )

    return response.json()


@router.get("/getalltasks")
async def get_all_tasks(Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            TASKSERVICE_URL + "task/getalltasks/1/100",
            headers={"Token": Token}
        )

    return response.json()


@router.get("/gettask/{id}")
async def get_task(id: str, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            TASKSERVICE_URL + f"task/gettask/{id}",
            headers={"Token": Token}
        )

    return response.json()

@router.get("/getmytasks/{email}")
async def get_my_tasks(email: str, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            TASKSERVICE_URL + "task/mytasks/1/100",
            headers={"Token": Token}
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
async def update_task(id: str, T: TaskSchema, Token: str = Header(...)):

    payload = {
        "title": T.taskname,
        "description": T.description,
        "deadline": T.date,
        "assignedto": T.userid,
        "priority": 0,
        "status": T.status or 0
    }

    async with httpx.AsyncClient() as client:

        response = await client.put(
            TASKSERVICE_URL + f"task/updatetask/{id}",
            json=payload,
            headers={"Token": Token}
        )

    return response.json()


@router.delete("/deletetask/{id}")
async def delete_task(id: str, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.delete(
            TASKSERVICE_URL + f"task/deletetask/{id}",
            headers={"Token": Token}
        )

    return response.json()
