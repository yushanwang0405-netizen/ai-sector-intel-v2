import { sectorsData } from "../../data/sectors";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SectorPage({ params }: Props) {
  const { id } = await params;

  const sectorData = sectorsData[id.toLowerCase()];

  if (!sectorData) {
  return (
    <main className="p-10">
      板块不存在
    </main>
  );
}

  const { data: news } = await supabase
  .from("news")
  .select("*")
  .eq("sector", id.toLowerCase());

  const { data: policies } = await supabase
  .from("policies")
  .select("*")
  .eq("sector", id.toLowerCase())
  .order("policy_date", {
    ascending: false,
  });

  const { data: summaryData } = await supabase
  .from("sector_summaries")
  .select("*")
  .eq("sector", id.toLowerCase())
  .limit(1);

  const positiveNews =
  news?.filter(
    (item) => item.sentiment === "利好"
  ) || [];

  const negativeNews =
  news?.filter(
    (item) => item.sentiment === "利空"
  ) || [];

  const sentiment =
  positiveNews.length >
  negativeNews.length
    ? "偏暖"
    : positiveNews.length <
      negativeNews.length
    ? "偏弱"
    : "中性";

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            {sectorData.name} 板块
          </h1>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="rounded-full bg-green-50 px-4 py-2 text-green-700 font-medium">
              🟢 市场情绪：{sentiment}
            </span>

            <span className="text-gray-500">
              更新日期：{sectorData.lastUpdate}
            </span>
          </div>
        </div>

        {/* 今日总结 */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm border">
          <h2 className="text-xl font-bold mb-4">
            📋 今日总结
          </h2>

          <p className="text-gray-700 leading-7">
            {summaryData?.[0]?.summary ??
            sectorData.summary}
          </p>
        </section>

        {/* 利好 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            🔥 重点利好
          </h2>

          {positiveNews.length === 0 ? (
            <div className="rounded-xl bg-white border p-4 text-gray-500">
              暂无重点利好
            </div>
          ) : (
            positiveNews.map((item, index) => (
              <div
                key={index}
                className="mb-4 rounded-xl border border-green-100 bg-green-50 p-4"
              >
                <div className="font-semibold mb-2">
                  {item.title}
                </div>

                <p className="text-gray-700 text-sm mb-3">
                  {item.summary}
                </p>

                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  查看原文 →
                </a>
              </div>
            ))
          )}
        </section>

        {/* 利空 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-700 mb-4">
            ⚠️ 重点利空
          </h2>

          {negativeNews.length === 0 ? (
            <div className="rounded-xl bg-white border p-4 text-gray-500">
              暂无重点利空
            </div>
          ) : (
            negativeNews.map((item, index) => (
              <div
                key={index}
                className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4"
              >
                <div className="font-semibold mb-2">
                  {item.title}
                </div>

                <p className="text-gray-700 text-sm mb-3">
                  {item.summary}
                </p>

                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  查看原文 →
                </a>
              </div>
            ))
          )}
        </section>

        {/* 政策动态 */}
        {/* 政策动态 */}
<section className="rounded-2xl bg-white p-6 shadow-sm border">
  <h2 className="text-xl font-bold mb-4">
    📄 政策动态
  </h2>

  {!policies || policies.length === 0 ? (
    <p className="text-gray-500">
      暂无政策更新
    </p>
  ) : (
    policies.map((policy) => (
      <div
        key={policy.id}
        className="mb-4 rounded-xl bg-gray-50 p-4"
      >
        <div className="text-sm text-gray-500 mb-2">
          {policy.policy_date}
        </div>

        <div className="font-semibold mb-2">
          {policy.title}
        </div>

        <p className="text-gray-700 text-sm mb-3">
          {policy.summary}
        </p>

        <a
          href={policy.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm hover:underline"
        >
          查看原文 →
        </a>
      </div>
    ))
  )}
</section>
      </div>
    </main>
  );
}