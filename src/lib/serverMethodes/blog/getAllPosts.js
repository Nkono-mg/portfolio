import { Post } from "@/app/models/Post";
import { connectToDB } from "@/lib/utils/db/connectToDB";

export const getAllPosts = async () => {
  await connectToDB();
  const posts = await Post.find({}).sort({
    createdAt: -1,
  });
  return posts;
};
