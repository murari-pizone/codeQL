module.exports = {
  apps: [
    {
      name: 'PIzone_Aggregator',
      script: 'server.js', // Your main entry file
      instances: 'max', // Runs on all available CPU cores
      exec_mode: 'cluster', // Cluster mode for better performance
      watch: false, // Set to true to auto-restart on file changes
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
