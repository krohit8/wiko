"use server";

import { currentUser } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";

export type UploadedFile = {
  url: string;
  size: number;
  type: string;
  filename?: string;
};

export async function uploadFile(formData: FormData): Promise<UploadedFile> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const files = formData.getAll("files").filter(Boolean) as File[];
  const file = files[0];

  console.log(
    "📤 uploadFile called, received files:",
    files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
  );

  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });
    type vercelBlobResult = {
      url?: string;
      pathname?: string;
    };
    const blobResult = blob as unknown as vercelBlobResult;
    return {
      url: blobResult.url ?? "",
      size: file.size,
      type: file.type,
      filename: blobResult.pathname ?? file.name,
    };
  } catch (err) {
    console.error(" Vercel Blob upload error:", err);
    throw new Error("Upload failed");
  }
}
