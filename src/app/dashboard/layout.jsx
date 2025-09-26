import React from "react";
import { redirect } from "next/navigation";
import { sessionInfo } from "@/lib/serverMethodes/session/sessionAction";

export default async function layout({ children }) {
  const session = await sessionInfo();
  if (!session.success) {
    redirect("/signin");
  }
  return <>{children}</>;
}
