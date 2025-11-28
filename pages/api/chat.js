import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. 允许跨域（可选，防止部分环境报错）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: '只允许 POST 请求' });
  }

  try {
    // 2. 第一重检查：检查 Key 是否存在
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("致命错误：在 Vercel 环境变量中找不到 GEMINI_API_KEY！请去 Settings -> Environment Variables 添加。");
    }

    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. 使用 flash 模型（更稳定）
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("服务器报错:", error);
    // 4. 【关键】把错误信息伪装成 AI 回复发给你，这样你就能看见了！
    // 我们强制返回 200 状态码，确保微信能把错误显示出来
    res.status(200).json({ reply: "【调试模式报错】: " + error.message });
  }
}
