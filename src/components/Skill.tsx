import {
  useFloating,
  autoUpdate,
  offset,
  arrow,
  FloatingArrow,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { useRef, useState } from "react";

const logos = {
  "astro-icon": "i-logos-astro-icon",
  aws: "i-logos-aws",
  bootstrap: "i-logos-bootstrap",
  craftcms: "i-logos-craftcms",
  "css-3": "i-logos-css-3",
  d3: "i-logos-d3",
  "django-icon": "i-logos-django-icon",
  "docker-icon": "i-logos-docker-icon",
  "github-icon": "i-logos-github-icon",
  gitlab: "i-logos-gitlab",
  go: "i-logos-go",
  grunt: "i-logos-grunt",
  "html-5": "i-logos-html-5",
  javascript: "i-logos-javascript",
  jekyll: "i-logos-jekyll",
  jquery: "i-logos-jquery",
  laravel: "i-logos-laravel",
  less: "i-logos-less",
  "netlify-icon": "i-logos-netlify-icon",
  "nextjs-icon": "i-logos-nextjs-icon",
  "nodejs-icon": "i-logos-nodejs-icon",
  "nuxt-icon": "i-logos-nuxt-icon",
  php: "i-logos-php",
  postgresql: "i-logos-postgresql",
  "prismic-icon": "i-logos-prismic-icon",
  python: "i-logos-python",
  react: "i-logos-react",
  ruby: "i-logos-ruby",
  sass: "i-logos-sass",
  "storyblok-icon": "i-logos-storyblok-icon",
  "tailwindcss-icon": "i-logos-tailwindcss-icon",
  threejs: "i-logos-threejs",
  "travis-ci": "i-logos-travis-ci",
  unocss: "i-logos-unocss",
  vue: "i-logos-vue",
  webpack: "i-logos-webpack",
  "wordpress-icon": "i-logos-wordpress-icon",
};

export function Skill({ logo, name }: { logo: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), arrow({ element: arrowRef })],
  });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div
        className={`w-8 h-8 ${logos[logo as keyof typeof logos]}`}
        ref={refs.setReference}
        {...getReferenceProps()}
      />
      {isOpen ? (
        <div
          className="rounded-lg bg-dark text-white text-xs p-1"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <FloatingArrow
            className="fill-dark"
            ref={arrowRef}
            context={context}
          />
          {name}
        </div>
      ) : null}
    </>
  );
}
