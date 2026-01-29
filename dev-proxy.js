const http = require('http');
const httpProxy = require('http-proxy');

const DEFAULT_TARGET = 'http://localhost:3030'; // Old Site

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(function(req, res) {
  
  // 1. Determine year from: Path > Cookie > Referer
  const yearMatch = req.url.match(/^\/(\d{4})/);
  const cookie = req.headers.cookie || '';
  const referer = req.headers['referer'] || '';
  
  let year;

  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
    
    // If we explicitly switch to an old year (< 2026), clear the sticky session cookie
    if (year < 2026) {
        res.setHeader('Set-Cookie', 'meichu-year=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    }
  } else {
    // Check Cookie first (most reliable for session)
    const cookieMatch = cookie.match(/meichu-year=(\d{4})/);
    if (cookieMatch) {
        year = parseInt(cookieMatch[1], 10);
    } else {
        // Fallback to Referer
        const refMatch = referer.match(/\/(\d{4})(\/|$)/);
        if (refMatch) {
            year = parseInt(refMatch[1], 10);
        }
    }
  }
  
  // 2. If it's a new site (2026 or later)
  if (year && year >= 2026) {
    // Set cookie if we hit the year path directly to "stick" the session
    if (yearMatch) {
        res.setHeader('Set-Cookie', `meichu-year=${year}; Path=/; HttpOnly`);
    }

    // Handle trailing slash redirect (e.g. /2026 -> /2026/)
    if (req.url === `/${year}`) {
        res.writeHead(301, { 'Location': `/${year}/` });
        res.end();
        return;
    }

    const targetPort = 20000 + year; // Convention: Port = 20000 + Year
    const target = `http://localhost:${targetPort}`;

    // Strip the year prefix if present, so the target site sees it as root
    if (yearMatch) {
        req.url = req.url.substring(yearMatch[0].length) || '/';
    }

    // console.log(`[Proxy] Routing ${req.url} to ${target} (Year: ${year})`);
    
    proxy.web(req, res, { target }, (e) => {
        // Fallback implies the site isn't running
        console.error(`[Proxy] Failed to connect to ${target}. Is site-${year} running?`);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`Bad Gateway: Could not connect to site-${year} on port ${targetPort}.`);
    });
    return;
  }

  // Default: Everything else goes to Old Site
  proxy.web(req, res, { target: DEFAULT_TARGET }, (e) => {
      // console.error(e);
  });
});

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

console.log("Proxy server running on http://localhost:8080");
server.listen(8080);
