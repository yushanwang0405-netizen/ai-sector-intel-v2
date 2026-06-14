import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { sectorsData } from "./data/sectors";

const icons = {
  ai: "🤖",
  robot: "🦾",
  semiconductor: "💾",
  compute: "🖥️",
  new_energy: "⚡",
};

export default async function HomePage() {
  const keys = Object.keys(sectorsData);

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  const { data: summaries } = await supabase
    .from("sector_summaries")
    .select("*");

  const totalNews = news?.length || 0;

  const positiveTotal =
    news?.filter((item) => item.sentiment === "利好")
      .length || 0;

  const negativeTotal =
    news?.filter((item) => item.sentiment === "利空")
      .length || 0;

  const latestUpdate =
    summaries?.[0]?.updated_at
      ? new Date(
          summaries[0].updated_at
        ).toLocaleString()
      : "暂无更新";

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#111827] via-[#1e3a8a] to-[#0f766e] p-8 text-white shadow-xl">
          <div className="absolute right-8 top-8 hidden opacity-25 md:block">
            <div className="text-8xl font-black leading-none">
              A股
            </div>
          </div>

          <div className="absolute bottom-6 right-8 hidden h-32 w-80 md:block">
            <svg
              viewBox="0 0 320 120"
              className="h-full w-full"
            >
              <polyline
                points="0,90 40,70 75,78 115,45 150,55 190,25 230,35 270,18 315,30"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="270"
                cy="18"
                r="7"
                fill="#f97316"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm text-blue-100">
              AI Sector Intelligence
            </div>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              板块情报中心
            </h1>

            <p className="mb-6 text-slate-200">
              自动抓取产业新闻，使用 AI 判断利好利空、归类板块并生成摘要，帮助快速了解市场热点。
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/15 px-4 py-2">
                RSS 自动采集
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2">
                AI 情绪分析
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2">
                板块自动总结
              </span>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              已收录新闻
            </div>
            <div className="mt-2 text-3xl font-bold">
              {totalNews}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              利好新闻
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {positiveTotal}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              利空新闻
            </div>
            <div className="mt-2 text-3xl font-bold text-rose-600">
              {negativeTotal}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              最近更新
            </div>
            <div className="mt-2 text-sm font-medium text-slate-700">
              {latestUpdate}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                重点跟踪板块
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                点击进入详情页查看新闻、摘要与政策动态
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {keys.map((key) => {
              const sector = sectorsData[key];

              const sectorNews =
                news?.filter(
                  (item) => item.sector === key
                ) || [];

              const positiveCount =
                sectorNews.filter(
                  (item) => item.sentiment === "利好"
                ).length;

              const negativeCount =
                sectorNews.filter(
                  (item) => item.sentiment === "利空"
                ).length;

              const sentimentText =
                positiveCount > negativeCount
                  ? "偏暖"
                  : positiveCount < negativeCount
                  ? "偏弱"
                  : "中性";

              return (
                <Link
                  key={key}
                  href={`/sector/${key}`}
                  className="group"
                >
                  <div className="h-full rounded-3xl bg-white p-5 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="text-4xl">
                        {
                          icons[
                            key as keyof typeof icons
                          ]
                        }
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        {sectorNews.length} 条
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold">
                      {sector.name}
                    </h3>

                    <div className="mb-4 text-sm text-slate-500">
                      市场情绪：{sentimentText}
                    </div>

                    <div className="mb-5 flex gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        利好 {positiveCount}
                      </span>

                      <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
                        利空 {negativeCount}
                      </span>
                    </div>

                    <div className="border-t pt-4 text-sm font-medium text-blue-600">
                      查看详细情报 →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}