import Parser from "rss-parser";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const parser = new Parser();

  const feed = await parser.parseURL(
  "https://www.marktechpost.com/feed/"
);

  const newsList = feed.items.slice(0, 5);

  let inserted = 0;
let skipped = 0;

for (const item of newsList) {
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
`,
          },
          {
            role: "user",
            content: item.title || "",
          },
        ],
        temperature: 0.3,
      }),
    }
  );

  const aiResult = await response.json();

  const aiContent =
    aiResult.choices?.[0]?.message?.content;

  const parsed = JSON.parse(aiContent);

  const { data: existing } = await supabase
    .from("news")
    .select("id")
    .eq("title", item.title)
    .maybeSingle();

  if (existing) {
    skipped++;
    continue;
  }

  const { error } = await supabase
    .from("news")
    .insert({
      title: item.title,
      sector: parsed.sector,
      sub_sector: parsed.subSector,
      sentiment: parsed.sentiment,
      summary: parsed.summary,
      source: "MarkTechPost",
    });

  if (!error) {
    inserted++;
  }
}

  const sectors = [
  "ai",
  "robot",
  "semiconductor",
  "compute",
  "new_energy",
];
for (const sector of sectors) {
  await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/generate-summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sector,
      }),
    }
  );
}

return NextResponse.json({
  success: true,
  inserted,
  skipped,
});
  }