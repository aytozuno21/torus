import { usePath } from "@/core/hooks/path";
import useTorrentInfo from "@/core/hooks/torrent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TorrentFileInfo } from "@/types";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderClosed, FolderUp } from "lucide-react";

export interface FileExplorerProps {
  infohash: string;
  path?: string;
}

function getDirs(path: string, files: TorrentFileInfo[]): string[] {
  const dirs: string[] = [];
  const len = path.length;

  console.log(files);

  if (files?.length > 0) {
    for (const file of files) {
      if (!file.path.startsWith(path)) continue;
      const spath = file.path
        .substring(len)
        .split("/")
        .filter((n) => n);
      if (spath.length <= 1) continue;
      if (dirs.indexOf(spath[0]) == -1) dirs.push(spath[0]);
    }
  }

  return dirs;
}

function getFiles(path: string, files: TorrentFileInfo[]): TorrentFileInfo[] {
  return files?.filter((f: TorrentFileInfo) => f.path === `${path}/${f.name}`);
}

function getFileSize(size: number) {
  return size > 1000000000
    ? `${(size / 1000000000).toFixed(2)} GB`
    : size > 1000000
    ? `${(size / 1000000).toFixed(2)} MB`
    : `${(size / 1000).toFixed(2)} KB`;
}

function File({ file, infohash }: { file: TorrentFileInfo; infohash: string }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link href={`/api/torrent/${infohash}${file.path}`}>{file.name}</Link>
      </TableCell>
      <TableCell className="text-center">
        {Math.round((file.downloaded / file.size) * 100)}%
      </TableCell>
      <TableCell className="text-center">{getFileSize(file.size)}</TableCell>
    </TableRow>
  );
}

function Directory({ name, onClick }: { name?: string; onClick: () => void }) {
  return (
    <TableRow onClick={onClick}>
      <TableCell className="cursor-pointer font-bold inline-flex items-center gap-2">
        {name ? (
          <>
            <FolderClosed className="w-4 h-4" />
            {name}
          </>
        ) : (
          <FolderUp className="w-4 h-4" />
        )}
      </TableCell>
      <TableCell className="text-center">~</TableCell>
      <TableCell className="text-center">~</TableCell>
    </TableRow>
  );
}

export default function FileExplorer({
  infohash,
  path: initPath,
}: FileExplorerProps) {
  const { torrent, error, isLoading } = useTorrentInfo(infohash);
  const { path, open, back } = usePath(initPath);
  const [dirs, setDirs] = useState<string[]>([]);
  const [files, setFiles] = useState<TorrentFileInfo[]>([]);
  const router = useRouter();

  useEffect(() => {
    setDirs(torrent ? getDirs(path, torrent.files) : []);
    setFiles(torrent ? getFiles(path, torrent.files) : []);
  }, [path, torrent]);

  const watchVideo = (path: string) =>
    router.push(`/player/${infohash}${path}`);

  if (isLoading) return <div>Loading...</div>;
  if (error || !torrent) return <div>Failed to fetch torrent files!</div>;

  return (
    <div>
      <h2 className="text-muted-foreground text-lg font-medium">
        Path: {path}
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        <Table>
          <TableCaption>List of files</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead className="text-center w-24">Progress</TableHead>
              <TableHead className="text-center">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {path !== "/" ? <Directory name="/" onClick={back} /> : null}
            {dirs.map((name) => (
              <Directory
                key={path + "/" + name}
                name={name}
                onClick={() => open(name)}
              />
            ))}
            {files?.map((file) => (
              <File key={file.path} file={file} infohash={infohash} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
