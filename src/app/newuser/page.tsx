"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewUser() {
  const { data: session, status } = useSession();
  const [favoriteMovie, setFavoriteMovie] = useState<string>("");
  const [isCheckingExistingMovie, setIsCheckingExistingMovie] =
    useState<boolean>(true);
  const router = useRouter();

  // Check if user already has a favorite movie and redirect to homepage
  useEffect(() => {
    const checkExistingMovie = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/get-movie", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.favoriteMovie) {
              // User already has a favorite movie, redirect to homepage
              router.push("/");
              return;
            }
          }
        } catch (error) {
          console.error("Error checking existing movie:", error);
        }

        // Done checking, show the newuser form
        setIsCheckingExistingMovie(false);
      }
    };

    if (session?.user?.email) {
      checkExistingMovie();
    }
  }, [session, router]);

  if (status === "loading" || isCheckingExistingMovie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {status === "loading"
              ? "Loading..."
              : "Taking you to your movie fact..."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!favoriteMovie.trim() || !session?.user?.email) return;

    try {
      const response = await fetch("/api/save-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          favoriteMovie,
        }),
      });

      if (response.ok) {
        router.push(`/`);
      } else {
        console.error("Failed to save favorite movie");
      }
    } catch (error) {
      console.error("Error saving favorite movie:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-6">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="mx-auto h-20 w-20 rounded-full shadow-lg"
              />
            ) : (
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xl font-semibold">
                  {session?.user?.name?.[0] || "?"}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome, {session?.user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">{session?.user?.email}</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">
              What's your favorite movie?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll show you interesting facts about it!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={favoriteMovie}
                onChange={(e) => setFavoriteMovie(e.target.value)}
                placeholder="Enter your favorite movie"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
