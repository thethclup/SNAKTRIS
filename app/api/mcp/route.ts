import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: "MCP server is active", version: "1.0.0" }, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params, id } = body;
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
          { name: "get_race_status", description: "Get the current status of the race" },
          { name: "start_race", description: "Start a new race" },
          { name: "get_leaderboard", description: "Gets the current highest score in the Snaktris game" },
          { name: "optimize_speed", description: "Optimize the speed of the snake/racer" },
          { name: "get_track_info", description: "Get information about the current track" }
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
      return NextResponse.json({ error: { code: -32601, message: "Method not found" } }, { status: 404 });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
