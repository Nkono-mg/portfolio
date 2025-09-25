"use client"; //on utlise de gestionnaire d'evenement

import React, { useRef } from "react";
import { loginUser } from "@/lib/serverActions/session/sessionServerAction";
import { useRouter } from "next/navigation";

export default function SignIn() {
  //hooks
  const serverInfoRef = useRef();
  const submitButtonRef = useRef();
  const navigateTo = useRouter();

  //fonctions
  const handleSubmit = async (e) => {
    e.preventDefault();
    serverInfoRef.current.textContent = "";
    submitButtonRef.current.disabled = true;
    try {
      const formData = new FormData(e.target);
      const result = await loginUser(formData);
      if (result.success) {
        navigateTo.push("/");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      serverInfoRef.current.textContent = `${errorMessage}`;
      submitButtonRef.current.disabled = false;
    }
  };
  //fin fonctions
  return (
    <form className="max-w-md mx-auto mt-32" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        className="f-auth-input"
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        required
      />
      <label htmlFor="password">Password</label>
      <input
        className="f-auth-input"
        type="password"
        name="password"
        id="password"
        placeholder="password"
      />
      <button
        ref={submitButtonRef}
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 mb-5 mt-8 rounded border-none"
      >
        Connect
      </button>
      <p ref={serverInfoRef} className="text-center mb-10"></p>
    </form>
  );
}
