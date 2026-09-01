import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { MODEL_ID, SYSTEM_PROMPT } from "@/lib/ai/config";
import { estimateOrder } from "@/lib/ai/tools";
 
export const maxDuration = 30;
 
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
 
  const result = streamText({
    model: google(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { estimateOrder },
  });
 
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}