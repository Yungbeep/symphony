import { NextRequest, NextResponse } from "next/server";
import { initializeProviders } from "@/lib/providers";
import { getModel } from "@/lib/models/catalog";
import { executeTask, streamTask } from "@/lib/orchestration/execute-task";

interface RequestBody {
  modelId: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}

export async function POST(req: NextRequest) {
  let body: RequestBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { modelId, messages } = body;

  if (!modelId || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "modelId (string) and messages (non-empty array) are required" },
      { status: 400 }
    );
  }

  await initializeProviders();

  const model = getModel(modelId);

  if (!model) {
    return NextResponse.json(
      { error: `Unknown modelId: ${modelId}` },
      { status: 400 }
    );
  }

  const wantStream = req.nextUrl.searchParams.get("stream") === "1";

  // ---- Streaming path ----
  if (wantStream) {
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamTask(model, messages)) {
            controller.enqueue(encoder.encode(JSON.stringify(chunk) + "\n"));
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: "error", message: msg }) + "\n")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  }

  // ---- Non-streaming path (unchanged) ----
  try {
    const message = await executeTask(model, messages);
    return NextResponse.json({ message });
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    console.error("[execute-task] Provider error:", detail);

    return NextResponse.json(
      { error: "Provider execution failed", detail },
      { status: 502 }
    );
  }
}