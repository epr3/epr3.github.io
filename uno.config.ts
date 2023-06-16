import { defineConfig, presetIcons, presetUno, presetTypography } from "unocss";
import logos from "@iconify-json/logos";

export default defineConfig({
  // ...UnoCSS options
  safelist: [
    ...Object.keys(logos.icons.icons).map((item) => `i-logos-${item}`),
  ],
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({
      collections: {
        heroicons: () =>
          import("@iconify-json/heroicons/icons.json").then((i) => i.default),
        logos: () => logos.icons,
      },
    }),
  ],
});
