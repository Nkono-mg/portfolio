"use client";
import React, { useRef } from "react";
import { userRegister } from "@/lib/serverActions/session/sessionServerAction";
import { useRouter } from "next/navigation";

export default function SignUp() {
  //les hooks
  const serverInfoRef = useRef();
  const submitButtonRef = useRef();
  const navigateTo = useRouter();
  //les fonctions
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    serverInfoRef.current.textContent = "";
    serverInfoRef.current.classList.add("hidden");
    submitButtonRef.current.textContent = "Saving ...";
    submitButtonRef.current.disabled = true;
    try {
      const formData = new FormData(e.target);
      const result = await userRegister(formData);
      if (result.success) {
        submitButtonRef.current.textContent = "User created ✅";
        let countDown = 3;
        serverInfoRef.current.classList.remove("hidden");
        serverInfoRef.current.textContent = `Redirecting in ${countDown}...`;
        const interval = setInterval(() => {
          countDown -= 1;
          serverInfoRef.current.textContent = `Redirecting in ${countDown}...`;
          if (countDown === 0) {
            clearInterval(interval);
            navigateTo.push("/signin");
          }
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      submitButtonRef.current.textContent = "Submit";
      submitButtonRef.current.disabled = false;
      serverInfoRef.current.classList.remove("hidden");
      serverInfoRef.current.textContent =
        error?.message || "An unexpected error occurred";
    }
  };

  //fin de fonction
  return (
    <form className="max-w-md mx-auto mt-32" onSubmit={handleSubmitUser}>
      <label htmlFor="userName" className="f-label">
        Name or Pseudo
      </label>
      <input
        type="text"
        name="userName"
        id="userName"
        className="f-auth-input"
        placeholder="Name or Pseudo"
        required
      />
      <label htmlFor="email" className="f-label">
        Mail
      </label>
      <input
        type="email"
        name="email"
        id="email"
        className="f-auth-input"
        placeholder="Mail"
        required
      />
      <label htmlFor="password" className="f-label">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        className="f-auth-input"
        placeholder="Password"
        required
      />
      <label htmlFor="confirmPassword" className="f-label">
        Confirm Password
      </label>
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        className="f-auth-input"
        placeholder="Confirm Password"
        required
      />
      <button
        ref={submitButtonRef}
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 mb-5 mt-8 rounded border-none"
      >
        Submit
      </button>
      <p ref={serverInfoRef} className="text-center mb-10 hidden"></p>
      <a
        href="/signin"
        className="mb-5 underline text-blue-600 block text-center"
      >
        Already have an account ? Login
      </a>
    </form>
  );
}
