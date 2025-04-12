import React, { FC, ComponentPropsWithoutRef, JSX } from "react";
import { ThemeType } from "../theme/theme";
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
type StyledProps<T extends keyof JSX.IntrinsicElements, P> = Omit<ComponentPropsWithoutRef<T>, keyof P> & P & {
    $theme?: ThemeType;
    children?: React.ReactNode;
    className?: string;
};
/**
 * Overload #1: style object (no custom props beyond $theme).
 */
export declare function styled<T extends keyof JSX.IntrinsicElements>(tag: T, styleObj: StyleObject): FC<StyledProps<T, unknown>>;
/**
 * Overload #2: style function with typed props.
 */
export declare function styled<T extends keyof JSX.IntrinsicElements, P extends object>(tag: T, styleFn: (props: {
    $theme: ThemeType;
} & P) => StyleObject): FC<StyledProps<T, P>>;
export {};
