"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [movieFact, setMovieFact] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favoriteMovie, setFavoriteMovie] = useState<string>("");

  // Load user's favorite movie from database
  useEffect(() => {
    const loadFavoriteMovie = async () => {
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
            setFavoriteMovie(data.favoriteMovie || "");
          }
        } catch (error) {
          console.error("Error loading favorite movie:", error);
        }
      }
    };

    if (session?.user?.email) {
      loadFavoriteMovie();
    }
  }, [session]);

  const getMovieFact = async () => {
    if (!favoriteMovie) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/movie-fact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie: favoriteMovie }),
      });

      const result = await response.json();
      setMovieFact(result.movieFact);
    } catch (error) {
      console.error("Error fetching movie fact:", error);
      setMovieFact("Failed to load movie fact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (favoriteMovie) {
      getMovieFact();
    }
  }, [favoriteMovie]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="mb-6">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="mx-auto h-16 w-16 rounded-full shadow-lg"
              />
            ) : (
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-lg font-semibold">
                  {session?.user?.name?.[0] || "?"}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-sm text-gray-600">{session?.user?.email}</p>
          {favoriteMovie && (
            <p className="mt-4 text-lg text-indigo-600 font-medium">
              Your favorite movie:{" "}
              <span className="font-bold">{favoriteMovie}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🎬 Movie Fact
            </h2>
            <p className="text-sm text-gray-500">
              Here's an interesting fact about {favoriteMovie}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-500">
                Generating movie fact...
              </p>
            </div>
          ) : movieFact ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-md p-4 border-l-4 border-indigo-500">
                <p className="text-gray-800 leading-relaxed">{movieFact}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No movie fact available</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
