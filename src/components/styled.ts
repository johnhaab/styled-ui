import React, {
  useEffect,
  useMemo,
  useRef,
  FC,
  ComponentPropsWithoutRef,
  JSX,
} from "react";
import { ThemeType } from "../theme/theme";
import { useTheme } from "../theme/theme-provider";

type StyleObject = {
  [key: string]: string | number | StyleObject;
};

type StyledProps<T extends keyof JSX.IntrinsicElements, P> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof P
> &
  P & {
    $theme?: ThemeType;
    className?: string;
    children?: React.ReactNode;
  };

type StyleParam<P> =
  | StyleObject
  | ((props: { $theme: ThemeType } & P) => StyleObject);

// Cache to avoid duplicate <style> tags
const styleCache = new Map<string, string>();

function styleToCss(className: string, styles: StyleObject): string {
  let base = "";
  let nested = "";

  for (const key in styles) {
    const val = styles[key];

    if (typeof val === "object") {
      const selector = key.startsWith("&")
        ? key.replace("&", `.${className}`)
        : `.${className}${key}`;
      nested += `${selector} { ${styleToDeclarations(val)} }`;
    } else {
      base += `${camelCaseToDash(key)}: ${val};`;
    }
  }

  return `.${className} { ${base} } ${nested}`;
}

function styleToDeclarations(obj: StyleObject): string {
  return Object.entries(obj)
    .filter(([, v]) => typeof v !== "object")
    .map(([k, v]) => `${camelCaseToDash(k)}: ${v};`)
    .join(" ");
}

function camelCaseToDash(str: string) {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

function generateClassHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `sc-${Math.abs(hash).toString(36)}`;
}

export function styled<
  T extends keyof JSX.IntrinsicElements,
  P extends object = {}
>(tag: T, styleParam: StyleParam<P>): FC<StyledProps<T, P>> {
  return function StyledComponent(props: StyledProps<T, P>) {
    const { theme: $theme } = useTheme();
    const fullProps = { ...props, $theme } as { $theme: ThemeType } & P;

    const styleObj =
      typeof styleParam === "function" ? styleParam(fullProps) : styleParam;

    const styleKey = JSON.stringify(styleObj);
    const className = useMemo(() => generateClassHash(styleKey), [styleKey]);

    useEffect(() => {
      if (styleCache.has(className)) return;
      const css = styleToCss(className, styleObj);
      const tag = document.createElement("style");
      tag.textContent = css;
      document.head.appendChild(tag);
      styleCache.set(className, css);
    }, [className, styleKey]);

    const { children, className: incomingClass, ...rest } = props;

    return React.createElement(
      tag,
      {
        ...rest,
        className: [className, incomingClass].filter(Boolean).join(" "),
      },
      children
    );
  };
}
