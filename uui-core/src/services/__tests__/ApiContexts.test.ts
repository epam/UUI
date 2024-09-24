import { ApiCallError, ApiContext } from '../ApiContext';

type GlobalOpenType = typeof global.open;

const delay = (time?: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, time || 0);
    });

const parseBlob = async (response: Response) => {
    if (response.ok) {
        return await response.blob();
    }

    return await response.text();
};

describe('ApiContext', () => {
    let context = new ApiContext({});

    interface TestData {
        testData: string;
    }

    const testData: TestData = {
        testData: 'test test',
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const getFetchMock = (status: number) => {
        return jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(testData),
                ok: status === 200,
                status: status,
            } as Response);
        });
    };

    afterEach(() => {
        (global.fetch as jest.Mock<Promise<Response>>).mockClear?.();
        context = new ApiContext({});
    });

    it('should make a request', async () => {
        const fetchMock = getFetchMock(200);
        global.fetch = fetchMock;

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        );

        expect(fetchMock).toBeCalledTimes(1);
        expect(fetchMock).toBeCalledWith(
            'path',
            {
                headers,
                method: 'POST',
                body: JSON.stringify(testData),
                credentials: 'include',
            },
        );
    });

    it('should handle api error', async () => {
        const fetchMock = getFetchMock(500);
        global.fetch = fetchMock;

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        )
            .catch(() => {});

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('error');
        expect(call.httpStatus).toEqual(500);
    });

    it('should handle connection lost', async () => {
        const fetchMock = getFetchMock(408);
        global.fetch = fetchMock;

        context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        );
        await delay(100);

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('scheduled');
        expect(fetchMock).toBeCalledWith(
            '/auth/ping',
            {
                method: 'GET',
                credentials: 'include',
            },
        );
    });

    it('should handle connection lost in manual mode', async () => {
        const fetchMock = getFetchMock(408);
        global.fetch = fetchMock;

        context.processRequest<TestData>(
            'path',
            'POST',
            testData,
            {
                errorHandling: 'manual',
            },
        );
        await delay(100);

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('scheduled');
        expect(fetchMock).toBeCalledWith(
            '/auth/ping',
            {
                method: 'GET',
                credentials: 'include',
            },
        );
    });

    it('should handle auth lost', async () => {
        const fetchMock = getFetchMock(401);
        global.fetch = fetchMock;
        const windowOpenMock = jest.fn((() => {}) as GlobalOpenType);
        global.open = windowOpenMock;

        context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        );
        await delay(100);

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('scheduled');

        await delay();

        expect(windowOpenMock).toBeCalledWith('/auth/login');

        (global.open as jest.Mock<ReturnType<GlobalOpenType>>).mockClear();
    });

    it('should handle auth lost with manual mode', async () => {
        const fetchMock = getFetchMock(401);
        global.fetch = fetchMock;
        const windowOpenMock = jest.fn((() => {}) as GlobalOpenType);
        global.open = windowOpenMock;

        context.processRequest<TestData>(
            'path',
            'POST',
            testData,
            {
                errorHandling: 'manual',
            },
        );
        await delay(100);

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('scheduled');

        await delay();

        expect(windowOpenMock).toBeCalledWith('/auth/login');

        (global.open as jest.Mock<ReturnType<GlobalOpenType>>).mockClear();
    });

    it('should reject promise on api error with type manual', async () => {
        const fetchMock500 = getFetchMock(500);
        const fetchMock503 = getFetchMock(503);

        global.fetch = fetchMock500;
        await expect(
            context.processRequest<TestData>(
                'path',
                'POST',
                testData,
                {
                    errorHandling: 'manual',
                },
            ),
        ).rejects.toEqual(new ApiCallError(null));

        global.fetch = fetchMock503;
        await expect(
            context.processRequest<TestData>(
                'path',
                'POST',
                testData,
                {
                    errorHandling: 'manual',
                },
            ),
        ).rejects.toEqual(new ApiCallError(null));

        const call = context.getActiveCalls();
        expect(context.status).toEqual('idle');
        expect(call.length).toEqual(0);
    });

    it('should use custom fetcher', async () => {
        const customFetchMock = getFetchMock(200);
        context = new ApiContext({
            fetch: customFetchMock,
        });

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        );

        expect(customFetchMock).toBeCalledTimes(1);
    });

    it('should parse JSON in errors', async () => {
        const fetchMock = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve({
                    error: 'error',
                }),
                ok: false,
                status: 500,
            } as Response);
        });
        context = new ApiContext({
            fetch: fetchMock,
        });

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        )
            .catch(() => {});

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('error');
        expect(call.httpStatus).toEqual(500);
        expect(call.responseData).toEqual({
            error: 'error',
        });
    });

    it('should handler non valid json parsing error with ok status', async () => {
        const fetchMock = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.reject(),
                ok: true,
                status: 200,
            } as Response);
        });
        context = new ApiContext({
            fetch: fetchMock,
        });

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        )
            .catch(() => {});

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('error');
    });

    it('should survive non-json error responses', async () => {
        const fetchMock = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.reject(new Error()),
                ok: false,
                status: 500,
            } as Response);
        });
        context = new ApiContext({
            fetch: fetchMock,
        });

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
        )
            .catch(() => {});

        const call = context.getActiveCalls()[0];
        expect(call.status).toEqual('error');
        expect(call.httpStatus).toEqual(500);
        expect(call.responseData).toEqual(null);
    });

    it('should allow to process custom OK response formats with parseResponse', async () => {
        const fetchMock = jest.fn(() => {
            return Promise.resolve({
                blob: () => Promise.resolve(new Blob()),
                text: () => Promise.resolve('text error message'),
                ok: true,
                status: 200,
            } as Response);
        });
        context = new ApiContext({
            fetch: fetchMock,
        });

        const result = await context.processRequest(
            'path',
            'POST',
            testData,
            {
                parseResponse: parseBlob,
            },
        );

        expect(fetchMock).toBeCalledTimes(1);
        expect(result).toBeInstanceOf(Blob);
    });

    it('should allow to process custom error response formats with parseResponse', async () => {
        const fetchMock = jest.fn(() => {
            return Promise.resolve({
                blob: () => Promise.resolve(new Blob()),
                text: () => Promise.resolve('text error message'),
                ok: false,
                status: 500,
            } as Response);
        });
        context = new ApiContext({
            fetch: fetchMock,
        });

        const error = await (
            context.processRequest(
                'path',
                'POST',
                testData,
                {
                    parseResponse: parseBlob,
                },
            )
                .catch((requestError) => requestError)
        );

        expect(error.call.httpStatus).toBe(500);
        expect(error.call.responseData).toBe('text error message');
        expect(fetchMock).toBeCalledTimes(1);
        expect(context.status).toBe('error');
    });

    it('should user \'Content-Type\' header', async () => {
        const fetchMock = getFetchMock(200);
        global.fetch = fetchMock;
        const userHeaders = new Headers({
            'Content-Type': 'text/html',
        });

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
            {
                fetchOptions: {
                    headers: userHeaders,
                },
            },
        );

        const expectedHeaders = new Headers({
            'Content-Type': 'text/html',
        });
        expect(fetchMock).toBeCalledTimes(1);
        expect(fetchMock).toBeCalledWith(
            'path',
            {
                headers: expectedHeaders,
                method: 'POST',
                body: JSON.stringify(testData),
                credentials: 'include',
            },
        );
    });

    it('should contain user headers', async () => {
        const fetchMock = getFetchMock(200);
        global.fetch = fetchMock;
        const excelContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const userHeaders = new Headers({
            Accept: excelContentType,
        });

        await context.processRequest<TestData>(
            'path',
            'POST',
            testData,
            {
                fetchOptions: {
                    headers: userHeaders,
                },
            },
        );

        const expectedHeaders = new Headers({
            Accept: excelContentType,
            'Content-Type': 'application/json',
        });
        expect(fetchMock).toBeCalledTimes(1);
        expect(fetchMock).toBeCalledWith(
            'path',
            {
                headers: expectedHeaders,
                method: 'POST',
                body: JSON.stringify(testData),
                credentials: 'include',
            },
        );
    });
});
