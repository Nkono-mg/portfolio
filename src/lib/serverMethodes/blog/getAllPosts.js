import { Post } from "@/app/models/Post";
import { connectToDB } from "@/lib/utils/db/connectToDB";

export const getAllPosts = async () => {
  try {
    await connectToDB;
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return posts;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new error(errorMessage);
  }
};
