import React from "react";
import { getOnePost } from "@/lib/serverMethodes/blog/getOnePostMethod";
import Link from "next/link";

export default async function AfficheArticle({ params }) {
  const { slug } = await params;
  const post = await getOnePost(slug);
  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="text-4xl mb-3">{post.title}</h1>
      <p className="mb-6">
        {post.tags.map((tag) => (
          <Link
            href={`/categories/tag/${tag.slug}`}
            key={tag.slug}
            className="mr-4 underline"
          >
            #{tag.name}
          </Link>
        ))}
      </p>
      <p className="">{post.markdownArticle}</p>
    </main>
  );
}
