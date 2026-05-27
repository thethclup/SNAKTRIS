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

  mcp.prompt(
    "snaktris_status",
    "Provides instructions to get the status of the Snaktris game",
    {},
    () => ({
      messages: [{
        role: "user",
        content: { type: "text", text: "Check Snaktris leaderboard and active runs." }
      }]
    })
  );

  mcp.resource(
    "snaktris_stats",
    "snaktris://stats",
    { description: "Global Snaktris stats" },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: JSON.stringify({ totalHits: 104200, activePlayers: 12 }),
      }]
    })
  );

  app.post("/api/mcp", express.json(), async (req, res) => {
    try {
      const { method, params, id } = req.body;
      let result = null;
      
      if (method === "initialize") {
        result = {
          protocolVersion: "2024-11-05",
          capabilities: {},
          serverInfo: {
            name: "Snaktris MCP Server",
            version: "1.0.0"
          }
        };
      } else if (method === "tools/list") {
        result = {
          tools: [
            { 
              name: "get_race_status", 
              description: "Get the current status of the race",
              inputSchema: { type: "object", properties: {} }
            },
            { 
              name: "start_race", 
              description: "Start a new race",
              inputSchema: { type: "object", properties: {} }
            },
            { 
              name: "get_leaderboard", 
              description: "Gets the current highest score in the Snaktris game",
              inputSchema: { type: "object", properties: { limit: { type: "number" } } }
            },
            { 
              name: "optimize_speed", 
              description: "Optimize the speed of the snake/racer",
              inputSchema: { type: "object", properties: {} }
            },
            { 
              name: "get_track_info", 
              description: "Get information about the current track",
              inputSchema: { type: "object", properties: {} }
            }
          ]
        };
      } else if (method === "tools/call") {
        const toolName = params.name;
        if (toolName === "get_leaderboard") {
          result = {
            content: [{ type: "text", text: JSON.stringify([{ name: 'vitalik.base.eth', score: 942000 }]) }]
          };
        } else {
          result = {
            content: [{ type: "text", text: `Mocked result for ${toolName}` }]
          };
        }
      } else if (method === "prompts/list") {
        result = { prompts: [] };
      } else if (method === "resources/list") {
        result = { resources: [] };
      } else {
        return res.status(404).json({ error: { code: -32601, message: "Method not found" } });
      }

      res.json({
        jsonrpc: "2.0",
        id,
        result
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid JSON" });
    }
  });

  app.get("/api/mcp", (req, res) => {
    res.json({ status: "MCP server is active", version: "1.0.0" });
  });

  // Agent API Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      status: "active",
      name: "SNAKTRIS Agent",
      message: "Snaktris AI Agent is running",
      version: "1.0.0" 
    });
  });

  app.post("/api/agent", express.json(), (req, res) => {
    res.json({ 
      success: true,
      received: req.body,
      name: "SNAKTRIS Agent",
      status: "processed",
      version: "1.0.0"
    });
  });

  app.get("/.well-known/agent-card.json", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", ".well-known", "agent-card.json"));
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
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
