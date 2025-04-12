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
// Cache to avoid duplicate <style> tags
const styleCache = new Map();
function styleToCss(className, styles) {
    let base = "";
    let nested = "";
    for (const key in styles) {
        const val = styles[key];
        if (typeof val === "object") {
            const selector = key.startsWith("&")
                ? key.replace("&", `.${className}`)
                : `.${className}${key}`;
            nested += `${selector} { ${styleToDeclarations(val)} }`;
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
export function styled(tag, styleParam) {
    return function StyledComponent(props) {
        const { theme: $theme } = useTheme();
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
        return React.createElement(tag, Object.assign(Object.assign({}, rest), { className: [className, incomingClass].filter(Boolean).join(" ") }), children);
    };
}
