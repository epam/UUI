import * as React from 'react';
import { TDocConfig, ThemeId } from '@epam/uui-docs';
import { ComponentEditorWrapper } from '../../properyEditor/PropertyEditor';

type TPropExplorerTabProps = {
    isSkin: boolean;
    title: string;
    theme: ThemeId;
    config: TDocConfig | undefined;
    onOpenDocTab: () => void;
};

export function PropExplorerTab(props: TPropExplorerTabProps) {
    const { isSkin, theme, config, title, onOpenDocTab } = props;

    return (
        <ComponentEditorWrapper
            key={ `${theme}${isSkin ? '-skin' : ''}` }
            onRedirectBackToDocs={ onOpenDocTab }
            config={ config }
            title={ title }
            isSkin={ isSkin }
            theme={ theme }
        />
    );
}
