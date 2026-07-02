import WikiEditor from "@/components/wiki-editor";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewArticlePage() {
  const user = await currentUser()
  if(!user) redirect("/")
  return <WikiEditor isEditing={false} />;
}
