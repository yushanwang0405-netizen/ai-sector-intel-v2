import Parser from "rss-parser";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const parser = new Parser();

  const feeds = [
  "https://www.marktechpost.com/feed/",
  "https://blogs.nvidia.com/feed/",
  "https://electrek.co/feed/",
  "https://www.semiengineering.com/feed/",
  "https://www.semiconductor-digest.com/feed/",
];

  const allNews = [];

for (const url of feeds) {
  try {
    const feed = await parser.parseURL(url);

    allNews.push(
      ...feed.items.slice(0, 5)
    );
  } catch (error) {
    console.log("RSS抓取失败:", url);
  }
}

  let inserted = 0;
let skipped = 0;

const newsToProcess = allNews.slice(0, 4);
for (const item of newsToProcess) {
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

分类规则：
- 如果新闻重点是GPU、AI服务器、数据中心、云计算、算力建设，sector 返回 compute。
- 如果新闻重点是芯片制造、晶圆厂、先进制程、封装测试、EDA、存储芯片、半导体设备、光刻机，sector 返回 semiconductor。
- 如果新闻重点是大模型、AI Agent、AI应用，sector 返回 ai。
- 如果新闻重点是电动车、光伏、储能、电池，sector 返回 new_energy。
- 如果新闻重点是机器人、人形机器人、工业自动化，sector 返回 robot。

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
      content: `
      标题：
      ${item.title || ""}

      摘要：
      ${item.contentSnippet || ""}

      链接：
      ${item.link || ""}
      `,
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
      source: item.link || "MarkTechPost",
    });

  if (!error) {
    inserted++;
  }
}

  /*const sectors = [
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
*/
return NextResponse.json({
  success: true,
  inserted,
  skipped,
});
  }