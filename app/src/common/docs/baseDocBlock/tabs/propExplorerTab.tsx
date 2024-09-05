import * as React from 'react';
import { TDocConfig } from '@epam/uui-docs';
import { ComponentEditorWrapper } from '../../properyEditor/PropertyEditor';
import { ThemesList } from '../../../../data';

type TPropExplorerTabProps = {
    isSkin: boolean;
    title: string;
    theme: ThemesList;
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
