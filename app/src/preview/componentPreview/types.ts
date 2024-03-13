import { TTheme } from '../../common/docs/docsConstants';

export type TComponentPreviewParams = {
    theme: TTheme;
    isSkin: boolean;
    componentId: string | undefined;
    previewId: string | undefined;
};
