import { TDocConfig } from '@epam/uui-docs';
import { componentsStructure } from '../../../documents/structureComponents';

const compMap = componentsStructure.reduce<Map<string, TDocConfig >>((acc, entry) => {
    const Comp = entry.component;
    const config = Comp?.config;
    if (config) {
        acc.set(entry.id, config);
    }
    return acc;
}, new Map());

export function getConfigByComponentId(componentId: string | undefined): TDocConfig | undefined {
    return compMap.get(componentId);
}
