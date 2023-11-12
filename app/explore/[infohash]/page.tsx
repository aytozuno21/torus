import Explore from "@/components/explore";

interface ExplorerPageParams {
  infohash: string;
}

export default function ExplorerPage({
  params,
}: {
  params: ExplorerPageParams;
}) {
  return <Explore infohash={params.infohash} />;
}
