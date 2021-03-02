export enum Browser {
    Firefox,
    Opera,
    IE,
    Edge,
    Chrome,
    Safari,
    Other,
}

export function getBrowser() {
    let sBrowser;
    const sUsrAg = navigator.userAgent;

    // The order matters here, and this may report false positives for unlisted browsers.

    if (sUsrAg.indexOf("Firefox") > -1) {
        sBrowser = Browser.Firefox;
    } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
        sBrowser = Browser.Opera;
    } else if (sUsrAg.indexOf("Trident") > -1) {
        sBrowser = Browser.IE;
    } else if (sUsrAg.indexOf("Edge") > -1) {
        sBrowser = Browser.Edge;
    } else if (sUsrAg.indexOf("Chrome") > -1) {
        sBrowser = Browser.Chrome;
    } else if (sUsrAg.indexOf("Safari") > -1) {
        sBrowser = Browser.Safari;
    } else {
        sBrowser = Browser.Other;
    }

    return sBrowser;
}