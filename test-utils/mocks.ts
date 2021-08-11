export const windowMock = {
    matchMedia: () => ({matches: false}),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
} as any;