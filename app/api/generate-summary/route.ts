import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { sector } = await req.json();

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("sector", sector);

  if (!news || news.length === 0) {
    return NextResponse.json({
      error: "没有找到相关新闻",
    });
  }

  const newsText = news
    .map(
      (item) =>
        `标题：${item.title}\n摘要：${item.summary}`
    )
    .join("\n\n");

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
你是专业财经分析师。

请根据给出的新闻，
生成100字以内的板块总结。

不要分点。
不要Markdown。
直接返回总结内容。
`,
          },
          {
            role: "user",
            content: newsText,
          },
        ],
        temperature: 0.3,
      }),
    }
  );

  const data = await response.json();

  const summary =
    data.choices?.[0]?.message?.content;

  const { error } = await supabase
  .from("sector_summaries")
  .upsert(
    {
      sector,
      summary,
      updated_at: new Date(),
    },
    {
      onConflict: "sector",
    }
  );

  if (error) {
    return NextResponse.json({
      error: error.message,
    });
  }

  return NextResponse.json({
    success: true,
    summary,
  });
}
export async function GET() {
  return POST(
    new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        sector: "ai",
      }),
    })
  );
}