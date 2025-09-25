import Link from "next/link";
import React from "react";
import { sessionInfo } from "@/lib/serverMethodes/session/sessionAction";
import NavbarDropdown from "./NavbarDropdown";

export default async function Navbar() {
  const session = await sessionInfo();

  return (
    <nav className="fixed w-full bg-slate-50 border-b border-b-zinc-300">
      <div className="u-main-container flex py-4">
        <Link href="/" className="mr-2 text-zinc-900">
          Techs
        </Link>
        <Link href="/categories" className="mx-2 text-zinc-900 mr-auto">
          Categories
        </Link>
        {/* seul utilisateur connecté peut voir */}
        {session.success ? (
          <>
            <Link href="/dashboard/create" className="mx-2 text-zinc-900">
              Add an Article
            </Link>
            <NavbarDropdown />
          </>
        ) : (
          // navbardropdown
          <>
            <Link href="/signin" className="mx-2 text-zinc-900">
              Sign In
            </Link>
            <Link href="/signup" className="mx-2 text-zinc-900">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
