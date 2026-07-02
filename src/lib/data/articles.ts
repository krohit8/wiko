import db from "@/db";
import { articles, userSync } from "@/db/Schema";
import { eq } from "drizzle-orm";


export async function getArticles(){
    const response = await db
    .select({
        title: articles.title,
        id: articles.id,
        createdAt: articles.createdAt,
        content: articles.content,
        author: userSync.id
    })
    .from(articles)
    .leftJoin(userSync,eq(articles.authorId,userSync.id))
    return response
}

export async function getArticleById(id:number){
    const response = await db
    .select({
        id: articles.id,
        title: articles.title,
        createdAt: articles.createdAt,
        content: articles.content,
        author: userSync.id,
        imageUrl:articles.imageUrl
    })
    .from(articles)
    .where(eq(articles.id,id))
    .leftJoin(userSync,eq(articles.authorId,userSync.id))
    return response[0] ? response[0] : null;
}