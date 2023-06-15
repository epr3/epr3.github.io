import { defineConfig, presetIcons, presetUno } from "unocss";
import logos from "@iconify-json/logos";

export default defineConfig({
  // ...UnoCSS options
  safelist: [
    ...Object.keys(logos.icons.icons).map((item) => `i-logos-${item}`),
  ],
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        heroicons: () =>
          import("@iconify-json/heroicons/icons.json").then((i) => i.default),
        logos: () => logos.icons,
      },
    }),
  ],
});
