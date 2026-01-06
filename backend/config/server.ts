export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  proxy: {
    koa: true, // Enable trusting proxy headers
  },
  app: {
    keys: env.array("APP_KEYS"),
  },
});
