"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/serverActions/session/sessionServerAction";

export default function NavbarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = async () => {
    await logoutUser();
    router.push("/signin");
  };
  const closeDropdown = () => {
    setIsOpen(false);
  };
  //fin fonction
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    }
    // ajout de l'écouteur
    document.addEventListener("click", handleClickOutside);
    //suppression de l'evenement
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div ref={dropdownRef} className="relative">
      <button className="flex" onClick={toggleDropdown}>
        <Image src="/icons/user.svg" alt="icon" width={24} height={24} />
      </button>
      {isOpen && (
        <ul className="absolute rigth-0 top-10 w-[200px] border-b border-x border-zinc-300">
          <li className="bg-slate-50 hover:bg-slate-200 border-b border-slate-300">
            <Link
              href="/dashboard"
              className="block p-4"
              onClick={closeDropdown}
            >
              Dashboard
            </Link>
          </li>
          <li className="bg-slate-50 hover:bg-slate-200">
            <button onClick={handleLogout} className="w-full p-4 text-left">
              Log out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
