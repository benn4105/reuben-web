import type { NextConfig } from "next";
import { createRequire } from "node:module";

const nextConfig: NextConfig = {
  /* config options here */
};

const require = createRequire(import.meta.url);
const sentryEnabled = Boolean(process.env.SENTRY_AUTH_TOKEN);
let withSentryConfig: undefined | ((config: NextConfig, options: Record<string, unknown>) => NextConfig);

if (sentryEnabled) {
  try {
    ({ withSentryConfig } = require("@sentry/nextjs"));
  } catch {
    withSentryConfig = undefined;
  }
}

const sentryOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  org: "reuben",
  project: "reuben-web",
  sentryUrl: "https://sentry.io/",
  
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default withSentryConfig ? withSentryConfig(nextConfig, sentryOptions) : nextConfig;
