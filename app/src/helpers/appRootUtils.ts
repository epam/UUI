const ROOT_ID = 'root';
const SHADOW_ROOT_ID = 'root-shadow';

/**
 * Returns HTML element which will be used to mount the app.
 */
export function getAppRootNode() {
    const defaultRoot = document.getElementById(ROOT_ID);
    if (defaultRoot.shadowRoot) {
        /**
         * It's an experimental mode which can be optionally enabled in local dev server (when it's started via "yarn start-sd").
         * It's useful for checking how components behave inside ShadowDOM or to reproduce specific bugs.
         */
        let div = defaultRoot.shadowRoot.getElementById(SHADOW_ROOT_ID);
        if (!div) {
            div = document.createElement('div');
            div.id = SHADOW_ROOT_ID;
            div.className = document.body.className;
            document.body.className = '';
            defaultRoot.shadowRoot.appendChild(div);
        }
        return div;
    }
    return defaultRoot;
}

/**
 * Returns element which is assigned a CSS class for theming
 */
export function getUuiThemeRoot() {
    const rootNode = getAppRootNode();
    if (rootNode.id === SHADOW_ROOT_ID) {
        return rootNode;
    }
    return document.body;
}

export function setThemeCssClass(theme: string) {
    const themeRoot = getUuiThemeRoot();
    const currentTheme = themeRoot.classList.value.match(/uui-theme-(\S+)\s*/)[0].trim();
    themeRoot.classList.replace(currentTheme, `uui-theme-${theme}`);
}

export function getThemeRootComputedStyles() {
    const themeRoot = getUuiThemeRoot();
    return getComputedStyle(themeRoot);
}
