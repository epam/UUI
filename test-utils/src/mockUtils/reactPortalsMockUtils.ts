import ReactDOM from 'react-dom';

/**
 * Use this mock for snapshot testing only.
 */
export function mockReactPortalsForSnapshots() {
    beforeAll(() => {
        (ReactDOM.createPortal as any) = jest.fn((element) => element);
    });

    afterAll(() => {
        (ReactDOM.createPortal as any).mockClear();
    });
}
