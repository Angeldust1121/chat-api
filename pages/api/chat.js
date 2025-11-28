
export default async function handler(req, res) {
  // 1. 设置跨域，允许小程序访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: '只允许 POST 请求' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message } = req.body;

    if (!apiKey) {
      throw new Error("没有找到 API Key，请在 Vercel 设置里添加");
    }

    // 2. 【关键】直接手动向 Google 发请求，绕过所有 SDK 版本问题
    // 我们强制使用 v1beta 版本，这是肯定支持 1.5-flash 的
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: message }] 
        }]
      })
    });

    const data = await response.json();

    // 3. 检查 Google 有没有报错
    if (!response.ok) {
      throw new Error(data.error?.message || "Google API 连接失败");
    }

    // 4. 提取回复内容
    const replyText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("报错:", error);
    // 把错误直接显示在聊天框，方便调试
    res.status(200).json({ reply: "❌ 报错了: " + error.message });
  }
}
