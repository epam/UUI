import ReactDOM from 'react-dom';

/**
 * It mocks React portals, so that it's possible to do a snapshot testing of components which use Portals internally.
 *
 * Use this mock for snapshot testing only.
 */
export function mockReactPortalsForSnapshots() {
    (ReactDOM.createPortal as any) = jest.fn((element) => element);
    return {
        mockClear: (ReactDOM.createPortal as any).mockClear(),
    };
}
