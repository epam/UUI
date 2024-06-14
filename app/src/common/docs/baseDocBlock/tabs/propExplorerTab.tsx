import * as React from 'react';
import { TDocConfig } from '@epam/uui-docs';
import { ComponentEditorWrapper } from '../../componentEditor/ComponentEditor';
import { TTheme } from '../../../../data';

type TPropExplorerTabProps = {
    isSkin: boolean;
    title: string;
    theme: TTheme;
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
