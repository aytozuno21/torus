import WebTorrent from "webtorrent";

const client = new WebTorrent();
client.setMaxListeners(100);

export { client };
