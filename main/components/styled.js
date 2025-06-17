var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useEffect, useMemo, } from "react";
import { useTheme } from "../theme/theme-provider";
import { motion } from "framer-motion";
// Type guard to check if component is a motion component
function isMotionComponent(component) {
    return (component &&
        (component === motion.div ||
            component === motion.span ||
            // Add other motion components as needed
            Object.values(motion).includes(component)));
}
// Cache to avoid duplicate <style> tags
const styleCache = new Map();
function styleToCss(className, styles) {
    let base = "";
    let nested = "";
    for (const key in styles) {
        const val = styles[key];
        if (typeof val === "object") {
            if (key.startsWith("@media")) {
                // Handle media queries
                nested += `${key} { .${className} { ${styleToDeclarations(val)} } }`;
            }
            else {
                // Handle pseudo-selectors and other nested selectors
                const selector = key.startsWith("&")
                    ? key.replace("&", `.${className}`)
                    : `.${className}${key}`;
                nested += `${selector} { ${styleToDeclarations(val)} }`;
            }
        }
        else {
            base += `${camelCaseToDash(key)}: ${val};`;
        }
    }
    return `.${className} { ${base} } ${nested}`;
}
function styleToDeclarations(obj) {
    return Object.entries(obj)
        .filter(([, v]) => typeof v !== "object")
        .map(([k, v]) => `${camelCaseToDash(k)}: ${v};`)
        .join(" ");
}
function camelCaseToDash(str) {
    return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
function generateClassHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return `sc-${Math.abs(hash).toString(36)}`;
}
// Media query helper functions for common breakpoints
export const media = {
    mobile: (styles) => ({
        "@media (max-width: 768px)": styles,
    }),
    tablet: (styles) => ({
        "@media (min-width: 769px) and (max-width: 1024px)": styles,
    }),
    desktop: (styles) => ({
        "@media (min-width: 1025px)": styles,
    }),
    largeDesktop: (styles) => ({
        "@media (min-width: 1440px)": styles,
    }),
    // Custom breakpoint helper
    custom: (query, styles) => ({
        [`@media ${query}`]: styles,
    }),
};
// Implementation
export function styled(tagOrComponent, styleParam) {
    return function StyledComponent(props) {
        const { theme: contextTheme } = useTheme();
        const $theme = props.$theme || contextTheme;
        const fullProps = Object.assign(Object.assign({}, props), { $theme });
        const styleObj = typeof styleParam === "function" ? styleParam(fullProps) : styleParam;
        const styleKey = JSON.stringify(styleObj);
        const className = useMemo(() => generateClassHash(styleKey), [styleKey]);
        useEffect(() => {
            if (styleCache.has(className))
                return;
            const css = styleToCss(className, styleObj);
            const tag = document.createElement("style");
            tag.textContent = css;
            document.head.appendChild(tag);
            styleCache.set(className, css);
        }, [className, styleKey]);
        const { children, className: incomingClass } = props, rest = __rest(props, ["children", "className"]);
        const combinedClassName = [className, incomingClass]
            .filter(Boolean)
            .join(" ");
        // Handle both HTML elements and React components, including motion components
        if (typeof tagOrComponent === "string") {
            return React.createElement(tagOrComponent, Object.assign(Object.assign({}, rest), { className: combinedClassName }), children);
        }
        else if (isMotionComponent(tagOrComponent)) {
            // For motion components, properly forward props
            return React.createElement(tagOrComponent, Object.assign(Object.assign({}, rest), { className: combinedClassName }), children);
        }
        else {
            // For other React components
            return React.createElement(tagOrComponent, Object.assign(Object.assign({}, rest), { className: combinedClassName }), children);
        }
    };
}
// Helper function specifically for motion components
export function styledMotion(component, styleParam) {
    return styled(motion[component], styleParam);
}
