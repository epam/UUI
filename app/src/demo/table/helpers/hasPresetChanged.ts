import isEqual from 'lodash.isequal';
import { ColumnsConfig, ITablePreset } from '@epam/uui';
import { parseFilterUrl } from './parseFilterUrl';

export const hasPresetChanged = (preset: ITablePreset | undefined, columnsConfig: ColumnsConfig) => {
    const filter = parseFilterUrl();

    return !isEqual(preset?.filter, filter) 
        || !isEqual(preset?.columnsConfig, columnsConfig);
};