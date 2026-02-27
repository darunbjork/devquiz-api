// Step 13: in concise and short without no academic jargon, set up a simple Bun server in index.ts that serves the frontend and provides a few API endpoints for testing. This will allow you to verify that your server is running correctly and can handle basic requests before you implement the full functionality of your quiz application. The server will serve the index.html file for all unmatched routes and provide simple JSON responses for specific API endpoints, such as '/api/hello' and '/api/hello/:name'. This setup will help you ensure that your development environment is properly configured and ready for building out the rest of your application features.
import { serve } from 'bun';
import index from './index.html';

const server = serve({
  // Enable development features when not in production 
  // This includes console logging and hot module reloading (HMR) for a better development experience. 
  // In development mode, the server will echo console logs from the browser to the server console, allowing you to see client-side logs in your terminal. 
  // Additionally, HMR will enable hot reloading of the frontend code, so you can see changes in real-time without needing to refresh the browser manually.
  development: process.env.NODE_ENV !== 'production' && {
    // Echo console logs from the browser to the server
    console: true,

    // Enable browser hot reloading in development
    // What is hmr? HMR stands for Hot Module Replacement, which is a feature that allows you to see changes in real-time without needing to refresh the browser manually. When you make changes to your frontend code, HMR will automatically update the relevant modules in the browser without requiring a full page reload. This can significantly speed up your development workflow by allowing you to see changes immediately as you work on your code.
    hmr: true, // Hot Module Replacement (HMR) allows you to see changes in real-time without needing to refresh the browser manually. 
  },

  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/hello': {
      async GET(_req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT(_req) {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
    },

    '/api/hello/:name': async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },
});

console.log(`🚀 Server running at ${server.url}`);
