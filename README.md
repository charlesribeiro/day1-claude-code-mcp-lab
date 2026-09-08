# Day 1 — Claude Code Mastery & Context Engineering Lab

This repository implements a custom Model Context Protocol (MCP) server for project task management and integrates it with Claude Code.

## What This Project Demonstrates

- A custom MCP server built in TypeScript
- SQLite persistence
- Three MCP tools:
  - `create_task`
  - `list_tasks`
  - `update_task`
- Claude Code integration through `.mcp.json`
- A structured `CLAUDE.md`
- Project-scoped Claude Code permissions
- Two custom Claude commands
- A `PostToolUse` hook that typechecks TypeScript changes
- An end-to-end Claude Code -> MCP -> SQLite workflow

## Architecture

    Claude Code
        |
        | stdio / MCP
        v
    src/index.ts
        |
        v
    src/server.ts
        |
        v
    src/db.ts
        |
        v
    SQLite (tasks.db)

## Project Structure

    .
    ├── .claude/
    │   ├── commands/
    │   │   ├── task-summary.md
    │   │   └── verify-project.md
    │   ├── hooks/
    │   │   └── typecheck-on-ts-edit.sh
    │   └── settings.json
    ├── .mcp.json
    ├── CLAUDE.md
    ├── README.md
    ├── src/
    │   ├── db.ts
    │   ├── index.ts
    │   └── server.ts
    ├── package.json
    └── tsconfig.json

## MCP Tools

### create_task

Creates a task.

Inputs:

- `title`: string, required
- `description`: string, optional
- `priority`: `low | medium | high | critical`

### list_tasks

Lists tasks with optional filters.

Inputs:

- `status`: `todo | in_progress | done`
- `priority`: `low | medium | high | critical`

### update_task

Updates the status of an existing task.

Inputs:

- `id`: positive integer
- `status`: `todo | in_progress | done`

## SQLite Schema

Tasks contain:

- `id`
- `title`
- `description`
- `priority`
- `status`
- `created_at`
- `updated_at`

The database file is `tasks.db` and is intentionally ignored by Git.

## Setup

Install dependencies:

    npm install

Typecheck:

    npm run typecheck

Build:

    npm run build

Start the MCP server directly:

    npm run dev

The process will wait for MCP messages over stdio.

## Claude Code Integration

The project registers the MCP server in `.mcp.json`.

Verify it with:

    claude mcp list

Then start Claude Code from the repository root:

    claude

Claude Code should discover the `project-manager` MCP server.

## End-to-End Workflow

Example prompts used to verify the MCP integration:

    Create a task called "Set up CI/CD pipeline" with high priority

    List all tasks

    Update task 2 to in_progress

    Show me all high priority tasks that are still todo

These prompts exercise the full flow:

    Claude Code
    -> project-manager MCP
    -> MCP tool handler
    -> SQLite
    -> MCP result
    -> Claude Code

## Context Engineering

### CLAUDE.md

`CLAUDE.md` documents:

- project purpose
- architecture
- development commands
- MCP tool contracts
- database safety
- code-change workflow
- completion criteria

It is intentionally concise and structured rather than a large unorganized prompt.

### Custom Commands

Two project commands are included.

`/task-summary`

Uses the MCP tools to summarize the current task database.

`/verify-project`

Checks:

- TypeScript typechecking
- project build
- MCP configuration
- exact MCP tool contract
- Git ignore rules

### PostToolUse Hook

`.claude/hooks/typecheck-on-ts-edit.sh`

The hook runs after Claude edits or writes TypeScript files under `src/`.

It automatically executes:

    npm run typecheck

A successful typecheck exits normally. A failure returns the typecheck output to Claude.

## Grading Criteria Mapping

### Criterion 1 — Custom MCP Server + Workflow

Implemented by:

- `src/server.ts`
- `src/db.ts`
- `src/index.ts`
- `.mcp.json`

Verified through an end-to-end create/list/update workflow in Claude Code.

### Criterion 2 — Context Engineering Configuration

Implemented by:

- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/commands/task-summary.md`
- `.claude/commands/verify-project.md`
- `.claude/hooks/typecheck-on-ts-edit.sh`

The configuration was tested directly inside Claude Code.

## Verification

Run:

    npm run typecheck
    npm run build
    claude mcp list
    git status

Expected result:

- typecheck passes
- build passes
- `project-manager` is connected
- Git working tree is clean
