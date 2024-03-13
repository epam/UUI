import { DocPreviewBuilder, TDocConfig } from '@epam/uui-docs';
import { componentsStructure } from '../../../documents/structureComponents';

export function getDefaultPreviewId(componentId: string) {
    const config = getConfigByComponentId(componentId);
    return getPreviewOptions(config)[0]?.id;
}

export function getPreviewOptions(config: TDocConfig | undefined) {
    const preview = config?.preview;
    if (!preview) {
        return [];
    }
    const builder = new DocPreviewBuilder();
    preview(builder);
    return builder.previewProps.map(({ id }) => {
        return {
            id,
            name: id,
        };
    });
}

export const componentsPreviewMap = componentsStructure.reduce<Map<string, { previewIds: { id: string, name: string }[], config: TDocConfig } >>((acc, entry) => {
    const Comp = entry.component;
    const config = Comp?.config;
    if (config) {
        const previewIds = getPreviewOptions(config);
        if (previewIds?.length) {
            acc.set(entry.id, {
                previewIds,
                config,
            });
        }
    }
    return acc;
}, new Map());

export const componentItems = [...componentsPreviewMap.keys()].map((id) => ({ id, name: id }));

export function getConfigByComponentId(componentId: string | undefined): TDocConfig | undefined {
    return componentsPreviewMap.get(componentId)?.config;
}
