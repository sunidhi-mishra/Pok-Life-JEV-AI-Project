import { executeMatchPipeline } from "../../../lib/orchestration/orchestrator.ts";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Malformed request payload. JSON body expected.",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await executeMatchPipeline(body);

    return new Response(JSON.stringify(result.data), {
      status: result.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error occurred.",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
