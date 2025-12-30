import { DataTableObject } from './dataTableObject';

export class LazyDataTableObject extends DataTableObject {
    protected getDefaultFirstRowText(): string {
        return '225284';
    }

    public static testUrl = '/docExample?theme=loveship&examplePath=tables%2FLazyTable';
}
