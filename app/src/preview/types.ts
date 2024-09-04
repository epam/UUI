import { TComponentPreview } from '@epam/uui-docs';
import { ThemesList } from '../data';

export type TPreviewContentParams = {
    theme: ThemesList;
    isSkin: boolean;
    componentId: string | undefined;
    previewId: string | undefined | TComponentPreview<unknown>;
};

export type TPredefinedPreviewRefItem = { groupId?: string; id: string, link: string };
export type TPreviewRef = { link: string, error: string | undefined, predefinedPreviewRefs: TPredefinedPreviewRefItem[] };
