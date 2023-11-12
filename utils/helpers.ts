import rangeParser, { Range, Ranges, Result } from "range-parser";
import WebTorrent from "webtorrent";
import mime from "mime";
import pump from "pump";
import { NextApiRequest, NextApiResponse } from "next";
import type { Torrent } from "webtorrent";
import { client } from "@/lib/webtorrent";
import { TorrentInfo } from "@/types";
import { trackers } from "@/core/utils/torrent-trackers";

export function mediaType(file: string) {
  if (file?.endsWith(".mkv")) {
    return "video/x-matroska";
  }
  if (file?.endsWith(".mp4")) {
    return "video/mp4";
  }
}

export function isMediaFile(file: string) {
  return file?.endsWith(".mkv") || file?.endsWith(".mp4");
}
 
export const getTorrentInfo = async (torrentId: string): Promise<TorrentInfo> =>
  new Promise((resolve, reject) => {
    const t = client.get(torrentId);
    if (t) {
      resolve(torrentToJson(t));
      console.log("Torrent already in client");
    } else {
      console.log("Torrent not in client");
      const torrent = client.add(torrentId, {
        announce: trackers,
        maxWebConns: 100,
        strategy: "sequential",
      });
      torrent.on("error", (err) => {
        torrent.destroy();
        reject(err);
      });
      torrent.on("metadata", () => {
        torrent.pause();
        for (let file of torrent.files) file.deselect();
        resolve(torrentToJson(torrent));
      });
    }
  });

export const getTorrent = async (torrentId: string): Promise<Torrent> =>
  new Promise((resolve, reject) => {
    const t = client.get(torrentId);
    if (t) {
      resolve(t);
      console.log("Torrent already in client");
    } else {
      console.log("Torrent not in client");
      const torrent = client.add(torrentId, {
        announce: trackers,
        maxWebConns: 100,
        strategy: "sequential",
      });
      torrent.on("error", (err) => {
        torrent.destroy();
        console.log("Error in torrent", err);
        reject(err);
      });
      torrent.on("ready", () => {
        torrent.pause();
        for (let file of torrent.files) file.deselect();
        resolve(torrent);
      });
    }
  });

/** converts torrent into json format to ease server/client sharing */
export const torrentToJson = (torrent: WebTorrent.Torrent): TorrentInfo => ({
  name: torrent.name,
  infoHash: torrent.infoHash,
  size: Math.max(torrent.length, 0),
  peers: torrent.numPeers,
  downloaded: Math.max(torrent.downloaded, 0),
  files: torrent.files?.map((file) => ({
    name: file.name,
    path: "/" + file.path,
    size: Math.max(file.length, 0),
    type: mime.getType(file.name) || "application/octet-stream",
    downloaded: Math.max(file.downloaded, 0),
  })),
});

/**
 * request torrent object by its id or info hash
 */

/**
 * stream file and support continues downloading
 */
export const streamFile = (
  file: WebTorrent.TorrentFile | undefined,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!file) {
    res.status(404).json({ error: "file not found" });
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", mime.getType(file.name) || "");

  // Support range-requests
  res.setHeader("Accept-Ranges", "bytes");

  // Set name of file (for "Save Page As..." dialog)
  res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);

  // `rangeParser` returns an array of ranges, or an error code (number) if
  // there was an error parsing the range.
  let range: Range | Ranges | Result | null = rangeParser(
    file.length,
    req.headers.range || "application/octet-stream"
  );

  if (Array.isArray(range)) {
    res.statusCode = 206; // indicates that range-request was understood

    // no support for multi-range request, just use the first range
    // @ts-ignore
    range = range[0] as Range;

    res.setHeader(
      "Content-Range",
      `bytes ${range.start}-${range.end}/${file.length}`
    );
    res.setHeader("Content-Length", range.end - range.start + 1);
  } else {
    range = null;
    res.setHeader("Content-Length", file.length);
  }

  if (req.method === "HEAD") return res.end();

  pump(
    file.createReadStream(
      range ? { start: range.start, end: range.end } : undefined
    ),
    res
  );
};
