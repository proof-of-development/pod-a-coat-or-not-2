const http = require('http');
const { URL } = require('url');

const PORT = 3000;
const HOST = '0.0.0.0';

const TRUTHY = new Set(['true', 'yes', '1', 'y', 'on']);

function isRaining(value) {
  if (value === null || value === undefined) return false;
  return TRUTHY.has(String(value).trim().toLowerCase());
}

const server = http.createServer((req, res) => {
  let url;
  try {
    url = new URL(req.url, 'http://localhost');
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request\n');
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Allow': 'GET, HEAD'
    });
    res.end('Method not allowed\n');
    return;
  }

  const raining = isRaining(url.searchParams.get('raining'));
  const body = raining
    ? 'Yes, take a coat. It is raining.\n'
    : 'No coat needed. It is dry.\n';

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(req.method === 'HEAD' ? undefined : body);
});

server.listen(PORT, HOST, () => {
  console.log(`Coat service listening on http://${HOST}:${PORT}`);
});
