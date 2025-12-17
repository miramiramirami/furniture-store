from app.core.database import SessionLocal

def init_database():
    db = SessionLocal()
    db.close()

if __name__ == "__main__":
    init_database()