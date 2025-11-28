import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ✅ 改成了最新的 gemini-1.5-flash 模型
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error(error);
    // 这里把具体的错误打印出来，方便调试
    res.status(500).json({ error: error.message || "Server Error" });
  }
}
