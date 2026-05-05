import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const index = args.indexOf(name);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  const prefixed = args.find((arg) => arg.startsWith(`${name}=`));
  return prefixed ? prefixed.slice(name.length + 1) : fallback;
}

const host = argValue("--host", "127.0.0.1");
const port = Number(argValue("--port", "4173"));

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".pdf", "application/pdf"],
  [".csv", "text/csv; charset=utf-8"],
  [".glb", "model/gltf-binary"],
]);

function resolveSafePath(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const normalized = path.posix.normalize(decoded);
  const relative = normalized.replace(/^\/+/, "");
  const fullPath = path.resolve(distDir, relative);
  if (!fullPath.startsWith(distDir)) return null;
  return fullPath;
}

function candidateFiles(urlPath) {
  const safePath = resolveSafePath(urlPath);
  if (!safePath) return [];
  if (urlPath === "/") return [path.join(distDir, "index.html")];

  const ext = path.extname(safePath);
  const candidates = [safePath];
  if (!ext) {
    candidates.push(`${safePath}.html`);
    candidates.push(path.join(safePath, "index.html"));
  }
  if (ext === "" && urlPath.endsWith("/")) {
    candidates.unshift(path.join(safePath, "index.html"));
  }
  return candidates;
}

function findFile(urlPath) {
  for (const file of candidateFiles(urlPath)) {
    if (existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

function sendFile(res, req, file, status = 200) {
  const ext = path.extname(file);
  const contentType = types.get(ext) ?? "application/octet-stream";
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(file).pipe(res);
}

const server = createServer((req, res) => {
  if (!req.url || !["GET", "HEAD"].includes(req.method ?? "")) {
    res.writeHead(405).end();
    return;
  }

  const url = new URL(req.url, `http://${host}:${port}`);
  const file = findFile(url.pathname);
  if (file) {
    sendFile(res, req, file);
    return;
  }

  const notFound = path.join(distDir, "404.html");
  if (existsSync(notFound)) {
    sendFile(res, req, notFound, 404);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, host, () => {
  console.log(`  Local:   http://${host}:${port}/`);
});
