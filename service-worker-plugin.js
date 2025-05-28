// A Vite plugin that handles service worker copying to the correct location
export default function serviceWorkerPlugin() {
  return {
    name: 'service-worker-plugin',
    async writeBundle() {
      // This hook runs after bundle has been written to disk
      console.log('Service worker plugin running...');
      // The service worker will be copied from public to the build root
      // This is already handled by Vite for files in the public directory
      console.log('Service worker copied to build directory.');
    },
    configureServer(server) {
      // During development, make sure the service-worker.js is served from any path
      return () => {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('/service-worker.js')) {
            // Serve the service worker file for any path
            console.log(`Service worker requested: ${req.url}`);
            req.url = '/service-worker.js';
          }
          next();
        });
      };
    }
  };
}
