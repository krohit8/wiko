import WikiEditor from "@/components/wiki-editor";
import { authorizeUserToEditArticle } from "@/db/auth";
import { getArticleById } from "@/lib/data/articles";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;
  
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  const canEdit = await authorizeUserToEditArticle(user.id, id);
  if (!canEdit) {
    redirect(`/wiki/${id}`);
  }

  const article = await getArticleById(Number(id));
  if (!article) {
    notFound();
  }

  return (
    <WikiEditor
      initialTitle={article.title}
      initialContent={article.content}
      isEditing={true}
      articleId={id}
    />
  );
}
