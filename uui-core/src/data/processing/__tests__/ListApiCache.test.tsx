import { ListApiCache, ListApiSettings } from '../ListApiCache';
import { LazyDataSourceApiRequest, LazyDataSourceApiResponse } from '../../../types';
import { delay } from '@epam/test-utils';

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
        items = items.filter((i) => r.ids.indexOf(i.id) >= 0);
    }

    return Promise.resolve<LazyDataSourceApiResponse<TestItem>>({ items });
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
});
