import { sectorsData } from "../../data/sectors";
import { supabase } from "@/lib/supabase";
import AskBox from "@/app/components/AskBox";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SectorPage({ params }: Props) {
  const { id } = await params;
  const sectorKey = id.toLowerCase();
  const sectorData = sectorsData[sectorKey];

  if (!sectorData) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <h1 className="text-2xl font-bold">板块不存在</h1>
      </main>
    );
  }

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("sector", sectorKey)
    .order("created_at", {
      ascending: false,
    });

  const { data: policies } = await supabase
    .from("policies")
    .select("*")
    .eq("sector", sectorKey)
    .order("policy_date", {
      ascending: false,
    });

  const { data: summaryData } = await supabase
    .from("sector_summaries")
    .select("*")
    .eq("sector", sectorKey)
    .limit(1);

  const positiveNews =
    news?.filter((item) => item.sentiment === "利好") || [];

  const negativeNews =
    news?.filter((item) => item.sentiment === "利空") || [];

  const totalNews = news?.length || 0;

  const sentiment =
    positiveNews.length > negativeNews.length
      ? "偏暖"
      : positiveNews.length < negativeNews.length
      ? "偏弱"
      : "中性";

  const updateTime = summaryData?.[0]?.updated_at
    ? new Date(summaryData[0].updated_at).toLocaleString()
    : sectorData.lastUpdate;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <section className="mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm text-blue-100">
                Sector Intelligence
              </div>

              <h1 className="mb-3 text-4xl font-bold">
                {sectorData.name} 板块
              </h1>

              <p className="max-w-2xl text-slate-200">
                基于 RSS 新闻与 AI 分析生成的板块情报，包括情绪判断、重点利好利空与政策动态。
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              <div className="text-slate-300">最近更新</div>
              <div className="mt-1 font-medium">{updateTime}</div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">市场情绪</div>
            <div className="mt-2 text-2xl font-bold">{sentiment}</div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">新闻总数</div>
            <div className="mt-2 text-3xl font-bold">{totalNews}</div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">利好</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {positiveNews.length}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">利空</div>
            <div className="mt-2 text-3xl font-bold text-rose-600">
              {negativeNews.length}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">📋 今日总结</h2>
          <AskBox sector={sectorKey} />

          <p className="leading-8 text-slate-700">
            {summaryData?.[0]?.summary ?? sectorData.summary}
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-emerald-700">
              🔥 重点利好
            </h2>

            {positiveNews.length === 0 ? (
              <p className="text-slate-500">暂无重点利好</p>
            ) : (
              <div className="space-y-4">
                {positiveNews.map((item) => (
                  <a
                    key={item.id}
                    href={item.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-2 font-semibold">
                      {item.title}
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.summary}
                    </p>

                    <div className="mt-3 text-sm font-medium text-blue-600">
                      查看原文 →
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-rose-700">
              ⚠️ 重点利空
            </h2>

            {negativeNews.length === 0 ? (
              <p className="text-slate-500">暂无重点利空</p>
            ) : (
              <div className="space-y-4">
                {negativeNews.map((item) => (
                  <a
                    key={item.id}
                    href={item.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl border border-rose-100 bg-rose-50/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-2 font-semibold">
                      {item.title}
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.summary}
                    </p>

                    <div className="mt-3 text-sm font-medium text-blue-600">
                      查看原文 →
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">📄 政策动态</h2>

          {!policies || policies.length === 0 ? (
            <p className="text-slate-500">暂无政策更新</p>
          ) : (
            <div className="space-y-4">
              {policies.map((policy) => (
                <a
                  key={policy.id}
                  href={policy.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-slate-50 p-4 transition hover:shadow-md"
                >
                  <div className="mb-1 text-sm text-slate-400">
                    {policy.policy_date}
                  </div>

                  <div className="mb-2 font-semibold">
                    {policy.title}
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    {policy.summary}
                  </p>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}