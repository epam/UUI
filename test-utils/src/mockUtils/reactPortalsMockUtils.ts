import ReactDOM from 'react-dom';

/**
 * Use this mock for snapshot testing only.
 */
export function mockReactPortalsForSnapshots() {
    (ReactDOM.createPortal as any) = jest.fn((element) => element);
    return {
        mockClear: (ReactDOM.createPortal as any).mockClear(),
    };
}
