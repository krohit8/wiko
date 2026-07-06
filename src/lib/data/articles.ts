import db from "@/db";
import { articles, userSync } from "@/db/Schema";
import { eq, desc } from "drizzle-orm";


export async function getArticles(){
    const response = await db
    .select({
        title: articles.title,
        id: articles.id,
        createdAt: articles.createdAt,
        content: articles.content,
        author: userSync.name
    })
    .from(articles)
    .leftJoin(userSync,eq(articles.authorId,userSync.id))
    .orderBy(desc(articles.updatedAt))
    return response
}

export async function getArticleById(id:number){
    const response = await db
    .select({
        id: articles.id,
        title: articles.title,
        createdAt: articles.createdAt,
        content: articles.content,
        author: userSync.name,
        imageUrl:articles.imageUrl
    })
    .from(articles)
    .where(eq(articles.id,id))
    .leftJoin(userSync,eq(articles.authorId,userSync.id))
    return response[0] ? response[0] : null;
}