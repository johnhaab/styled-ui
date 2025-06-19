import React, {
  useEffect,
  useMemo,
  FC,
  ComponentPropsWithoutRef,
  JSX,
  ComponentType,
} from "react";
import { ThemeType } from "../theme/theme";
import { useTheme } from "../theme/theme-provider";
import { motion, MotionProps } from "framer-motion";

type StyleObject = {
  [K in keyof React.CSSProperties]?: React.CSSProperties[K];
} & {
  [selector: string]: string | number | StyleObject;
};

type StyledProps<T, P> = Omit<T, keyof P> &
  P & {
    $theme?: ThemeType;
    className?: string;
    children?: React.ReactNode;
  };

type StyleParam<P> =
  | StyleObject
  | ((props: { $theme: ThemeType } & P) => StyleObject);

function isMotionComponent(component: any): boolean {
  return (
    component &&
    (component === motion.div ||
      component === motion.span ||
      Object.values(motion).includes(component))
  );
}

const styleCache = new Map<string, string>();

function styleToCss(className: string, styles: StyleObject): string {
  let base = "";
  let nested = "";

  for (const key in styles) {
    const val = styles[key];
    if (typeof val === "object") {
      if (key.startsWith("@media")) {
        nested += `${key} { .${className} { ${styleToDeclarations(val)} } }`;
      } else {
        const selector = key.startsWith("&")
          ? key.replace("&", `.${className}`)
          : `.${className}${key}`;
        nested += `${selector} { ${styleToDeclarations(val)} }`;
      }
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

export const media = {
  mobile: (styles: StyleObject) => ({
    "@media (max-width: 768px)": styles,
  }),
  tablet: (styles: StyleObject) => ({
    "@media (min-width: 769px) and (max-width: 1024px)": styles,
  }),
  desktop: (styles: StyleObject) => ({
    "@media (min-width: 1025px)": styles,
  }),
  largeDesktop: (styles: StyleObject) => ({
    "@media (min-width: 1440px)": styles,
  }),
  custom: (query: string, styles: StyleObject) => ({
    [`@media ${query}`]: styles,
  }),
};

export function styled<
  T extends keyof JSX.IntrinsicElements,
  P extends object = {}
>(
  tag: T,
  styleParam: StyleParam<P>
): FC<StyledProps<ComponentPropsWithoutRef<T>, P>>;

export function styled<
  P extends object = {},
  T extends ComponentType<any> = ComponentType<any>
>(
  component: T,
  styleParam: StyleParam<P>
): FC<StyledProps<ComponentPropsWithoutRef<T>, P>>;

export function styled<
  T extends keyof JSX.IntrinsicElements | ComponentType<any>,
  P extends object = {}
>(tagOrComponent: T, styleParam: StyleParam<P>) {
  return function StyledComponent(rawProps: any) {
    const { theme: contextTheme } = useTheme();

    const {
      $theme = contextTheme,
      children,
      className: incomingClass,
      ...restProps
    } = rawProps;

    const styleProps = { $theme, ...rawProps } as { $theme: ThemeType } & P;

    const styleObj =
      typeof styleParam === "function" ? styleParam(styleProps) : styleParam;

    const styleKey = JSON.stringify(styleObj);
    const className = useMemo(() => generateClassHash(styleKey), [styleKey]);

    useEffect(() => {
      if (styleCache.has(className)) return;
      const css = styleToCss(className, styleObj);
      const tag = document.createElement("style");
      tag.textContent = css;
      document.head.appendChild(tag);
      styleCache.set(className, css);
    }, [className, styleObj]);

    const combinedClassName = [className, incomingClass]
      .filter(Boolean)
      .join(" ");

    // Filter out only custom $ props, preserve all standard DOM props
    const domProps: Record<string, any> = {};
    for (const key in restProps) {
      if (!key.startsWith("$")) {
        domProps[key] = restProps[key];
      }
    }

    // Ensure className is set
    domProps.className = combinedClassName;

    // REMOVE THIS SOON DONT FORGET HAHA: Debugging purpose
    if (domProps.onClick) {
      console.log("StyledComponent: onClick handler present", tagOrComponent);
    }

    return React.createElement(tagOrComponent as any, domProps, children);
  };
}

export type StyledMotionComponent<P = {}> = FC<StyledProps<MotionProps, P>>;

export function styledMotion<
  C extends keyof typeof motion,
  P extends object = {}
>(component: C, styleParam: StyleParam<P>): StyledMotionComponent<P> {
  return styled(motion[component], styleParam) as StyledMotionComponent<P>;
}
