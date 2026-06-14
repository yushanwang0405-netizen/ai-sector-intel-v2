"use client";

import { useState } from "react";
export default function AskBox({
  sector,
}: {
  sector?: string;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          sector,
        }),
      });

      const data = await response.json();

      setAnswer(data.answer || "暂无回答");
    } catch (error) {
      console.error(error);
      setAnswer("回答生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          问 AI 情报助手
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          基于已抓取新闻回答问题，不提供投资建议。
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
        sector
        ? `例如：最近${sector}板块为什么偏暖？`
        : "例如：最近AI板块有哪些利好？"
}
          className="flex-1 rounded-2xl border px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "分析中..." : "提问"}
        </button>
      </div>

      {answer && (
        <div className="mt-5 whitespace-pre-line rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          {answer}
        </div>
      )}
    </section>
  );
}