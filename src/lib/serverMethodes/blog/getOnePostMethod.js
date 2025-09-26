import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/app/models/Post";
import { Tag } from "@/app/models/Tag"; // <- Important !
import { notFound } from "next/navigation";

export async function getOnePost(slug) {
  await connectToDB();
  const post = await Post.findOne({ slug }).populate({
    path: "tags", //refenrence de table tags en base de données,
    select: "name slug",
  });
  if (!post) {
    return notFound();
  }
  return post;
}
