import Parser from "rss-parser";
import { NextResponse } from "next/server";

export async function GET() {
  const parser = new Parser();

  const feed = await parser.parseURL(
    "https://www.marktechpost.com/feed/"
  );

  return NextResponse.json(
    feed.items.slice(0, 5).map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
    }))
  );
}