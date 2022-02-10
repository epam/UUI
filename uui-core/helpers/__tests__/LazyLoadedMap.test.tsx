import { LazyLoadedMap, LazyLoadedMapLoadCallback } from '../LazyLoadedMap';

const delay = () => new Promise(resolve => setTimeout(resolve, 1));

describe('LazyLoadedMap', () => {
    const mockApi: LazyLoadedMapLoadCallback<number, string> = (keys: number[]) => {
        return new Promise<[number, string][]>((resolve, reject) => {
            resolve(keys.map(key => [key, 'item' + key] as [number, string]));
        });
    };

    it('should schedule and run request once for a single item', async () => {
        const api = jest.fn(mockApi);
        const map = new LazyLoadedMap<number, string>(api);

        expect(map.get(1)).toBeNull();
        expect(api).not.toBeCalled();

        await delay();

        expect(api.mock.calls.length).toBe(1);
        expect(api.mock.calls[0][0]).toEqual([1]);
        expect(map.get(1)).toBe('item1');

        await delay();

        expect(api.mock.calls.length).toBe(1); // already in Map, no second call
        expect(map.get(1)).toBe('item1');
    });

    it('should not load if fetchIfAbsent = false', async () => {
        const api = jest.fn(mockApi);
        const map = new LazyLoadedMap<number, string>(api);

        expect(map.get(1, false)).toBeNull();
        expect(api).not.toBeCalled();

        await delay();

        expect(api).not.toBeCalled();
        expect(map.get(1)).toBeNull();
    });

    it('should batch two gets into a single request', async () => {
        const api = jest.fn(mockApi);
        const map = new LazyLoadedMap<number, string>(api);

        expect(map.get(1)).toBeNull();
        expect(map.get(1)).toBeNull();
        expect(map.get(2)).toBeNull();
        expect(api).not.toBeCalled();

        await delay();

        expect(api.mock.calls.length).toBe(1);
        expect(api.mock.calls[0][0]).toEqual([1, 2]);
        expect(map.get(1)).toBe('item1');
        expect(map.get(2)).toBe('item2');
    });

    it('should not retry on rejects', async () => {
        const api = jest.fn(() => Promise.reject('test failure'));
        const map = new LazyLoadedMap<number, string>(api);

        map.get(1);
        await delay();

        map.get(1);
        await delay();

        expect(api.mock.calls.length).toBe(1);
    });
});