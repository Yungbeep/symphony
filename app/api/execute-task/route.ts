import { NextRequest, NextResponse } from "next/server";
import { initializeProviders } from "@/lib/providers";
import { getModel } from "@/lib/models/catalog";
import { executeTask } from "@/lib/orchestration/execute-task";

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