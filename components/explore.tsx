"use client";

import Link from "next/link";
import React from "react";
import FileExplorer from "./file_explorer";
import useTorrentInfo from "@/core/hooks/torrent";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { Icons } from "./icons";

const Explore = ({ infohash }: { infohash: string }) => {
  const { torrent, error, isLoading } = useTorrentInfo(infohash);

  console.log(torrent, error, isLoading);

  if (isLoading)
    return (
      <div className="mx-auto flex flex-col justify-center items-center h-screen gap-8">
        <h1 className="text-6xl font-semibold text-primary inline-flex gap-2 items-center">
          Fetching Infohash{" "}
          <Icons.loading className="text-primary stroke-current" />
        </h1>
        <p className="text-xl font-medium">Getting {infohash}</p>
      </div>
    );

  if (error || !torrent)
    return (
      <div
        className="container mx-auto flex flex-col justify-center
          place-items-center h-screen"
      >
        <h1 className="text-6xl font-bold text-red-500 mb-16">Error!</h1>
        <p className="text-xl">Failed to fetch info: {infohash}</p>
        <Link href="/" className="text-white bg-sky-600 px-4 py-2 mt-6 rounded">
          Home
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto my-16 flex flex-col">
      <div className="flex gap-x-4 mb-8">
        <Link href="/">
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{torrent!.name}</h1>
      </div>
      <FileExplorer infohash={infohash} />
    </div>
  );
};

export default Explore;
