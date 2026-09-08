Verify the health of this repository.

Perform these checks:

1. Run `npm run typecheck`.
2. Run `npm run build`.
3. Confirm `.mcp.json` defines the `project-manager` MCP server.
4. Confirm the MCP implementation exposes exactly:
   - create_task
   - list_tasks
   - update_task
5. Confirm `tasks.db` is ignored by Git.

Do not modify project files.

Return a short PASS/FAIL report with evidence for each check.
