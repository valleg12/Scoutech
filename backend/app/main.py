from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .config.database import engine, get_db
from .models import base, player
from .services.auto_update import AutoUpdateService

# Création des tables
base.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ScouTech API")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service de mise à jour automatique
auto_update_service = None

@app.on_event("startup")
async def startup_event():
    global auto_update_service
    db = next(get_db())
    auto_update_service = AutoUpdateService(db)
    background_tasks = BackgroundTasks()
    await auto_update_service.start_update_scheduler(background_tasks)

# Endpoints pour la gestion des données
@app.post("/api/v1/update")
async def force_update(db: Session = Depends(get_db)):
    """Force une mise à jour immédiate des données"""
    if auto_update_service:
        await auto_update_service.force_update()
        return {"message": "Mise à jour forcée effectuée avec succès"}
    return {"message": "Service de mise à jour non disponible"}

@app.get("/api/v1/status")
async def get_status():
    """Obtient le statut de la dernière mise à jour"""
    if auto_update_service and auto_update_service.last_update:
        return {
            "last_update": auto_update_service.last_update,
            "next_update": auto_update_service.last_update + auto_update_service.update_interval
        }
    return {"message": "Aucune mise à jour effectuée"}