import { DocBuilder, PropDoc, TSkin } from '@epam/uui-docs';
import { TTypeProp } from '../../apiReference/sharedTypes';

export type TPropDocBuilder =
    (params: { docs: DocBuilder<any>, prop: TTypeProp, skin: TSkin })
    => (Partial<PropDoc<any, any>> | undefined);
