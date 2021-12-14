export const windowMock = {
    matchMedia: () => ({matches: false}),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    document: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    },
};