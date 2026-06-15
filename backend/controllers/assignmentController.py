from fastapi import APIRouter, Header
from models.schemas import AssignmentSchema
import httpx

router = APIRouter(prefix="/assignmentservice")

SPRING_URL = "http://localhost:8001/"

@router.post("/add")
async def add_assignment(A: AssignmentSchema, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.post(
            SPRING_URL + "assignment/add",
            json = A.model_dump(),
            headers = {"Token": Token}
        )

    return response.json()


@router.get("/getall")
async def get_all_assignments(Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            SPRING_URL + "assignment/getall",
            headers = {"Token": Token}
        )

    return response.json()


@router.get("/get/{id}")
async def get_assignment(id: int, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            SPRING_URL + f"assignment/get/{id}",
            headers = {"Token": Token}
        )

    return response.json()


@router.get("/status/{status}")
async def get_assignments_by_status(status: int, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            SPRING_URL + f"assignment/status/{status}",
            headers = {"Token": Token}
        )

    return response.json()


@router.post("/user")
async def get_assignments_by_user(data: dict, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.post(
            SPRING_URL + "assignment/user",
            json = data,
            headers = {"Token": Token}
        )

    return response.json()


@router.put("/update/{id}")
async def update_assignment(id: int, A: AssignmentSchema, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.put(
            SPRING_URL + f"assignment/update/{id}",
            json = A.model_dump(),
            headers = {"Token": Token}
        )

    return response.json()


@router.delete("/delete/{id}")
async def delete_assignment(id: int, Token: str = Header(...)):

    async with httpx.AsyncClient() as client:

        response = await client.delete(
            SPRING_URL + f"assignment/delete/{id}",
            headers = {"Token": Token}
        )

    return response.json()