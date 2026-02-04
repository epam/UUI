import { DataTableObject } from './dataTableObject';

export class LocationsDataTableObject extends DataTableObject {
    protected getDefaultFirstRowText(): string {
        return 'Africa';
    }

    public static testUrl = 'docExample?theme=loveship&examplePath=tables%2FTableCollapse';
}
