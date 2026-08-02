import {
  defineConfig,
  presetWind3,
  presetWebFonts,
  transformerVariantGroup,
} from "unocss";

// Material dark palette — .scratch/terminal-cobalt-design/design-reference.html
const colors = {
  background: "#000000",
  // surface
  surface: "#101415",
  "surface-dim": "#101415",
  "surface-bright": "#363a3b",
  "surface-variant": "#323537",
  "surface-container": "#1d2022",
  "surface-container-low": "#191c1e",
  "surface-container-lowest": "#0b0f10",
  "surface-container-high": "#272a2c",
  "surface-container-highest": "#323537",
  "surface-tint": "#b7c4ff",
  // on-surface
  "on-surface": "#e0e3e5",
  "on-surface-variant": "#c4c5d7",
  "on-background": "#e0e3e5",
  // primary
  primary: "#3b82f6",
  "primary-container": "#3b82f6",
  "on-primary": "#002682",
  "on-primary-container": "#cad3ff",
  "primary-fixed": "#dce1ff",
  "primary-fixed-dim": "#b7c4ff",
  "on-primary-fixed": "#001551",
  "on-primary-fixed-variant": "#0039b5",
  // secondary
  secondary: "#bec6e0",
  "secondary-container": "#3f465c",
  "on-secondary": "#283044",
  "on-secondary-container": "#adb4ce",
  "secondary-fixed": "#dae2fd",
  "secondary-fixed-dim": "#bec6e0",
  "on-secondary-fixed": "#131b2e",
  "on-secondary-fixed-variant": "#3f465c",
  // outline
  outline: "#8e90a0",
  "outline-variant": "#434655",
};

const fonts = {
  "code-inline": ["JetBrains Mono", "monospace"],
  "body-md": ["JetBrains Mono", "monospace"],
  "body-lg": ["JetBrains Mono", "monospace"],
  "headline-lg": ["JetBrains Mono", "monospace"],
  "headline-lg-mobile": ["JetBrains Mono", "monospace"],
  "headline-md": ["JetBrains Mono", "monospace"],
  "label-sm": ["JetBrains Mono", "monospace"],
};

const fontSizes = {
  "code-inline": ["14px", { lineHeight: "1.4", fontWeight: "400" }],
  "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
  "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
  "headline-lg": [
    "40px",
    { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
  ],
  "headline-lg-mobile": ["30px", { lineHeight: "1.2", fontWeight: "700" }],
  "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
  "label-sm": [
    "12px",
    { lineHeight: "1.0", letterSpacing: "0.05em", fontWeight: "500" },
  ],
};

export default defineConfig({
  // ...UnoCSS options

  transformers: [transformerVariantGroup()],
  theme: {
    colors,
    fontFamily: fonts,
    fontSize: fontSizes,
  },
  presets: [
    presetWind3(),
    presetWebFonts({
      provider: "google",
      fonts: {
        mono: "JetBrains Mono:400,500,700",
      },
    }),
  ],
});
