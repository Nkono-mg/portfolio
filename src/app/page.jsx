import { connectToDB } from "@/lib/utils/db/connectToDB";
import Link from "next/link";
import { getAllPosts } from "@/lib/serverMethodes/blog/getAllPosts";

export default async function Home() {
  await connectToDB();
  const posts = await getAllPosts();
  return (
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Stay up to date</h1>
      <p className="t-main-subtitle">Tech trending</p>
      <p className="tex-md text-zinc-900">Latest articles</p>
      <ul className="u-articles-grid">
        {posts.map((post, index) => (
          <li key={index} className="li-list-content">
            <div className="pt-5 px-5 pb-7">
              <div className="flex items-baseline gap-x-4 text-xs">
                <time
                  dateTime={new Date().toISOString()}
                  className="text-gray-500 text-sm"
                >
                  {new Date().toLocaleDateString("en-EN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <Link
                  href={`/categories/author/${post.author}`}
                  className="ml-auto text-base text-gray-700 hover:text-gray-600 whitespace-nowrap truncate"
                >
                  {post.author} Nkono
                </Link>
              </div>
              <Link
                href={`/article/${post.slug}`}
                className="inline-block mt-6 text-xl font-semibold text-zinc-800 hover:text-zinc-600"
              >
                {post.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
