import React, { FC, ComponentPropsWithoutRef, JSX } from "react";
import { ThemeType } from "../theme/theme";
type StyleObject = {
    [key: string]: string | number | StyleObject;
};
type StyledProps<T extends keyof JSX.IntrinsicElements, P> = Omit<ComponentPropsWithoutRef<T>, keyof P> & P & {
    $theme?: ThemeType;
    className?: string;
    children?: React.ReactNode;
};
type StyleParam<P> = StyleObject | ((props: {
    $theme: ThemeType;
} & P) => StyleObject);
export declare function styled<T extends keyof JSX.IntrinsicElements, P extends object = {}>(tag: T, styleParam: StyleParam<P>): FC<StyledProps<T, P>>;
export {};
