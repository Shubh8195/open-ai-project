import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!prompt)
      return new NextResponse("Replicate API Key is not configured", {
        status: 400,
      });

    const freeTrail = await checkApiLimit();

    if (!freeTrail) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt,
        },
      }
    );

    await increaseApiLimit();
    
    return NextResponse.json(response);
  } catch (err) {
    console.log("[VIDEO_ERROR]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}