import { ApiCallError, ApiContext } from '../ApiContext';

const delay = (time?: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, time || 0);
    });

describe('ApiContext', () => {
    let context = new ApiContext({});

    const testData = { testData: 'test test' };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const getFetchMock = (status: number, data?: any): any => {
        return jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(data || testData),
                ok: status === 200,
                status: status,
            });
        });
    };

    afterEach(() => {
        (global.fetch as any).mockClear();
        context = new ApiContext({});
    });

    it('should make a request', async () => {
        const fetchMock = getFetchMock(200);
        global.fetch = fetchMock;

        await context.processRequest('path', 'POST', testData);
        expect(fetchMock).toBeCalledTimes(1);
        expect(fetchMock).toBeCalledWith('path', {
            headers,
            method: 'POST',
            body: JSON.stringify(testData),
            credentials: 'include',
        });
    });

    it('should handle api error', async () => {
        const fetchMock = getFetchMock(500);
        global.fetch = fetchMock;

        await context.processRequest('path', 'POST', testData).catch(() => {});
        const call = context.getActiveCalls()[0];

        expect(call.status).toEqual('error');
        expect(call.httpStatus).toEqual(500);
    });

    it('should handle connection lost', async () => {
        const fetchMock = getFetchMock(408);
        global.fetch = fetchMock;

        context.processRequest('path', 'POST', testData);
        await delay(100);

        const call: any = context.getActiveCalls()[0];
        expect(call.status).toEqual('scheduled');

        expect(fetchMock).toBeCalledWith('/auth/ping', {
            method: 'GET',
            credentials: 'include',
        });
    });

    it('should handle auth lost', async () => {
        const fetchMock = getFetchMock(401);
        global.fetch = fetchMock;

        const windowOpenMock = jest.fn(() => {});
        global.open = windowOpenMock as any;

        context.processRequest('path', 'POST', testData);
        await delay(100);

        const call: any = context.getActiveCalls()[0];
        expect(call.status).toEqual('scheduled');
        await delay();

        expect(windowOpenMock).toBeCalledWith('/auth/login');

        (global.open as any).mockClear();
    });

    it('should reject promise on api error with type manual', async () => {
        const fetchMock500 = getFetchMock(500);
        const fetchMock503 = getFetchMock(503);

        global.fetch = fetchMock500;
        await expect(context.processRequest('path', 'POST', testData, { errorHandling: 'manual' })).rejects.toEqual(new ApiCallError(null));

        global.fetch = fetchMock503;
        await expect(context.processRequest('path', 'POST', testData, { errorHandling: 'manual' })).rejects.toEqual(new ApiCallError(null));

        const call = context.getActiveCalls();

        expect(context.status).toEqual('idle');
        expect(call.length).toEqual(0);
    });
});
