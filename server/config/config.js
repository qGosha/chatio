const env = process.env.NODE_ENV
if (env === "development" || env === "test" || env === "seed") {
  const config = require("./config.json")
  const envConfig = config[env]

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key]
  })
}
