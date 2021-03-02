import { delay } from "../../../helpers";
import { ListApiCache, ListApiSettings } from '../ListApiCache';
import { LazyDataSourceApiRequest, LazyDataSourceApiResponse } from '../types';

interface TestItem {
    id: number;
    name: string;
    categoryId: number;
}

interface TestFilter {
    categoryId?: number;
    fetchAll?: boolean;
}

const allItems: TestItem[] = [];

for (let id = 0; id < 100; id++) {
    allItems.push({ id, name: 'Item' + id, categoryId: id % 2 });
}

const testApi = (r: LazyDataSourceApiRequest<TestItem, number, TestFilter>) => {
    let items: TestItem[] = allItems;
    let from: number;
    let count: number;

    if (r.ids) {
        items = items.filter(i => r.ids.indexOf(i.id) >= 0);
    }

    if (r.filter) {
        items = items.filter(i => i.categoryId == r.filter.categoryId);
    }

    if (r.range) {
        items = items.slice(r.range.from, r.range.from + r.range.count);
    }

    if (r.filter && r.filter.fetchAll) {
        items = allItems;
        from = 0;
        count = allItems.length;
    }

    return Promise.resolve<LazyDataSourceApiResponse<TestItem>>({ items, count, from });
};


describe('ListApiCache', () => {
    const apiFn = jest.fn(testApi);
    const updateFn = jest.fn(() => null);
    const apiSettings: ListApiSettings<TestItem, number, TestFilter> = {
        api: apiFn,
        getId: (i: TestItem) => i.id,
        onUpdate: updateFn,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Performs reads by id with batching', async () => {
        const cache = new ListApiCache(apiSettings);
        expect(cache.byId(0)).toBe(null);
        expect(cache.byId(10)).toBe(null);

        await delay();

        expect(updateFn).toBeCalled();
        expect(cache.byId(0)).toEqual(allItems[0]);
        expect(cache.byId(10)).toEqual(allItems[10]);
        expect(apiFn.mock.calls.length).toBe(1);
    });

    it('Returns cached items when all fetched', async () => {
        const cache = new ListApiCache(apiSettings);
        const request1 = { range: { from: 10, count: 5 }, filter: { fetchAll: true } };
        const request2 = { range: { from: 1, count: 3 }, filter: { fetchAll: true } };
        const request3 = { range: { from: 20, count: 5 }, filter: { fetchAll: true } };
        expect(cache.query(request1)).toEqual({ knownCount: 0, exactCount: null, items: new Array(5).fill(null) });

        await delay();

        expect(updateFn).toBeCalled();
        const list = cache.query(request1);
        expect(list.items.length).toEqual(5);
        expect(list.exactCount).toBe(allItems.length);
        expect(list.knownCount).toBe(allItems.length);
        expect(cache.query(request2)).toEqual({ knownCount: allItems.length, exactCount: allItems.length, items: allItems.slice(1, 4) });
        expect(cache.query(request3)).toEqual({ knownCount: allItems.length, exactCount: allItems.length, items: allItems.slice(20, 25) });
    });

    it('Performs ranged list reads', async () => {
        const cache = new ListApiCache(apiSettings);
        const request: LazyDataSourceApiRequest<TestItem, number, TestFilter> = { range: { from: 10, count: 3 } };
        expect(cache.query(request)).toEqual({ knownCount: 0, exactCount: null, items: [null, null, null] });

        await delay();

        expect(updateFn).toBeCalled();
        const list = cache.query(request);
        expect(list.items.length).toEqual(request.range.count);
        expect(list.items[0]).toEqual(allItems[10]);
        expect(list.items[2]).toEqual(allItems[12]);
        expect(list.exactCount).toBeNull();
        expect(list.knownCount).toBe(13);
    });

    it('Merges ranged list reads into batches', async () => {
        const cache = new ListApiCache(apiSettings);
        const request1 = { range: { from: 10, count: 10 } };
        const request2 = { range: { from: 20, count: 10 } };
        cache.query(request1);
        cache.query(request2);

        await delay();

        expect(updateFn).toBeCalledTimes(1);
        expect(apiFn.mock.calls.length).toBe(1);
        expect(apiFn.mock.calls[0][0]).toEqual({ range: { from: 10, count: 20 } });
        expect(cache.query(request1).items).toEqual(allItems.slice(10, 20));
        expect(cache.query(request2).items).toEqual(allItems.slice(20, 30));
        expect(cache.query({ range: { from: 15, count: 10 }}).items).toEqual(allItems.slice(15, 25));
    });

    it('Runs different tasks in parallel', async () => {
        const cache = new ListApiCache(apiSettings);
        const request1 = { range: { from: 10, count: 10 }, filter: { categoryId: 0 } };
        const request2 = { range: { from: 40, count: 10 }, filter: { categoryId: 1 } };
        cache.query(request1);
        cache.query(request2);
        cache.byId(1);
        cache.byId(2);
        cache.byId(3);

        await delay();

        expect(updateFn).toBeCalledTimes(1);
        expect(apiFn.mock.calls.length).toBe(3);
    });

    it('Runs different tasks in parallel', async () => {
        const cache = new ListApiCache(apiSettings);
        const request1 = { range: { from: 10, count: 10 }, filter: { categoryId: 0 } };
        const request2 = { range: { from: 40, count: 10 }, filter: { categoryId: 1 } };
        cache.query(request1);
        cache.query(request2);
        cache.byId(1);
        cache.byId(2);
        cache.byId(3);

        await delay();

        expect(updateFn).toBeCalledTimes(1);
        expect(apiFn.mock.calls.length).toBe(3);
    });

    it('Finds end of list and sets counts', async () => {
        const cache = new ListApiCache(apiSettings);
        cache.query({ range: { from: 90, count: 10 } });

        await delay();

        const list1 = cache.query({ range: { from: 90, count: 10 } });
        expect(list1.knownCount).toBe(100);
        expect(list1.exactCount).toBe(null);

        const list2 = cache.query({ range: { from: 90, count: 20 } });
        expect(list2.items.length).toBe(20);
        expect(list2.knownCount).toBe(100);
        expect(list2.exactCount).toBe(null);

        await delay();

        let list3 = cache.query({ range: { from: 90, count: 20 } });
        expect(list3.items.length).toBe(10);
        expect(list3.knownCount).toBe(100);
        expect(list3.exactCount).toBe(100);
    });


    it('Does not set end of the list if fetched range after the end of the list', async () => {
        const cache = new ListApiCache(apiSettings);
        cache.query({ range: { from: 200, count: 10 } });

        await delay();

        const list1 = cache.query({ range: { from: 0, count: 10 } });
        expect(list1.knownCount).toBe(0);
        expect(list1.exactCount).toBe(null);
    });

    it('Correctly handles missing fields in request', async () => {
        const cache = new ListApiCache(apiSettings);
        cache.query({ range: { from: 0, count: 1000 } });

        await delay();

        expect(cache.query({ range: { count: 2 } } as any).items).toEqual(allItems.slice(0, 2));
        //expect(cache.query({ range: { } } as any).items).toEqual(allItems);
        //expect(cache.query({ range: { from: 50 } } as any).items).toEqual(allItems.slice(50, 100));
        //expect(cache.query({ ids: null, range: null } as any).items).toEqual(allItems);
    });

    it('Correctly deals with filters', async () => {
        const cache = new ListApiCache(apiSettings);
        const q1 = { range: { from: 40, count: 20 }, filter: { categoryId: 0 } };
        const q2 = { range: { from: 45, count: 20 }, filter: { categoryId: 1 } };

        cache.query(q1);
        cache.query(q2);

        await delay();

        const list1 = cache.query(q1);
        expect(list1.items.length).toBe(10);
        expect(list1.knownCount).toBe(50);
        expect(list1.exactCount).toBe(50);
        expect(list1.items.every(i => i.categoryId == 0)).toBe(true);

        const list2 = cache.query(q2);
        expect(list2.items.length).toBe(5);
        expect(list2.knownCount).toBe(50);
        expect(list2.exactCount).toBe(50);
        expect(list2.items.every(i => i.categoryId == 1)).toBe(true);

        // Even if filter is set, all items should be cached by id
        expect(cache.byId(99).name).toBe('Item99');
    });

    it('Correctly handles empty lists', async () => {
        const cache = new ListApiCache(apiSettings);
        cache.query({ range: { from: 0, count: 10}, filter: { categoryId: 100500 } });

        await delay();

        const result = cache.query({ range: { from: 0, count: 10}, filter: { categoryId: 100500 } });
        expect(result.exactCount).toEqual(0);
        expect(result.knownCount).toEqual(0);
        expect(result.items.length).toEqual(0);
    });

    it('Should remove last created item from cache, if cache size > maxCacheSize, on new item set', async () => {
        const cache = new ListApiCache({ ...apiSettings, maxCacheSize: 1 });
        const request1 = { range: { from: 0, count: 5 }, search: 'a' };
        const request2 = { range: { from: 0, count: 5 }, search: 'b' };

        expect(cache.itemLists.size).toEqual(0);

        cache.query(request1);
        await delay();

        expect(cache.itemLists.size).toEqual(1);

        cache.query(request2);
        await delay();

        expect(cache.itemLists.size).toEqual(1);
    });
});
