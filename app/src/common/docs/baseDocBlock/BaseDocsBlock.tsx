import * as React from 'react';
import { TDocConfig } from '@epam/uui-docs';
import { UuiContext, UuiContexts } from '@epam/uui-core';
import { FlexCell, FlexRow, FlexSpacer, IconContainer, RichTextView, Text } from '@epam/uui';
import { svc } from '../../../services';
import { analyticsEvents } from '../../../analyticsEvents';
import { TMode } from '../docsConstants';
import { DocTab } from './tabs/docTab';
import { PropExplorerTab } from './tabs/propExplorerTab';
import { TabsNav } from './components/tabsNav';
import { SkinModeToggler } from './components/skinModeToggler';
import { QueryHelpers } from './utils/queryHelpers';
import { DocItem } from '../../../documents/structure';
import { Sidebar } from '../../sidebar';
import { ReactComponent as NavigationCloseOutlineIcon } from '@epam/assets/icons/navigation-close-outline.svg';

//
import css from './BaseDocsBlock.module.scss';
import cx from 'classnames';

type State = {
    isOpen: boolean;
};

export abstract class BaseDocsBlock extends React.Component<any, State> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    constructor(props: any) {
        super(props);
        this.state = {
            isOpen: false,
        };

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

    public handleMobSidebarBtnClick = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    };

    render() {
        const mode = QueryHelpers.getMode();
        const supportedModes = Object.values(TMode).filter((m) => this.isModeSupported(m));
        const { queryParamId, onChange, items, getSearchFields, getItemLink } = this.props.sidebarProps;

        return (
            <div className={ cx(css.container, this.state.isOpen && css.mobile) }>
                { !this.state.isOpen && (
                    <TabsNav
                        mode={ mode }
                        supportedModes={ supportedModes }
                        renderSkinSwitcher={ this.renderSkinSwitcher }
                        onChangeMode={ this.handleChangeTab }
                        handleMobSidebarBtnClick={ this.handleMobSidebarBtnClick }
                    />
                ) }
                { !this.state.isOpen && this.renderTabContent(mode)}
                { this.state.isOpen && (
                    <FlexCell grow={ 1 } style={ { minHeight: '100vh' } }>
                        <FlexRow borderBottom={ true } padding="18" vPadding="24">
                            <Text fontSize="18" fontWeight="600" lineHeight="24">Navigation</Text>
                            <FlexSpacer />
                            <IconContainer
                                size={ 24 }
                                icon={ NavigationCloseOutlineIcon }
                                onClick={ this.handleMobSidebarBtnClick }
                                style={ { fill: '#6C6F80' } }
                            />
                        </FlexRow>
                        <FlexRow borderBottom={ true } alignItems="stretch" cx={ css.sidebar }>
                            <Sidebar<DocItem>
                                value={ queryParamId }
                                onValueChange={ onChange }
                                items={ items }
                                getSearchFields={ getSearchFields }
                                getItemLink={ getItemLink }
                            />
                        </FlexRow>
                    </FlexCell>
                ) }
            </div>
        );
    }
}
