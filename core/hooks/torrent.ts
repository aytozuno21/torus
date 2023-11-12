import { useQuery } from "@tanstack/react-query";
import { TorrentInfo } from "@/types";

const fetcher = async (infohash: string) => {
  const res = await fetch(`/api/torrent/${infohash}`);

  console.log("ressy", res)

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function useTorrentInfo(infohash: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: [infohash],
    queryFn: () => fetcher(infohash),
  });

  console.log(data);

  return {
    torrent: data,
    error,
    isLoading,
  } as {
    torrent: TorrentInfo | null;
    error: Error | null;
    isLoading: boolean;
  };
}
