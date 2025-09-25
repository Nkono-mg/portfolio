"use server";
import { connectToDB } from "@/lib/utils/db/connectToDB";
import { Post } from "@/app/models/Post";
import { Tag } from "@/app/models/Tag";
import slugify from "slugify";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import Prism from "prismjs";
import { markedHighlight } from "marked-highlight";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import AppError from "@/lib/utils/errorhandler/errorHandler";
import { sessionInfo } from "@/lib/serverMethodes/session/sessionAction";

//gestion attaque xss
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export async function addPost(formData) {
  const { title, markdownArticle, tags } = Object.fromEntries(formData);

  try {
    //gestion de l'erreur
    if (typeof title !== "string" || title.trim().length < 3) {
      throw new AppError("Ivalid title");
    }
    if (
      typeof markdownArticle !== "string" ||
      markdownArticle.trim().length == 0
    ) {
      throw new AppError("Invalid markdown");
    }
    if (typeof tags !== "string") {
      throw new AppError("Tags invalid");
    }
    await connectToDB();
    //verification de session
    const session = await sessionInfo();
    if (!session) {
      throw new AppError("Please sign in");
    }
    //gestion des tags
    const tagNameArray = JSON.parse(tags);
    if (!Array.isArray(tagNameArray)) {
      throw new AppError("Tags must be a valid array");
    }
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
    //gestion de markdown
    marked.use(
      markedHighlight({
        highlight: (code, language) => {
          const validLanguage = Prism.languages[language]
            ? language
            : "plaintext";
          return Prism.highlight(
            code,
            Prism.languages[validLanguage],
            validLanguage
          );
        },
      })
    );
    let markdownHTMLResult = marked(markdownArticle);
    markdownHTMLResult = DOMPurify.sanitize(markdownHTMLResult); //on applique ici la gestion attaque xss

    const newPost = new Post({
      title,
      markdownArticle,
      markdownHTMLResult,
      tags: tagIds,
    });
    console.log(newPost);
    const savedPost = await newPost.save();
    console.log(`Post saved successfull!`);
    return {
      success: true,
      slug: savedPost.slug,
    };
  } catch (error) {
    console.log("Error while creating the post: ", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new Error(error.message);
  }
}
