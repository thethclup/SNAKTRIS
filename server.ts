import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Setup MCP Server
  const mcp = new McpServer({
    name: "Snaktris MCP Server",
    version: "1.0.0"
  });

  // Example Tool for MCP
  mcp.tool(
    "get_leaderboard",
    "Gets the current highest score in the Snaktris game",
    {
      limit: z.number().optional().describe("Number of top scores to return")
    },
    async ({ limit }) => {
      // Mocked response, this would connect to the database / smart contract ideally
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify([
               { name: 'vitalik.base.eth', score: 942000 },
               { name: 'ox_snaker.base', score: 812400 },
            ].slice(0, limit || 10))
          }
        ]
      };
    }
  );

  // MCP SSE Endpoints
  let transport: SSEServerTransport;
  
  app.get("/api/mcp", async (req, res) => {
     transport = new SSEServerTransport("/api/mcp/message", res);
     await mcp.connect(transport);
  });

  app.post("/api/mcp/message", express.json(), async (req, res) => {
     if (transport) {
       await transport.handlePostMessage(req, res);
     } else {
       res.status(500).send("Transport not initialized");
     }
  });

  // Agent API Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      status: "active",
      message: "Snaktris AI Agent is running"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve the public folder and dist
    app.use(express.static(distPath));
    app.use(express.static(path.join(process.cwd(), 'public')));
    
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
