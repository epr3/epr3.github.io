import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://epr3.github.io",
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
  ],
});
