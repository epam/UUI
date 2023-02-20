export function isUrl(url: string): boolean {
    const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    return !!url.match(regex);
}

export function prependHttp(url: string, options: { https: boolean }) {
    if (typeof url !== 'string') {
        throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof url}\``);
    }

    url = url.trim();

    if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
        return url;
    }

    return url.replace(/^(?!(?:\w+:)?\/\/)/, options.https ? 'https://' : 'http://');
}
