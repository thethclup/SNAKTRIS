export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({ 
      status: "active",
      name: "SNAKTRIS Agent",
      message: "Snaktris AI Agent is running",
      version: "1.0.0" 
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const bodyText = await req.text();
      let body;
      try {
        body = JSON.parse(bodyText);
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON parsing" }), { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      return new Response(JSON.stringify({ 
        success: true,
        received: body,
        name: "SNAKTRIS Agent",
        status: "processed",
        version: "1.0.0"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal error" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
