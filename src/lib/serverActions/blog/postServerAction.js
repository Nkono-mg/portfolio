"use server";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/app/models/Post";
import { Tag } from "@/app/models/Tag";
import slugify from "slugify";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

export async function addPost(formData) {
  const { title, markdownArticle, tags } = Object.fromEntries(formData);

  try {
    await connectToDB();
    //gestion des tags
    const tagNameArray = JSON.parse(tags);
    const tagIds = await Promise.all(
      tagNameArray.map(async (tagName) => {
        const normalizedTagName = tagName.trim().toLowerCase();
        let tag = await Tag.findOne({ name: normalizedTagName });
        if (!tag) {
          tag = await Tag.create({
            name: normalizedTagName,
            slug: slugify(normalizedTagName, { strict: true }),
          });
        }
        return tag._id;
      })
    );
    const newPost = new Post({ title, markdownArticle, tags: tagIds });
    const savedPost = await newPost.save();
    console.log(`Post saved successfull!`);
    return {
      success: true,
      slug: savedPost.slug,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(errorMessage);
  }
}
