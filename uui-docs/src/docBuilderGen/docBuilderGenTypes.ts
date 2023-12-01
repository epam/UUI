import { PropDoc, TSkin } from '../types';
import { DocBuilder } from '../DocBuilder';
import { TTypeProp } from '../sharedTypes';

export type TPropDocBuilder =
    (params: { docs: DocBuilder<any>, prop: TTypeProp, skin: TSkin })
    => (Partial<PropDoc<any, any>> | undefined);
