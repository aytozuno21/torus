"use client";

export default function VideoPlayer({
  params: { infohash, path },
}: {
  params: { infohash: string; path: string[] };
}) {
  return (
    <div>
      <h4>
        Player: {infohash}:/{path.join("/")}
      </h4>
      <video src={`/api/torrent/${infohash}/${path.join("/")}`} controls />
    </div>
  );
}
