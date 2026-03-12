import Database from 'better-sqlite3';

const db = new Database('codepulse.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT 'New Chat',
    messages TEXT DEFAULT '[]',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT 'Untitled Snippet',
    code TEXT NOT NULL,
    language TEXT DEFAULT 'plaintext',
    tags TEXT DEFAULT '[]',
    description TEXT DEFAULT '',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT 'Untitled Template',
    prompt TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    variables TEXT DEFAULT '[]',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    theme TEXT DEFAULT 'dark',
    language TEXT DEFAULT 'en',
    notifications INTEGER DEFAULT 1,
    autoSync INTEGER DEFAULT 1,
    syncInterval INTEGER DEFAULT 5,
    defaultBranch TEXT DEFAULT 'main'
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    totalRequests INTEGER DEFAULT 0,
    totalSyncs INTEGER DEFAULT 0,
    lastSyncTime TEXT,
    requestHistory TEXT DEFAULT '[]'
  );

  -- Insert default settings if not exists
  INSERT OR IGNORE INTO settings (id) VALUES (1);
  INSERT OR IGNORE INTO analytics (id) VALUES (1);
`);

export default db;
