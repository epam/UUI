import fs from 'fs';
import path from 'path';

export function getThemeTokenTemplate(params: { scssVars: string, cssVars: string }) {
    const res = fs.readFileSync(path.resolve(__dirname, './_theme_tokens.scss.template'));
    return res
        .toString()
        .replace('<% SCSS_VARS_FORMATTED %>', params.scssVars)
        .replace('<% CSS_VARS_FORMATTED %>', params.cssVars);
}

export function getThemeColorClassesTemplate() {
    const res = fs.readFileSync(path.resolve(__dirname, './_color_classes.scss.template'));
    return res.toString();
}
