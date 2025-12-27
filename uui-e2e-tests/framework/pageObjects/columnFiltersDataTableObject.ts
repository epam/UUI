import { DataTableObject } from './dataTableObject';

export class ColumnFiltersDataTableObject extends DataTableObject {
    protected getDefaultFirstRowText(): string {
        return 'Aaron Benoît';
    }

    public static testUrl = '/docExample?theme=loveship&examplePath=tables%2FColumnFiltersTable';
}
