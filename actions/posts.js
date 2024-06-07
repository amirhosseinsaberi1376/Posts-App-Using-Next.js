"use server";

import { redirect } from "next/navigation";

import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  let errors = [];

  if (!title || title.length === 0) {
    errors.push("title is required");
  }

  if (!content || content.length === 0) {
    errors.push("message is required");
  }

  if (!image || image.size === 0) {
    errors.push("you must upload an image");
  }

  if (errors.length) {
    return { errors };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error("Could not upload the image");
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  });

  revalidatePath("/", "layout");
  redirect("/feed");
}

export async function togglePostLikeStatus(postId) {
  updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
}
