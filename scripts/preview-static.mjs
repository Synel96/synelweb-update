import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const rootDir = resolve(process.cwd(), "dist/client");
const host = process.env.HOST || "localhost";
const port = Number(process.env.PORT || 4173);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getMimeType(filePath) {
  return MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function isFile(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

async function resolveFile(pathname) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const candidates = [];

  if (safePath === "/") {
    candidates.push(join(rootDir, "index.html"));
  } else {
    const exact = join(rootDir, safePath);
    candidates.push(exact);

    if (pathname.endsWith("/")) {
      candidates.push(join(rootDir, safePath, "index.html"));
    }

    if (!extname(pathname)) {
      candidates.push(join(rootDir, safePath, "index.html"));
    }
  }

  for (const candidate of candidates) {
    if (await isFile(candidate)) return candidate;
  }

  return join(rootDir, "404.html");
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);
    const filePath = await resolveFile(url.pathname);
    const body = await readFile(filePath);
    const is404 = filePath.endsWith("404.html");

    res.writeHead(is404 ? 404 : 200, {
      "Content-Type": getMimeType(filePath),
      "Cache-Control": "no-cache",
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(error instanceof Error ? error.message : "Unknown preview server error");
  }
});

server.listen(port, host, () => {
  console.log(`Static preview running at http://${host}:${port}`);
  console.log(`Serving ${rootDir}`);
});
