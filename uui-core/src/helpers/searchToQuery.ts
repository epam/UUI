export const searchToQuery = (search: string): Record<string, any> => {
    const query = {} as Record<string, any>;
    new URLSearchParams(search).forEach((value, key) => {
        if (!value) return;

        try {
            query[key] = JSON.parse(value);
        } catch (e) {
            query[key] = value;
        }
    });

    return query;
};
