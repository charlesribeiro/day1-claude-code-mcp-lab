# Demo Walkthrough

## 1. MCP Server Discovery

From the project root:

    claude mcp list

Expected result:

    project-manager ... Connected

## 2. Claude Code MCP Workflow

Claude Code was started from the project root.

The following prompts were used:

    Create a task called "Set up CI/CD pipeline" with high priority

    List all tasks

    Update task 2 to in_progress

    Show me all high priority tasks that are still todo

Claude Code invoked the custom project-manager MCP tools.

## 3. SQLite Persistence

Persistence was verified directly with:

    sqlite3 tasks.db \
      "SELECT id,title,priority,status,created_at,updated_at FROM tasks ORDER BY id DESC;"

The rows reflected the same tasks created and updated through Claude Code.

## 4. Custom Commands

The following project commands were tested:

    /task-summary

and:

    /verify-project

`/task-summary` used the project-manager MCP tools to inspect tasks.

`/verify-project` returned a PASS report for typechecking, build, MCP configuration, tool definitions, and Git ignore behavior.

## 5. PostToolUse Hook

Claude Code was asked to edit a TypeScript file under `src/`.

The configured `PostToolUse` hook ran automatically and executed:

    npm run typecheck

The typecheck completed successfully.

## Result

The tested flow is:

    Claude Code
        |
        +-- CLAUDE.md context
        |
        +-- custom command
        |
        +-- MCP call
                |
                v
          project-manager
                |
                v
              SQLite

    Claude Code edit
        |
        v
    PostToolUse hook
        |
        v
    npm run typecheck
