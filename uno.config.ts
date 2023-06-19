import {
  defineConfig,
  presetIcons,
  presetUno,
  presetTypography,
  presetWebFonts,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  // ...UnoCSS options

  transformers: [transformerVariantGroup()],
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Inter:400,500,600,700",
        passion: "Passion One",
        inconsolata: "Inconsolata",
      },
    }),
    presetTypography(),
    presetIcons({
      collections: {
        heroicons: () =>
          import("@iconify-json/heroicons/icons.json").then((i) => i.default),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        logos: import("@iconify-json/logos/icons.json").then((i) => i.default),
      },
    }),
  ],
});
