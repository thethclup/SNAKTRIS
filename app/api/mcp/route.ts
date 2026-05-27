import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ status: "MCP server is active", version: "1.0.0" }, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
}

async function handleMcpRequest(reqBody: any) {
  const { method, params, id } = reqBody;
  let result = null;

  if (method === "initialize") {
    result = {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {}
      },
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
    const toolName = params?.name;
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
    throw new Error("Method not found");
  }

  return {
    jsonrpc: "2.0",
    id,
    result
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Handle JSON-RPC batch requests
    let responseBody;
    if (Array.isArray(body)) {
      responseBody = [];
      for (const reqBody of body) {
        try {
          responseBody.push(await handleMcpRequest(reqBody));
        } catch (e) {
          responseBody.push({ jsonrpc: "2.0", id: reqBody.id, error: { code: -32601, message: "Method not found" } });
        }
      }
    } else {
      try {
        responseBody = await handleMcpRequest(body);
      } catch (e) {
        responseBody = { jsonrpc: "2.0", id: body.id, error: { code: -32601, message: "Method not found" } };
      }
    }

    return NextResponse.json(responseBody, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON or internal error" }, { status: 400 });
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
