"use server";

import db from "@/db";
import { authorizeUserToEditArticle } from "@/db/auth";
import { articles } from "@/db/Schema";
import { ensureUserExists } from "@/db/sync-user";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type CreateArticleInput = {
  title: string;
  content: string;
  imageUrl?: string;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export async function createArticle(data: CreateArticleInput) {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthorized");
  }
  console.log(user);
  await ensureUserExists({
    id: user.id,
    displayName: user.fullName,
    primaryEmail: user.emailAddresses[0]?.emailAddress,
  });
  const response = await db
    .insert(articles)
    .values({
      title: data.title,
      content: data.content,
      slug: `${Date.now()}`,
      published: true,
      authorId: user.id,
    })
    .returning({ id: articles.id });
  const articleId = response[0]?.id;
  console.log(response, "res");
  console.log(articleId, "aId");
  return { success: true, message: "Article create logged", id: articleId };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthorized");
  }
  if (!(await authorizeUserToEditArticle(user.id, id))) {
    throw new Error("restricted");
  }

  console.log("📝 updateArticle called:", { id, ...data });

  const _response = await db
    .update(articles)
    .set({
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || undefined,
    })
    .where(eq(articles.id, Number(id)));

  return { success: true, message: `Article ${id} update logged (stub)` };
}

export async function deleteArticle(id: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("unauthorized");
  }
  if (!(await authorizeUserToEditArticle(user.id, id))) {
    throw new Error("restricted");
  }

  console.log("🗑️ deleteArticle called:", id);

  const _response = await db
    .delete(articles)
    .where(eq(articles.id, Number(id)));

  return { success: true, message: `Article ${id} delete logged (stub)` };
}

// Form-friendly server action: accepts FormData from a client form and calls deleteArticle
export async function deleteArticleForm(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Missing article id");
  }

  await deleteArticle(String(id));
  // After deleting, redirect the user back to the homepage.
  redirect("/");
}
