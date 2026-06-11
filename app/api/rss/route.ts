import Parser from "rss-parser";
import { NextResponse } from "next/server";

export async function GET() {
  const parser = new Parser();

  const feed = await parser.parseURL(
    "https://www.marktechpost.com/feed/"
  );

  const firstNews = feed.items[0];

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
你是专业产业分析师。

分析新闻后严格返回JSON。

禁止返回Markdown。
禁止返回解释。
禁止返回代码块。
只能返回JSON。

sector必须从以下选项中选择：

ai
robot
semiconductor
compute
new_energy

subSector必须从以下选项中选择：

大模型
AI Agent
GPU
算力基础设施
机器人
人形机器人
自动驾驶
新能源车
光伏
储能
芯片设计
半导体设备

sentiment必须从以下选项中选择：

利好
利空
中性

返回格式：

{
  "sector":"",
  "subSector":"",
  "sentiment":"",
  "summary":""
}

summary控制在100字以内。
`
},
          {
            role: "user",
            content: firstNews.title || "",
          },
        ],
        temperature: 0.3,
      }),
    }
  );

  const aiResult = await response.json();

  return NextResponse.json({
    title: firstNews.title,
    ai: aiResult.choices?.[0]?.message?.content,
  });
}