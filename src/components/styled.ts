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

/**
 * Represents normal CSS or pseudo-selectors.
 * "key: value" can be:
 * - "color": "red"
 * - ":hover": { color: "blue" }
 * - "& > span": { margin: 10 }
 */
export interface StyleObject {
  [key: string]: string | number | StyleObject;
}

/**
 * A utility type that:
 * 1. Takes a JSX element tag like 'div', 'button', etc.
 * 2. Combines default props for that element with extra typed props `P`.
 */
type StyledProps<T extends keyof JSX.IntrinsicElements, P> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof P
> &
  P & {
    // IMPORTANT: Use your actual theme type here so TypeScript can do auto-completion.
    $theme?: ThemeType;
    children?: React.ReactNode;
    className?: string;
  };

// We allow either a plain object or a function that returns a style object.
type StyleParam<P> =
  | StyleObject
  | ((props: { $theme: ThemeType } & P) => StyleObject);

/**
 * Overload #1: style object (no custom props beyond $theme).
 */
export function styled<T extends keyof JSX.IntrinsicElements>(
  tag: T,
  styleObj: StyleObject
): FC<StyledProps<T, unknown>>;

/**
 * Overload #2: style function with typed props.
 */
export function styled<T extends keyof JSX.IntrinsicElements, P extends object>(
  tag: T,
  styleFn: (props: { $theme: ThemeType } & P) => StyleObject
): FC<StyledProps<T, P>>;

export function styled<
  T extends keyof JSX.IntrinsicElements,
  P extends object = object
>(tag: T, styleParam: StyleParam<P>): FC<StyledProps<T, P>> {
  const StyledComponent: FC<StyledProps<T, P>> = (props) => {
    const { theme } = useTheme(); // <==== Pull theme from context
    const classNameRef = useRef<string>(generateClassName());
    const className = classNameRef.current;

    // Turn styleParam into a function if it's not already.
    const getStyleFn = useMemo(() => {
      if (typeof styleParam === "function") {
        return styleParam;
      } else {
        // If it's a style object, return a no-arg function that always returns the object.
        return () => styleParam;
      }
    }, [styleParam]);

    // Recompute the style object when props change.
    const styleObj = useMemo(() => {
      const finalProps = { ...props, $theme: theme } as {
        $theme: ThemeType;
      } & P;
      return getStyleFn(finalProps);
    }, [props, theme, getStyleFn]);

    // Build final CSS from the style object + class name.
    const finalCss = useMemo(() => {
      return styleObjectToCss(className, styleObj);
    }, [styleObj]);

    // Inject or update the <style> in the DOM.
    useEffect(() => {
      const styleId = `style-${className}`;
      let styleTag = document.getElementById(
        styleId
      ) as HTMLStyleElement | null;

      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = finalCss;

      // No cleanup needed since we're updating existing style tag
    }, [finalCss, className]);

    // Spread the rest props, apply the generated className
    const { children, ...restProps } = props;
    return React.createElement(
      tag,
      {
        ...restProps,
        className: [className, restProps.className].filter(Boolean).join(" "),
      },
      children
    );
  };

  return StyledComponent;
}

function styleObjectToCss(className: string, styleObj: StyleObject): string {
  let baseStyles = "";
  let nestedStyles = "";

  for (const key of Object.keys(styleObj)) {
    const val = styleObj[key];
    if (key.startsWith(":") || key.startsWith("&")) {
      const pseudoSelector = key.startsWith("&")
        ? key.replace("&", `.${className}`)
        : `.${className}${key}`;

      if (typeof val === "object") {
        nestedStyles += `${pseudoSelector} {${styleObjectToDeclarations(
          val as StyleObject
        )}}`;
      }
    } else {
      baseStyles += `${camelCaseToDash(key)}: ${val};`;
    }
  }

  return `.${className} {${baseStyles}} ${nestedStyles}`;
}

function styleObjectToDeclarations(obj: StyleObject): string {
  let declarations = "";
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "object") {
      // If there are nested objects, handle them or skip
      continue;
    }
    declarations += `${camelCaseToDash(key)}: ${val};`;
  }
  return declarations;
}

function camelCaseToDash(str: string) {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

function generateClassName() {
  return "sc-" + Math.random().toString(36).substr(2, 7);
}
