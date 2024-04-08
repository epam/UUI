import { Task } from './TaskDb';
import { ListLoadingTracker } from '../ListLoadingTracker';
import { DataQuery, LazyDataSourceApiResponse, runDataQuery, range } from '@epam/uui-core';

describe('db - ListLoadingTracker', () => {
    const testItems = range(200).map((id) => {
        return {
            id, name: 'Task', isDone: false, createdBy: 'JS', isDraft: false, assignedTo: 'DT',
        } as Task;
    });

    function getMockResponse(request: DataQuery<Task>): LazyDataSourceApiResponse<Task> {
        return runDataQuery(testItems, request);
    }

    it('Should correctly process single ranged load', () => {
        const tracker = new ListLoadingTracker<Task>();

        const request = { filter: { assignedTo: 'DT' }, range: { from: 0, count: 10 } };
        const request1 = tracker.diff(request);
        expect(request1).toEqual(request);

        tracker.append(request);

        const request2 = tracker.diff(request);
        expect(request2).toEqual(null);
    });

    it('Should correctly process overlapping ranges', () => {
        const tracker = new ListLoadingTracker<Task>();

        const request = { range: { from: 0, count: 10 } };
        tracker.append(request, getMockResponse(request));

        const overlappingRequest = { range: { from: 5, count: 10 } };
        const diffRequest = tracker.diff(overlappingRequest);
        expect(diffRequest).toEqual({ range: { from: 10, count: 5 } });
    });

    it('Should correctly process non-overlapping ranges', () => {
        const tracker = new ListLoadingTracker<Task>();

        const request = { range: { from: 0, count: 10 } };
        tracker.append(request, getMockResponse(request));

        const nonOverlappingRequest = { range: { from: 20, count: 10 } };
        const missingRequest = tracker.diff(nonOverlappingRequest);

        expect(missingRequest).toEqual({ range: { from: 10, count: 20 } });
    });

    it('Handle complete list correctly (after explicit load with no range)', () => {
        const tracker = new ListLoadingTracker<Task>();

        const request = {};
        const loadRequest = tracker.diff(request);
        expect(loadRequest).toEqual(request);

        tracker.append(request);

        const loadRequest2 = tracker.diff({});
        expect(loadRequest2).toEqual(null);

        const loadRequest3 = tracker.diff({ range: { from: 20, count: 10 } });
        expect(loadRequest3).toEqual(null);
    });

    it('Handle complete list correctly (with implicit end of list detection)', () => {
        const tracker = new ListLoadingTracker<Task>();

        const request = { range: { from: 0, count: 2000 } };
        const loadRequest = tracker.diff(request);
        expect(loadRequest).toEqual(request);
        tracker.append(request, getMockResponse(request));

        const loadRequest2 = tracker.diff({});
        expect(loadRequest2).toEqual(null);

        const loadRequest3 = tracker.diff({ range: { from: 20, count: 10 } });
        expect(loadRequest2).toEqual(null);
    });
});
