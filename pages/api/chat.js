import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. 获取数据
    const { message } = req.body;
    
    // 3. 调用 Google Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    // 4. 返回结果
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "服务器出错了" });
  }
}
