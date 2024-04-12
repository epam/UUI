import { TTheme } from '../common/docs/docsConstants';
import { TComponentPreview } from '@epam/uui-docs';

export type TPreviewContentParams = {
    theme: TTheme;
    isSkin: boolean;
    componentId: string | undefined;
    previewId: string | undefined | TComponentPreview<unknown>;
};

export type TPreviewRef = { link: string, error: string | undefined, predefinedPreviewRefs: { id: string, link: string }[] };
