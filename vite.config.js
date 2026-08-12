import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        try {
          // Load env vars into process.env
          const env = loadEnv(server.config.mode, process.cwd(), '');
          Object.assign(process.env, env);

          // Parse JSON body for POST requests if needed
          if (req.method === 'POST' && !req.body) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString();
            try {
              req.body = JSON.parse(rawBody);
            } catch (e) {
              req.body = {};
            }
          }

          // Add helper res.json and res.status for compatibility
          if (!res.status) {
            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
          }
          if (!res.json) {
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
          }

          const pathname = req.url.split('?')[0];

          if (pathname === '/api/send-email') {
            const module = await server.ssrLoadModule('./api/send-email.js');
            const handler = module.default;
            return await handler(req, res);
          }

          if (pathname === '/api/contact') {
            const module = await server.ssrLoadModule('./api/contact.js');
            const handler = module.default;
            return await handler(req, res);
          }

          if (pathname === '/api/support-ticket') {
            const module = await server.ssrLoadModule('./api/support-ticket.js');
            const handler = module.default;
            return await handler(req, res);
          }

          next();
        } catch (err) {
          console.error(`[api-dev-server] Error handling ${req.url}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
})
