from .authenticationController import router as AuthenticationRouter
from .taskController import router as TaskRouter
from .assignmentController import router as AssignmentRouter
from .teamController import router as TeamRouter

def init(app):

    app.include_router(AuthenticationRouter)
    app.include_router(TaskRouter)
    app.include_router(AssignmentRouter)
    app.include_router(TeamRouter)
