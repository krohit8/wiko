import { eq } from "drizzle-orm";
import db from ".";
import { articles } from "./Schema";

export const authorizeUserToEditArticle = async function authorizeArticle(
  loggedInUserId: string,
  articleId: string,
): Promise<boolean> {
  const response = await db
    .select({
      authorId: articles.authorId,
    })
    .from(articles)
    .where(eq(articles.id, Number(articleId)));

  if (!response.length) {
    return false;
  }
  return response[0].authorId === loggedInUserId;
};
