import Database from "better-sqlite3";

export type Priority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

const dbPath = process.env.DB_PATH ?? "tasks.db";
const db = new Database(dbPath);

export function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      priority TEXT NOT NULL
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
      status TEXT NOT NULL DEFAULT 'todo'
        CHECK (status IN ('todo', 'in_progress', 'done')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

export function createTask(
  title: string,
  description: string = "",
  priority: Priority
): Task {
  const now = new Date().toISOString();

  const result = db
    .prepare(`
      INSERT INTO tasks (
        title,
        description,
        priority,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, 'todo', ?, ?)
    `)
    .run(title, description, priority, now, now);

  return db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid) as Task;
}

export function listTasks(
  status?: TaskStatus,
  priority?: Priority
): Task[] {
  const conditions: string[] = [];
  const params: string[] = [];

  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }

  if (priority) {
    conditions.push("priority = ?");
    params.push(priority);
  }

  const where =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  return db
    .prepare(`
      SELECT *
      FROM tasks
      ${where}
      ORDER BY id DESC
    `)
    .all(...params) as Task[];
}

export function updateTask(
  taskId: number,
  status: TaskStatus
): Task | null {
  const now = new Date().toISOString();

  const result = db
    .prepare(`
      UPDATE tasks
      SET status = ?, updated_at = ?
      WHERE id = ?
    `)
    .run(status, now, taskId);

  if (result.changes === 0) {
    return null;
  }

  return db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(taskId) as Task;
}
