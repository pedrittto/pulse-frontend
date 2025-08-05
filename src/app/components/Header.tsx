"use client";
import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-black text-white px-4 py-3 shadow-md">
      <div className="max-w-2xl mx-auto flex items-center">
        <div className="flex items-center space-x-3">
          <Image
            src="/icons/icon-512.png"
            alt="Pulse Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold">Pulse</h1>
        </div>
      </div>
    </header>
  );
}
