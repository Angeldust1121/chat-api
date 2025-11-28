import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(message);
    const text = result.response.text();
    
    return NextResponse.json({ reply: text });
  } catch (error) {
    return NextResponse.json({ error: "出错啦" }, { status: 500 });
  }
}
