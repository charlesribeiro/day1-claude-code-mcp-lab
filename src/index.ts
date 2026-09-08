import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { initDb } from "./db.js";
import { server } from "./server.js";

async function main(): Promise<void> {
  initDb();

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal MCP server error:", error);
  process.exit(1);
});
