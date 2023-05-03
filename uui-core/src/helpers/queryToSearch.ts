export const queryToSearch = (query: Record<string, any>): string => {
    if (!query) return '';

    const params = new URLSearchParams();

    Object.keys(query).forEach((key) => {
        if (query[key] === undefined) return;

        if (typeof query[key] === 'object') {
            params.set(key, JSON.stringify(query[key]));
        } else {
            params.set(key, query[key]);
        }
    });

    return params.toString();
};
