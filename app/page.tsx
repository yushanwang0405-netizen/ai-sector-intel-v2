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
  .select("*");

  const { data: summaries } = await supabase
  .from("sector_summaries")
  .select("*");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          板块情报中心
        </h1>

        <p className="text-gray-500 mb-8">
          AI整理每日热点、政策与行业动态
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keys.map((key) => {
            const sector = sectorsData[key];

            const summaryData =
              summaries?.find(
                (item) => item.sector === key
              );

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

            return (
              <Link
                key={key}
                href={`/sector/${key}`}
              >
                <div
                  className="
                    bg-white
                    rounded-2xl
                    p-6
                    shadow-sm
                    border
                    hover:shadow-lg
                    hover:-translate-y-1
                    transition-all
                    duration-200
                    cursor-pointer
                    h-full
                  "
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">
                      {icons[key as keyof typeof icons]}
                    </h2>

                    <span className="text-xs text-gray-400">
                      {sector.lastUpdate}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      🟢 利好 {positiveCount}
                    </span>

                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      🔴 利空 {negativeCount}
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {
                    summaries?.find(
                    (s) => s.sector === key
                    )?.summary ??
                    sector.summary
                    }
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}