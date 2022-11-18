import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { Environment } from "./api/api";
import { Layout } from "./components/layout/Layout";

import styles from "./tailwind.css";

type RootRouteLoaderData = {
  environment: Environment;
};

export const loader = (): RootRouteLoaderData => {
  const env: Environment = process.env.NODE_ENV;

  console.log(env);

  return {
    environment: env,
  };
};

export const links: LinksFunction = () => [
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  {
    rel: "icon",
    href: "/favicon-32x32.png",
    type: "image/png",
    sizes: "32x32",
  },
  {
    rel: "icon",
    href: "/favicon-16x16.png",
    type: "image/png",
    sizes: "16x16",
  },
  { rel: "preconnect", href: "https://rsms.me/" },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "YNAB Sync",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout environment={data.environment}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
