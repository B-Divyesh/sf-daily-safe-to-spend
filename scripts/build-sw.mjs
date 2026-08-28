import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const appHtml = await readFile(join(dist, "index.html"), "utf8");
for (const route of ["demo", "privacy", "terms"]) {
  await mkdir(join(dist, route), { recursive: true });
  await writeFile(join(dist, route, "index.html"), appHtml);
}
await writeFile(join(dist, "404.html"), appHtml);
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]));
  return nested.flat();
}
const assets = (await files(dist)).map((file) => `/${relative(dist, file)}`).filter((file) => !["/sw.js", "/404.html", "/staticwebapp.config.json"].includes(file) && !file.endsWith(".map"));
const version = (await readFile(join(dist, "index.html"), "utf8")).match(/assets\/[^"']+/)?.[0] ?? Date.now().toString();
const sw = `const CACHE = ${JSON.stringify(`today-money-${version}`)};
const PRECACHE = ${JSON.stringify(assets)};
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(async keys => { const oldCaches = keys.filter(key => key.startsWith("today-money-") && key !== CACHE); await Promise.all(oldCaches.map(key => caches.delete(key))); await self.clients.claim(); })));
self.addEventListener("message", event => { if (event.data?.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    if (url.pathname.includes("/verify")) event.respondWith(fetch(event.request));
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response; }).catch(async () => (await caches.match(event.request, { ignoreVary: true })) || (await caches.match("/index.html", { ignoreVary: true })) || (await caches.match("/offline.html", { ignoreVary: true }))));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then(cached => cached || fetch(event.request).then(response => { if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); } return response; })));
});`;
await writeFile(join(dist, "sw.js"), sw);
console.log(`service worker: ${assets.length} files in ${CACHE_LABEL(version)}`);
function CACHE_LABEL(value) { return `today-money-${value}`; }
