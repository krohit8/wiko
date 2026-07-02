import WikiArticleViewer from "@/components/wiki-article-viewer";
import { authorizeUserToEditArticle } from "@/db/auth";
import { getArticleById } from "@/lib/data/articles";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface ViewArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const { id } = await params;

  let canEdit = true;
  try {
    const user = await currentUser()
    if(user){
      canEdit = await authorizeUserToEditArticle(user.id,id)
    }
    
  } catch (_err) {
    canEdit = false;
  }
 const article = await getArticleById(Number(id))
 if(!article){
    notFound()
 }

  return <WikiArticleViewer article={article} canEdit={canEdit} />;
}
