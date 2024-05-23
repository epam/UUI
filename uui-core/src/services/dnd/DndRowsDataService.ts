import { newMap } from '../../data';
import { IDndData, IMap } from '../../types';

export interface DndRowData<TId = any, TSrcData = any, TDstData = any> extends IDndData<TSrcData, TDstData> {
    id: TId;
    path: TId[];
    /** Source item data. This is the srcData of the actor that is being dropped into. */
    srcData: TSrcData;
    /** Destination item data. This is the dstData of the actor into which the drop is performed. */
    dstData?: TDstData;
}

export class DndRowsDataService<TId, TSrcData, TDstData> {
    dndRows: IMap<TId, DndRowData<TId, TSrcData, TDstData>>;
    constructor() {
        this.dndRows = newMap({ complexIds: true });
    }

    setDndRowData(data: DndRowData<TId, TSrcData, TDstData>) {
        this.dndRows.set(data.id, data);
    }

    getDndRowData(id: TId) {
        return this.dndRows.get(id) ?? null;
    }

    destroy() {
        this.dndRows = newMap({ complexIds: true });
    }
}
