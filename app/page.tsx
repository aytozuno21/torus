"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { Space_Grotesk } from "next/font/google";
import Movies from "@/components/movies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";

const twConfig = {
  full: {
    form: "h-screen flex flex-col justify-center place-items-center",
    logo: "mb-24 text-6xl",
    input: "w-1/2 mb-6 p-2 rounded",
    button: "py-2 px-4",
  },
  oneline: {
    form: "h-16 p-4 flex items-center gap-x-4",
    logo: "text-xl",
    input: "w-1/3 px-2 py-1 rounded",
    button: "py-1 px-4",
  },
};

export default function Home() {
  const router = useRouter();
  const sp = useSearchParams();
  const q: string | null | undefined =
    sp?.has("q") ?? false ? sp?.get("q") : undefined;
  const showMovies = q !== undefined;
  const [query, setQuery] = useState(q || "");
  const mode = showMovies ? twConfig.oneline : twConfig.full;

  const whichPath = () => {
    var len = query.trim().length;
    return len === 40 ? "/explore/" + query : "/?q=" + query;
  };

  const submit = (e: FormEvent) => {
    if (query.trim().length === 40) router.push("/explore/" + query);
    else router.push("/?q=" + query);
    e.preventDefault();
  };

  return (
    <div>
      <div className="absolute top-0 right-0 p-5">
        <ModeToggle />
      </div>
      <form
        className="mx-auto flex justify-center items-center h-screen flex-col gap-12"
        onSubmit={submit}
      >
        <Link
          href="/"
          className={`text-primary font-bold text-5xl select-none`}
        >
          Torus
        </Link>
        <div className="flex flex-col gap-4 w-1/2">
          <Input
            placeholder="Put a movie name or infohash 🍿"
            value={query}
            className="w-full"
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="gap-x-4 flex">
            <Button asChild>
              <Link href={whichPath()}>Search</Link>
            </Button>

            <Button asChild variant={"outline"}>
              <Link href="/explore/08ada5a7a6183aae1e09d831df6748d566095a10">
                Explore Sintel Example
              </Link>
            </Button>
          </div>
        </div>
      </form>
      {showMovies && <hr />}
      {showMovies && <Movies query={query} />}
    </div>
  );
}
