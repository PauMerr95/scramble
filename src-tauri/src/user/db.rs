use crate::user::data;
use chrono::{DateTime, Utc};
use std::path::Path;
use std::sync::{Mutex, OnceLock};
use sqlx::{Connection, SqliteConnection};
use std::fmt;

pub struct ErrDB {
    pub id: u64,
    pub timestamp: DateTime<Utc>,
    pub desc: String,
}
impl fmt::Display for ErrDB {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Error #{}: {}", self.id, self.desc)
    }
}
impl ErrDB {
    pub fn new(desc: &str) -> ErrDB {
        Self {
            id: ErrID::instance().get_id(),
            timestamp: chrono::Utc::now(),
            desc: String::from(desc)
        }
    }
}

pub struct ErrID {
    counter: Mutex<u64>,
}

static ID_GEN_ERROR: OnceLock<ErrID> = OnceLock::new();

impl ErrID {
    pub fn instance() -> &'static ErrID {
        ID_GEN_ERROR.get_or_init(|| ErrID {
            counter: Mutex::new(0)
        })
    }
    pub fn get_id(&self) -> u64 {
    let mut id = self.counter.lock().unwrap();
    *id += 1;
    *id
    } 
}

pub async fn get_user_data(path: &Path) -> Result<data::UserInfo, ErrDB> {
    if let Ok(conn) = open_db(path).await {
        todo!();
    } else {
        Err(ErrDB::new("Could not retrieve user information from Database."))
    }
}

pub async fn open_db(path: &Path) -> Result<SqliteConnection, ErrDB> {
    SqliteConnection::connect(path.to_str().unwrap())
        .await
        .map_err(|_| ErrDB::new("Could not open specified User Database"))
}
pub async fn close_db(conn: SqliteConnection) -> Result<(), ErrDB>{
    conn.close().await
        .map_err(|_| ErrDB::new("Failed to close User Database properly"))
}
pub async fn create_db(path: &Path) -> Result<(), ErrDB> {
    if path.exists() {
        return Err(ErrDB::new("Tried to create an already existing User Database."));
    }
    let mut conn = open_db(path).await?;
    let _ = sqlx::raw_sql("
        CREATE TABLE users(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            encrypted_key TEXT,
            last_session_path TEXT,
            created_at TEXT,
            updated_at TEXT
        );
        CREATE TABLE errors(
            id INTEGER PRIMARY KEY,
            type TEXT NOT NULL,
            triggered_at TEXT,
            description TEXT NOT NULL
        );")
        .execute(&mut conn)
        .await
        .map_err(|_| ErrDB::new("Failed to create tables in Database."));
    close_db(conn).await
}

