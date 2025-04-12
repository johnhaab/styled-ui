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
import React, { useEffect, useMemo, useRef, } from "react";
import { useTheme } from "../theme/theme-provider";
export function styled(tag, styleParam) {
    const StyledComponent = (props) => {
        const { theme } = useTheme(); // <==== Pull theme from context
        const classNameRef = useRef(generateClassName());
        const className = classNameRef.current;
        // Turn styleParam into a function if it's not already.
        const getStyleFn = useMemo(() => {
            if (typeof styleParam === "function") {
                return styleParam;
            }
            else {
                // If it's a style object, return a no-arg function that always returns the object.
                return () => styleParam;
            }
        }, [styleParam]);
        // Recompute the style object when props change.
        const styleObj = useMemo(() => {
            const finalProps = Object.assign(Object.assign({}, props), { $theme: theme });
            return getStyleFn(finalProps);
        }, [props, theme, getStyleFn]);
        // Build final CSS from the style object + class name.
        const finalCss = useMemo(() => {
            return styleObjectToCss(className, styleObj);
        }, [styleObj]);
        // Inject or update the <style> in the DOM.
        useEffect(() => {
            const styleId = `style-${className}`;
            let styleTag = document.getElementById(styleId);
            if (!styleTag) {
                styleTag = document.createElement("style");
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }
            styleTag.textContent = finalCss;
            // No cleanup needed since we're updating existing style tag
        }, [finalCss, className]);
        // Spread the rest props, apply the generated className
        const { children } = props, restProps = __rest(props, ["children"]);
        return React.createElement(tag, Object.assign(Object.assign({}, restProps), { className: [className, restProps.className].filter(Boolean).join(" ") }), children);
    };
    return StyledComponent;
}
function styleObjectToCss(className, styleObj) {
    let baseStyles = "";
    let nestedStyles = "";
    for (const key of Object.keys(styleObj)) {
        const val = styleObj[key];
        if (key.startsWith(":") || key.startsWith("&")) {
            const pseudoSelector = key.startsWith("&")
                ? key.replace("&", `.${className}`)
                : `.${className}${key}`;
            if (typeof val === "object") {
                nestedStyles += `${pseudoSelector} {${styleObjectToDeclarations(val)}}`;
            }
        }
        else {
            baseStyles += `${camelCaseToDash(key)}: ${val};`;
        }
    }
    return `.${className} {${baseStyles}} ${nestedStyles}`;
}
function styleObjectToDeclarations(obj) {
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
function camelCaseToDash(str) {
    return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
function generateClassName() {
    return "sc-" + Math.random().toString(36).substr(2, 7);
}
