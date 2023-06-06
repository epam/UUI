import ReactDOM from 'react-dom';

/**
 * It mocks React portals, so that it's possible to do a snapshot testing of components which use Portals internally.
 *
 * Use this mock for snapshot testing only.
 */
export function mockReactPortalsForSnapshots() {
    const prevMethod = ReactDOM.createPortal;
    ReactDOM.createPortal = ((elem: any) => elem) as any;
    return {
        mockClear: () => {
            ReactDOM.createPortal = prevMethod;
        },
    };
}
