import { NextApiRequest, NextApiResponse } from "next";
import { getTorrentInfo } from "@/utils/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let infohash: string = req.query["infohash"] as string;

  getTorrentInfo(infohash)
    .then(res.json)
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
}
