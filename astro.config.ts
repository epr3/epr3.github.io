import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "always",
  },
  experimental: {
    assets: true,
  },
  site: "https://epr3.github.io",
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    react(),
  ],
});
