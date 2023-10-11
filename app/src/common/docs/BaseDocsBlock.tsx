import * as React from 'react';
import {
    Text, RichTextView, FlexRow, MultiSwitch, FlexSpacer, TabButton, LinkButton, ScrollBars,
} from '@epam/promo';
import { ComponentEditor } from './ComponentEditor';
import { svc } from '../../services';
import { getQuery } from '../../helpers';
import { analyticsEvents } from '../../analyticsEvents';
import css from './BaseDocsBlock.module.scss';
import cx from 'classnames';
import { TDocsGenExportedType } from '../apiReference/types';
import { ApiRefTypeProps } from '../apiReference/ApiRefTypeProps';

export enum TSkin {
    UUI3_loveship = 'UUI3_loveship',
    UUI4_promo = 'UUI4_promo',
    UUI = 'UUI'
}
const DEFAULT_SKIN = TSkin.UUI4_promo;

export const UUI3 = TSkin.UUI3_loveship;
export const UUI4 = TSkin.UUI4_promo;
export const UUI = TSkin.UUI;

const items: { id: TSkin; caption: string }[] = [
    { caption: 'UUI3 [Loveship]', id: TSkin.UUI3_loveship }, { caption: 'UUI4 [Promo]', id: TSkin.UUI4_promo }, { caption: 'UUI [Themebale]', id: TSkin.UUI },
];

export type TDocsGenType = TDocsGenExportedType;
type DocPath = {
    [key in TSkin]?: string;
};

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

    abstract title: string;
    abstract renderContent(): React.ReactNode;
    protected getPropsDocPath(): DocPath {
        return null;
    }

    protected getDocsGenType(): TDocsGenType | undefined {
        return undefined;
    }

    renderApiBlock() {
        const docsGenType = this.getDocsGenType();
        if (docsGenType) {
            return (
                <>
                    <RichTextView>
                        <h2>Api</h2>
                    </RichTextView>
                    <ApiRefTypeProps showCode={ true } typeRef={ docsGenType } />
                </>
            );
        }
    }

    renderMultiSwitch() {
        return (
            <MultiSwitch<TSkin>
                size="36"
                items={ items.filter((i) => (!window.location.host.includes('localhost') ? i.id !== TSkin.UUI : true)) }
                value={ this.getSkin() }
                onValueChange={ (newValue: TSkin) => this.handleChangeSkin(newValue) }
            />
        );
    }

    renderTabsNav() {
        return (
            <FlexRow background="white" rawProps={ { role: 'tablist' } } padding="12" cx={ [css.uuiThemePromo, css.secondaryNavigation] } borderBottom>
                <TabButton size="60" caption="Documentation" isLinkActive={ getQuery('mode') === 'doc' } onClick={ () => this.handleChangeMode('doc') } />
                <TabButton size="60" caption="Property Explorer" isLinkActive={ getQuery('mode') === 'propsEditor' } onClick={ () => this.handleChangeMode('propsEditor') } />
                <FlexSpacer />
                {getQuery('mode') !== 'doc' && this.renderMultiSwitch()}
            </FlexRow>
        );
    }

    renderPropEditor() {
        if (!this.getPropsDocPath()) {
            svc.uuiRouter.redirect({
                pathname: '/documents',
                query: {
                    category: getQuery('category'),
                    id: getQuery('id'),
                    mode: getQuery('doc'),
                    skin: getQuery('skin'),
                },
            });
            return null;
        }
        const skin = getQuery('skin') as TSkin;
        const propsDoc = this.getPropsDocPath()[skin];
        if (!propsDoc) {
            return this.renderNotSupportPropExplorer();
        }
        return (
            <ComponentEditor key={ propsDoc } propsDocPath={ propsDoc } title={ this.title } />
        );
    }

    renderSectionTitle(title: string) {
        return (
            <RichTextView>
                <h2>{title}</h2>
            </RichTextView>
        );
    }

    renderDocTitle() {
        return (
            <RichTextView>
                <h1>{this.title}</h1>
            </RichTextView>
        );
    }

    renderDoc() {
        return (
            <ScrollBars>
                <div className={ css.widthWrapper }>
                    {this.renderDocTitle()}
                    {this.renderContent()}
                    {this.renderApiBlock()}
                </div>
            </ScrollBars>
        );
    }

    renderNotSupportPropExplorer() {
        return (
            <div className={ css.notSupport }>
                <Text fontSize="16" lineHeight="24">
                    This component does not support property explorer
                </Text>
                <LinkButton
                    size="24"
                    cx={ css.backButton }
                    caption="Back to Docs"
                    onClick={ () =>
                        svc.uuiRouter.redirect({
                            pathname: '/documents',
                            query: {
                                category: 'components',
                                id: getQuery('id'),
                                mode: 'doc',
                                skin: getQuery('skin'),
                            },
                        }) }
                />
            </div>
        );
    }

    handleChangeSkin(skin: TSkin) {
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: getQuery('category'),
                id: getQuery('id'),
                mode: getQuery('mode'),
                skin: skin,
            },
        });
    }

    handleChangeMode(mode: 'doc' | 'propsEditor') {
        const skin = getQuery('skin');
        if (mode === 'propsEditor' && skin !== UUI) {
        }

        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: 'components',
                id: getQuery('id'),
                mode: mode,
                skin: getQuery('skin'),
            },
        });
    }

    render() {
        return (
            <div className={ css.container }>
                {this.getPropsDocPath() && this.renderTabsNav()}
                {getQuery('mode') === 'propsEditor' ? this.renderPropEditor() : this.renderDoc()}
            </div>
        );
    }
}
