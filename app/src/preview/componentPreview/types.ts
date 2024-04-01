import { TTheme } from '../../common/docs/docsConstants';
import { TComponentPreview } from '@epam/uui-docs';

export type TComponentPreviewParams = {
    theme: TTheme;
    isSkin: boolean;
    componentId: string | undefined;
    previewId: string | undefined | TComponentPreview<unknown>;
};
