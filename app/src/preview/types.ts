import { TComponentPreview } from '@epam/uui-docs';
import { TTheme } from '../data';

export type TPreviewContentParams = {
    theme: TTheme;
    isSkin: boolean;
    componentId: string | undefined;
    previewId: string | undefined | TComponentPreview<unknown>;
};

export type TPredefinedPreviewRefItem = { groupId?: string; id: string, link: string };
export type TPreviewRef = { link: string, error: string | undefined, predefinedPreviewRefs: TPredefinedPreviewRefItem[] };
