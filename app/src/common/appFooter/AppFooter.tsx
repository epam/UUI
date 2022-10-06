import * as React from 'react';
import * as css from './AppFooter.scss';
import { FlexRow } from '@epam/promo';
import { Copyright } from "./copyright/Copyright";
import { DemoToolbar } from "./demoToolbar/DemoToolbar";
import { DemoItem } from "../../demo/structure";
import { cx } from "@epam/uui-core";

AppFooter.displayName = 'AppFooter';
interface IAppFooterProps {
    renderContent: () => React.ReactNode;
    isContentCentered?: boolean;
    isSmallerHeight?: boolean;
}
function AppFooter(props: IAppFooterProps) {
    const { renderContent, isContentCentered = true, isSmallerHeight } = props;
    return (
        <div className={ cx(css.layout, isSmallerHeight && css.smallerHeight) } >
            <FlexRow cx={ [css.footer, isContentCentered && css.centered] } >
                { renderContent() }
            </FlexRow>
        </div>
    );
}

AppFooterDefault.displayName = 'AppFooterDefault';
export function AppFooterDefault() {
    return (
        <AppFooter renderContent={ () => <Copyright /> } />
    );
}

AppFooterDemo.displayName = 'AppFooterDemo';
interface IAppFooterDemoProps {
    demoItem: DemoItem;
}
export function AppFooterDemo(props: IAppFooterDemoProps) {
    return (
        <AppFooter
            isSmallerHeight={ true }
            isContentCentered={ false }
            renderContent={ () => <DemoToolbar demoItem={ props.demoItem } /> }
        />
    );
}
