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
        className={`w-8 h-8 i-logos-${logo}`}
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
