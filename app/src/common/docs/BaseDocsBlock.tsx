import * as React from 'react';
import cx from 'classnames';
import { TDocConfig, TSkin } from '@epam/uui-docs';
import { UuiContext, UuiContexts } from '@epam/uui-core';
import { Checkbox, FlexRow, FlexSpacer, IconContainer, RichTextView, ScrollBars, TabButton, Tooltip } from '@epam/uui';
import { svc } from '../../services';
import { getQuery, getCurrentTheme } from '../../helpers';
import { analyticsEvents } from '../../analyticsEvents';
import { TypeRefSection } from '../apiReference/TypeRefSection';
import { ComponentEditorWrapper } from './componentEditor/ComponentEditor';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-fill-18.svg';
import css from './BaseDocsBlock.module.scss';
import { DEFAULT_MODE, DEFAULT_THEME, TMode, TUUITheme } from './docsConstants';

const CONTROL_DESCRIPTION = 'If checked, a component from the skin-specific package will be used, according to the selected theme (for example, "@epam/loveship"). If unchecked, it will use a component from the "@epam/uui" package, only with semantic props.';

interface BaseDocsBlockState {}

export abstract class BaseDocsBlock extends React.Component<any, BaseDocsBlockState> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    constructor(props: any) {
        super(props);

        const { category, id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.document.pv(id, category));
    }

    private isSkin(): boolean {
        return getQuery('isSkin') ?? JSON.parse(localStorage.getItem('app-theme-context'))?.isSkin ?? true;
    }

    private getMode(): TMode {
        return getQuery('mode') || DEFAULT_MODE;
    }

    private getTheme(): TTheme {
        return getCurrentTheme();
    }

    private hasSkin(): boolean {
        return ['electric', 'loveship', 'loveship_dark', 'promo'].includes(this.getTheme());
    }

    abstract title: string;
    abstract renderContent(): React.ReactNode;

    config: TDocConfig;

    componentDidMount() {
        this.handleMountOrUpdate();
    }

    componentDidUpdate() {
        this.handleMountOrUpdate();
    }

    private handleMountOrUpdate = () => {
        if (this.getMode() === TMode.propsEditor && !this.isPropEditorSupported()) {
            this.handleChangeMode(TMode.doc);
        }
    };

    private renderApiBlock = () => {
        if (this.config) {
            const configGeneric = this.config.bySkin;
            /**
             * API block is always based on the "UUI" TS type.
             * But if it's not defined for some reason, then the first available skin is used instead.
             */
            const skinSpecific = configGeneric[TSkin.UUI] || configGeneric[Object.keys(configGeneric)[0] as TSkin];
            const docsGenType = skinSpecific?.type;
            if (docsGenType) {
                return (
                    <>
                        { this.renderSectionTitle('Api') }
                        <TypeRefSection showCode={ true } typeRef={ docsGenType } />
                    </>
                );
            }
        }
    };

    protected renderSkinSwitcher() {
        if (this.getMode() !== TMode.propsEditor || !this.hasSkin()) return;

        return (
            <>
                <FlexSpacer />
                <Checkbox label="Show theme specific props" value={ this.isSkin() } onValueChange={ this.handleChangeSkin } />
                <Tooltip content={ CONTROL_DESCRIPTION } color="inverted">
                    <IconContainer icon={ InfoIcon } cx={ css.infoIcon } />
                </Tooltip>
            </>
        );
    }

    private renderTabsNav() {
        return (
            <FlexRow
                rawProps={ { role: 'tablist' } }
                padding="12"
                cx={ [css.secondaryNavigation] }
                borderBottom
            >
                <TabButton
                    size="60"
                    caption="Documentation"
                    isLinkActive={ this.getMode() === TMode.doc }
                    onClick={ () => this.handleChangeMode(TMode.doc) }
                />
                <TabButton
                    size="60"
                    caption="Property Explorer"
                    isLinkActive={ this.getMode() === TMode.propsEditor }
                    onClick={ () => this.handleChangeMode(TMode.propsEditor) }
                />
                {this.renderSkinSwitcher()}
            </FlexRow>
        );
    }

    private isPropEditorSupported = () => {
        return !!this.config;
    };

    private renderPropsEditor() {
        const isSkin = this.isSkin();
        const theme = this.getTheme();

        return (
            <ComponentEditorWrapper
                onRedirectBackToDocs={ () => this.handleChangeMode(TMode.doc) }
                config={ this.config }
                title={ this.title }
                isSkin={ isSkin }
                theme={ theme }
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

    protected renderDocTitle() {
        return (
            <RichTextView>
                <h1>{this.title}</h1>
            </RichTextView>
        );
    }

    private renderDoc() {
        return (
            <ScrollBars>
                <div className={ cx(css.widthWrapper) }>
                    {this.renderDocTitle()}
                    {this.renderContent()}
                    {this.renderApiBlock()}
                </div>
            </ScrollBars>
        );
    }

    private handleChangeSkin = () => {
        const isSkin = this.isSkin();

        localStorage.setItem('app-theme-context', JSON.stringify({ isSkin: !isSkin }));
        this.handleNav({ isSkin: !isSkin });
    };

    private handleChangeMode(mode: TMode) {
        this.handleNav({ mode });
    }

    private handleNav = (params: { mode?: TMode, isSkin?: boolean, theme?: TTheme }) => {
        const mode: TMode = params.mode ? params.mode : this.getMode();
        const isSkin: boolean = params.isSkin ?? this.isSkin();
        const theme: TTheme = params.theme ? params.theme : this.getTheme();

        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: 'components',
                id: getQuery('id'),
                mode,
                isSkin: isSkin,
                theme,
            },
        });
    };

    render() {
        return (
            <div className={ css.container }>
                {this.isPropEditorSupported() && this.renderTabsNav()}
                {this.getMode() === TMode.propsEditor ? this.renderPropsEditor() : this.renderDoc()}
            </div>
        );
    }
}
