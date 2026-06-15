from fastapi import APIRouter, Header
from models.schemas import TeamSchema
import httpx

router = APIRouter(prefix="/teamservice")

SPRING_URL = "http://localhost:8001/"


@router.post("/save")
async def save_team(T: TeamSchema, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            SPRING_URL + "team/save",
            json=T.model_dump(),
            headers={"Token": Token}
        )

    return response.json()


@router.put("/update/{id}")
async def update_team(id: int, T: TeamSchema, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.put(
            SPRING_URL + f"team/update/{id}",
            json=T.model_dump(),
            headers={"Token": Token}
        )

    return response.json()


@router.get("/getall")
async def get_all_teams(Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "team/getall",
            headers={"Token": Token}
        )

    return response.json()


@router.get("/view")
async def get_team_view(Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "team/view",
            headers={"Token": Token}
        )

    return response.json()


@router.get("/query")
async def query_tasks(q: str = "", teamId: int | None = None, status: int | None = None, Token: str = Header(...)):
    params = {}
    if q:
        params["q"] = q
    if teamId is not None:
        params["teamId"] = teamId
    if status is not None:
        params["status"] = status

    async with httpx.AsyncClient() as client:
        response = await client.get(
            SPRING_URL + "team/query",
            params=params,
            headers={"Token": Token}
        )

    return response.json()


@router.delete("/delete/{id}")
async def delete_team(id: int, Token: str = Header(...)):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            SPRING_URL + f"team/delete/{id}",
            headers={"Token": Token}
        )

    return response.json()
