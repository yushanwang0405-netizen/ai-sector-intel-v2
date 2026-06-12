"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [sector, setSector] = useState("ai");
  const [subSector, setSubSector] = useState("");
  const [sentiment, setSentiment] = useState("利好");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [summaryLoading, setSummaryLoading] =
  useState(false);
  const [rawNews, setRawNews] = useState("");
  const [rssLoading, setRssLoading] =useState(false);

  async function loadNews() {
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  if (data) {
    setNewsList(data);
  }
}
  async function deleteNews(id: number) {
  const confirmed = confirm(
    "确定删除这条新闻吗？"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) {
    setMessage("删除失败");
    console.error(error);
    return;
  }

  setMessage("删除成功");

  await loadNews();
}

  useEffect(() => {
  loadNews();
}, []);

  async function handleAnalyze() {
  if (!rawNews.trim()) {
    setMessage("请先粘贴新闻内容");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "/api/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          content: rawNews,
        }),
      }
    );

    const data =
      await response.json();

    const result = JSON.parse(
      data.result
    );

    setTitle(result.title);
    setSector(result.sector);
    setSubSector(
      result.subSector
    );
    setSentiment(
      result.sentiment
    );
    setSummary(
      result.summary
    );

    setMessage(
      "AI分析完成"
    );
  } catch (error) {
    console.error(error);

    setMessage(
      "AI分析失败"
    );
  } finally {
    setLoading(false);
  }
}

  async function fetchRSS() {
  try {
    setRssLoading(true);

    const response =
      await fetch("/api/rss");

    const data =
      await response.json();

    setMessage(
      data.message ||
      "RSS抓取成功"
    );

    await loadNews();
  } catch (error) {
    console.error(error);

    setMessage("RSS抓取失败");
  } finally {
    setRssLoading(false);
  }
}

  async function generateSummary() {
  try {
    setSummaryLoading(true);

    const response = await fetch(
      "/api/generate-summary",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          sector,
        }),
      }
    );

    const data =
      await response.json();

    if (data.error) {
      setMessage(data.error);
      return;
    }

    setMessage(
      "AI板块总结生成成功"
    );
  } catch (error) {
    console.error(error);

    setMessage(
      "生成失败"
    );
  } finally {
    setSummaryLoading(false);
  }
}

  async function handleSubmit() {
    setLoading(true);
    const { error } = await supabase
      .from("news")
      .insert([
        {
        sector,
        sub_sector: subSector,
        title,
        sentiment,
        summary,
        source,
      },
      ]);

    if (error) {
      setLoading(false);
      setMessage("提交失败");
      console.error(error);
      return;
    }

    setMessage("提交成功");
    await loadNews();

    setTitle("");
    setSummary("");
    setSector("ai");
    setSubSector("");
    setSentiment("利好");
    setSource("");
    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      {message && (
      <div
        className="
          mb-4
          rounded-lg
          bg-green-50
          p-3
          text-green-700
        "
      >
        {message}
      </div>
    )}

      <h1 className="text-3xl font-bold mb-8">
        新闻录入后台
      </h1>

      <textarea
      value={rawNews}
      onChange={(e) =>
        setRawNews(e.target.value)
      }
      placeholder="粘贴完整新闻内容"
      className="w-full border rounded-lg p-3 h-40"
      />

      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="新闻标题"
          className="w-full border rounded-lg p-3"
        />

        <select
          value={sector}
          onChange={(e) =>
          setSector(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="ai">AI</option>
          <option value="robot">机器人</option>
          <option value="semiconductor">半导体</option>
          <option value="compute">算力</option>
          <option value="new_energy">新能源</option>
        </select>

        <input
          value={subSector}
          onChange={(e) =>
          setSubSector(e.target.value)
          }
          placeholder="细分赛道（GPU、大模型、人形机器人等）"
          className="w-full border rounded-lg p-3"
        />

        <select
        value={sentiment}
        onChange={(e) =>
        setSentiment(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      >
        <option value="利好">利好</option>
        <option value="利空">利空</option>
      </select>

        <textarea
          value={summary}
          onChange={(e) =>
            setSummary(e.target.value)
          }
          placeholder="新闻摘要"
          className="w-full border rounded-lg p-3 h-32"
        />

        <button
        onClick={handleAnalyze}
        disabled={loading}
        className="
          bg-purple-600
          text-white
          px-6
          py-3
          rounded-lg
        "
        >
        {loading
          ? "分析中..."
          : "AI分析"}
        </button>

        <input
        value={source}
        onChange={(e) =>
        setSource(e.target.value)
        }
        placeholder="新闻来源链接"
        className="w-full border rounded-lg p-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-lg
          "
        >
          {loading ? "提交中..." : "提交新闻"}
        </button>

        <button
        onClick={generateSummary}
        disabled={summaryLoading}
        className="
          bg-green-600
          text-white
          px-6
          py-3
          rounded-lg
          ml-3
          "
        >
        {summaryLoading
        ? "生成中..."
        : `生成${sector}板块总结`}
        </button>

        <button
  onClick={fetchRSS}
  disabled={rssLoading}
  className="
    bg-orange-600
    text-white
    px-6
    py-3
    rounded-lg
    ml-3
  "
>
  {rssLoading
    ? "抓取中..."
    : "抓取RSS新闻"}
</button>
        
        <hr className="my-10" />

        <h2 className="text-2xl font-bold mb-4">
          最近录入新闻
        </h2>

        <div className="space-y-3">
        {newsList.map((item) => (
        <div
        key={item.id}
        className="border rounded-lg p-4 bg-gray-50"
        >
        <div className="flex justify-between items-start">
        <div className="font-semibold">
          {item.title}
        </div>

        <button
          onClick={() =>
          deleteNews(item.id)
        }
        className="
          bg-red-500
          text-white
          px-3
          py-1
          rounded
          text-sm
        "
      >
        删除
      </button>
    </div>

    <div className="text-sm text-gray-500 mt-1">
      {item.sector} · {item.sentiment}
    </div>

    <div className="text-sm mt-2">
      {item.summary}
    </div>
  </div>
    ))}
    </div>
      </div>
    </main>
    
  );
}