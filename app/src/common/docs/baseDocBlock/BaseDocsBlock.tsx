import * as React from 'react';
import { TDocConfig } from '@epam/uui-docs';
import { UuiContext, UuiContexts } from '@epam/uui-core';
import { RichTextView } from '@epam/uui';
import { svc } from '../../../services';
import { analyticsEvents } from '../../../analyticsEvents';
import { TMode } from '../docsConstants';
import { DocTab } from './tabs/docTab';
import { PropExplorerTab } from './tabs/propExplorerTab';
import { TabsNav } from './components/tabsNav';
import { SkinModeToggler } from './components/skinModeToggler';
import { QueryHelpers } from './utils/queryHelpers';
//
import css from './BaseDocsBlock.module.scss';

export abstract class BaseDocsBlock extends React.Component<any, {}> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    constructor(props: any) {
        super(props);

        const { category, id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.document.pv(id, category));
    }

    abstract title: string;
    abstract renderContent(): React.ReactNode;
    protected renderDocTitle(): React.ReactNode { return null; }

    static config: TDocConfig;

    componentDidMount() {
        this.redirectIfModeIsUnsupported();
        document.title = this.title ? `${this.title} | UUI` : 'UUI';
    }

    componentDidUpdate() {
        this.redirectIfModeIsUnsupported();
    }

    protected renderSkinSwitcher() {
        const mode = QueryHelpers.getMode();
        const isSkin = QueryHelpers.isSkin();
        const theme = QueryHelpers.getTheme();
        return (
            <SkinModeToggler
                mode={ mode }
                theme={ theme }
                isSkinEnabled={ isSkin }
                onToggleSkin={ QueryHelpers.toggleSkinMode }
            />
        );
    }

    protected renderSectionTitle(title: string) {
        return (
            <RichTextView>
                <h2>{title}</h2>
            </RichTextView>
        );
    }

    private getConfig = () => {
        return (this.constructor as unknown as { config: TDocConfig })?.config;
    };

    private isModeSupported = (mode: TMode) => {
        if ([TMode.propsEditor].includes(mode)) {
            return !!this.getConfig();
        }
        return true;
    };

    private renderTabContent(mode: TMode) {
        const isSkin = QueryHelpers.isSkin();
        const theme = QueryHelpers.getTheme();

        switch (mode) {
            case TMode.doc: {
                return (
                    <DocTab
                        title={ this.title }
                        config={ this.getConfig() }
                        renderDocTitle={ () => this.renderDocTitle() }
                        renderSectionTitle={ (title) => this.renderSectionTitle(title) }
                        renderContent={ () => this.renderContent() }
                    />
                );
            }
            case TMode.propsEditor: {
                return (
                    <PropExplorerTab
                        title={ this.title }
                        config={ this.getConfig() }
                        isSkin={ isSkin }
                        theme={ theme }
                        onOpenDocTab={ () => QueryHelpers.changeTab(TMode.doc) }
                    />
                );
            }
            default: {
                return null;
            }
        }
    }

    private redirectIfModeIsUnsupported = () => {
        const mode = QueryHelpers.getMode();
        if (!this.isModeSupported(mode)) {
            QueryHelpers.changeTab(TMode.doc);
        }
    };

    private handleChangeTab = (mode: TMode) => {
        return QueryHelpers.changeTab(mode);
    };

    render() {
        const mode = QueryHelpers.getMode();
        const supportedModes = Object.values(TMode).filter((m) => this.isModeSupported(m));
        return (
            <div className={ css.container }>
                <TabsNav
                    mode={ mode }
                    supportedModes={ supportedModes }
                    renderSkinSwitcher={ this.renderSkinSwitcher }
                    onChangeMode={ this.handleChangeTab }
                />
                {this.renderTabContent(mode)}
            </div>
        );
    }
}
