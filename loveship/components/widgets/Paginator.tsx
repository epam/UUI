import React from "react";
import { Paginator as UuiPaginator, PaginatorParams, PaginatorProps } from '@epam/uui-components';
import * as css from './Paginator.scss';
import { PageButton } from "./PageButton";
import * as arrowLeftIcon_24 from '../icons/navigation-chevron-left-18.svg';
import * as arrowRightIcon_24 from '../icons/navigation-chevron-right-18.svg';
import * as arrowRightIcon_30 from '../icons/navigation-chevron-right-24.svg';
import * as arrowLeftIcon_30 from '../icons/navigation-chevron-left-24.svg';

export class Paginator extends React.Component<PaginatorProps> {
    renderPaginator(params: PaginatorParams) {
        return (
            <div className={ css.root }>
                <PageButton size={ params.size } icon={ (params.size === '30') ? arrowLeftIcon_30 : arrowLeftIcon_24 } onClick={ params.goToPrev } isDisabled={ params.isFirst } fill={ (params.isFirst && 'solid') || 'white' } color='night400' />
                {
                    params.pages.map((page, index) => {
                        if (page.type === 'spacer') {
                            return <PageButton size={ params.size } key={ index } caption={ '...' } fill='light' color='sky' />;
                        } else {
                            return <PageButton size={ params.size } key={ index } caption={ page.pageNumber } onClick={ () => page.onClick() } fill={ (page.isActive && 'white') || 'light' } color={ 'sky' } />;
                        }
                    })
                }
                <PageButton size={ params.size } icon={ (params.size === '30') ? arrowRightIcon_30 : arrowRightIcon_24 } onClick={ params.goToNext } isDisabled={ params.isLast } fill={ (params.isLast && 'solid') || 'white' } color='night400' />
            </div>
        );
    }

    render() {
        return <UuiPaginator { ...this.props } render={ this.renderPaginator } />;
    }
}
