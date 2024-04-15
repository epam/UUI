import { TComponentPreview } from '@epam/uui-docs';

export type TPreviewContentParams = {
    theme: string;
    isSkin: boolean;
    componentId: string | undefined;
    previewId: string | undefined | TComponentPreview<unknown>;
};

export type TPreviewRef = { link: string, error: string | undefined, predefinedPreviewRefs: { id: string, link: string }[] };
