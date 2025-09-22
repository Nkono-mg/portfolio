import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/app/models/Post";

export async function getOnePost(slug) {
  try {
    await connectToDB();
    const post = await Post.findOne({ slug }).populate({
      path: "tags", //refenrence de table tags en base de données,
      select: "name slug",
    });
    return post;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}
