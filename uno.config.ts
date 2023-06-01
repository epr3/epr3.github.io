import { defineConfig, presetIcons } from "unocss";

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetIcons({
      collections: {
        heroicons: () =>
          import("@iconify-json/heroicons/icons.json").then((i) => i.default),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        logos: () =>
          import("@iconify-json/logos/icons.json").then((i) => i.default),
      },
    }),
  ],
});
