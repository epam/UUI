const mockedUrl = {
    href: '/',
    search: '',
};

const setMockedUrl = (filter: any, presetId?: string) => {
    mockedUrl.href = '/?' + new URLSearchParams({ filter, presetId }).toString();
    mockedUrl.search = new URLSearchParams({ filter, presetId }).toString();
};

const clearMockedUrl = () => {
    mockedUrl.href = '/';
    mockedUrl.search = '';
};

Object.defineProperty(window, 'location', {
    get: () => mockedUrl,
});

export { setMockedUrl, clearMockedUrl };
