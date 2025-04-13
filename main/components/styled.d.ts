import React, { FC, ComponentPropsWithoutRef, JSX, ComponentType } from "react";
import { ThemeType } from "../theme/theme";
import { motion, MotionProps } from "framer-motion";
type StyleObject = {
    [key: string]: string | number | StyleObject;
};
type StyledProps<T, P> = Omit<T, keyof P> & P & {
    $theme?: ThemeType;
    className?: string;
    children?: React.ReactNode;
};
type StyleParam<P> = StyleObject | ((props: {
    $theme: ThemeType;
} & P) => StyleObject);
export declare function styled<T extends keyof JSX.IntrinsicElements, P extends object = {}>(tag: T, styleParam: StyleParam<P>): FC<StyledProps<ComponentPropsWithoutRef<T>, P>>;
export declare function styled<P extends object = {}, T extends ComponentType<any> = ComponentType<any>>(component: T, styleParam: StyleParam<P>): FC<StyledProps<ComponentPropsWithoutRef<T>, P>>;
export type StyledMotionComponent<P = {}> = FC<StyledProps<MotionProps, P>>;
export declare function styledMotion<C extends keyof typeof motion, P extends object = {}>(component: C, styleParam: StyleParam<P>): StyledMotionComponent<P>;
export {};
