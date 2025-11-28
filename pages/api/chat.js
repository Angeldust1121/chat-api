export default async function handler(req, res) {
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
      throw new Error("没有找到 API Key");
    }

    // 🔴 关键修改：换回了最稳的 gemini-pro，绝对存在！
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

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

    if (!response.ok) {
      throw new Error(data.error?.message || "Google API 连接失败");
    }

    const replyText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error("报错:", error);
    res.status(200).json({ reply: "❌ 报错了: " + error.message });
  }
}
