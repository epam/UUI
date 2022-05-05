import { ApiContext } from "../ApiContext";

describe("ApiContext", () => {
    const testData = { testData: 'test test' };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const fetchMock = jest.fn((req) => {
        return Promise.resolve({
            json: () => Promise.resolve(testData),
            ok: true,
        });
    });

    global.fetch = fetchMock as any;


    it("should make a request", async () => {
        const context = new ApiContext({});

        await context.processRequest('path', 'POST', testData);
        expect(fetchMock).toBeCalledTimes(1);
        expect(fetchMock).toBeCalledWith('path', {
            headers,
            method: 'POST',
            body: JSON.stringify(testData),
            credentials: 'include',
        });
    });
});