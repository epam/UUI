export const searchToQuery = (search: string): Record<string, any> => {
    const query = {} as any;
    new URLSearchParams(search).forEach((value, key) => {
        if (!value) return;

        try {
            query[key] = JSON.parse(decodeURIComponent(value));
        } catch (e) {
            query[key] = value;
        }
    });

    return query;
};
