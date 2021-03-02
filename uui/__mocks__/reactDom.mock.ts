const reactDomMock = {
    findDOMNode: jest.fn().mockImplementation(() => ({
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getElementsByClassName: () => [] as HTMLElement[],
    })),
};

module.exports = reactDomMock;