import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  /** `content` is the default editorial width; `wide` is for full-bleed grids. */
  width?: "content" | "wide" | "prose";
  as?: ElementType;
  className?: string;
};

export function Container({
  children,
  width = "content",
  as: Tag = "div",
  className,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-7 lg:px-10",
        width === "content" && "max-w-content",
        width === "wide" && "max-w-wide",
        width === "prose" && "max-w-[46rem]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
