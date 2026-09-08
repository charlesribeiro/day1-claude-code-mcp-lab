# Project Manager MCP Lab

## Purpose

This repository implements a custom Model Context Protocol (MCP) server for
project task management.

The server exposes exactly three project-management tools:

- `create_task`
- `list_tasks`
- `update_task`

Tasks are persisted in SQLite.

## Architecture

Claude Code
  -> MCP stdio transport
  -> src/index.ts
  -> src/server.ts
  -> src/db.ts
  -> SQLite (`tasks.db`)

### Files

- `src/index.ts` — stdio MCP entrypoint
- `src/server.ts` — MCP server and tool definitions
- `src/db.ts` — SQLite persistence layer
- `.mcp.json` — Claude Code MCP registration
- `.claude/` — Claude Code project configuration

## Development Commands

Install dependencies:

    npm install

Run the MCP server:

    npm run dev

Typecheck:

    npm run typecheck

Build:

    npm run build

## MCP Tool Contract

### create_task

Use when the user wants to create a project task.

Required:
- `title`: non-empty string
- `priority`: `low | medium | high | critical`

Optional:
- `description`: string

New tasks begin with status `todo`.

### list_tasks

Use when the user wants to inspect or search tasks.

Optional filters:
- `status`: `todo | in_progress | done`
- `priority`: `low | medium | high | critical`

Do not reproduce task filtering in application code when this MCP tool can
perform the requested filtering directly.

### update_task

Use when the user wants to change an existing task's status.

Required:
- `id`: positive integer
- `status`: `todo | in_progress | done`

Do not invent task IDs. Use `list_tasks` first when the target task is
ambiguous.

## Working Rules

Before changing TypeScript code:

1. Read the relevant existing file.
2. Preserve the three-tool MCP contract unless the task explicitly requests
   an extension.
3. Keep database operations in `src/db.ts`.
4. Keep MCP definitions and handlers in `src/server.ts`.
5. Keep transport/bootstrap logic in `src/index.ts`.

After changing TypeScript code:

1. Run `npm run typecheck`.
2. Run `npm run build`.
3. Report failures rather than claiming success.

## Database Safety

`tasks.db` is runtime data and must not be committed.

Do not perform destructive database operations unless explicitly requested.

The current project-management MCP contract does not expose a delete tool.

## Completion Criteria

A code change is complete when:

- TypeScript typechecking passes.
- The project builds successfully.
- MCP behavior remains consistent with the documented tool contract.
- Relevant documentation is updated when behavior changes.
