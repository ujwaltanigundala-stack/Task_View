from typing import Optional

from pydantic import BaseModel

class SignupSchema(BaseModel):
    fullname: str
    phone: str
    email: str
    password: str


class SigninSchema(BaseModel):
    email: str
    password: str


class UsersSchema(BaseModel):
    fullname: str
    phone: str
    email: str
    password: str
    role: int
    status: int
    teamId: Optional[int] = None


class TaskSchema(BaseModel):
    taskname: str
    description: str
    date: str
    email: str
    status: Optional[int] = 0


class AssignmentSchema(BaseModel):
    task: dict
    user: dict
    assignedBy: str
    assignedAt: str
    status: int


class TeamSchema(BaseModel):
    teamName: str
    description: str = ""
    status: int = 1
