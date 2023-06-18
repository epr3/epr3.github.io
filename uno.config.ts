import {
  defineConfig,
  presetIcons,
  presetUno,
  presetTypography,
  presetWebFonts,
  transformerVariantGroup,
} from "unocss";
import logos from "@iconify-json/logos";

export default defineConfig({
  // ...UnoCSS options
  safelist: [
    ...Object.keys(logos.icons.icons).map((item) => `i-logos-${item}`),
  ],
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
        logos: () => logos.icons,
      },
    }),
  ],
});
