import { WithToolbarButton } from '../../implementation/Toolbars';
import { HeaderType } from './constants';

export type HeaderPluginOptions = WithToolbarButton & {
    headers: HeaderType[]
};
