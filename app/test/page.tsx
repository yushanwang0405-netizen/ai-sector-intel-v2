import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        数据库新闻测试
      </h1>

      {news?.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-4 mb-4"
        >
          <div className="flex gap-2 mb-2">
            <span
              className={
                item.sentiment === "利好"
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {item.sentiment}
            </span>

            <span className="text-gray-500">
              {item.sub_sector}
            </span>
          </div>

          <h2 className="font-bold text-lg">
            {item.title}
          </h2>

          <p className="text-gray-600 mt-2">
            {item.summary}
          </p>

          <a
            href={item.source}
            target="_blank"
            className="text-blue-500 mt-2 inline-block"
          >
            查看原文 →
          </a>
        </div>
      ))}
    </div>
  );
}