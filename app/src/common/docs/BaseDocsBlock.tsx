import * as React from 'react';
import { ArrayDataSource, DataColumnProps, DataSourceState } from '@epam/uui-core';
import {
    DataTable, Text, RichTextView, FlexRow, MultiSwitch, FlexSpacer, TabButton, LinkButton, ScrollBars,
} from '@epam/promo';
import { ComponentEditor } from './ComponentEditor';
import { svc } from '../../services';
import { getQuery } from '../../helpers';
import { analyticsEvents } from '../../analyticsEvents';
import css from './BaseDocsBlock.module.scss';
import { TTsDocExportedEntry } from '../../demo/apiDocs/types';
import { ApiReferenceItemTable } from '../../demo/apiDocs/components/ApiReferenceItemTable';

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

export type TUuiTsDoc = TTsDocExportedEntry;
type DocPath = {
    [key in TSkin]?: string;
};

interface BaseDocsBlockState {
    props?: any;
    tableState: DataSourceState;
}

export abstract class BaseDocsBlock extends React.Component<any, BaseDocsBlockState> {
    propsDS: ArrayDataSource;

    constructor(props: any) {
        super(props);

        const { category, id } = svc.uuiRouter.getCurrentLink().query;
        svc.uuiAnalytics.sendEvent(analyticsEvents.document.pv(id, category));

        this.state = {
            tableState: {},
        };
    }

    componentDidMount() {
        if (this.getPropsDocPath() !== null) {
            const propsPromise = svc.api.getProps();
            propsPromise
            && propsPromise.then((res) => {
                const skin = this.getPropsDocPath()[UUI4] === undefined ? UUI3 : UUI4;
                const resProps = res.content.props;
                const docPath = this.getPropsDocPath()[skin];
                const docPathNorm = docPath.indexOf('.') === 0 ? docPath.substring(1) : docPath;
                const props = resProps[docPathNorm];
                /**
                 * Keys in "public/docs/componentsPropsSet.json":
                 * - always start from "/"
                 * - are relative to the monorepo root.
                 */
                if (props) {
                    this.propsDS = new ArrayDataSource({
                        items: props,
                        getId: (i) => i.name,
                    });
                    this.setState({ props: props });
                }
            });
        }
    }

    private getSkin(): TSkin {
        return getQuery('skin') || DEFAULT_SKIN;
    }

    abstract title: string;
    abstract renderContent(): React.ReactNode;
    getPropsDocPath(): DocPath {
        return null;
    }

    protected getUuiTsDoc(): TUuiTsDoc | undefined {
        return undefined;
    }

    onTableStateChange = (newState: DataSourceState) => this.setState({ tableState: newState });
    apiColumns: DataColumnProps<{ name: string; value: string; comment: string }>[] = [
        {
            key: 'name',
            caption: 'NAME',
            render: (prop) => <Text color="gray80">{prop.name}</Text>,
            width: 200,
            isSortable: true,
        }, {
            key: 'value',
            caption: 'Type',
            render: (prop) => (
                <Text color="gray80">
                    <span style={ { whiteSpace: 'pre-wrap' } }>{prop.value}</span>
                </Text>
            ),
            width: 200,
            isSortable: true,
        }, {
            key: 'comment',
            caption: 'Description',
            render: (prop) => <RichTextView htmlContent={ prop.comment } />,
            width: 200,
            grow: 1,
        },
    ];

    renderApiBlock() {
        const tsDocProps = this.getUuiTsDoc();
        if (tsDocProps) {
            return (
                <ApiReferenceItemTable entry={ tsDocProps } />
            );
        }
        return this.renderLegacyApiBlock();
    }

    private renderLegacyApiBlock() {
        const view = this.propsDS.getView(this.state.tableState, this.onTableStateChange);

        return (
            <>
                <RichTextView>
                    <h2>Api</h2>
                </RichTextView>
                <DataTable
                    value={ this.state.tableState }
                    onValueChange={ this.onTableStateChange }
                    columns={ this.apiColumns }
                    getRows={ view.getVisibleRows }
                    { ...view.getListProps() }
                />
            </>
        );
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
            <FlexRow rawProps={ { role: 'tablist' } } background="white" padding="12" cx={ css.secondaryNavigation } borderBottom>
                <TabButton size="60" caption="Documentation" isLinkActive={ getQuery('mode') === 'doc' } onClick={ () => this.handleChangeMode('doc') } />
                <TabButton size="60" caption="Property Explorer" isLinkActive={ getQuery('mode') === 'propsEditor' } onClick={ () => this.handleChangeMode('propsEditor') } />
                <FlexSpacer />
                {getQuery('mode') !== 'doc' && this.renderMultiSwitch()}
            </FlexRow>
        );
    }

    renderPropEditor() {
        this.handleChangeBodyTheme(getQuery('skin'));
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
                    {this.state.props && this.renderApiBlock()}
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
        this.handleChangeBodyTheme(skin);
    }

    handleChangeBodyTheme(skin: TSkin) {
        const theme = document.body.classList.value.match(/uui-theme-(\S+)\s*/)[1];
        if (theme === skin.split('_')[1]) return;
        document.body.classList.remove(`uui-theme-${theme}`);
        document.body.classList.add(`uui-theme-${skin === UUI3 ? 'loveship' : 'promo'}`);
    }

    componentWillUnmount() {
        this.handleChangeBodyTheme(TSkin.UUI4_promo);
    }

    handleChangeMode(mode: 'doc' | 'propsEditor') {
        this.handleChangeBodyTheme(TSkin.UUI4_promo);

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
