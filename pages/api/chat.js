export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key 没填");

    // ---------------------------------------------------------
    // 🕵️‍♂️ 别猜了，直接去 Google 仓库里查！
    // ---------------------------------------------------------
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(listUrl, { method: 'GET' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("查询失败，Google 回复: " + JSON.stringify(data));
    }

    // 提取出所有模型的“身份证号” (name)
    const modelIDs = data.models.map(m => m.name).join('\n');

    // ---------------------------------------------------------
    // 把查到的 ID 列表直接发回微信
    // ---------------------------------------------------------
    res.status(200).json({ 
      reply: "✅ 查到了！你的 Key 支持的模型 ID 如下：\n\n" + modelIDs 
    });

  } catch (error) {
    console.error("报错:", error);
    res.status(200).json({ reply: "❌ 查询失败: " + error.message });
  }
}
