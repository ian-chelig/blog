export default ({
  env,
}: {
  env: (key: string, defaultValue?: any) => any;
}): any => ({
  host: env("HOST", "0.0.0.0"),
  port: env("PORT", 1337) ?? 1337,
  url: env("PUBLIC_URL", "https://strapi.ianmadeit.org"),
  proxy: true,
  security: {
    cors: {
      enabled: true,
      origin: ["https://strapi.ianmadeit.org"],
    },
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    },
  },
  app: {
    keys: env("APP_KEYS")?.split(",") ?? [],
  },
  webhooks: {
    populateRelations: env("WEBHOOKS_POPULATE_RELATIONS") === "true",
  },
});
