import { DataSourceState } from '../../../../../../../types';
import { PatchOrderingTypes } from '../../../PatchOrderingMap';
import { newMap } from '../../../newTree';
import { sortPatchByParentId } from '../usePatchTree';

type Item = {
    id: string;
    parentId: string;
    name: string;
};

describe('sortPatchByParentId', () => {
    const groupedByParentId = newMap<string, Item[]>({});
    groupedByParentId.set('1', [
        { id: '1.1', name: 'name 7 (old 1)', parentId: '1' },
        { id: '1.2', name: 'name 2', parentId: '1' },
        { id: '1.3', name: 'name 3 NEW', parentId: '1' },
        { id: '1.4', name: 'name 4', parentId: '1' },
        { id: '1.5', name: 'name 5 NEW', parentId: '1' },
    ]);
    // groupedByParentId.set('2', [{ id: '2.1', name: 'name 2', parentId: '2' }, { id: '2.2', name: 'name 2', parentId: '2' }, { id: '2.3', name: 'name 3', parentId: '2' }, { id: '2.4', name: 'name 4', parentId: '2' }, { id: '2.5', name: 'name 5', parentId: '2' }]);
    // groupedByParentId.set('3', [{ id: '3.1', name: 'name 1', parentId: '3' }, { id: '3.2', name: 'name 2', parentId: '3' }, { id: '3.3', name: 'name 3', parentId: '3' }, { id: '3.4', name: 'name 4', parentId: '3' }, { id: '3.5', name: 'name 5', parentId: '3' }]);

    const patchItemsAtLastSort = newMap({});
    patchItemsAtLastSort.set('1.1', { id: '1.1', name: 'name 1', parentId: '1' });
    patchItemsAtLastSort.set('1.2', { id: '1.2', name: 'name 2', parentId: '1' });
    patchItemsAtLastSort.set('1.4', { id: '1.4', name: 'name 4', parentId: '1' });

    const sortBy = (item) => item.name;
    const sorting: DataSourceState<any, string>['sorting'] = [{ field: 'name', direction: 'asc' }];
    const getId = (item) => item.id;
    const getParentId = (item) => item.parentId;

    it('should work', () => {
        // console.log(sortPatchByParentId(groupedByParentId, () => PatchOrderingTypes.BOTTOM, patchItemsAtLastSort, sortBy, sorting, getId, getParentId));
    });
});
