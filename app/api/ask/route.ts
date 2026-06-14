import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { question, sector } = await req.json();

  if (!question) {
    return NextResponse.json({
      error: "问题不能为空",
    });
  }

  let query = supabase
  .from("news")
  .select("*")
  .order("created_at", {
    ascending: false,
  })
  .limit(30);

if (sector) {
  query = query.eq("sector", sector);
}

const { data: news } = await query;

  const newsText =
    news
      ?.map(
        (item) =>
          `标题：${item.title}
板块：${item.sector}
情绪：${item.sentiment}
摘要：${item.summary}`
      )
      .join("\n\n") || "";

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
你是产业情报分析助手。

你只能基于给定新闻回答问题。
不要编造不存在的信息。
如果新闻不足以回答，请说明“当前数据不足”。

回答要简洁，适合投资者阅读。
不要给买卖建议。
`,
          },
          {
            role: "user",
            content: `
新闻材料：
${newsText}

用户问题：
${question}
`,
          },
        ],
        temperature: 0.3,
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json({
    answer: data.choices?.[0]?.message?.content,
  });
}