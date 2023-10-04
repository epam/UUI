import { TTypeSummary } from '../types/sharedTypes';
import { TConvertable } from '../types/types';
import { ConvertableUtils } from './converterUtils/convertableUtils';
import { NodeUtils } from './converterUtils/nodeUtils';

export function convertTypeSummary(nodeOrSymbol: TConvertable): TTypeSummary {
    const node = ConvertableUtils.getNode(nodeOrSymbol);
    return NodeUtils.getTypeSummary(node);
}
