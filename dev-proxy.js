const http = require('http');
const httpProxy = require('http-proxy');

const DEFAULT_TARGET = 'http://localhost:3030'; // Old Site

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(function(req, res) {
  
  // Dynamic Year Based Routing
  // Rule: /XXXX -> maps to port 2XXXX (e.g. /2026 -> 22026)
  // Only applies for years >= 2026
  
  const yearMatch = req.url.match(/^\/(\d{4})/);
  
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);

    // If it's a new site (2026 or later)
    if (year >= 2026) {
        
        // Handle trailing slash redirect (e.g. /2026 -> /2026/)
        if (req.url === `/${year}`) {
            res.writeHead(301, { 'Location': `/${year}/` });
            res.end();
            return;
        }

        const targetPort = 20000 + year; // Convention: Port = 20000 + Year
        const target = `http://localhost:${targetPort}`;

        // console.log(`[Proxy] Routing /${year} to ${target}`);
        
        proxy.web(req, res, { target }, (e) => {
            // Fallback implies the site isn't running
            console.error(`[Proxy] Failed to connect to ${target}. Is site-${year} running?`);
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end(`Bad Gateway: Could not connect to site-${year} on port ${targetPort}.`);
        });
        return;
    }
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
