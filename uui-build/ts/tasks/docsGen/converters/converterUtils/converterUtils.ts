import { TTypeRef, TTypeSummary } from '../../types/sharedTypes';

export function getTypeRefFromTypeSummary(summary: TTypeSummary): TTypeRef {
    return `${summary.module}:${summary.typeName.name}`;
}
