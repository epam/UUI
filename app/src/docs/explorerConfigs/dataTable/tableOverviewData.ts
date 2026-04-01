import { demoData } from '@epam/uui-docs';

export const rowsExample = demoData.featureClasses.map((item, index) => ({
    id: item.id,
    rowKey: item.id,
    index,
    value: item,
}));
