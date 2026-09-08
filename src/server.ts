import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  createTask,
  listTasks,
  updateTask,
  type Priority,
  type TaskStatus,
} from "./db.js";

export const server = new McpServer({
  name: "project-manager",
  version: "1.0.0",
});

server.tool(
  "create_task",
  "Create a new project task with a title, optional description, and priority. Use this when the user wants to add work to the project task list.",
  {
    title: z.string().min(1).describe("Task title"),
    description: z
      .string()
      .optional()
      .describe("Optional detailed description of the task"),
    priority: z
      .enum(["low", "medium", "high", "critical"])
      .describe("Task priority"),
  },
  async ({ title, description, priority }) => {
    const task = createTask(
      title,
      description ?? "",
      priority as Priority
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(task, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "list_tasks",
  "List project tasks, optionally filtering by status and/or priority. Use this when the user wants to inspect, search, or summarize existing tasks.",
  {
    status: z
      .enum(["todo", "in_progress", "done"])
      .optional()
      .describe("Optional task status filter"),
    priority: z
      .enum(["low", "medium", "high", "critical"])
      .optional()
      .describe("Optional task priority filter"),
  },
  async ({ status, priority }) => {
    const tasks = listTasks(
      status as TaskStatus | undefined,
      priority as Priority | undefined
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "update_task",
  "Update the status of an existing project task by numeric ID. Use this when work begins, completes, or otherwise changes state.",
  {
    id: z.number().int().positive().describe("Numeric task ID"),
    status: z
      .enum(["todo", "in_progress", "done"])
      .describe("New task status"),
  },
  async ({ id, status }) => {
    const task = updateTask(id, status as TaskStatus);

    if (!task) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: "Task not found",
                id,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(task, null, 2),
        },
      ],
    };
  }
);
