import * as React from 'react';
import path from 'path';
import { ArrayDataSource, DataColumnProps, DataSourceState } from '@epam/uui';
import { DataTable, Text, RichTextView, FlexRow, MultiSwitch, FlexSpacer, TabButton, LinkButton, ScrollBars } from '@epam/promo';
import { ComponentEditor } from './ComponentEditor';
import { svc } from "../../services";
import * as css from './BaseDocsBlock.scss';

export type UUI3 = 'UUI3_loveship';
export type UUI4 = 'UUI4_promo';

export const UUI3: UUI3 = 'UUI3_loveship';
export const UUI4: UUI4 = 'UUI4_promo';

const items = [
    {
        caption: 'UUI3 [Loveship]',
        id: UUI3,
    },
    {
        caption: 'UUI4 [Promo]',
        id: UUI4,
    },
];

interface DocPath {
    [UUI3]?: string;
    [UUI4]?: string;
}

interface BaseDocsBlockState {
    props?: any;
    tableState: DataSourceState;
}

export abstract class BaseDocsBlock extends React.Component<any, BaseDocsBlockState> {
    propsDS: ArrayDataSource;

    constructor(props: any) {
        super(props);

        if (this.getPropsDocPath() !== null) {
            svc.api.getProps() && svc.api.getProps().then(res => {
                const skin = this.getPropsDocPath()[UUI4] === undefined ? UUI3 : UUI4;
                Object.keys(res.content.props).find(docPath => {
                    if (docPath.includes(path.normalize(this.getPropsDocPath()[skin]))) {
                        this.propsDS = new ArrayDataSource({
                            items: res.content.props[docPath],
                            getId: i => i.name,
                        });

                        this.setState({ props: res.content.props[docPath] });
                    }
                });
            });
        }

        this.state = {
            tableState: {},
        };
    }

    abstract title: string;
    abstract renderContent(): React.ReactNode;

    getPropsDocPath(): DocPath {
        return null;
    }

    onTableStateChange = (newState: DataSourceState) => this.setState({ tableState: newState });

    apiColumns: DataColumnProps<{ name: string, value: string }>[] = [
        {
            key: 'name',
            caption: 'NAME',
            render: prop => <Text color='gray80'>{ prop.name }</Text>,
            width: 200,
            isSortable: true,
        },
        {
            key: 'value',
            caption: 'Type',
            render: prop => <Text color='gray80'><span style={ { whiteSpace: "pre-wrap" } }>{ prop.value }</span></Text>,
            grow: 1,
            isSortable: true,
        },
    ];

    renderApiBlock() {
        const view = this.propsDS.getView(this.state.tableState, this.onTableStateChange);

        return (
            <>
                <RichTextView><h2>Api</h2></RichTextView>
                <div className={ css.tableBorder }>
                    <DataTable
                        value={ this.state.tableState }
                        onValueChange={ this.onTableStateChange }
                        columns={ this.apiColumns }
                        getRows={ view.getVisibleRows }
                        { ...view.getListProps() }
                    />
                </div>
            </>
        );
    }

    renderMultiSwitch() {
        return <MultiSwitch size='36' items={ items } value={ this.getQuery('skin') || UUI4 } onValueChange={ (newValue: UUI3 | UUI4) => this.handleChangeSkin(newValue) } />;
    }

    renderTabsNav() {
        return (
            <FlexRow background='white' padding='12' cx={ css.secondaryNavigation } borderBottom >
                <TabButton
                    size='60'
                    caption='Documentation'
                    isLinkActive={ this.getQuery('mode') === 'doc' }
                    onClick={ () => this.handleChangeMode('doc') }
                />
                <TabButton
                    size='60'
                    caption='Property Explorer'
                    isLinkActive={ this.getQuery('mode') === 'propsEditor' }
                    onClick={ () => this.handleChangeMode('propsEditor') }
                />
                <FlexSpacer />
                { this.getQuery('mode') !== 'doc' && this.renderMultiSwitch() }
            </FlexRow>
        );
    }

    renderPropEditor() {
        if (!this.getPropsDocPath()) {
            return svc.uuiRouter.redirect({
                pathname: '/documents',
                query: {
                    category: this.getQuery('category'),
                    id: this.getQuery('id'),
                    mode: this.getQuery('doc'),
                    skin: this.getQuery('skin'),
                },
            });
        }
        if (!this.getPropsDocPath()[this.getQuery('skin') as UUI3 | UUI4]) {
            return this.renderNotSupportPropExplorer();
        }
        return <ComponentEditor
            key={ this.getPropsDocPath()[this.getQuery('skin') as UUI3 | UUI4] }
            propsDocPath={ this.getPropsDocPath()[this.getQuery('skin') as UUI3 | UUI4] }
            title={ this.title }
        />;
    }

    renderSectionTitle(title: string) {
        return <RichTextView><h2>{ title }</h2></RichTextView>;
    }

    renderDocTitle() {
        return <div className={ css.title }>{ this.title }</div>;
    }

    renderDoc() {
        return (
            <ScrollBars>
                <div className={ css.widthWrapper }>
                    { this.renderDocTitle() }
                    { this.renderContent() }
                    { this.state.props && this.renderApiBlock() }
                </div>
            </ScrollBars>
        );
    }

    renderNotSupportPropExplorer() {
        return (
            <div className={ css.notSupport } >
                <Text fontSize='16' lineHeight='24' >This component does not support property explorer</Text>
                <LinkButton size='24' cx={ css.backButton } caption='Back to Docs' onClick={ () => svc.uuiRouter.redirect({
                    pathname: '/documents',
                    query: {
                        category: 'components',
                        id: this.getQuery('id'),
                        mode: 'doc',
                        skin: this.getQuery('skin'),
                    },
                }) } />
            </div>
        );
    }

    getQuery(query: string): string {
        return svc.uuiRouter.getCurrentLink().query[query];
    }

    handleChangeSkin(skin: UUI3 | UUI4) {
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: 'components',
                id: this.getQuery('id'),
                mode: this.getQuery('mode'),
                skin: skin,
            },
        });
    }

    handleChangeMode(mode: 'doc' | 'propsEditor') {
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query: {
                category: 'components',
                id: this.getQuery('id'),
                mode: mode,
                skin: this.getQuery('skin'),
            },
        });
    }

    render() {
        return (
            <div className={ css.container } >
                { this.getPropsDocPath() && this.renderTabsNav() }
                { this.getQuery('mode') === 'propsEditor' ? this.renderPropEditor() : this.renderDoc() }
            </div>
        );
    }
}