// app/api/news/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      title: "NVIDIA发布新一代AI GPU",
      summary: "新GPU性能提升，有望推动AI算力需求增长。",
      sentiment: "利好",
    },
    {
      title: "某AI企业融资计划终止",
      summary: "市场对相关赛道短期信心有所下降。",
      sentiment: "利空",
    },
  ]);
}