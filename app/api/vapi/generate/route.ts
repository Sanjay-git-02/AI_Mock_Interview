import {generateObject} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/server";
import {z} from "zod";

export async function GET() {
    return Response.json({success: true, data: "Thank You"}, {status: 200});
}

export async function POST(request: Request) {
  const body = await request.json();

  const toolCall = body?.message?.toolCallList?.[0];
  if (!toolCall?.id || !toolCall?.function?.arguments) {
    return Response.json(
      { results: [{ toolCallId: toolCall?.id ?? "unknown", result: { success: false, error: "Invalid tool payload" } }] },
      { status: 200 }
    );
  }

  const toolCallId = toolCall.id;

  let args: any = {};
  try {
    args =
      typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
  } catch {
    return Response.json(
      { results: [{ toolCallId, result: { success: false, error: "Arguments JSON parse failed" } }] },
      { status: 200 }
    );
  }

  const { type, role, level, techstack, amount, userid } = args;

  try {
    if (!type || !role || !level || !techstack || !amount || !userid) {
      return Response.json(
        { results: [{ toolCallId, result: { success: false, error: "Missing required fields" } }] },
        { status: 200 }
      );
    }

    const techstackArr = String(techstack)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { object } = await generateObject({
      model: google("gemini-3-flash-preview"),
      schema: z.object({
        questions: z.array(z.string().min(1)).min(1),
      }),
      prompt: `
        Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstackArr.join(", ")}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return JSON that matches this schema:
        {"questions":["Question 1","Question 2","Question 3"]}
        `,
            });

    const interview = {
      role: role ?? "",
      type: type ?? "",
      level: level ?? "",
      techstack: techstackArr ?? [],
      questions: object?.questions ?? [],
      userId: userid ?? "",
      finalized: true,
      coverImage: getRandomInterviewCover() ?? "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json(
      {
        results: [
          {
            toolCallId,
            result: {
              success: true,
              interviewId: docRef.id,
              questions: object.questions,
            },
          },
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        results: [
          {
            toolCallId,
            result: { success: false, error: error?.message ?? "Server error" },
          },
        ],
      },
      { status: 200 }
    );
  }
}
