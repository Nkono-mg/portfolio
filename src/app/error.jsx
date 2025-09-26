"use client";
import React from "react";
import Link from "next/link";
export default function Error() {
  // page d'erreur generique
  return (
    <div className="pt-44 text-center">
      <h1 className="text-4xl mb-4">A server error has occured</h1>
      <Link href="/" className="underline">
        Return homme
      </Link>
    </div>
  );
}
