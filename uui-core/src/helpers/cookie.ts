export function getCookie(name: string) {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// options - (expires, path, domain, secure)
export function setCookie(name: string, value: string, options?: any) {
    options = options || {};

    let expires = options.expires;

    if (typeof expires == 'number' && expires) {
        const d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        options.expires = d;
        expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + '=' + value;

    for (const propName in options) {
        updatedCookie += '; ' + propName;
        const propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += '=' + propValue;
        }
    }

    document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
    setCookie(name, '', { expires: -1 });
}
