import { getTorrent, streamFile } from "@/utils/helpers";
import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const infohash: string = req.query["infohash"] as string;

  const path: string = (req.query["path"] as string[]).join("/");

  getTorrent(infohash)
    .then((torrent) => {
      const file = torrent.files.filter((f) => f.path === path)[0];
      file.select();
      streamFile(file, req, res);
    })
    .catch((_) => res.status(404).json({ error: error }));
}
