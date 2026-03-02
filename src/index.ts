/* eslint-disable perfectionist/sort-objects */
// Step 13: in concise and short without no academic jargon, set up a simple Bun server in index.ts that serves the frontend and provides a few API endpoints for testing. This will allow you to verify that your server is running correctly and can handle basic requests before you implement the full functionality of your quiz application. The server will serve the index.html file for all unmatched routes and provide simple JSON responses for specific API endpoints, such as '/api/hello' and '/api/hello/:name'. This setup will help you ensure that your development environment is properly configured and ready for building out the rest of your application features.
import { serve } from 'bun';
import index from './index.html';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

const server = serve({
  // Enable development features when not in production 
  development: process.env.NODE_ENV !== 'production' && {
    console: true,
    hmr: true, 
  },

  fetch(req) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    const url = new URL(req.url);
    
    // API Routes
    if (url.pathname === '/api/hello') {
      return Response.json({ message: 'Hello, world!', method: req.method }, { headers: corsHeaders });
    }

    if (url.pathname.startsWith('/api/hello/')) {
      const name = url.pathname.slice('/api/hello/'.length);
      return Response.json({ message: `Hello, ${name}!` }, { headers: corsHeaders });
    }

    // Default to serving the index.html
    return new Response(index.toString(), {
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders,
      },
    });
  }
});

console.log(`🚀 Server running at ${server.url}`);
