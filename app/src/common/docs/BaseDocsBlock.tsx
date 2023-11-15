import * as React from 'react';
import { FlexRow, FlexSpacer, MultiSwitch, RichTextView, ScrollBars, TabButton } from '@epam/promo';
import { svc } from '../../services';
import { getQuery } from '../../helpers';
import { analyticsEvents } from '../../analyticsEvents';
import { TypeRefSection } from '../apiReference/TypeRefSection';
import { normalizeDocConfig, TDocConfig, TSkin } from './docBuilderGen/types';
import { ComponentEditorWrapper } from './componentEditor/ComponentEditor';
import cx from 'classnames';
import css from './BaseDocsBlock.module.scss';
import { TEMP_THEME_PROMO_SELECTOR } from './constants';

export { TSkin };

enum TMode {
    doc = 'doc',
    propsEditor = 'propsEditor'
}

const DEFAULT_SKIN = TSkin.UUI4_promo;
const DEFAULT_MODE = TMode.doc;

const items: { id: TSkin; caption: string }[] = [
    { caption: 'UUI3 [Loveship]', id: TSkin.UUI3_loveship }, { caption: 'UUI4 [Promo]', id: TSkin.UUI4_promo }, { caption: 'UUI [Themebale]', id: TSkin.UUI },
];

interface BaseDocsBlockState {}

export abstract class BaseDocsBlock extends React.Component<any, BaseDocsBlockState> {
    constructor(props: any) {
        super(props);

        const { category, id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.document.pv(id, category));
    }

    private getSkin(): TSkin {
        return getQuery('skin') || DEFAULT_SKIN;
    }

    private getMode(): TMode {
        return getQuery('mode') || DEFAULT_MODE;
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
            const configGeneric = normalizeDocConfig(this.config).bySkin;
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
        return (
            <MultiSwitch<TSkin>
                size="36"
                items={ items }
                value={ this.getSkin() }
                onValueChange={ (newValue: TSkin) => this.handleChangeSkin(newValue) }
            />
        );
    }

    private renderTabsNav() {
        return (
            <FlexRow
                rawProps={ { role: 'tablist' } }
                padding="12"
                cx={ [css.secondaryNavigation, TEMP_THEME_PROMO_SELECTOR] }
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
                <FlexSpacer />
                {this.getMode() === TMode.propsEditor && this.renderSkinSwitcher()}
            </FlexRow>
        );
    }

    private isPropEditorSupported = () => {
        return !!this.config;
    };

    private renderPropsEditor() {
        const skin = this.getSkin();
        return (
            <ComponentEditorWrapper
                onRedirectBackToDocs={ () => this.handleChangeMode(TMode.doc) }
                config={ this.config }
                title={ this.title }
                skin={ skin }
            />
        );
    }

    protected renderSectionTitle(title: string) {
        return (
            <RichTextView cx={ TEMP_THEME_PROMO_SELECTOR }>
                <h2>{title}</h2>
            </RichTextView>
        );
    }

    protected renderDocTitle() {
        return (
            <RichTextView cx={ TEMP_THEME_PROMO_SELECTOR }>
                <h1>{this.title}</h1>
            </RichTextView>
        );
    }

    private renderDoc() {
        return (
            <ScrollBars>
                <div className={ cx(TEMP_THEME_PROMO_SELECTOR, css.widthWrapper) }>
                    {this.renderDocTitle()}
                    {this.renderContent()}
                    {this.renderApiBlock()}
                </div>
            </ScrollBars>
        );
    }

    private handleChangeSkin(skin: TSkin) {
        this.handleNav({ skin });
    }

    private handleChangeMode(mode: TMode) {
        this.handleNav({ mode });
    }

    private handleNav = (params: { mode?: TMode, skin?: TSkin }) => {
        const mode: TMode = params.mode ? params.mode : this.getMode();
        const skin: TSkin = params.skin ? params.skin : this.getSkin();

        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: 'components',
                id: getQuery('id'),
                mode,
                skin,
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
