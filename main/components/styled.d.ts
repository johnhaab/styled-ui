import React, { FC, ComponentPropsWithoutRef, JSX, ComponentType } from "react";
import { ThemeType } from "../theme/theme";
import { motion, MotionProps } from "framer-motion";
type StyleObject = {
    [K in keyof React.CSSProperties]?: React.CSSProperties[K];
} & {
    [selector: string]: string | number | StyleObject;
};
type StyledProps<T, P> = Omit<T, keyof P> & P & {
    $theme?: ThemeType;
    className?: string;
    children?: React.ReactNode;
};
type StyleParam<P> = StyleObject | ((props: {
    $theme: ThemeType;
} & P) => StyleObject);
export declare const media: {
    mobile: (styles: StyleObject) => {
        "@media (max-width: 768px)": StyleObject;
    };
    tablet: (styles: StyleObject) => {
        "@media (min-width: 769px) and (max-width: 1024px)": StyleObject;
    };
    desktop: (styles: StyleObject) => {
        "@media (min-width: 1025px)": StyleObject;
    };
    largeDesktop: (styles: StyleObject) => {
        "@media (min-width: 1440px)": StyleObject;
    };
    custom: (query: string, styles: StyleObject) => {
        [x: string]: StyleObject;
    };
};
export declare function styled<T extends keyof JSX.IntrinsicElements, P extends object = {}>(tag: T, styleParam: StyleParam<P>): FC<StyledProps<ComponentPropsWithoutRef<T>, P>>;
export declare function styled<P extends object = {}, T extends ComponentType<any> = ComponentType<any>>(component: T, styleParam: StyleParam<P>): FC<StyledProps<ComponentPropsWithoutRef<T>, P>>;
export type StyledMotionComponent<P = {}> = FC<StyledProps<MotionProps, P>>;
export declare function styledMotion<C extends keyof typeof motion, P extends object = {}>(component: C, styleParam: StyleParam<P>): StyledMotionComponent<P>;
export {};
