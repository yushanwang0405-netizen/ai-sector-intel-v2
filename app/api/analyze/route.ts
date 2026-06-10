import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content } = await req.json();

  const response = await fetch(
    "https://api.deepseek.com/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `
你是专业财经分析助手。

请根据新闻内容返回JSON。

格式如下：

{
  "title": "",
  "sector": "",
  "subSector": "",
  "sentiment": "",
  "summary": ""
}

规则：

sector只能返回：
ai
robot
energy
pharma

sentiment只能返回：
利好
利空

不要返回markdown。
不要返回解释。
只返回JSON。
`,
          },
          {
            role: "user",
            content,
          },
        ],
        temperature: 0.2,
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json({
    result:
      data.choices?.[0]?.message?.content,
  });
}