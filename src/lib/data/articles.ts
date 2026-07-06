import redis from "@/cache";
import db from "@/db";
import { articles, userSync } from "@/db/Schema";
import { eq, desc } from "drizzle-orm";

export type ArticleList = {
  id: number;
  title: string;
  createdAt: string;
  content: string;
  author: string | null;
  imageUrl?: string | null;
}

export async function getArticles() {
  const cached = await redis.get<ArticleList[]>("articles:all")
  if (cached) {
    console.log(" Get Articles Cache Hit!");
    return cached;
  }
  const response = await db
    .select({
      title: articles.title,
      id: articles.id,
      createdAt: articles.createdAt,
      content: articles.content,
      author: userSync.name,
    })
    .from(articles)
    .leftJoin(userSync, eq(articles.authorId, userSync.id))
    .orderBy(desc(articles.updatedAt));

    try {
      await redis.set("articles:all",response,{
        ex:60
      })
    } catch (error) {
         console.warn("Failed to set articles cache", error);
    }
  return response as unknown as ArticleList[];
}



export async function getArticleById(id: number) {
  const response = await db
    .select({
      id: articles.id,
      title: articles.title,
      createdAt: articles.createdAt,
      content: articles.content,
      author: userSync.name,
      imageUrl: articles.imageUrl,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(userSync, eq(articles.authorId, userSync.id));
  return response[0] ? response[0] as unknown as ArticleList : null;
}
