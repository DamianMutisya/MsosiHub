module.exports = {
  apps: [{
    name: "msosi-hub-server",
    script: "server.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}

