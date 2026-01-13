// config/admin.ts
export default ({ env }: { env: (key: string) => string }): any => ({
  url: env("ADMIN_URL") ?? "https://strapi.ianmadeit.org/admin",
  allowedHosts: ["strapi.ianmadeit.org"],
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
});
