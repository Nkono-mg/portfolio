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

//gestion attaque xss
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

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
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(errorMessage);
  }
}
