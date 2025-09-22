import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/app/models/Post";

export async function getPost(slug) {
  try {
    await connectToDB();
    const post = await Post.findOne(slug);
    return post;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(errorMessage);
  }
}
