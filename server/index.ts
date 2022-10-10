import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import { Theme } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js";
import "dotenv/config";
import {
  buildClientSchema,
  printSchema,
  Source,
  buildSchema,
  getIntrospectionQuery,
  print,
  GraphQLSchema,
} from "graphql";
import adminApiIntrospection from "../graphql.schema.json" assert { type: "json" };
import storefrontApiIntrospection from "../storefront-graphql.schema.json" assert { type: "json" };
import { argsLookup } from "./sampleArgs.ts";

import fs from "fs";
import { generateMutationsFromSchema } from "./generateMutationsFromSchema.ts";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import { IntrospectionQuery } from "graphql";

const adminMutationList = generateMutationsFromSchema(
  adminApiIntrospection as IntrospectionQuery
);
const storefrontMutationList = generateMutationsFromSchema(
  storefrontApiIntrospection as IntrospectionQuery
);

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      if (!res.headersSent) {
        res.status(500).send(error.message);
      }
    }
  });

  app.post("/storefront-api", verifyRequest(app), async (req, res) => {
    // const accessToken = process.env.STOREFRONT_TOKEN;
    // const shop = process.env.SHOP;

    // const introspectionQuery = getIntrospectionQuery()

    // const storefrontClient = new Shopify.Clients.Storefront(shop, accessToken);

    // const schema = await storefrontClient.query({
    //   data: introspectionQuery,
    // })

    // const builtSchema = buildClientSchema(schema.body.data);
    // const schemaLanguage = printSchema(builtSchema);
    // const source = new Source(schemaLanguage);
    // const validSchema = buildSchema(source, { assumeValidSDL: true });

    //   fs.writeFile('./storefront-schema.graphql', validSchema, function (err) {
    //     if (err) return console.log(err);
    //     console.log('schema written');
    //   });

    res.status(200).send();
  });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.use(express.json());

  app.get("/admin-api/mutations", verifyRequest(app), async (req, res) => {
    res.status(200).send(JSON.stringify({ data: adminMutationList }));
  });

  app.get(
    "/admin-api/mutations/:mutation",
    verifyRequest(app),
    async (req, res) => {
      const name = req.params.mutation;

      const mutation = adminMutationList.find(
        (item) => item.mutationInfo.name === name
      );
      res.status(200).send(JSON.stringify({ data: mutation }));
    }
  );

  app.get(
    "/admin-api/mutations/:mutation/datasets",
    verifyRequest(app),
    async (req, res) => {
      const name = req.params.mutation;

      const data = argsLookup[name] ?? [];

      res.status(200).send(JSON.stringify({ data }));
    }
  );

  app.get(
    "/admin-api/mutations/:mutation/datasets/:id",
    verifyRequest(app),
    async (req, res) => {
      const name = req.params.mutation;
      const id = req.params.id;

      const data = argsLookup[name] ?? [];
      const item = data.find((item) => item.id === id);

      console.log({ data, id, item });

      res.status(200).send(JSON.stringify({ data: item }));
    }
  );

  app.get("/storefront-api/mutations", verifyRequest(app), async (req, res) => {
    res.status(200).send(JSON.stringify({ data: storefrontMutationList }));
  });

  app.get(
    "/storefront-api/mutations/:mutation",
    verifyRequest(app),
    async (req, res) => {
      const mutation = req.params.mutation;
      console.log({ mutation });
      res.status(200).send(JSON.stringify({ data: storefrontMutationList }));
    }
  );

  app.get("/themes", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const themes = await Theme.all({
      session,
    });

    res.status(200).send(themes);
  });

  app.post("/theme-switch", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );

    const themeId = req.body?.id;

    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const theme = new Theme({ session });

    theme.id = themeId;
    theme.role = "main";

    const response = await theme.save({
      update: true,
    });

    res.status(200).send();
  });

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
