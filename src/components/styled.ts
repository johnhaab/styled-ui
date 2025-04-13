import React, {
  useEffect,
  useMemo,
  FC,
  ComponentPropsWithoutRef,
  JSX,
  ComponentType,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from "react";
import { ThemeType } from "../theme/theme";
import { useTheme } from "../theme/theme-provider";
import { motion, MotionProps } from "framer-motion";

type StyleObject = {
  [key: string]: string | number | StyleObject;
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

// Type guard to check if component is a motion component
function isMotionComponent(component: any): boolean {
  return (
    component &&
    (component === motion.div ||
      component === motion.span ||
      // Add other motion components as needed
      Object.values(motion).includes(component))
  );
}

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

// Function overloads for better TypeScript support
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

// Implementation
export function styled<
  T extends keyof JSX.IntrinsicElements | ComponentType<any>,
  P extends object = {}
>(tagOrComponent: T, styleParam: StyleParam<P>) {
  return function StyledComponent(props: any) {
    const { theme: contextTheme } = useTheme();
    const $theme = props.$theme || contextTheme;
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
    const combinedClassName = [className, incomingClass]
      .filter(Boolean)
      .join(" ");

    // Handle both HTML elements and React components, including motion components
    if (typeof tagOrComponent === "string") {
      return React.createElement(
        tagOrComponent,
        {
          ...rest,
          className: combinedClassName,
        },
        children
      );
    } else if (isMotionComponent(tagOrComponent)) {
      // For motion components, properly forward props
      return React.createElement(
        tagOrComponent as ComponentType,
        {
          ...rest,
          className: combinedClassName,
        },
        children
      );
    } else {
      // For other React components
      return React.createElement(
        tagOrComponent as ComponentType,
        {
          ...rest,
          className: combinedClassName,
        },
        children
      );
    }
  };
}

// Example usage:
// const MotionBox = styled(motion.div, {
//   display: 'flex',
//   background: 'blue'
// });

// Helper types to make using styled with motion components easier
export type StyledMotionComponent<P = {}> = FC<StyledProps<MotionProps, P>>;

// Helper function specifically for motion components
export function styledMotion<
  C extends keyof typeof motion,
  P extends object = {}
>(component: C, styleParam: StyleParam<P>): StyledMotionComponent<P> {
  return styled(motion[component], styleParam) as StyledMotionComponent<P>;
}
