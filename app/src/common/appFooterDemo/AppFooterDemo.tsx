import * as React from 'react';
import css from './AppFooterDemo.scss';
import { FlexRow } from '@epam/promo';
import { DemoItem } from '../../demo/structure';
import { DemoToolbar } from './demoToolbar/DemoToolbar';

interface IAppFooterDemoProps {
    demoItem: DemoItem;
    isFullScreenSupported: boolean;
    onOpenFullScreen: () => void;
}
export function AppFooterDemo(props: IAppFooterDemoProps) {
    const { demoItem, isFullScreenSupported, onOpenFullScreen } = props;
    return (
        <div className={ css.layout }>
            <FlexRow cx={ css.footer }>
                <DemoToolbar demoItem={ demoItem } isFullScreenSupported={ isFullScreenSupported } onOpenFullScreen={ onOpenFullScreen } />
            </FlexRow>
        </div>
    );
}
