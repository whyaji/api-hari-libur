// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: "api-hari-libur",
      script: "bun",
      args: "run src/main.ts",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env_file: ".env",
      error_file: "./logs/pm2-api-error.log",
      out_file: "./logs/pm2-api-out.log",
      log_file: "./logs/pm2-api-combined.log",
      time: true,
    },
  ],
};
