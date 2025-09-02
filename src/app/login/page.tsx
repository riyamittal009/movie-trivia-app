"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Movie Trivia
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to see facts about your favorite movie
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/newuser",
              })
            }
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
