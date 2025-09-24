"use client";
import React, { useState, useRef } from "react";
import { addPost } from "@/lib/serverActions/blog/postServerAction";
import { useRouter } from "next/navigation";

export default function FormArticle() {
  //les hooks
  const [tags, setTags] = useState([]);
  const tagInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const serverValidationText = useRef(null);
  const navigateTo = useRouter();
  //les fonctions
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("tags", JSON.stringify(tags)); //ajouter les tags à post
    serverValidationText.current.textContent = "";
    submitButtonRef.current.textContent = "Saving Post ...";
    submitButtonRef.current.disabled = true;
    try {
      const result = await addPost(formData);
      if (result.success) {
        submitButtonRef.current.textContent = "Post saved ✅";
        let countDown = 3;
        serverValidationText.current.textContent = `Redirecting in ${countDown}...`;
        const interval = setInterval(() => {
          countDown -= 1;
          serverValidationText.current.textContent = `Redirecting in ${countDown}...`;
          if (countDown === 0) {
            clearInterval(interval);
            navigateTo.push(`/article/${result.slug}`);
          }
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      serverValidationText.current.textContent = `${errorMessage}`;
      submitButtonRef.current.textContent = "Submit";
      submitButtonRef.current.disabled = false;
    }
  };
  const handleAddTag = () => {
    const newTag = tagInputRef.current.value.trim().toLowerCase();
    if (newTag !== "" && !tags.includes(newTag) && tags.length <= 4) {
      setTags([...tags, newTag]);
    }
    tagInputRef.current.value = "";
  };
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleEnterOnTagInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  //fin fonctions
  return (
    <main className="u-main-container bg-white p-7 mt-32 mb-44">
      <h1 className="text-4xl mb-4">Write an article 📝</h1>
      <form action="" onSubmit={handleSubmit} className="pb-6">
        <label htmlFor="title" className="f-label">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          required
          className="shadow border rounded w-full p-3 mb-7 text-gray-700 focus:outline-slate-400"
        />
        <div className="mb-10">
          <label htmlFor="tag" className="f-label">
            Add a tag(s) (optional, max 5)
          </label>
          <div className="flex">
            <input
              type="text"
              name="tag"
              id="tag"
              disabled={tags.length >= 5}
              className="shadow border rounded p-3 text-gray-700 focus:outline-slate-400"
              placeholder={tags.length >= 5 ? "MAX TAG 5" : "Add a tag"}
              ref={tagInputRef}
              onKeyDown={handleEnterOnTagInput}
            />

            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-4 rounded mx-4"
              type="button"
              onClick={handleAddTag}
            >
              Add
            </button>
            <div className="flex items-center grow whitespace-nowrap overflow-y-auto shadow border rounded px-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block whitespace-nowrap bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                >
                  {tag}{" "}
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <label htmlFor="markdownArticle" className="f-label">
          Write your Article using markdown
        </label>
        <a
          href="https://www.markdownguide.org/cheat-sheet/"
          target="_blank"
          className="block mb-4 text-blue-600"
        >
          How to use the markdown syntax ?
        </a>
        <textarea
          name="markdownArticle"
          id="markdownArticle"
          required
          className="min-h-44 text-xl shadow appearance-none border rounded w-full p-8 text-gray-700 mb-4 focus:outline-slate-400"
        ></textarea>
        <button
          ref={submitButtonRef}
          className="min-w-44 bg-indigo-500 hover:bg-indigo-700 text-2xl text-white font-bold py-3 px-4 rounded border-none mb-4"
        >
          Submit
        </button>
        <p ref={serverValidationText}></p>
      </form>
    </main>
  );
}
